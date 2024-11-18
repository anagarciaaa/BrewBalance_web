import { Stack } from "expo-router";
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  gql, 
} from '@apollo/client';
import { UserProvider } from '@/components/UserContext'; 
const client = new ApolloClient({
  uri: 'https://192.168.56.1:4000/graphql',
  cache: new InMemoryCache(),
});

const RootLayout = () => {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Stack />
      </UserProvider>
    </ApolloProvider>
  );
};
export default RootLayout;