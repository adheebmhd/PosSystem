import React, { useEffect, useState } from "react";

export default function report() {
   const [bills, setBills] = useState([]);
   const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/bills")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBills(data.bills);
        }
      });
  }, []);
  const refreshData = () => {
  fetch("http://localhost:5000/bills")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBills(data.bills);
      }
    });
};


  const Payment = (id) => {
  const b = bills.find((i) => i.id === id);

  const payment = parseInt(
    prompt("How much customer paid:", b.payment_amount)
  );
  const total = b.total; // use original total


  if (isNaN(payment)) {
    return alert("Invalid input");
  }

  fetch(`http://localhost:5000/update-payment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({payment,total }),
  }).then(() => refreshData());
};
 // Delete Stock
  const deletebill = (id) => {
    if (!confirm("Are you sure to delete?")) return;

    fetch(`http://localhost:5000/update-payment/${id}`, {
      method: "DELETE",
    })
      .then(() => refreshData());}

    const filteredStock = bills.filter((b) =>
  String(b.id).toLowerCase().includes(search.toLowerCase()) ||
  (b.customer_name || "").toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Bill History</h2>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search billno or customer name "
          className="border px-3 py-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>

      <table className="table-auto w-full border border-gray-400 text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">Bill No</th>
            <th className="border px-3 py-2">Customer Name</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Payment</th>
            <th className="border px-3 py-2">Panding Amount</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Action</th>

          </tr>
        </thead>

        <tbody>
          {filteredStock.map((b) => (
            <tr key={b.id}>
              <td className="border px-3 py-2">
                {String(b.id).padStart(4, "0")}
              </td>
              <td className="border px-3 py-2">{b.customer_name}</td>
              <td className="border px-3 py-2">Rs. {b.total}</td>
              <td className="border px-3 py-2">Rs. {b.payment_amount}</td>
              <td className="border px-3 py-2">Rs. {b.pending_amount}</td>
              <td className="border px-3 py-2">
                {new Date(b.created_at).toLocaleString()}
              </td>
              <td className="border flex gap-2 px-3 py-2"><button
                  onClick={() => Payment(b.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deletebill(b.id)}
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
