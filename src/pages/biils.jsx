import React, { useState, useEffect, useRef } from "react";
import "./receipt.css";
import API from "../api";


function BillingPage() {
  const [stock, setStock] = useState([]);
  const [cart, setCart] = useState([]);
  const printRef = useRef();
  const [customerName, setCustomerName] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [search, setSearch] = useState("");


  // Fetch stock from backend
  useEffect(() => {
    fetch(`${API}/stock`)
      .then((res) => res.json())
      .then((data) => setStock(data))
      .catch((err) => console.error("Error loading stock:", err));
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  const getDrafts = async () => {
  try {
    const res = await fetch(`${API}/drafts`);
    const data = await res.json();

    if (data.success) {
      setDrafts(data.drafts);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  getDrafts();
}, []);

  const updateCartItem = (id, field, value) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Print & Update Database
  const handlePrint = async () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  if (!customerName.trim()) {
    alert("Enter customer name!");
    return;
  }

  // ✅ Stock Validation
  for (const item of cart) {
    const stockItem = stock.find((s) => s.id === item.id);

    if (!stockItem) {
      alert(`Error: ${item.name} not found in stock`);
      return;
    }

    if (item.quantity > stockItem.quantity) {
      alert(
        `Out of Stock!\n\n${item.name} available: ${stockItem.quantity}\nYou entered: ${item.quantity}`
      );
      return;
    }
  }

  try {
    // ✅ Save Bill
    const billRes = await fetch(`${API}/create-bill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        cart,
        total,
      }),
    });

    const billData = await billRes.json();

    if (!billData.success) {
      alert("Failed to save bill!");
      return;
    }

    alert("Bill Saved!");
    setBillNumber(billData.billNumber);

    // ✅ Update Stock
    const stockRes = await fetch(`${API}/update-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    const stockData = await stockRes.json();

    if (!stockData.success) {
      alert("Failed to update stock!");
      return;
    }

    alert("Stock updated successfully ✅");

    // ✅ Refresh Stock
    const refreshRes = await fetch(`${API}/stock`);
    const updatedStock = await refreshRes.json();

    setStock(updatedStock);
    
    // ✅ Print
    window.print();
    

    

  setTimeout(() => {
  setCustomerName("");
  setCart([]);
}, 3000);

  } catch (err) {
    console.error("ERROR:", err);
    alert("Something went wrong!");
  }
};
  
  //save darft
  const saveDraft = async () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  if (!customerName.trim()) {
    alert("Enter customer name");
    return;
  }

  try {
    const res = await fetch(`${API}/save-draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerName,
        cart: Array.isArray(cart) ? cart : [],
        total: total,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Draft saved!");
      setCart([]);
      setCustomerName("");
      await getDrafts(); 

    } else {
      alert(data.message || "Failed to save draft");
    }
  } catch (error) {
    console.error("Save Draft Error:", error);
    alert("Server error");
  }
};

useEffect(() => {
    fetch(`${API}/drafts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDrafts(data.drafts);
      });
  }, []);

const deleteDraft = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this draft?"
  );

  if (!confirmDelete) {
    return; // User clicked Cancel
  }

  try {
    const res = await fetch(`${API}/drafts/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setDrafts((prevDrafts) =>
        prevDrafts.filter((d) => d.id !== id)
      );

      alert("✅ Draft deleted successfully!");
    } else {
      alert("❌ Failed to delete draft.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong!");
  }
};

 const loadDraft = (draft) => {
  let loadedCart = [];

  try {
    loadedCart = JSON.parse(draft.cart || "[]");
  } catch (err) {
    console.error("Cart parse error:", err);
    loadedCart = [];
  }

  setCustomerName(draft.customer_name);
  setCart(loadedCart);

  alert("Draft Loaded!");
};
  const filteredStock = stock.filter((item) =>
  (item.name || "").toLowerCase().includes(search.toLowerCase())
);



  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Stock Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Product List</h2>
        <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search stock..."
          className="border px-3 py-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>
        <div className="border rounded-lg shadow p-4 max-h-[500px] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-400 text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-3 py-2">Name</th>
                <th className="border border-gray-400 px-3 py-2">Price</th>
                <th className="border border-gray-400 px-3 py-2">Qty</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-100 cursor-pointer"
                  onClick={() => addToCart(item)}
                >
                  <td className="border border-gray-400 px-3 py-2">{item.name}</td>
                  <td className="border border-gray-400 px-3 py-2">{item.price}</td>
                  <td className="border border-gray-400 px-3 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Table */}
      <div ref={printRef}>
        
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        

        <div className="flex justify my-1">
          <h3 className="font-bold text-xl">Custome Name : </h3>
          <input type="text"
            className="border px-2 py-1 ml-2 rounded"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}  />
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
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total + Print */}
        <div className="mt-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Total: Rs. {total.toFixed(2)}
          </h3>
          
            <div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={async () => {
              await handlePrint();
              
            }}
          >
            🖨️ Print Receipt
          </button>
          </div>
          
        </div>
        <button
            onClick={async () =>{
              await saveDraft();
            }}

            className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save Draft
        </button>
        {/* DRAFT LIST */}
        {drafts.map((d) => (
          <div key={d.id} className="border p-3 my-2 rounded">
            <p><b>Customer:</b> {d.customer_name}</p>
            <p><b>Total:</b> Rs. {d.total}</p>

            <button
              onClick={async () => {
                await loadDraft(d);
                await deleteDraft(d.id);
              }

              }
              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
            >
              Load
            </button>

            <button
              onClick={() => deleteDraft(d.id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
     <div
  id="receiptArea"
  className="receipt hidden"
>
  <h2 className="text-2xl font-bold mb-4 text-center">Oil Mart</h2>
  <p><strong>Customer:</strong> {customerName || "N/A"}</p>
  <p>Bill No: {String(billNumber).padStart(4, "0")}</p>
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
  

  
</div>



    </div>
  );
}

export default BillingPage;
