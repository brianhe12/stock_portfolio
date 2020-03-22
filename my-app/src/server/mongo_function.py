import datetime
import json
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pprint import pprint
import iex_api

# Function handles all the intricacies invovled in querying our Mongodb cloud instance
def buy_sell_stock(user,stock,amount,operation):

    load_dotenv()
    # Connect with Mongodb Atlas.
    client = MongoClient(os.getenv("MONGO_STRING"))
    db=client.userHoldings

    # If user does not exist, create the user in our database.
    result = db.users.find_one({"email": user})
    if result == None:
        print("User does not exist, Adding User")
        db.users.insert_one({
            "email": user,
            "portfolio": [],
            "history": [],
            "cash": 5000
        })

    # Grab Real-time stock data.
    stock_data = iex_api.grab_stock_data(str(stock))

    # Invalid Stock Call, stop function.
    if stock_data[0] == -1 and stock_data[1] == -1:
        return

    if operation == "Sell":
        amount = amount * -1

    # Checks to see if a user with a certain email has an entry for the stock they are trying to Buy/Sell
    exists = db.users.find_one({ "$and": [ {"portfolio.symbol": stock}, {"email": user} ] })

    # Checks to make sure user cannot sell more stock than they own.
    if exists != None and operation == "Sell":
        for i in range(len(result["portfolio"])):
            if result['portfolio'][i]['amount'] + amount < 0 and result['portfolio'][i]['symbol'] == stock:
                print("You do not have enough " + stock + " stock for this action")
                return result

    elif exists == None and operation == "Sell":
        print("No inventory of " + stock + " to sell.")
        return result

    # If stock does not exist in our query & we try to buy, add the stock in our database under the user's email.
    elif exists == None and operation == "Buy":
        # Error check if user has enough cash for their order.
        if db.users.find( {"email": user} )[0]['cash'] - stock_data[1] * amount < 0:
            return "Unable to Buy"

        # If user has enough cash, then we can execute their order.
        db.users.update({"email": "a@a.com"}, {"$inc":{"cash": - stock_data[1] * amount,}} )
        db.users.update_one({"email": user}, {"$push":{"portfolio": { "symbol": stock,"amount" : amount,"currentPrice": stock_data[1], "dayChange": round(stock_data[1]-stock_data[0],2) }}})
        db.users.update_one({"email": user}, {"$push":{"history": { "stock": stock,"transaction" : operation,"numShares": amount, "pricePerShare": stock_data[1], "Time": str(datetime.datetime.utcnow())[0:len(str(datetime.datetime.utcnow()))-4]}}})
        return db.users.find_one({"email": user})

    # User exists. Execute their order.
    index = 0
    for i in range(len(result["portfolio"])):
        if result['portfolio'][i]['symbol'] == stock:
            index = i
            break
    # Error check if user has enough cash for their order.
    if db.users.find( {"email": user} )[0]['cash'] - stock_data[1] * amount < 0:
        return "Unable to Buy"

    # Update stock's opening price --> Done at the beginning of the day

    # Increase/Decrease cash in user's account after they buy/sell
    db.users.update({"email": user}, {"$inc":{"cash": - stock_data[1] * amount,}} )

    # Increase/Decrease amount of stocks in user's account after they buy/sell
    db.users.update_one({"email": user}, {"$inc":{"portfolio." + str(index) +".amount": amount}})

    # Add transaction into history
    db.users.update_one({"email": user}, {"$push":{"history": { "stock": stock,"transaction" : operation,"numShares": amount, "pricePerShare": stock_data[1], "Time": str(datetime.datetime.utcnow())}}})
    
    return db.users.find_one({"email": user})

# TESTING
# load_dotenv()
# # Connect with Mongodb Atlas.
# client = MongoClient(os.getenv("MONGO_STRING"))
# db=client.userHoldings
# buy_sell_stock("a@a.com","AAPL",2,"Buy")
