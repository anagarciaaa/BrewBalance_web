const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const csv = require('csv-parser'); // Make sure to install this package: npm install csv-parser
const express = require('express');
const https = require('https');
require('dotenv').config();


// Placeholder for parsed caffeine data
let caffeineData = [];
let userSettings = { weight: 150, maxCaffeineLimit: (150 / 2.2) * 5.7 }; // Default weight: 150 lbs
const calculateMaxCaffeine = (weight) => (weight / 2.2) * 5.7;
const pool = require('./db');


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database:', res.rows[0]);
  }
});
// Function to load caffeine data
const loadCaffeineData = async () => {
  const csvFilePath = path.join(__dirname, 'caffeine-data', 'caffeine.csv');
  try {
    console.log(`Loading data from: ${csvFilePath}`);
    caffeineData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          caffeineData.push({
            drink: row['drink'],
            volume: parseFloat(row['Volume (ml)']),
            calories: parseInt(row['Calories'], 10),
            caffeine: parseFloat(row['Caffeine (mg)']),
            type: row['type'],
          });
        })
        .on('end', resolve)
        .on('error', (error) => {
          console.error('Error reading CSV:', error.message);
          reject(error);
        });
    });
    console.log('Caffeine data loaded successfully.');
  } catch (error) {
    console.error('Error loading caffeine data:', error.message);
    throw new Error('Failed to load caffeine data.');
  }
};
// Define your GraphQL schema
const typeDefs = gql`
  type CaffeineSource {
    id: ID
    user_id: String
    drink: String
    volume: Float
    calories: Int
    caffeine: Float
    type: String
    created_at: String
  }
  type UserSettings {
    weight: Float
    maxCaffeineLimit: Float
  }

  type Query {
    # Search caffeine data by drink name
    searchCaffeineSource(search: String): [CaffeineSource]
    userSettings: UserSettings

    # Load the caffeine data from the CSV file
    loadCaffeineData: String
    caffeineLogById(id: ID!): CaffeineSource
    caffeineLogByUserId(user_id: String!): [CaffeineSource]
    caffeineLogByType(type: String!): [CaffeineSource]
    paginatedCaffeineLogs(limit: Int!, offset: Int!): [CaffeineSource]
    caffeineLogByUserIdAndDate(user_id: String!, date: String!): [CaffeineSource]
    caffeineLogByDate(date: String!): [CaffeineSource]
    totalCaffeineConsumed(user_id: String!, date: String!): Float
  }

  type Mutation {
    # Mutation to insert a new log
    insertCaffeineLog(
      user_id: String!
      drink: String!
      volume: Float!
      caffeine: Float!
      type: String!
    ): CaffeineSource

    # Mutation to delete a log by ID
    deleteCaffeineLog(id: ID!): String
    updateUserSettings(weight: Float!): UserSettings
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    // Query to search caffeine data by drink name
    searchCaffeineSource: async (_, { search }) => {
      if (caffeineData.length === 0) {
        throw new Error('Caffeine data has not been loaded. Please call loadCaffeineData first.');
      }
    
      const lowerSearch = search ? search.toLowerCase() : '';
      return caffeineData.filter(
        (item) =>
          !lowerSearch ||
          item.drink.toLowerCase().includes(lowerSearch) ||
          item.type.toLowerCase().includes(lowerSearch)
      );
    },
    caffeineLogById: async (_, { id }) => {
      const query = `SELECT * FROM caffeine_log WHERE id = $1`;
      const values = [id];
      try {
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (err) {
        console.error('Error fetching data by ID:', err);
        throw new Error('Failed to fetch data by ID.');
      }
    },

    // Get all logs for a specific user
    caffeineLogByUserId: async (_, { user_id }) => {
      const query = `SELECT * FROM caffeine_log WHERE user_id = $1`;
      const values = [user_id];
      try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (err) {
        console.error('Error fetching data by user ID:', err);
        throw new Error('Failed to fetch data by user ID.');
      }
    },

    // Get all logs by type
    caffeineLogByType: async (_, { type }) => {
      const query = `SELECT * FROM caffeine_log WHERE LOWER(type) = $1`;
      const values = [type.toLowerCase()];
      try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (err) {
        console.error('Error fetching data by type:', err);
        throw new Error('Failed to fetch data by type.');
      }
    },

    // Get paginated caffeine logs
    paginatedCaffeineLogs: async (_, { limit, offset }) => {
      const query = `
        SELECT * FROM caffeine_log
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const values = [limit, offset];
      try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (err) {
        console.error('Error fetching paginated data:', err);
        throw new Error('Failed to fetch paginated data.');
      }
    },
    caffeineLogByUserIdAndDate: async (_, { user_id, date }) => {
      const query = `
        SELECT * 
        FROM caffeine_log 
        WHERE user_id = $1 AND DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York') = $2
        ORDER BY created_at DESC
      `;
      const values = [user_id, date];
      try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (err) {
        console.error('Error fetching data by user_id and date:', err);
        throw new Error('Failed to fetch data by user_id and date.');
      }
    },
    caffeineLogByDate: async (_, { date }) => {
      const query = `
        SELECT * FROM caffeine_log
        WHERE DATE(created_at) = $1
        ORDER BY created_at ASC
      `;
      const values = [date];
      try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (err) {
        console.error('Error fetching data by date:', err);
        throw new Error('Failed to fetch data by date.');
      }
    },
    totalCaffeineConsumed: async (_, { user_id, date }) => {
      const query = `
        SELECT SUM(caffeine) AS total_caffeine 
        FROM caffeine_log 
        WHERE user_id = $1 AND DATE(created_at) = $2;
      `;
      const values = [user_id, date];
      try {
        const result = await pool.query(query, values);
        return result.rows[0].total_caffeine || 0; // Return 0 if no data exists
      } catch (err) {
        console.error('Error calculating total caffeine:', err);
        throw new Error('Failed to calculate total caffeine.');
      }
    },
    // Fetch user settings
    userSettings: () => userSettings,
  },

  Mutation: {
    // Mutation to insert a new caffeine log
    insertCaffeineLog: async (_, { user_id, drink, volume, caffeine, type }) => {
      const query = `
        INSERT INTO caffeine_log (user_id, drink, volume, caffeine, type, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW() AT TIME ZONE 'America/New_York')
        RETURNING *;
      `;
      const values = [user_id, drink, volume, caffeine, type];
      try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the inserted record
      } catch (err) {
        console.error("Database error:", err);
        throw new Error("Failed to insert data.");
      }
    },
    

    // Mutation to delete a caffeine log by ID
    deleteCaffeineLog: async (_, { id }) => {
      const query = `
        DELETE FROM caffeine_log
        WHERE id = $1
        RETURNING id;
      `;
      const values = [id];
      try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
          throw new Error(`Record with ID ${id} does not exist.`);
        }
        return `Record with ID ${id} successfully deleted.`;
      } catch (err) {
        console.error('Error deleting data:', err);
        throw new Error('Failed to delete data.');
      }
    },
    updateUserSettings: (_, { weight }) => {
      userSettings.weight = weight;
      userSettings.maxCaffeineLimit = calculateMaxCaffeine(weight);
      return userSettings;
    },
  },
};

// Load SSL certificates
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

// Create Express App
const app = express();

// Create and start the Apollo server with CORS configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: ['http://192.168.56.1:8081'], // Allow requests from your frontend
    credentials: true, // Allow cookies if needed
  },
});

(async () => {
  await server.start(); // Explicitly start the server
  await loadCaffeineData();
  server.applyMiddleware({ app }); // Apply middleware after starting the server
  const PORT = process.env.PORT || 4000;
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🚀 Server ready at https://localhost:${PORT}${server.graphqlPath}`);
  });
})();

