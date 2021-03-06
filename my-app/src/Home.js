import React from "react";
import app from "./base";
import { Component } from 'react';
import { Label, Input} from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Navbar from './components/navbar';

function fetch_from_flask(email,stock,amount,operation){
  var url = 'https://stock-portfolio-flask.herokuapp.com/' + email + '/' + stock + '/' + amount + '/' + operation;
  fetch(url, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    return data
  });
  window.location.reload(); 
}

class Home extends Component {
  constructor(props) {
    var zero = 0;
    super(props);
    this.state = {
      symbol: '',
      operation: 'Buy',
      quantity: '',
      userEmail: app.auth().currentUser.email,
      portfolioValue: 0,
      cash: 5000,
      columnDefs: [
        { headerName: "Stock", field: "symbol"},
        { headerName: "Holdings", field: "amount"},
        { headerName: "Price ($)", field: "currentPrice",},
        { headerName: "Day Change ($)", field: "dayChange",
          cellStyle: function(params){
          if (params.value === zero){
            console.log(params.value)
            return {color:'slategray'}
          }
          else if (params.value > zero){
            return {color:'mediumseagreen'}
          }
          else {
            return {color: 'red'}
          }},
        }
      ],
      rowData: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Backend calls to Flask
  componentDidMount() {
    var url = 'https://stock-portfolio-flask.herokuapp.com/';
    fetch(url + this.state.userEmail)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.setState({rowData: data})
    });

    fetch(url + 'cashUpdate/' + this.state.userEmail)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.setState({cash: data})
    });

    fetch(url + 'portfolioUpdate/' + this.state.userEmail)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.setState({portfolioValue: data})
    });
  }

  handleChange = event => {
    this.setState({
        [event.target.name]: event.target.value
    })
}

  handleSubmit = event => {
    event.preventDefault()
    // alert(this.state.userEmail + ":" + this.state.operation + " " + this.state.quantity + " of " + this.state.symbol)
    fetch_from_flask(this.state.userEmail, this.state.symbol, this.state.quantity, this.state.operation);
  }

  render() {
    return (
      <div className="home-page">
        <Navbar/>
        {/* Labels */}
        <Label className="portfolio-label">PORTFOLIO VALUE</Label>
        <Label className="portfolio-cash-label">${this.state.portfolioValue}</Label>
        {/* Portfolio Chart */}
        <div className="ag-theme-balham" >
          <AgGridReact
              enableSorting={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
          </AgGridReact>
        </div>
        <Label className="buying-power-label">BUYING POWER</Label>
        <Label className="cash-label">${this.state.cash}</Label>
        {/* Functionality */}
          <form className="purchase" onSubmit={this.handleSubmit}>
            <Label>Ticker</Label>
            <Input type="text" name="symbol" placeholder="Search for symbols" onChange={this.handleChange}/><br></br>
            <Label>Quantity</Label>
            <Input type="text" name="quantity" placeholder="Number of shares" onChange={this.handleChange}/><br></br>
            <Label for="trade">Trade</Label>
            <Input type="select" name="operation" onChange={this.handleChange}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </Input>
            <br></br>
            <center><button className="button" type="submit">Confirm</button></center>
          </form>
      </div>
    );
  }
}

export default Home
