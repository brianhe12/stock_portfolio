import React from 'react'
import { Button } from 'reactstrap';
import app from "../base";

const Navbar = () => {
    return (
      <div>
        <nav class="navbar navbar-expand-sm bg-light justify-content-center">
        {/* Logout Button */}
        <Button color="danger" style={{position: 'absolute', top: 10, right: 10}} onClick={() => app.auth().signOut()}>Sign Out</Button>
        {/* Navbar */}
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/transactionhistory">Transaction History</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/">Portfolio</a>
          </li>
        </ul>
        </nav>
      </div>
    )
  };

  export default Navbar