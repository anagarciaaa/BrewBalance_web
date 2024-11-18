import {View, Text, StyleSheet} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
// @ts-ignore

const CaffeineLogListItem = ({ item }) =>{
    return(
        <View style ={styles.container}>
            <View style ={{flex:1, gap: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.drink}</Text>
            <Text style={{color: 'dimgray'}}> 
                Volume: {item.volume} ml | Caffeine: {item.caffeine} mg | Type: {item.type}
            </Text>
        </View>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gainsboro', 
        padding: 10, 
        borderRadius: 5, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
  })
  export default CaffeineLogListItem;
  