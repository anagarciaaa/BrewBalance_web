import { StyleSheet, Text, View, FlatList, TextInput, Button, ActivityIndicator } from "react-native";
import FoodListItem from "@/components/FoodListItem";
// @ts-ignore
import { useEffect, useState } from "react";
import{gql, useLazyQuery} from "@apollo/client";
const query = gql`
    query($search: String){
      searchCaffeineSource(search: $search) {
        caffeine
        drink
        volume
        type
      }
    }
  `;

  export default function SearchScreen() {
    const [search, setSearch] = useState('');
    const [runSearch, { data, loading, error }] = useLazyQuery(query);
  
    // Automatically load all results when the screen is first loaded
    useEffect(() => {
      runSearch({ variables: { search: '' } });
    }, []);
  
    const performSearch = () => {
      runSearch({ variables: { search } });
    };
  
    if (loading) {
      return <ActivityIndicator />;
    }
  
    if (error) {
      return (
        <View style={styles.container}>
          <Text>Error: {error.message}</Text>
        </View>
      );
    }
  
    const items = data?.searchCaffeineSource || [];
  
    return (
      <View style={styles.container}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by Drink Brand or Type"
          style={styles.input}
        />
        <Button title="Search" onPress={performSearch} />
        <FlatList
          data={items}
          renderItem={({ item }) => <FoodListItem item={item} />}
          ListEmptyComponent={() => <Text>No items found.</Text>}
          keyExtractor={(item, index) => index.toString()} // Ensure unique keys
          contentContainerStyle={{ gap: 5 }}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#817A8C',
      padding: 10,
      gap: 10,
    },
    input: {
      backgroundColor: '#9CAF88',
      padding: 10,
      borderRadius: 20,
    },
  });
