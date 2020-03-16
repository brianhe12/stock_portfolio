"""
NOSQL DataBase - data stored as documents, in json-like syntax

Relationship database - need to map out everything
NoSql - don need any predefined structuring before building application
- NoSql easier to scale than SQL or other relationship databases,
example: Mysql, postgres, oracle -> Store data in rows and columns
NoSQL- store data in collections of documents
Much faster in most operations, especially with a lot of data 

Cheat Sheet
https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6

# How our database should look
db.userHoldings.insert({
  email: 'test@test.com',
  portfolio: {
    APPL: 3,
    GOOG: 4
  },
  date: Date(),
})

db.userHoldings.insert({
  email: 'user1@test.com',
  portfolio: {
    AMZN: 3,
    MSFT: 1
  },
  date: Date(),
})

# Increment a specific stock value & set last used date
db.userHoldings.update({ email: 'test@test.com' },
{
  $inc: {
    "portfolio.APPL": 7
  },
  $set: {
    date: Date()
  }
})

db.userHoldings.find({ email: 'test@test.com' })

https://flask-pymongo.readthedocs.io/en/latest/
"""
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
load_dotenv()
# Connect with Mongodb Atlas
client = MongoClient(os.getenv("MONGO_STRING"))
db=client.userHoldings

app = Flask(__name__)
CORS(app)

# Route to buy/sell
@app.route('/<email>/<stock>/<int:amount>/<operation>', methods=['GET'])
def main_function(email,stock,amount,operation):
  class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
        
  return JSONEncoder().encode(mongo_function.buy_sell_stock(email,stock,amount,operation))

# Route to cash update
@app.route('/cashUpdate/<email>')
def cash_update(email):
  result = db.users.find( {"email": email} )
  return jsonify(result[0]['cash'])


# Route to fill portfolio UI
@app.route("/<email>")
def test_again(email):
  myCursor = db.users.find( {"email": email} )
  return jsonify(myCursor[0]['portfolio'])

  
if __name__ == "__main__":
    app.run(debug=True)