import React from 'react'

const Cards = ({ transactionHistory }) => {
    return (
      <div>
        <div class="card">
            <div class="card-body">
              <h5 class="card-title">Deposit</h5>
              <h6 class="card-subtitle mb-2 text-muted">+$5,000</h6>
            </div>
          </div>
        {transactionHistory.map((data) => (
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{data.stock}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Market {data.transaction}</h6>
              <p class="card-text">{data.numShares} Shares</p>
              <p class="card-text">${data.pricePerShare} per share</p>
              <p class="card-text">Filled {data.Time} </p>
            </div>
          </div>
        ))}
      </div>
    )
  };

  export default Cards