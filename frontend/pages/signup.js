import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessCategory: "",
    businessSubCategory: "",
  });

  const [errors, setErrors] = useState({});

  const categories = {
    "alexa-skills": ["Smart Home", "Games", "Productivity"],
    "devices": ["Smartphones", "Laptops", "Tablets"],
    "fashion": ["Men", "Women", "Kids"],
    "pharmacy": ["Medicines", "Health Supplements", "Personal Care"],
    "appliances": ["Kitchen", "Home", "Electronics"],
    "apps-and-games": ["Mobile Apps", "PC Games", "Console Games"],
    "audiobooks": ["Fiction", "Non-fiction", "Self-help"],
    "books": ["Novels", "Educational", "Comics"],
    "clothing-and-accessories": ["Casual", "Formal", "Sportswear"],
    "electronics": ["Cameras", "Audio", "Wearables"],
    "cars-and-motorbikes": ["Cars", "Bikes", "Accessories"],
    "deals": ["Daily Deals", "Coupons", "Flash Sales"],
    "furniture-and-outdoor": ["Indoor", "Outdoor", "Office"],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!formData.businessName) newErrors.businessName = "Business Name is required";
    if (!formData.businessCategory) newErrors.businessCategory = "Select a business category";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", formData);
      alert("Sign-Up Successful!");
      setFormData({ name: "", email: "", password: "", businessName: "", businessCategory: "", businessSubCategory: "" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} 
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} 
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} 
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Business Name</label>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} 
                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Business Category</label>
            <select name="businessCategory" value={formData.businessCategory} onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>{category.replace(/-/g, ' ')}</option>
              ))}
            </select>
            {errors.businessCategory && <p className="text-red-500 text-sm">{errors.businessCategory}</p>}
          </div>

          {formData.businessCategory && categories[formData.businessCategory] && (
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">Business Sub-Category (Optional)</label>
              <select name="businessSubCategory" value={formData.businessSubCategory} onChange={handleChange} 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                {categories[formData.businessCategory].map((subCategory) => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>

          <p className="text-center text-gray-600 mt-4">Already have an account? <a href="#" className="text-blue-600 hover:underline">Login</a></p>
        </form>
      </div>
    </div>
  );
 }