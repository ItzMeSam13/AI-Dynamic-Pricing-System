/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { FaHome, FaBox, FaChartBar, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import axios from "axios";

// Sidebar Component
const Sidebar = () => (
  <div className="w-72 bg-gray-900 text-white h-screen p-6 flex flex-col justify-between shadow-lg">
    <div>
      <h1 className="text-xl font-bold mb-6 text-center tracking-wide">📊 Dashboard</h1>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200">
          <FaUserCircle className="text-xl" />
          <span>Profile</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200">
          <FaHome className="text-xl" />
          <span>Home</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200">
          <FaBox className="text-xl" />
          <span>Products</span>
        </li>
        <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200">
          <FaChartBar className="text-xl" />
          <span>Reports</span>
        </li>
      </ul>
    </div>
    <li className="flex items-center space-x-3 hover:bg-red-600 p-3 rounded-lg cursor-pointer transition duration-200 mt-auto">
      <FaSignOutAlt className="text-xl" />
      <span>Logout</span>
    </li>
  </div>
);

// Navbar Component
const Navbar = () => (
  <div className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-md p-4 flex justify-between items-center w-full text-white">
    <h1 className="text-xl font-bold">📈 AI-Powered Pricing Dashboard</h1>
  </div>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/dashboard/fetch-products`, {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Full API Response:", response.data);

        let fetchedProducts = response.data?.products || [];
        if (!Array.isArray(fetchedProducts)) {
          console.error("Unexpected response format:", fetchedProducts);
          fetchedProducts = [];
        }
        setProducts(fetchedProducts);
        
      } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to fetch products.");
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 p-6 flex flex-col overflow-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            🚀 AI-Powered Product Pricing
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full">
              {products.map((product, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <img 
                    src={product.imageUrl || "/placeholder.jpg"}  
                    alt={product.title || "No image"} 
                    className="h-48 w-full object-cover rounded-lg mb-3"
                  />
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                    <p className="text-gray-600">Competitor Price: <span className="text-gray-900 font-bold">{product.competitorPrice} Rs</span></p>
                    <p className="text-gray-600">AI Suggested Price: <span className="text-green-600 font-bold">{product.aiSuggestedPrice} Rs</span></p>
                    <p className="text-gray-500 text-sm">Source: {product.source}</p>
                  </div>
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
