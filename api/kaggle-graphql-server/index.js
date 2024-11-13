const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const csv = require('csv-parser'); // Make sure to install this package: npm install csv-parser

// Placeholder for parsed caffeine data
let caffeineData = [];

// Define your GraphQL schema
const typeDefs = gql`
  type CaffeineSource {
    drink: String
    volume: Float
    calories: Int
    caffeine: Int
    type: String
  }

  type Query {
    # Search caffeine data by drink name
    searchCaffeineSource(search: String): [CaffeineSource]

    # Load the caffeine data from the CSV file
    loadCaffeineData: String
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    // Query to search caffeine data by drink name
    searchCaffeineSource: (_, { drink, type }) => {
      let results = caffeineData;

      // Filter by drink name if provided
      if (drink) {
        results = results.filter((entry) =>
          entry.drink.toLowerCase().includes(drink.toLowerCase())
        );
      }

      // Filter by type if provided
      if (type) {
        results = results.filter((entry) =>
          entry.type.toLowerCase() === type.toLowerCase()
        );
      }

      return results;
    },

    // Load the caffeine data from the CSV file
    loadCaffeineData: async () => {
      const csvFilePath = path.join(__dirname, 'caffeine-data', 'caffeine.csv');
      try {
        console.log(`Loading data from: ${csvFilePath}`);
        caffeineData = []; // Clear previous data

        // Read the CSV file and store data
        await new Promise((resolve, reject) => {
          fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
              // Parse numeric values
              caffeineData.push({
                drink: row['drink'],
                volume: parseFloat(row['Volume (ml)']),
                calories: parseInt(row['Calories'], 10),
                caffeine: parseInt(row['Caffeine (mg)'], 10),
                type: row['type'],
              });
            })
            .on('end', resolve)
            .on('error', (error) => {
              console.error('Error reading CSV:', error.message);
              reject(error);
            });
        });

        console.log('Caffeine data successfully loaded.');
        return 'Caffeine data successfully loaded.';
      } catch (error) {
        console.error('Error loading caffeine data:', error.message);
        throw new Error('Failed to load caffeine data.');
      }
    },
  },
};

// Create and start the server with CORS configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: 'http://10.188.104.235:8081', // Allow requests from your frontend
    credentials: true, // Allow cookies if needed
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
