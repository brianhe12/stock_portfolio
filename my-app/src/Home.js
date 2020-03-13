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
    var currentPrice = 300000;
    super(props);
    this.state = {
      portfolioValue: 0,
      columnDefs: [
        { headerName: "Stock", field: "symbol"},
        { headerName: "Price", field: "price", 
          cellStyle: function(params){
            if (params.value === currentPrice){
              return {color:'slategray'}
            }
            else if (params.value > currentPrice){
              return {color:'mediumseagreen'}
            }
            else {
              return {color: 'red'}
            }
          }}],
      //TODO: Use HTML5 Fetch to get data from python flask back-end in {symbol: "string", price: int} format
      rowData: [
        { symbol: "APPL", price: 335000 },
        { symbol: "GOOG", price: 32000 },
        { symbol: "NFLX", price: 300000 },],

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
      <div>
        <Label className="portfolio-label">Portfolio Value: {this.state.portfolioValue}</Label>
        <Button color="danger" style={{position: 'absolute', top: 10, right: 10}} onClick={() => app.auth().signOut()}>Logout</Button>
        <div className="ag-theme-balham" style={ {height: '500px', width: '402px'} }>
          <AgGridReact
              enableSorting={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
          </AgGridReact>
        </div>
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

