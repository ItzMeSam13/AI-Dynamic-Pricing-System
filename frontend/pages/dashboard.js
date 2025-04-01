import React, { useEffect, useState } from "react";
import { FaHome, FaBox, FaChartBar, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AILoadingAnimation from '../components/AILoadingAnimation';

const Sidebar = ({ activeSection, setActiveSection }) => (
  <div className="w-72 bg-gray-900 text-white h-screen p-6 flex flex-col justify-between shadow-lg">
    <div>
      <h1 className="text-xl font-bold mb-6 text-center tracking-wide">📊 Dashboard</h1>
      <ul className="space-y-4">
        <li 
          className={`flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200 ${activeSection === 'profile' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          <FaUserCircle className="text-xl" />
          <span>Profile</span>
        </li>
        <li 
          className={`flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200 ${activeSection === 'home' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveSection('home')}
        >
          <FaHome className="text-xl" />
          <span>Home</span>
        </li>
        <li 
          className={`flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200 ${activeSection === 'products' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveSection('products')}
        >
          <FaBox className="text-xl" />
          <span>Products</span>
        </li>
        <li 
          className={`flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-200 ${activeSection === 'reports' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveSection('reports')}
        >
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

const Navbar = () => (
  <div className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-md p-4 flex justify-between items-center w-full text-white">
    <h1 className="text-xl font-bold">📈 AI-Powered Pricing Dashboard</h1>
  </div>
);

const ReportsSection = ({ products }) => {
  // Generate sample data for pricing trends
  const generatePricingTrends = () => {
    return products.map(product => {
      // Simulate price predictions for next 6 months
      return {
        name: product.name,
        month0: product.aiSuggestedPrice,
        month1: Math.round(product.aiSuggestedPrice * 1.05),
        month2: Math.round(product.aiSuggestedPrice * 1.1),
        month3: Math.round(product.aiSuggestedPrice * 1.15),
        month4: Math.round(product.aiSuggestedPrice * 1.2),
        month5: Math.round(product.aiSuggestedPrice * 1.25),
        month6: Math.round(product.aiSuggestedPrice * 1.3)
      };
    });
  };

  const pricingTrends = generatePricingTrends();

  return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        🚀 Pricing & Inventory Reports
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pricing Trend Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-extrabold mb-4 text-center text-gray-900 shadow-sm">
  Price Projection
</h3>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={pricingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Price (Rs)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} Rs`, 
                  name === 'name' ? 'Product' : `Month ${name.replace('month', '')}`
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="month0" stroke="#8884d8" name="Current Price" />
              <Line type="monotone" dataKey="month6" stroke="#82ca9d" name="6 Months Projection" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory and Pricing Table */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-h-[600px] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Inventory Pricing Analysis</h3>
          <table className="w-full text-left border border-gray-300">
            <thead className="sticky top-0 bg-gray-300">
              <tr className="text-gray-900 text-lg font-semibold">
                <th className="p-4 border">Product</th>
                <th className="p-4 border">Current Price</th>
                <th className="p-4 border">Stock Level</th>
                <th className="p-4 border">Price Trend</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 transition">
                  <td className="p-4 font-medium text-gray-800">{product.name}</td>
                  <td className="p-4 font-semibold text-gray-900">{product.aiSuggestedPrice} Rs</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all" 
                        style={{ width: `${product.stockLevel || 50}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 mt-1 block">
                      {product.stockLevel}% in stock
                    </span>
                  </td>
                  <td className="p-4 font-bold text-lg">
                    <span className={` 
                      ${product.stockLevel < 30 ? 'text-red-600' : 
                        product.stockLevel < 60 ? 'text-yellow-600' : 'text-green-600'}
                    `}>
                      {product.stockLevel < 30 ? '📈 Rising' : 
                       product.stockLevel < 60 ? '➡ Stable' : '📉 Declining'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-h-[400px] overflow-y-auto">
      <h3 className="text-xl font-extrabold mb-4 text-center text-gray-800 shadow-sm">
  Pricing Strategy Insights
</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
            <p className="text-gray-800 font-medium">Current Price: {product.aiSuggestedPrice} Rs</p>
            <p className="text-gray-800 font-medium">Competitor Price: {product.competitorPrice} Rs</p>
            <p className="text-sm text-gray-900 font-semibold">
              {product.stockLevel < 30 
                ? 'Recommended: Gradually increase price due to low stock' 
                : product.stockLevel > 80 
                  ? 'Recommended: Consider promotional pricing' 
                  : 'Recommended: Maintain current pricing strategy'}
            </p>
          </div>
          
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState('home');

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

        let fetchedProducts = response.data?.products || [];
        if (!Array.isArray(fetchedProducts)) {
          console.error("Unexpected response format:", fetchedProducts);
          fetchedProducts = [];
        }
        
        // Add mock stock levels if not present
        fetchedProducts = fetchedProducts.map(product => ({
          ...product,
          stockLevel: product.stockLevel || Math.floor(Math.random() * 100)
        }));

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

  // Render different sections based on activeSection state
  const renderSection = () => {
    if (loading) {
      return <AILoadingAnimation />;
    }

    switch(activeSection) {
      case 'reports':
        return <ReportsSection products={products} />;
      case 'home':
      default:
        return (
          <div className="flex-1 p-6 flex flex-col overflow-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
              🚀 AI-Powered Product Pricing
            </h2>
            {error ? (
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
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <Navbar />
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;