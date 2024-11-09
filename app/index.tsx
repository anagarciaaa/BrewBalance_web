import { StyleSheet, Text, View, FlatList, TextInput, Button } from "react-native";
import FoodListItem from "@/components/FoodListItem";
// @ts-ignore
import { useState } from "react";

const foodItems =[
  {label: "Coffee", cal: 75, brand: 'Dominos'},
  {label: "Pizza", cal: 50, brand: 'generic'},
  {label: "Apple", cal: 25, brand: 'walmart'},
  {label: "Apple", cal: 25, brand: 'walmart'},
]
export default function App() {
  const[search, setSearch] = useState('');
  const performSearch=()=>{
    console.warn("Searching for: ",search);
    setSearch('');
  }
  return (
    <View style ={styles.container}>
      {/*Food Item View*/}
      <TextInput 
        value = {search} 
        onChangeText={setSearch}
        placeholder="Search..." 
        style={styles.input}
      />
      {search && <Button title="Search" onPress={performSearch}/>}
      <FlatList
        data ={foodItems}
        renderItem={({item})=><FoodListItem item={item}/>}
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
