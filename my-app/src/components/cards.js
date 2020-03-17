import React from 'react'

const Cards = ({ transactionHistory }) => {
    return (
      <div>
        {transactionHistory.map((data) => (
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{data.stock}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{data.transaction}</h6>
              <p class="card-text">{data.numShares}</p>
              <p class="card-text">${data.pricePerShare}</p>
              <p class="card-text">{data.Time}</p>
            </div>
          </div>
        ))}
      </div>
    )
  };

  export default Cards