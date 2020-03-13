import React from "react";
import app from "./base";
import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';


var stocks = ['FB','AMZN','APPL','GOOG','MSFT']
console.log(stocks)

const Home = () => {
  return (
    <div>
      <div className="portfolio">
        <h1>Portfolio ($5000)</h1>
      </div>
        <Button color="danger" onClick={() => app.auth().signOut()}>Sign out</Button>
    </div>
  );
};

export default Home;