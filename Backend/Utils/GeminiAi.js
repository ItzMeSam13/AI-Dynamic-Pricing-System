import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const fetchAISuggestedPrices = async (products) => {
	try {
		console.log("Sending request to Gemini with products:", products);

		// Build a single structured message
		const promptText = products
			.map((product, index) => {
				return `Product ${index + 1}:
					Name: ${product.name}
					Competitor Price: ${product.competitorPrice || "Unknown"}
					Category: ${product.category}
					Stock Status: ${product.stock}`;
			})
			.join("\n\n");

		// Corrected Gemini API request
		const response = await axios.post(
			`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
			{
				contents: [
					{
						role: "user",
						parts: [
							{
								text: `Suggest ideal selling prices in INR for the following products. 
									Provide only numeric values separated by commas:
									\n\n${promptText}`,
							},
						],
					},
				],
			},
			{ headers: { "Content-Type": "application/json" } }
		);

		// Extract AI-generated prices with improved parsing
		const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || response.data?.candidates?.[0]?.content?.text;

		if (!rawText) {
			throw new Error("Invalid response from Gemini API");
		}

		// Extract numbers (assuming they are comma-separated)
		const aiPrices = rawText
			.split(",")
			.map((price) => parseFloat(price.trim()))
			.filter((price) => !isNaN(price));

		// Ensure the AI returns the correct number of prices
		while (aiPrices.length < products.length) {
			aiPrices.push(null);
		}

		return aiPrices;
	} catch (error) {
		console.error("Error fetching AI prices:", error.response?.data || error.message);
		return products.map(() => null);
	}
};
