from flask import Flask
from flask import jsonify
from flask_cors import CORS
import mongo_function
import json
from bson import ObjectId
from pymongo import MongoClient
import os
import datetime
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Prevent issue with Heroku
@app.route('/')
def default_route():
  load_dotenv()
  # Connect with Mongodb Atlas
  client = MongoClient(os.environ["MONGO_STRING"])
  return "Hello World"
  
# Route to buy/sell
@app.route('/<email>/<stock>/<int:amount>/<operation>', methods=['GET'])
def main_function(email,stock,amount,operation):
  load_dotenv()
  # Connect with Mongodb Atlas
  client = MongoClient(os.getenv("MONGO_STRING"))
  db=client.userHoldings
  class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

  return JSONEncoder().encode(mongo_function.buy_sell_stock(email,stock,amount,operation))

# Route to cash 
@app.route('/cashUpdate/<email>')
def cash_update(email):
  load_dotenv()
  # Connect with Mongodb Atlas
  client = MongoClient(os.getenv("MONGO_STRING"))
  db=client.userHoldings
  myCursor = db.users.find( {"email": email} )
  return jsonify(round(myCursor[0]['cash'],2))

# Route to portfolio
@app.route('/portfolioUpdate/<email>')
def portfolio_update(email):
  load_dotenv()
# Connect with Mongodb Atlas
  client = MongoClient(os.getenv("MONGO_STRING"))
  db=client.userHoldings
  myCursor = db.users.find( {"email": email} )
  totalSum = 0
  for i in range(len(myCursor[0]['portfolio'])):
      totalSum += myCursor[0]['portfolio'][i]['currentPrice'] * myCursor[0]['portfolio'][i]['amount']
  return jsonify(round(totalSum,2))

# Route to portfolio UI
@app.route("/<email>")
def test_again(email):
  load_dotenv()
  # Connect with Mongodb Atlas
  client = MongoClient(os.getenv("MONGO_STRING"))
  db=client.userHoldings
  myCursor = db.users.find( {"email": email} )

  # Remove elements with no holdings
  db.users.update(
    {"email": email},
    {"$pull": { "portfolio" : {"amount": 0 } } },
  False,
  True
  )

  return jsonify(myCursor[0]['portfolio'])

# Route to Transaction History
@app.route('/transactionHistory/<email>')
def transaction_history(email):
  load_dotenv()
  # Connect with Mongodb Atlas
  client = MongoClient(os.getenv("MONGO_STRING"))
  db=client.userHoldings
  myCursor = db.users.find( {"email": email} )
  return jsonify(myCursor[0]['history'])

if __name__ == "__main__":
    app.run(debug=True)