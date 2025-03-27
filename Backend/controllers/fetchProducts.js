import supabase from "../Utils/supabaseclient.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/USD";

export const fetchProducts = async (req, res) => {
    try {
        const { userId } = req.body;
        

        if (!userId) {
            return res.status(run400).json({ error: "User ID is required" });
        }

        // Fetch business category from Supabase
        const { data: userData, error: userError } = await supabase
            .from("User")
            .select("businessCategory")
            .eq("id", userId)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ error: "User not found or business category missing" });
        }

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
            .select("id, competitorPrice")
            .eq("name", product.name)
            .eq("category", product.category)
            .eq("userId", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Error checking existing product:", error);
            return;
        }

        if (existingProduct) {
            // Update only if competitorPrice has changed
            if (existingProduct.competitorPrice !== product.competitorPrice) {
                const { error: updateError } = await supabase
                    .from("Product")
                    .update({
                        competitorPrice: product.competitorPrice,
                        imageUrl: product.imageUrl, // Optional update
                    })
                    .eq("id", existingProduct.id);

                if (updateError) {
                    console.error("Error updating product:", updateError);
                    return;
                }
            }
        } else {
            // Insert new product
            const { error: insertError } = await supabase.from("Product").insert([
                {
                    name: product.name,
                    category: product.category,
                    competitorPrice: product.competitorPrice,
                    aiSuggestedPrice: product.aiSuggestedPrice || null,
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