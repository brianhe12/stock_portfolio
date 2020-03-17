import requests
import os
from dotenv import load_dotenv

load_dotenv()

def grab_stock_data(stock):
    iex_token = os.getenv("IEX_TOKEN")
  
    URL = "https://cloud.iexapis.com/stable/stock/" + stock + "/quote?token=" + str(iex_token)

    r = requests.get(url = URL) 

    # Invalid stock call
    if (str(r) == "<Response [404]>"):
        return [-1,-1]

    data = r.json()

    # prices[0] = previous closing price, prices[1] = current price
    prices = []
    prices.append(data["previousClose"])
    prices.append(data["iexRealtimePrice"])

    return prices
    

# a = grab_stock_data("AAPL")
# print(a)