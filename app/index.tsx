import { Text, View } from "react-native";
import { Link } from 'expo-router'
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hi from expo router</Text>
      <Link href="/dashboard">Go to dashboard</Link>
    </View>
  );
}
