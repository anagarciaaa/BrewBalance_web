import { StyleSheet, Text, View, FlatList, TextInput, Button, ActivityIndicator } from "react-native";
import FoodListItem from "@/components/FoodListItem";
// @ts-ignore
import { useState } from "react";
import{gql, useLazyQuery} from "@apollo/client";
const query = gql`
    query($drink: String, $type: String){
      searchCaffeineSource(drink: $drink, type: $type) {
        caffeine
        drink
        volume
        type
      }
    }
  `;

const foodItems =[
  {label: "Coffee", cal: 75, brand: 'Dominos'},
  {label: "Pizza", cal: 50, brand: 'generic'},
  {label: "Apple", cal: 25, brand: 'walmart'},
  {label: "Apple", cal: 25, brand: 'walmart'},
]
export default function SearchScreen() {
  const[search, setSearch] = useState('');

  const [runSearch, {data, loading, error}]= useLazyQuery(query, 
    {variables: {search},
  });
  const performSearch=()=>{
    runSearch({variables: {type: search}});
    setSearch('');
  }
  /*
  if(loading){
    return <ActivityIndicator />;
  }
    */
  if(error){
    return <Text>Failed to Search</Text>;
  }
  const items = data?.searchCaffeineSource || [];
  return (
    <View style ={styles.container}>
      {/*Food Item View*/}
      <TextInput 
        value = {search} 
        onChangeText={setSearch}
        placeholder="Search by Drink Brand or Type" 
        style={styles.input}
      />
      {search && <Button title="Search" onPress={performSearch}/>}
      {loading && <ActivityIndicator />}
      <FlatList
        data ={items}
        renderItem={({item})=><FoodListItem item={item}/>}
        ListEmptyComponent={()=> <Text>Search a Food</Text>}
        contentContainerStyle={{gap: 5}}
        />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
  },
  input:{
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 20,
  }
})
