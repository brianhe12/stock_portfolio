"""
# How our database should look
db.user.insert({
  email: 'test@test.com',
  portfolio: {
    APPL: 3,
    GOOG: 4
  },
  date: Date(),
})

# Index into specific value
# result = db.users.find_one({"email": "<<email>>"})
# print(result['portfolio']['APPL'])

# This query returns JSON if exists, and None if it doesn't exist
exists = db.users.find_one({ "$and": [ { "email": "test@test.com" }, { "portfolio.NFLX":{"$exists":True} } ] })
"""

import datetime
import json
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pprint import pprint

def buy_sell_stock(user,stock,quantity,operation):

    load_dotenv()
    # Connect with Mongodb Atlas
    client = MongoClient(os.getenv("MONGO_STRING"))
    db=client.userHoldings

    # If user does not exist, create user
    result = db.users.find_one({"email": user})
    if result == None:
        print("User does not exist, Adding User")
        db.users.insert_one({
            "email": user,
            "portfolio": {},
            "date": str(datetime.datetime.utcnow()),
            "cash": 5000
        })
    
    if operation == "Sell":
        quantity = quantity * -1

    # Checks to see if a user with a certain email has an entry for the stock they are trying to Buy/Sell
    exists = db.users.find_one({ "$and": [ { "email": user }, { "portfolio." + stock:{"$exists":True} } ] })

    # If query exists, we can check index
    if exists != None:
        if result['portfolio'][stock] + quantity < 0:
            print("You do not have enough " + stock + " stock for this action")
            return result
    # If query does not exist & we try to sell, throw an error
    elif exists == None and operation == "Sell":
        print("No inventory of " + stock + " to sell.")
        return result

    # Update and Increase/Decrease user holdings of $stock by $amount
    query = { "email": user }
    newValues = { "$inc": { "portfolio." + stock: quantity } }
    db.users.update_one(query, newValues)
    return db.users.find_one({"email": user})
    

# load_dotenv()
# client = MongoClient(os.getenv("MONGO_STRING"))
# db=client.userHoldings

# result = buy_sell_stock("test2@test.com","AMZN",16,"Buy")
# print(result)

# print('Finish')