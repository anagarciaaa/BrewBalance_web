import { Stack } from "expo-router";
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  gql, 
} from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://10.188.104.235:4000/',
  cache: new InMemoryCache(),
});

const RootLayout = () =>{
  return(
    <ApolloProvider client = {client}>
      <Stack />
    </ApolloProvider>
  )
}
export default RootLayout;
