import React, { useState, useEffect } from "react";

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");

  // Load Stock from Backend
  useEffect(() => {
    fetch("http://localhost:5000/stock")
      .then((res) => res.json())
      .then((data) => setStock(data))
      .catch((err) => console.log(err));
  }, []);

  // Add Stock
  const addStock = () => {
    const name = prompt("Enter item name:");
    const quantity = parseInt(prompt("Enter quantity:"));
    const price = parseFloat(prompt("Enter price:"));

    if (!name || isNaN(quantity) || isNaN(price)) {
      return alert("Invalid input");
    }

    fetch("http://localhost:5000/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity, price }),
    })
      .then(() => refreshData());
  };

  // Update Stock
  const updateStock = (id) => {
    const item = stock.find((i) => i.id === id);
    const quantity = parseInt(prompt("Update quantity:", item.quantity));
    const price = parseFloat(prompt("Update price:", item.price));

    if (isNaN(quantity) || isNaN(price)) {
      return alert("Invalid input");
    }

    fetch(`http://localhost:5000/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, price }),
    })
      .then(() => refreshData());
  };

  // Delete Stock
  const deleteStock = (id) => {
    if (!confirm("Are you sure to delete?")) return;

    fetch(`http://localhost:5000/stock/${id}`, {
      method: "DELETE",
    })
      .then(() => refreshData());
  };

  // Refresh without reload
  const refreshData = () => {
    fetch("http://localhost:5000/stock")
      .then((res) => res.json())
      .then((data) => setStock(data));
  };

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

        <button
          onClick={addStock}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add New Stock
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStock.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.price}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => updateStock(item.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteStock(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
