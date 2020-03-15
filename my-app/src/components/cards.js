import React from 'react'

const Cards = ({ transactionHistory }) => {
    return (
      <div>
        <center><h1>Transaction History</h1></center>
        {transactionHistory.map((contact) => (
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{contact.stock}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{contact.transaction}</h6>
              <p class="card-text">{contact.numShares}</p>
            </div>
          </div>
        ))}
      </div>
    )
  };

  export default Cards