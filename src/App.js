import React, {Component} from 'react';
import ApolloClient from "apollo-boost";
import Routes from "./routes";
import {ApolloProvider} from "react-apollo";
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import Layout from "./components/Layout";

const client = new ApolloClient({
  uri: "http://127.0.0.1:4000"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
