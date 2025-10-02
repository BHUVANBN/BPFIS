import React, { useState, useEffect } from "react";
import axios from "axios";
import { districtsData } from "./districtsData";
import { commodities } from "./commodities";

const formatDate = (dateStr) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [year, month, day] = dateStr.split("-");
  return `${day}-${months[parseInt(month)-1]}-${year}`;
};

// Parse "14 May 2025" format to Date object
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  return new Date(Date.parse(dateStr));
};

const AgriDashboard = () => {
  const [commodity, setCommodity] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [markets, setMarkets] = useState([]);
  const [marketId, setMarketId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dist = districtsData.find(d => d.id === districtId);
    if (dist) {
      setMarkets(dist.markets);
      setMarketId("");
    } else {
      setMarkets([]);
    }
  }, [districtId]);

  const fetchData = async () => {
    if (!commodity || !districtId || !marketId || !fromDate || !toDate) {
      alert("Please select all fields");
      return;
    }

    try {
      setLoading(true);
      const body = {
        commodityId: commodity,
        stateCode: "KK",
        districtId: districtId,
        marketId: marketId,
        commodityHead: commodities.find(c => c.id === commodity)?.name || "",
        stateHead: "Karnataka",
        districtHead: districtsData.find(d => d.id === districtId)?.name || "",
        marketHead: markets.find(m => m.id === marketId)?.name || "",
        dateFrom: formatDate(fromDate),
        dateTo: formatDate(toDate)
      };

      const resp = await axios.post("http://localhost:5000/fetch-agmarknet", body);

      if (resp.data.error) {
        alert(resp.data.error);
        setTableData([]);
      } else {
        let data = resp.data.rows || [];
        if (data.length > 1) {
          const headers = data[0];
          const rows = data.slice(1).sort((a, b) => {
            return parseDate(a[a.length - 1]) - parseDate(b[b.length - 1]);
          });
          setTableData([headers, ...rows]);
        } else {
          setTableData(data);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching data from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agmarknet Data</h2>

      <div>
        <label>Commodity: </label>
        <select value={commodity} onChange={e => setCommodity(e.target.value)}>
          <option value="">--Select--</option>
          {commodities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label>District: </label>
        <select value={districtId} onChange={e => setDistrictId(e.target.value)}>
          <option value="">--Select--</option>
          {districtsData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div>
        <label>Market: </label>
        <select value={marketId} onChange={e => setMarketId(e.target.value)}>
          <option value="">--Select--</option>
          {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div>
        <label>From Date: </label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
      </div>

      <div>
        <label>To Date: </label>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
      </div>

      <button onClick={fetchData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>

      {tableData.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>{tableData[0].map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgriDashboard;
