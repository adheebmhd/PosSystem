import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  
  { name: "Stock", path: "/stock" },
  { name: "Bills", path: "/bills" },
  { name: "Payment", path: "/payment" },
  { name: "Reports", path: "/report" },
];


const Header = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="w-full p-6 bg-white border-b border-gray-300">
      <h1 className="text-2xl font-semibold flex justify-center">SF MARKETTING</h1>
      <p className="text-gray-500 text-sm mb-4 flex justify-center">Best OIl Best Choice</p>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setActiveCategory(cat.name);
              navigate(cat.path);
            }}
            className={`px-4 py-2 rounded-full border transition-all ${
              activeCategory === cat.name
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;
