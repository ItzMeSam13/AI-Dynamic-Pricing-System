import React, { useEffect, useState } from "react";
import { FaHome, FaBox, FaChartBar, FaSignOutAlt, FaUserCircle, FaEdit } from "react-icons/fa";

const Sidebar = () => (
  <div className="w-72 bg-gray-900 text-white h-screen p-6 flex flex-col justify-between">
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
  <div className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-md p-4 flex justify-between items-center w-full text-white">
    <h1 className="text-xl font-bold">Product Pricing Dashboard</h1>
  </div>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await fetch("https://fakestoreapi.com/products");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 p-8 flex flex-col justify-center overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            🔥 Latest AI-Powered Price Insights
          </h2>
          {loading ? (
            <p className="text-center text-white">Loading products...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 w-full px-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white text-black p-5 shadow-lg rounded-lg flex flex-col items-center">
                  <div className="h-20 w-full bg-gray-200 flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="h-full object-contain" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4 text-center">{product.title}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Competitor Price: <span className="font-bold">${(product.price + 10).toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    AI Generated Price: <span className="font-bold">${product.price.toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-center">Source: FakeStoreAPI</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
