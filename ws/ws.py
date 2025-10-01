import pandas as pd

def scrape_agmarknet_full(
    commodity_id, state_code, district_id, market_id,
    commodity_head, state_head, district_head, market_head,
    date_from, date_to
):
    base = "https://agmarknet.gov.in/SearchCmmMkt.aspx"
    params = (
        f"Tx_Commodity={commodity_id}&"
        f"Tx_State={state_code}&"
        f"Tx_District={district_id}&"
        f"Tx_Market={market_id}&"
        f"DateFrom={date_from}&"
        f"DateTo={date_to}&"
        f"Fr_Date={date_from}&"
        f"To_Date={date_to}&"
        f"Tx_Trend=0&"
        f"Tx_CommodityHead={commodity_head}&"
        f"Tx_StateHead={state_head}&"
        f"Tx_DistrictHead={district_head}&"
        f"Tx_MarketHead={market_head}"
    )
    url = base + "?" + params

    # Now fetch and parse
    tables = pd.read_html(url)
    if tables:
        return tables[0]
    else:
        raise ValueError(f"No valid table found. URL: {url}")

# Example usage:
df = scrape_agmarknet_full(
    commodity_id="1",
    state_code="KK",
    district_id="12",
    market_id="123",
    commodity_head="Wheat",
    state_head="Karnataka",
    district_head="Mysore",
    market_head="Mysore+(Bandipalya)",  # URL-encoded as needed
    date_from="16-Sep-2019",
    date_to="16-Sep-2025"
)

print(df)
