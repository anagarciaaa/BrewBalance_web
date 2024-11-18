import { View, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";

const mutation = gql`
  mutation InsertCaffeineLog(
    $user_id: String!
    $drink: String!
    $volume: Float!
    $caffeine: Float!
    $type: String!
  ) {
    insertCaffeineLog(
      user_id: $user_id
      drink: $drink
      volume: $volume
      caffeine: $caffeine
      type: $type
    ) {
      id
      user_id
      drink
      volume
      caffeine
      type
      created_at
    }
  }
`;

const FoodListItem = ({ item }: { item: any }) => {
  const [insertCaffeineLog, { data, loading, error }] = useMutation(mutation, {
    refetchQueries: ['caffeineLogByUserIdAndDate'],
  });
  const router = useRouter();

  const onPlusPressed = async () => {
    await insertCaffeineLog({
      variables:{
        user_id: "ana",
        drink: item.drink,
        volume: item.volume,
        caffeine: item.caffeine,
        type: item.type,
      },
    }
  );
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.drink}</Text>
        <Text style={{ color: "dimgray" }}>
          Volume: {item.volume} ml | Caffeine: {item.caffeine} mg | Type: {item.type}
        </Text>
      </View>
      <AntDesign
        onPress={onPlusPressed}
        name="pluscircleo"
        size={24}
        color="royalblue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gainsboro",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodListItem;
