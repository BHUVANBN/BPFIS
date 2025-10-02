// server.js
import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/fetch-agmarknet", async (req, res) => {
  try {
    const { commodityId, stateCode, districtId, marketId, commodityHead, stateHead, districtHead, marketHead, dateFrom, dateTo } = req.body;

    const base = "https://agmarknet.gov.in/SearchCmmMkt.aspx";
    const params = new URLSearchParams({
      Tx_Commodity: commodityId,
      Tx_State: stateCode,
      Tx_District: districtId,
      Tx_Market: marketId,
      DateFrom: dateFrom,
      DateTo: dateTo,
      Fr_Date: dateFrom,
      To_Date: dateTo,
      Tx_Trend: 0,
      Tx_CommodityHead: commodityHead,
      Tx_StateHead: stateHead,
      Tx_DistrictHead: districtHead,
      Tx_MarketHead: marketHead
    });

    const url = `${base}?${params.toString()}`;
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const table = $("table").first();
    if (!table) return res.json({ rows: [] });

    const rows = [];
    table.find("tr").each((i, tr) => {
      const row = [];
      $(tr).find("th, td").each((j, cell) => row.push($(cell).text().trim()));
      rows.push(row);
    });

    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Agmarknet data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
