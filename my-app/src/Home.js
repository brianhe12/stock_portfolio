import React from "react";
import app from "./base";
import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Home extends Component {
  constructor(props) {
    var openPrice = 300000;
    super(props);
    this.state = {
      portfolioValue: 6917,
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
      //TODO: Use HTML5 Fetch to get data from python flask back-end in {symbol: "string", price: int} format
      rowData: [
        { symbol: "APPL", amount: 3, currentPrice: 335000 },
        { symbol: "GOOG", amount: 4, currentPrice: 32000 },
        { symbol: "NFLX", amount: 5, currentPrice: 300000 }],

      // TransactionHistoryDef: [
      //   { headerName: "Stock", field: "symbol"},
      //   { headerName: "Transaction", field: "transaction"},
      //   { headerName: "# of Shares", field: "num"},
      //   { headerName: "Price per share", field: "price"},
      //   { headerName: "Time", field: "time"}],
      // TransactionRowData: [
      //   { symbol: "APPL", transaction: "BUY", num: 3, price: 128, time: "Friday"}
      // ]
    }
  }

  render() {
    return (
      <div className="home-page">
        <Label className="portfolio-label">Portfolio: ${this.state.portfolioValue}</Label>
        <Label className="buying-power-label">Buying Power:</Label>
        <Label className="cash-label">${this.state.cash}</Label>
        <Label className="past-transactions-label">Past Transactions</Label>
        <Button color="danger" style={{position: 'absolute', top: 10, right: 10}} onClick={() => app.auth().signOut()}>Sign Out</Button>
        <div className="ag-theme-balham" style={ {height: '500px', width: '602px'} }>
          <AgGridReact
              enableSorting={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
          </AgGridReact>
        </div>
        {/*TODO: Add Functionality */}
        <FormGroup className="purchase">
          <Label>Ticker</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="Search for symbols" />
          <Label for="trade">Trade</Label>
          <Input type="select" name="select" id="trade">
            <option>Buy</option>
            <option>Sell</option>
          </Input>
          <br></br>
          <Button>Confirm</Button>
        </FormGroup>
        <table className="transactions">
          <tr>
            <th>Stock</th>
            <th>Transaction</th>
            <th># of Shares</th>
            <th>Price per Share</th>
            <th>Time</th>
          </tr>
          <tr>
            <td>APPL</td>
            <td>BUY</td>
            <td>3</td>
            <td>129.38</td>
            <td>Friday</td>
          </tr>
          <tr>
            <td>GOOG</td>
            <td>BUY</td>
            <td>3</td>
            <td>129.38</td>
            <td>Friday</td>
          </tr>
        </table>

      </div>
    );
  }
}

export default Home

// const Home = () => {
//   return (
//     <div>
//       <div className="portfolio">
//         <h1>Portfolio ($5000)</h1>
//       </div>
//         <Button color="danger" onClick={() => app.auth().signOut()}>Sign out</Button>
//     </div>
//   );
// };

