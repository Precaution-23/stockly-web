import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { API_BASE } from './apiBase'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || `${API_BASE}/graphql`
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('stockly_token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.message.includes('Invalid or expired token') ||
        err.message.includes('No token provided') ||
        err.message.includes('Authorization header missing')
      ) {
        localStorage.removeItem('stockly_token')
        localStorage.removeItem('stockly_userData')
        localStorage.removeItem('stockly_abilities')
        window.location.href = '/login'
      }
    }
  }
  if (networkError) console.error('Network error:', networkError)
})

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only' },
    query: { fetchPolicy: 'network-only' }
  }
})

export default apolloClient
