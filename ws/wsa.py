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

    # Fetch and parse
    tables = pd.read_html(url)
    if tables:
        return tables[0]
    else:
        raise ValueError(f"No valid table found. URL: {url}")


if __name__ == "__main__":
    # Example: Wheat, Karnataka, Mysore (Bandipalaya), Sep 2019–Sep 2025
    df = scrape_agmarknet_full(
        commodity_id="1",
        state_code="KK",
        district_id="12",
        market_id="123",
        commodity_head="Wheat",
        state_head="Karnataka",
        district_head="Mysore",
        market_head="Mysore+(Bandipalya)",
        date_from="16-Sep-2019",
        date_to="16-Sep-2025"
    )

    # Pandas display settings → show full table
    pd.set_option("display.max_rows", None)
    pd.set_option("display.max_columns", None)
    pd.set_option("display.width", None)
    pd.set_option("display.max_colwidth", None)

    # Print full table (for shell redirection > output.txt)
    print(df.to_string(index=False))

    # Also save clean files
    df.to_csv("agmarknet_output.csv", index=False)
    df.to_csv("agmarknet_output.txt", sep="\t", index=False)
