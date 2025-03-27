import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import supabase from "../Utils/supabaseclient.js";

const prisma = new PrismaClient();

export const Register = async (req, res) => {
	const { name, email, password, businessCategory } = req.body;
	if (!name || !email || !password || !businessCategory) {
		return res.status(400).json({ error: "Please fill all fields" });
	}
	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: "Invalid email" });
	}
	if (password.length < 6) {
		return res
			.status(400)
			.json({ error: "Password must be at least 6 characters" });
	}

	try {
		const { data, error } = await supabase.auth.signUp({
			name,
			email,
			password,
		});

		if (error) {
			return res.status(400).json({ error: error.message });
		}
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password,
				businessCategory,
				supabase_id: data.user.id,
			},
		});

		return res.status(201).json({ message: "User created successfully", user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const Login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return res.status(401).json({ error: "Invalid email or password" });
		}
		const user = await prisma.user.findUnique({
			where: { email },
		});

		const { data: userData, error: userError } = await supabase
		.from("User")
		.select("businessCategory")
		.eq("email", email)
		.single();

		if (!user) {
			return res.status(404).json({ error: "User not found in database" });
		}

		return res
			.status(200)
			.json({ message: "Login successful", user, session: data.session });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const Logout = async (req, res) => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return res.status(400).json({ error: "Logout failed" });
		}
		return res.status(200).json({ message: "Logout successful" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};
