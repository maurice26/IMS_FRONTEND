import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

/* ================= GRAPHQL ENDPOINT ================= */
const httpLink = createHttpLink({
 uri: "https://localhost:7189/graphql",// 🔥 change if your backend runs elsewhere
});

/* ================= AUTH LINK ================= */
const authLink = setContext((_, { headers }) => {
  // Get token from storage
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/* ================= ERROR HANDLING ================= */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

/* ================= APOLLO CLIENT ================= */
export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});