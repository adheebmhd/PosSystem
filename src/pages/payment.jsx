import React, { useEffect, useState } from "react";



export default function payment() {
const [bills, setBills] = useState([]);
const [cart, setCart] = useState([]);
const [drafts, setDrafts] = useState([]);
const [customerName, setCustomerName] = useState("");
const [number, setNumber] = useState("");
const [total1, setTotal1] = useState("");
const [total2, setTotal] = useState("");
const [payedamount, setPayedamount] = useState("")
const [selectedId, setSelectedId] = useState(null);
const [billNumber, setBillNumber] = useState("");
const [pandingAmount, setPadingAmount] = useState("");
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

const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
useEffect(() => {
    fetch("http://localhost:5000/bills")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDrafts(data.drafts);
      });
  }, []);

  const updateCartItem = (id, field, value) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
    
  };

  const Payment = (id) => {
  const b = bills.find((i) => i.id === id);
  

  const payment = parseInt(
    prompt("How much customer paid:", b.payment_amount)
  );
  const total = b.total; // use original total
  
  const setTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  setTotal(setTotal)


  

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


  const loadDraft = (draft) => {
    setSelectedId(draft.id);
    const loadedCart = JSON.parse(draft.cart); // Always valid JSON now

    setCustomerName(draft.customer_name);
    setCart(loadedCart);
    setTotal1(draft.total)
    

    

    alert("Draft Loaded!");
  };

  const handlePrint = () => {
  if (!selectedId) {
    return alert("No bill selected!");
  }
  
  const item = bills.find((i) => i.id === selectedId);
  setBillNumber(selectedId);
  const payment = Number(payedamount);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const pan = total - payedamount
  setPadingAmount(pan)
  if (isNaN(payment)) {
    return alert("Invalid payment value");
  }

  fetch(`http://localhost:5000/update-payment/${selectedId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment, total, cart: cart  }),
  }).then(res => res.json())
  .then(data => {
    setBillNumber(selectedId); 
    refreshData();
  }); 
  window.print();
      setCustomerName("");
      setCart([]);
      setPayedamount("");
};

const filteredStock = bills.filter((b) =>
  String(b.id).toLowerCase().includes(search.toLowerCase()) ||
  (b.customer_name || "").toLowerCase().includes(search.toLowerCase())
);



  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div>
        <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Bill History</h2>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search billno or customer name"
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

          </tr>
        </thead>

        <tbody>
          {filteredStock.map((b) => (
            <tr key={b.id}
                className="hover:bg-blue-100 cursor-pointer"
                onClick={() => loadDraft(b)}
            >
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
              

                
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Check Payment</h2>
        

        <div className="flex justify my-1">
          <h3 className="font-bold text-xl">Custome Name : </h3>
          <input type="text"
            className="border px-2 py-1 ml-2 rounded"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
             />
        </div>
        <div className="border rounded-lg shadow p-4 max-h-[500px] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-400 text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-3 py-2">Name</th>
                <th className="border border-gray-400 px-3 py-2">Price</th>
                <th className="border border-gray-400 px-3 py-2">Qty</th>
                <th className="border border-gray-400 px-3 py-2">Total</th>
                
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-400 px-3 py-2">{item.name}</td>
                  <td className="border border-gray-400 px-3 py-2">
                    <input
                      type="number"
                      className="w-16 border rounded px-1"
                      value={item.price}
                      onChange={(e) =>
                        updateCartItem(item.id, "price", e.target.value)
                      }
                      
                      
                    />
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    <input
                      type="number"
                      className="w-16 border rounded px-1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(item.id, "quantity", e.target.value)
                      }
                      
                    />
                  </td>
                  <td className="border border-gray-400 px-3 py-2">
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          </div>
          <h3 className="text-lg font-semibold"
          >
            Total: Rs. {total.toFixed(2)}
          </h3>
          <div className="flex justify-between ">
          <h3 className="text-lg font-semibold">Payed Amount :</h3>
          <input type="number"
          className="border px-2 py-1 ml-2 rounded "
            placeholder="Enter Payed Amount" 
            value={payedamount}
            onChange={(e) => setPayedamount(e.target.value)}
            />
            <button
            className="bg-green-600   text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handlePrint}
          >
            🖨️ Print Receipt
          </button>
          </div>
          
          
          <div
  id="receiptArea"
  className="receipt hidden"
>
  <h2 className="text-2xl font-bold mb-4 text-center">RECEIPT</h2>
  <p><strong>Customer:</strong> {customerName || "N/A"}</p>
  <p>Bill No: {String(selectedId).padStart(4, "0")}</p>
  <p>Date: {new Date().toLocaleString()}</p>

  <hr className="border-dashed my-2" />
  
  <div  className="flex justify-between my-1"><span>Qty Product</span>
  <span>Unit Price</span>
  <span>Total</span>
  </div>
  {cart.map((item) => (
    <div key={item.id} className="row">
      <span>{item.quantity}x {item.name}</span>
      <span>{item.price}</span>
      <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
    </div>
  ))}

  <hr className="border-dashed my-2" />

  <div className="total-row">
    <span>TOTAL AMOUNT</span>
    <span>Rs. {total.toFixed(2)}</span>
  </div>
  <div className="total-row">
    <span>Payed Amount</span>
    <span>Rs. -{payedamount}</span>
  </div>
  <hr className="border-dashed my-2" />
  <div className="total-row">
    <span>Cridetit Amount</span>
    <span>Rs. {total.toFixed(2) - payedamount}</span>
  </div>
  </div>
      
        </div>
        
       
      
    </div>
  )
}

