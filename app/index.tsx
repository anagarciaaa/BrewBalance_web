import { StyleSheet, Text, View, FlatList } from "react-native";
import FoodListItem from "@/components/FoodListItem";
const foodItems =[
  {label: "Coffee", cal: 75, brand: 'Dominos'},
  {label: "Pizza", cal: 50, brand: 'generic'},
  {label: "Apple", cal: 25, brand: 'walmart'},
  {label: "Apple", cal: 25, brand: 'walmart'},
]
export default function App() {
  return (
    <View style ={styles.container}>
      {/*Food Item View*/}
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
  },
})
