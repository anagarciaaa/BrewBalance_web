import { StyleSheet, Text, View } from "react-native";
import FoodListItem from "@/components/FoodListItem";

export default function App() {
  return (
    <View style ={styles.container}>
      {/*Food Item View*/}
      <FoodListItem item={{label: "Coffee", cal: 75, brand: 'Dominos'}}/>
      <FoodListItem item={{label: "Apple", cal: 50, brand: 'Generic'}}/>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    gap: 5,
  },
})
