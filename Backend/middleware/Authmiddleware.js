import supabase from "../Utils/supabaseclient.js";

export const protectRoute = async (req, res, next) => {
	try {

		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "Unauthorized. No token provided." });
		}

		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data?.user) {
			return res.status(403).json({ error: "Invalid or expired token." });
		}

		req.user = data.user;
		next();
	} catch (err) {
		console.error("Error in protectRoute middleware:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
};
