import supabase from "../Utils/supabaseclient.js";
import axios from "axios";
import dotenv from "dotenv";
import { fetchAISuggestedPrices } from "../Utils/GeminiAi.js";

dotenv.config();

const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/USD";

// Enhanced AI Pricing Calculation Function
const calculateAIOptimizedPrice = (prices, productName) => {
    // Filter out invalid prices
    const validPrices = prices.filter(price => price !== null && !isNaN(price));
    
    if (validPrices.length === 0) return null;

    // Calculate statistics
    const maxPrice = Math.max(...validPrices);
    const minPrice = Math.min(...validPrices);
    const avgPrice = validPrices.reduce((acc, price) => acc + price, 0) / validPrices.length;

    // Use a hash of the product name to create a unique modifier
    const nameHash = productName.split('').reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    const uniqueModifier = Math.abs(nameHash % 10) / 100 + 0.9; // Ranges between 0.90 and 0.99

    // Advanced pricing strategy
    let optimizedPrice;
    if (validPrices.length > 1) {
        // Price differentiation based on market dynamics
        const priceSpread = maxPrice - minPrice;
        const competitivenessScore = priceSpread / avgPrice;

        // Different strategies based on market competition
        if (competitivenessScore > 0.3) {
            // High competition: More aggressive pricing
            optimizedPrice = avgPrice * (0.92 * uniqueModifier);
        } else if (competitivenessScore > 0.15) {
            // Moderate competition: Balanced approach
            optimizedPrice = avgPrice * (0.95 * uniqueModifier);
        } else {
            // Low competition: Premium pricing
            optimizedPrice = avgPrice * (0.98 * uniqueModifier);
        }

        // Profitability safeguard
        const minimumProfitMargin = 1.2; // Ensure at least 20% profit
        optimizedPrice = Math.max(optimizedPrice, minPrice * minimumProfitMargin);
    } else {
        // Single price scenario
        optimizedPrice = avgPrice * (0.95 * uniqueModifier);
    }

    // Additional price intelligence metrics
    const priceIntelligence = {
        maxCompetitorPrice: maxPrice,
        minCompetitorPrice: minPrice,
        averageCompetitorPrice: avgPrice,
        competitivenessScore: (maxPrice - minPrice) / avgPrice,
        uniqueModifier: uniqueModifier,
        recommendedPriceStrategy: optimizedPrice
    };

    console.log(`Price Intelligence for ${productName}:`, priceIntelligence);

    return {
        price: `₹${optimizedPrice.toFixed(2)}`,
        intelligence: priceIntelligence
    };
};

export const fetchProducts = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        // Fetch user category
        const { data: userData, error: userError } = await supabase
            .from("User")
            .select("businessCategory")
            .eq("id", userId)
            .single();

        if (userError || !userData) return res.status(404).json({ error: "User not found" });

		const businessCategory = userData.businessCategory;
		console.log(`Fetching products for category: ${businessCategory}`);

		// Fetch products from SerpAPI
		const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
			businessCategory
		)}&api_key=${process.env.SERP_API_KEY}`;
		const response = await axios.get(apiUrl);

		if (!response.data || !response.data.shopping_results) {
			return res.status(404).json({ error: "No products found" });
		}

		// Fetch exchange rate for USD to INR
		const exchangeRateRes = await axios.get(EXCHANGE_RATE_API);
		const usdToInr = exchangeRateRes.data.rates.INR;

		// Extract and convert product details
		const products = response.data.shopping_results.map((product) => {
			let priceInRs = "Price not available";
			let priceNum = null;

			if (product.price) {
				const priceInUsd = parseFloat(product.price.replace(/[^0-9.]/g, ""));
				if (!isNaN(priceInUsd)) {
					priceNum = priceInUsd * usdToInr;
					priceInRs = `₹${priceNum.toFixed(2)}`;
				}
			}

			return {
				name: product.title,
				competitorPrice: priceNum, // ✅ Corrected to store as a number
				aiSuggestedPrice: null, // Optional placeholder
				imageUrl: product.thumbnail || null,
				category: businessCategory,
				link: product.link,
				source: product.source,
				stock: product.stock || "Unknown",
			};
		});
		const aiPrices = await fetchAISuggestedPrices(products);

		products.forEach((product, index) => {
			product.aiSuggestedPrice = aiPrices[index] || null;
		});

		// ✅ FIXED: Pass userId
		await storeProductsInSupabase(products, userId);

		res.json({ category: businessCategory, products });
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ error: "Failed to fetch product data" });
	}
};

// Function to store/update products in Supabase


const upsertProduct = async (product, userId) => {
	try {
		// Check if the product already exists
		const { data: existingProduct, error } = await supabase
			.from("Product")
			.select("id, competitorPrice, aiSuggestedPrice")
			.eq("name", product.name)
			.eq("category", product.category)
			.eq("userId", userId)
			.single();

		if (error && error.code !== "PGRST116") {
			console.error("Error checking existing product:", error);
			return;
		}

		if (existingProduct) {
			// ✅ Update aiSuggestedPrice if it has changed
			if (
				existingProduct.competitorPrice !== product.competitorPrice ||
				existingProduct.aiSuggestedPrice !== product.aiSuggestedPrice
			) {
				const { error: updateError } = await supabase
					.from("Product")
					.update({
						competitorPrice: product.competitorPrice,
						aiSuggestedPrice: product.aiSuggestedPrice, // ✅ Ensure AI price is updated
						imageUrl: product.imageUrl, // Optional update
					})
					.eq("id", existingProduct.id);

				if (updateError) {
					console.error("Error updating product:", updateError);
					return;
				}
			}
		} else {
			// ✅ Insert new product with aiSuggestedPrice
			const { error: insertError } = await supabase.from("Product").insert([
				{
					name: product.name,
					category: product.category,
					competitorPrice: product.competitorPrice,
					aiSuggestedPrice: product.aiSuggestedPrice || null, // ✅ Store AI price
					imageUrl: product.imageUrl || null,
					userId: userId, // Required field
				},
			]);

			if (insertError) {
				console.error("Error inserting product:", insertError);
				return;
			}
		}
	} catch (err) {
		console.error("Unexpected error in upsertProduct:", err);
	}
};



// ✅ FIXED: Function now properly takes userId
const storeProductsInSupabase = async (products, userId) => {
	for (const product of products) {
		await upsertProduct(product, userId);
	}
};
