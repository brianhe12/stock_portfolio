import React from "react";
import app from "./base";
import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


function fetch_from_flask(email,stock,amount,operation){
  var url = 'http://127.0.0.1:5000/' + email + '/' + stock + '/' + amount + '/' + operation;
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

}
class Home extends Component {
  constructor(props) {
    var openPrice = 300000;
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
        { headerName: "Price", field: "currentPrice", 
          cellStyle: function(params){
            if (params.value === openPrice){
              return {color:'slategray'}
            }
            else if (params.value > openPrice){
              return {color:'mediumseagreen'}
            }
            else {
              return {color: 'red'}
            }
          }}],
      rowData: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    var url = 'http://127.0.0.1:5000/';
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
  }

  handleChange = event => {
    this.setState({
        [event.target.name]: event.target.value
    })
}

  handleSubmit = (event) => {
    event.preventDefault()
    alert(this.state.userEmail + ":" + this.state.operation + " " + this.state.quantity + " of " + this.state.symbol)
    fetch_from_flask(this.state.userEmail, this.state.symbol, this.state.quantity, this.state.operation);
  }

  render() {
    return (
      <div className="home-page">
        {/* Labels */}
        <Label className="portfolio-label">Portfolio: ${this.state.portfolioValue}</Label>
        <Label className="buying-power-label">Buying Power:</Label>
        <Label className="cash-label">${this.state.cash}</Label>
        {/* Logout Button */}
        <Button color="danger" style={{position: 'absolute', top: 10, right: 10}} onClick={() => app.auth().signOut()}>Sign Out</Button>
        {/* Portfolio Chart */}
        <div className="ag-theme-balham" style={ {height: '500px', width: '602px'} }>
          <AgGridReact
              enableSorting={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
          </AgGridReact>
        </div>
        {/* Functionality */}
          <form className="purchase" onSubmit={this.handleSubmit}>
            <Label>Ticker</Label>
            <Input type="text" name="symbol" placeholder="Search for symbols" onChange={this.handleChange}/>
            <Label>Quantity</Label>
            <Input type="text" name="quantity" placeholder="Number of shares" onChange={this.handleChange}/>
            <Label for="trade">Trade</Label>
            <Input type="select" name="operation" onChange={this.handleChange}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </Input>
            <br></br>
            <Button type="submit">Confirm</Button>
          </form>
        {/* Transition Links */}
        <div className="text-center">
          <a href="/transactionhistory">Transaction History</a>
          <span className="p-2">|</span>
          <a href="/">Portfolio</a>
        </div>
      </div>
    );
  }
}

export default Home
