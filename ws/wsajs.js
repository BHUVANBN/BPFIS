// Install dependencies first:
// npm install axios cheerio fs

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrapeAgmarknetFull({
  commodityId, stateCode, districtId, marketId,
  commodityHead, stateHead, districtHead, marketHead,
  dateFrom, dateTo
}) {
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
  const table = $("table").first(); // select the first table

  if (!table) throw new Error(`No table found at URL: ${url}`);

  const rows = [];
  table.find("tr").each((i, tr) => {
    const row = [];
    $(tr).find("th, td").each((j, cell) => {
      row.push($(cell).text().trim());
    });
    rows.push(row);
  });

  return rows;
}

(async () => {
  try {
    const rows = await scrapeAgmarknetFull({
      commodityId: "1",
      stateCode: "KK",
      districtId: "12",
      marketId: "123",
      commodityHead: "Wheat",
      stateHead: "Karnataka",
      districtHead: "Mysore",
      marketHead: "Mysore+(Bandipalya)",
      dateFrom: "16-Sep-2019",
      dateTo: "16-Sep-2025"
    });

    // Convert to CSV
    const csv = rows.map(r => r.join(",")).join("\n");
    fs.writeFileSync("agmarknet_output.csv", csv);
    fs.writeFileSync("agmarknet_output.txt", rows.map(r => r.join("\t")).join("\n"));

    console.log("Scraping done. Files saved.");
  } catch (err) {
    console.error(err);
  }
})();
