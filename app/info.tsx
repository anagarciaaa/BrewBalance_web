import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// GraphQL Queries and Mutations
const UPDATE_USER_SETTINGS = gql`
  mutation updateUserSettings($weight: Float!) {
    updateUserSettings(weight: $weight) {
      weight
      maxCaffeineLimit
    }
  }
`;

const USER_SETTINGS_QUERY = gql`
  query {
    userSettings {
      weight
      maxCaffeineLimit
    }
  }
`;

const TOTAL_CAFFEINE_QUERY = gql`
  query totalCaffeineConsumed($user_id: String!, $date: String!) {
    totalCaffeineConsumed(user_id: $user_id, date: $date)
  }
`;

export default function CaffeineInfoScreen() {
  const [weightInput, setWeightInput] = useState('');
  const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS);
  const { data: userSettingsData, refetch } = useQuery(USER_SETTINGS_QUERY);

  const user_id = 'ana'; // Replace with actual authentication when ready
  const now = dayjs().tz('America/New_York');
  const date = now.format('YYYY-MM-DD');

  const { data: caffeineData, loading, error } = useQuery(TOTAL_CAFFEINE_QUERY, {
    variables: { user_id, date },
  });

  // Function to update weight and max caffeine limit
  const updateWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Error', 'Enter a valid weight.');
      return;
    }
    await updateUserSettings({ variables: { weight } });
    refetch(); // Refresh the user settings
    Alert.alert('Success', `Weight updated to ${weight} lbs.`);
  };

  // Function to check caffeine intake
  const checkIntake = () => {
    if (loading || error) {
      Alert.alert('Error', 'Unable to fetch data. Please try again later.');
      return;
    }

    const maxCaffeine = userSettingsData?.userSettings?.maxCaffeineLimit || 0;
    const currentIntake = caffeineData?.totalCaffeineConsumed || 0;

    if (currentIntake >= maxCaffeine) {
      Alert.alert('Warning', 'You have reached or exceeded your daily caffeine limit!');
    } else if (currentIntake >= maxCaffeine * 0.8) {
      Alert.alert('Caution', 'You are approaching your daily caffeine limit.');
    } else {
      Alert.alert('Safe', 'Your caffeine consumption is within the safe range.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Caffeine and Its Effects</Text>

      <Text style={styles.sectionTitle}>Why Limit Caffeine?</Text>
      <Text style={styles.text}>
        Caffeine is a stimulant that can help you stay awake and focused, but consuming too much can lead to
        anxiety, insomnia, and other health issues.
      </Text>

      <Text style={styles.sectionTitle}>Daily Limit Recommendations</Text>
      <Text style={styles.text}>
        Adults: For healthy adults with no medical issues, 300 mg - 400 mg of caffeine{'\n'}
        Teens: No more than 100 mg per day due to the importance of sleep and brain development{'\n'}
        Children: Avoid caffeine
      </Text>

      <Text style={styles.sectionTitle}>Update Your Caffeine Limit</Text>
    <TextInput
      placeholder="Enter your weight (lbs)"
      value={weightInput}
      onChangeText={setWeightInput}
      keyboardType="numeric"
      style={styles.input}
    />
    <TouchableOpacity style={styles.button} onPress={updateWeight}>
      <Text style={styles.buttonText}>Update Weight</Text>
    </TouchableOpacity>

    <Text style={styles.result}>
      Current Weight: {userSettingsData?.userSettings?.weight || 'Not set'} lbs
    </Text>
    <Text style={styles.result}>
      Max Caffeine Limit: {Math.round(userSettingsData?.userSettings?.maxCaffeineLimit || 0)} mg
    </Text>

    <TouchableOpacity style={styles.button} onPress={checkIntake}>
      <Text style={styles.buttonText}>Check Caffeine Intake</Text>
    </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3621',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#8B4513',
  },
  text: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 15,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    borderColor: '#A0522D',
    borderWidth: 1,
    marginBottom: 10,
  },
  result: {
    fontSize: 16,
    color: '#4B3621',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#9CAF88', // Green for buttons
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});
