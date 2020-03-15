import React from 'react';
import { Component } from 'react';
import Cards from './components/cards'
import app from "./base";

class App extends Component {
    componentDidMount() {
        app.auth().onAuthStateChanged(user => {
            if (user) {
                //User is signed in
                console.log('This is the user: ', user)
                this.setState({
                    isLoggedIn: true,
                });
            } else {
                // No user is signed in.
                console.log('There is no logged in user');
                this.setState({
                    isLoggedIn: false,
                });
            }
        });
      fetch('http://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then((data) => {
        this.setState({ contacts: data })
      })
      .catch(console.log)
    }
  
    state = {
        isLoggedIn: false,
        contacts: [],
        transactionHistory: [
            {
              "stock": "APPL",
              "transaction": "Buy",
              "numShares": 3,
              "pricePerShare": 338,
              "Time": "10:23:01"
            },
            {
              "stock": "GOOG",
              "transaction": "Buy",
              "numShares": 32,
              "pricePerShare": 338,
              "Time": "10:23:01"
            },
        ]
    }
    render() {
        var isLoggedIn = this.state.isLoggedIn;
        return (
            <div>
                {/* Transition Links */}
                <div className="text-center">
                    <a href="/transactionhistory">Transaction History</a>
                    <span className="p-2">|</span>
                    <a href="/">Portfolio</a>
                </div>
                {/* Render if user is logged in, else do not render */}
                {isLoggedIn ? <Cards transactionHistory={this.state.transactionHistory} /> : <center><h1>User not Logged In</h1></center>}
            </div>
        );
    }
  }
  
  export default App;