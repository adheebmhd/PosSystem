import React, { useState, useEffect } from "react";

export default function useronly() {
    const [stock, setStock] = useState([]);
    const [search, setSearch] = useState("");

     // Load Stock from Backend
      useEffect(() => {
        fetch("http://localhost:5000/stock")
          .then((res) => res.json())
          .then((data) => setStock(data))
          .catch((err) => console.log(err));
      }, []);

const filteredStock = stock.filter((item) =>
  (item.name || "").toLowerCase().includes(search.toLowerCase())
);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Stock Maintain</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search stock..."
          className="border px-3 py-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredStock.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.price}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
