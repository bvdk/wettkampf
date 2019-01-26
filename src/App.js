import React, {Component} from 'react';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import './i18n';
import Routes from "./routes";
import {BrowserRouter as Router} from "react-router-dom";
import Layout from "./components/Layout";
import './App.css';




const client = new ApolloClient({
  uri: "/"
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
