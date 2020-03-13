import React from "react";
import app from "./base";
import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class Home extends Component {
    render() {
        return (
            <>
              <h1>Home</h1>
              <Button onClick={() => app.auth().signOut()}>Sign out</Button>
            </>
          );
    }
}
// const Home = () => {
//   return (
//     <>
//       <h1>Home</h1>
//       <button onClick={() => app.auth().signOut()}>Sign out</button>
//     </>
//   );
// };

export default Home;