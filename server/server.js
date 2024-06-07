const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors'); // Import cors middleware

// Sample data
let todos = [
  { id: '1', text: 'Learn React', completed: false },
  { id: '2', text: 'Build GraphQL server', completed: true }
];

// GraphQL schema
const typeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo]!
  }

  type Mutation {
    addTodo(text: String!): Todo
  }
`;

// Resolvers
const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (_, { text }) => {
      const todo = { id: String(todos.length + 1), text, completed: false };
      todos.push(todo);
      return todo;
    },
  },
};

async function startServer() {
  // Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  app.use(cors()); // Enable CORS

  server.applyMiddleware({ app });

  // Start server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});
