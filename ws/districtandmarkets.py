import requests
from bs4 import BeautifulSoup
import pandas as pd

BASE_URL = "https://agmarknet.gov.in/SearchCmmMkt.aspx"

districts = {
    "25": "Bagalkot",
    "1": "Bangalore",
    "2": "Belgaum",
    "3": "Bellary",
    "4": "Bidar",
    "5": "Bijapur",
    "28": "Chamrajnagar",
    "15": "Chikmagalur",
    "16": "Chitradurga",
    "6": "Davangere",
    "7": "Dharwad",
    "27": "Gadag",
    "18": "Hassan",
    "8": "Haveri",
    "17": "Kalburgi",
    "19": "Karwar(Uttar Kannad)",
    "10": "Kolar",
    "11": "Koppal",
    "20": "Madikeri(Kodagu)",
    "21": "Mandya",
    "22": "Mangalore(Dakshin Kannad)",
    "12": "Mysore",
    "14": "Raichur",
    "29": "Ramanagar",
    "23": "Shimoga",
    "24": "Tumkur",
    "26": "Udupi",
    "30": "Yadgiri",
}

rows = []

for dist_id, dist_name in districts.items():
    params = {
        "Tx_Commodity": "1",              # just pick Wheat (any commodity works)
        "Tx_State": "KK",
        "Tx_District": dist_id,
        "Tx_Market": "0",
        "DateFrom": "16-Sep-2019",
        "DateTo": "16-Sep-2025",
        "Fr_Date": "16-Sep-2019",
        "To_Date": "16-Sep-2025",
        "Tx_Trend": "0",
        "Tx_CommodityHead": "Wheat",
        "Tx_StateHead": "Karnataka",
        "Tx_DistrictHead": dist_name,
        "Tx_MarketHead": "--Select--"
    }

    resp = requests.get(BASE_URL, params=params)
    soup = BeautifulSoup(resp.text, "html.parser")

    market_dropdown = soup.find("select", {"id": "ddlMarket"})
    markets = [
        opt.text.strip()
        for opt in market_dropdown.find_all("option")
        if opt.get("value") not in ("0", None)
    ]

    rows.append([dist_name] + markets)
    print(f"✅ {dist_name}: {len(markets)} markets")

# normalize
max_len = max(len(r) for r in rows)
rows = [r + [""] * (max_len - len(r)) for r in rows]

headers = ["district"] + [f"market{i}" for i in range(1, max_len)]
df = pd.DataFrame(rows, columns=headers)
df.to_csv("district_markets.csv", index=False)

print("CSV saved: district_markets.csv")
