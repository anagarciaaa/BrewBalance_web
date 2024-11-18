import {Link, useRouter} from 'expo-router'; 
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Alert, TextInput} from 'react-native'
import{gql, useQuery} from '@apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useEffect, useState } from 'react';
import CaffeineLogListItem from '@/components/CaffeineLogListItem';
import CircularProgress from 'react-native-circular-progress-indicator';

dayjs.extend(utc);
dayjs.extend(timezone);

const LOGS_QUERY = gql`
  query caffeineLogByUserIdAndDate($user_id: String!, $date: String!) {
    caffeineLogByUserIdAndDate(user_id: $user_id, date: $date) {
      caffeine
      calories
      created_at
      drink
      id
      type
      volume
    }
  }
`;

const USER_SETTINGS_QUERY = gql`
  query {
    userSettings {
      weight
      maxCaffeineLimit
    }
  }`
;



export default function HomeScreen(){
    const user_id = 'ana'; //change later with authentication system
    const router = useRouter();
    const today = dayjs().tz('America/New_York').format('YYYY-MM-DD');
    
    const [modalVisible, setModalVisible] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    // Fetch user settings (weight and max caffeine limit)
    const { data: userSettingsData, loading: userLoading } = useQuery(USER_SETTINGS_QUERY);
    const weight = userSettingsData?.userSettings?.weight || 150;
    const maxCaffeine = userSettingsData?.userSettings?.maxCaffeineLimit || (weight / 2.2) * 5.7;
    const { data, loading: logsLoading, error } = useQuery(LOGS_QUERY, {
      variables: { date: today, user_id },
    });
    const [caffeineConsumed, setCaffeineConsumed] = useState<number>(0);

    useEffect(() => {
        const total = data?.caffeineLogByUserIdAndDate?.reduce(
          (sum: number, item: { caffeine: number }) => sum + item.caffeine,
          0
        ) || 0;
        setCaffeineConsumed(total);

        // Trigger warnings dynamically
        if (total >= maxCaffeine) {
          setWarningMessage('You have reached or exceeded your daily caffeine limit!');
          setModalVisible(true);
        } else if (total >= maxCaffeine * 0.8) {
          setWarningMessage('You are approaching your daily caffeine limit.');
          setModalVisible(true);
        }

      }, [data, maxCaffeine]);
    const showWarnings = ()=>{
        setModalVisible(true);
    };
  
    
    const progress = Math.min((caffeineConsumed / maxCaffeine) * 100, 100);
    

    if(userLoading ||logsLoading){
        return <ActivityIndicator />
    }

    if(error){
        return <Text>Failed to Fetch Data</Text>
    }
    console.log(data);
    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerRow}>
                <Text style={styles.subtitle}>Today's Caffeine</Text>
                <Link href="/search" asChild>
                    <Button title="ADD CAFFEINE" />
                </Link>
            </View>

            

                  {/* Progress Circle Section */}
            <View style={styles.progressContainer}>
                <CircularProgress
                value={caffeineConsumed}
                maxValue={maxCaffeine}
                radius={80}
                duration={1500}
                activeStrokeColor="#9CAF88"
                inActiveStrokeColor="#e0e0e0"
                progressValueColor="##9CAF88"
                progressValueFontSize={24}
                title="mg"
                titleColor="#333"
                titleStyle={{ fontWeight: 'bold' }}
                />
                <TouchableOpacity style={styles.warningButton} onPress={showWarnings}>
                <Text style={styles.warningButtonText}>Check Warnings</Text>
                </TouchableOpacity>
            </View>

            {/* Caffeine Log Section */}
            <FlatList
                data={data.caffeineLogByUserIdAndDate}
                keyExtractor={(item, index) => index.toString()} // Ensure unique keys
                renderItem={({ item }) => <CaffeineLogListItem item={item} />} // Pass individual items to FoodListItem
                contentContainerStyle={{ gap: 5 }} // Optional spacing between items
            />
            {/* Modal for Warnings */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Warning</Text>
                <Text style={styles.warningText}>{warningMessage}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            {/* Informational Section */}
            <TouchableOpacity style={styles.infoSection} onPress={() => router.push('/info')}>
                <Text style={styles.infoTitle}>Caffeine Intake Calculator</Text>
                <Text style={styles.infoDescription}>
                    Calculate your intake and discover the benefits and dangers of caffeine.
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#817A8C', 
        flex: 1, 
        padding: 10, 
        gap: 10,
    },
    headerRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 18, 
        fontWeight: '500', 
        flex: 1, 
        color: '#9CAF88',
    },
    weightInputContainer: {
        marginVertical: 10,
      },
      weightLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
      },
      weightInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
      },
      progressContainer: {
        alignItems: 'center',
        marginVertical: 20,
      },
      warningButton: {
        backgroundColor: '#9CAF88',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
      },
      warningButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', // Make it smaller and centered
        top: '30%', // Adjust position vertically
        left: '10%', // Adjust position horizontally
        width: '80%', // Set width of the modal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      modalTitle: {
        fontSize: 20, // Slightly smaller title
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#f44336',
      },
      warningText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
      },
      closeButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
    infoSection: {
        backgroundColor: '#9CAF88',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    infoDescription: {
        fontSize: 14,
        color: '#2C3E50',
        marginTop: 5,
    },
    warningsSection: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
      },
      warningsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f44336',
        marginBottom: 5,
      },
      noWarningsText: {
        fontSize: 16,
        color: '#666',
      },
});