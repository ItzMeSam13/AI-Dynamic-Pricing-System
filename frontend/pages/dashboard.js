import React, { useEffect, useState } from "react";
import { FaHome, FaBox, FaChartBar, FaSignOutAlt, FaUserCircle, FaEdit } from "react-icons/fa";

const Sidebar = () => (
  <div className="w-64 bg-gray-900 text-white h-screen p-10  flex flex-col justify-between">
    <div>
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <ul className="space-y-4">
        <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <FaUserCircle />
          <span>Profile</span>
        </li>
        <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <FaHome />
          <span>Home</span>
        </li>
        <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <FaBox />
          <span>Products</span>
        </li>
        <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <FaChartBar />
          <span>Reports</span>
        </li>
      </ul>
    </div>
    <li className="flex items-center space-x-2 hover:bg-red-600 p-2 rounded cursor-pointer mt-auto">
      <FaSignOutAlt />
      <span>Logout</span>
    </li>
  </div>
);

const Navbar = () => (
  <div className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold">Product Pricing Dashboard</h1>
  </div>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products"); 
        const data = await response.json();
        setProducts(data.slice(0, 6)); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex h-screen w-screen" style={{ background: "linear-gradient(135deg, #1e3a8a, #9333ea)" }}>
      <Sidebar />
      <div className="flex-1 min-h-screen text-white flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔥 Latest AI-Powered Price Insights
          </h2>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white text-black p-4 shadow-lg rounded-lg">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="h-full object-contain" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{product.title}</h3>
                  <p className="text-sm text-gray-600">
                    Competitor Price: <span className="font-bold">${(product.price + 10).toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    AI Generated Price: <span className="font-bold">${(product.price).toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Source: FakeStoreAPI</p>
                </div>
              ))
            ) : (
              <p className="text-center">Loading products...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
