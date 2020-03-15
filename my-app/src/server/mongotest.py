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
    # Increase/Decrease user holdings of $stock by $amount
    if operation == "Sell":
        quantity = quantity * -1

    result = db.users.find_one({"email": user})

    if len(result['portfolio']) == 0 and operation == "Sell":
        print("ERROR: User does not have any stock in portfolio")
        return result

    if operation == "Sell" and result['portfolio'][stock] + quantity < 0:
        print("You do not have enough " + stock + " stock for this action")
        return result

    query = { "email": user }
    newValues = { "$inc": { "portfolio."+ stock: quantity } }
    db.users.update_one(query, newValues)
    return db.users.find_one({"email": user})
    
#result = buy_sell_stock("test@test.com","GOOG",58,"Sell")
#print(result)

load_dotenv()
# Connect with Mongodb Atlas
client = MongoClient(os.getenv("MONGO_STRING"))
db=client.userHoldings

# This query returns JSON if exists, and None if it doesn't exist
exists = db.users.find_one({ "$and": [ { "email": "test@test.com" }, { "portfolio.NFLX":{"$exists":True} } ] })

print(exists == None)




print('Finish')