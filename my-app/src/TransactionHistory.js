import React from 'react';
import { Component } from 'react';
import Cards from './components/cards'
import app from "./base";
import Navbar from './components/navbar';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: false,
            transactionHistory: [],
        }
    }
    componentDidMount() {
        app.auth().onAuthStateChanged(user => {
            if (user) {
                //User is signed in
                console.log('This is the user: ', user.email)
                this.setState({
                    isLoggedIn: true,
                });
                var url = 'http://127.0.0.1:5000/transactionHistory/' + user.email;
                fetch(url)
                .then(res => res.json())
                .then((data) => {
                    console.log(data)
                    this.setState({ transactionHistory: data })
                })
                .catch(console.log)
            } else {
                // No user is signed in.
                console.log('There is no logged in user');
                this.setState({
                    isLoggedIn: false,
                });
            }
        });
    }

    render() {
        var isLoggedIn = this.state.isLoggedIn;
        return (
            <div>
                {/* Render if user is logged in, else do not render */}
                {isLoggedIn ? <Navbar/> : <center></center>}
                {isLoggedIn ? <Cards transactionHistory={this.state.transactionHistory} /> : <center></center>}
            </div>
        );
    }
  }
  
  export default App;