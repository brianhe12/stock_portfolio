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

https://stackoverflow.com/questions/34179117/how-can-i-increment-an-array-element-referenced-by-index-in-mongodb
"""

import datetime
import json
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pprint import pprint

def buy_sell_stock(user,stock,amount,operation):

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
            "portfolio": [],
            "date": str(datetime.datetime.utcnow()),
            "cash": 5000
        })
    
    if operation == "Sell":
        amount = amount * -1

    # Checks to see if a user with a certain email has an entry for the stock they are trying to Buy/Sell
    exists = db.users.find_one({ "$and": [ {"portfolio.symbol": stock}, {"email": user} ] })

    # If query exists, and we try to sell
    if exists != None and operation == "Sell":
        for i in range(len(result["portfolio"])):
            if result['portfolio'][i]['amount'] + amount < 0 and result['portfolio'][i]['symbol'] == stock:
                print("You do not have enough " + stock + " stock for this action")
                return result
    # If query does not exist & we try to sell, throw an error
    elif exists == None and operation == "Sell":
        print("No inventory of " + stock + " to sell.")
        return result

    # If query does not exist & we try to buy, add it in
    elif exists == None and operation == "Buy":
        db.users.update_one({"email": user}, {"$push":{"portfolio": { "symbol": stock,"amount" : amount,"currentPrice": 3000 }}})
        return db.users.find_one({"email": user})

    # Update if exists
    index = 0
    for i in range(len(result["portfolio"])):
        if result['portfolio'][i]['symbol'] == stock:
            index = i
            break
    db.users.update_one({"email": user}, {"$inc":{"portfolio." + str(index) +".amount": amount}})
    return db.users.find_one({"email": user})
    

# load_dotenv()
# client = MongoClient(os.getenv("MONGO_STRING"))
# db=client.userHoldings

# result = buy_sell_stock("test3@test.com","APPL",20,"Sell")
# print(result)


# db.users.insert_one({
#             "email": "NewTest@test.com",
#             "portfolio": [
#             {"symbol": "GOOG","amount": 4,"currentPrice": 3500},
#             {"symbol": "AMZN","amount": 5,"currentPrice": 32500},
#             ],
#             "date": str(datetime.datetime.utcnow()),
#             "cash": 5000
#         })

#result = db.users.find_one({"email": "NewTest@test.com"})
#db.users.update_one({"email": "NewTest@test.com"},{"$inc": {"items." + str(2) + ".count": 1}}) 
#db.users.update_one({"email": "NewTest@test.com"}, {"$inc":{"portfolio.0.amount": 2}})
#print(db.users.find_one({"email": "NewTest@test.com"}))
# print('Finish')