import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const res = await axios.post("http://localhost:8000/auth/login", {
            email,
            password
        });

        console.log("Login Response:", res.data); // ✅ Debugging

        // Check if response contains session & user ID
        if (!res.data.session || !res.data.session.access_token) {
            throw new Error("Authentication token missing from response.");
        }

        const token = res.data.session.access_token;
        const userId = res.data.user.id; // ✅ Get userId correctly

        console.log("User ID:", userId);
        console.log("Token Stored Successfully:", token);

        // ✅ Store token & userId in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Redirect to dashboard
        router.push("/dashboard");
    } catch (err) {
        console.error("Login Error:", err.message);
        setError(err.response?.data?.error || "Login failed");
    }
};
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-700 via-purple-700 to-purple-900">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="mt-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;