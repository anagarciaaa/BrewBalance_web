# Welcome to the Caffeine Tracker App 👋

This is a [React Native](https://reactnative.dev/) app created with [Expo](https://expo.dev) to track daily caffeine intake. The app uses [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL queries and mutations, and it connects to a PostgreSQL backend server with an Express-based [Apollo Server](https://www.apollographql.com/docs/apollo-server/).

## Features

- **Caffeine Search**: Search for drinks and their caffeine content.
- **Daily Tracking**: Log and track caffeine consumption.
- **Health Guidelines**: View recommendations and set personal intake limits.
- **Dynamic Alerts**: Receive warnings when approaching or exceeding your daily limit.
- **User Settings**: Update weight to customize caffeine limits.

---
Project Structure
Backend (index.js)
The backend is an Apollo Server that:

Serves GraphQL queries and mutations.
Handles PostgreSQL database interactions for storing user settings and caffeine logs.
Processes data from a CSV file for predefined caffeine source details.
Frontend (/app directory)
The frontend is built using React Native with Expo and features:

File-based routing for screens.
Context API for user authentication and state management.
Apollo Client for interacting with the backend.
Key Files
search.tsx: Implements the search screen for finding caffeine sources.
info.tsx: Displays user settings and health guidelines.
index.tsx: Home screen showing progress, logs, and navigation.
FoodListItem.tsx: Displays individual search results and logs.
CaffeineLogListItem.tsx: Displays individual log entries for the user.


## Get Started

### Prerequisites
- Install [Node.js](https://nodejs.org/en/) (LTS version recommended)
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/) globally:
  ```bash
  npm install -g expo-cli

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
