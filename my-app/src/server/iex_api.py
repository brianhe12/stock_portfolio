import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Function to grab stock data from IEX Cloud API
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
    prices.append(round(data["previousClose"],2))
    prices.append(round(data["latestPrice"],2))

    return prices
