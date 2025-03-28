import supabase from "../Utils/supabaseclient.js";
import axios from "axios";
import dotenv from "dotenv";

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

        // Fetch from SerpAPI
        const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
            businessCategory
        )}&api_key=${process.env.SERP_API_KEY}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.shopping_results) {
            return res.status(404).json({ error: "No products found" });
        }

        // Fetch exchange rate
        const exchangeRateRes = await axios.get(EXCHANGE_RATE_API);
        const usdToInr = exchangeRateRes.data.rates.INR;

        const productPriceMap = new Map();

        const products = response.data.shopping_results.map((product) => {
            let priceInRs = "Price not available";
            let priceNum = null;

            console.log(`Raw Price Data for ${product.title}:`, product.price);

            if (product.price) {
                const priceMatch = product.price.match(/[\d,.]+/);
                if (priceMatch) {
                    const priceInUsd = parseFloat(priceMatch[0].replace(/,/g, ""));
                    if (!isNaN(priceInUsd)) {
                        priceNum = parseFloat((priceInUsd * usdToInr).toFixed(2));
                        priceInRs = `₹${priceNum.toFixed(2)}`;
                    }
                }
            }

            console.log(`Extracted price for ${product.title}:`, priceNum);

            const productName = product.title || 'Unknown Product';
            if (productName) {
                if (!productPriceMap.has(productName)) {
                    productPriceMap.set(productName, []);
                }
                productPriceMap.get(productName).push(priceNum);
            }

            return {
                name: productName,
                competitorPrice: priceNum,
                aiSuggestedPrice: null,
                imageUrl: product.thumbnail || null,
                category: businessCategory,
                link: product.link,
                source: product.source,
                stock: product.stock || "Unknown",
            };
        });

        products.forEach((product) => {
            const prices = productPriceMap.get(product.name) || [];
            console.log(`Product: ${product.name}, Stored Competitor Prices:`, prices);

            const validPrices = prices.filter(price => price !== null && !isNaN(price));
            console.log(`Valid Prices for ${product.name}:`, validPrices);

            const aiPricing = calculateAIOptimizedPrice(prices, product.name);
            
            if (aiPricing) {
                product.aiSuggestedPrice = aiPricing.price;
                product.priceIntelligence = aiPricing.intelligence;
            } else {
                product.aiSuggestedPrice = "Price not available";
            }

            console.log(`AI Suggested Price for ${product.name}:`, product.aiSuggestedPrice);
        });

        await storeProductsInSupabase(products, userId);
        res.json({ category: businessCategory, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch product data" });
    }
};

// Store products in Supabase
const storeProductsInSupabase = async (products, userId) => {
    for (const product of products) {
        await upsertProduct(product, userId);
    }
};

const upsertProduct = async (product, userId) => {
    try {
        console.log(`Saving to Supabase: ${product.name}, AI Price: ${product.aiSuggestedPrice}`);

        const { data: existingProduct, error } = await supabase
            .from("Product")
            .select("id, competitorPrice, aiSuggestedPrice")
            .eq("name", product.name)
            .eq("category", product.category)
            .eq("userId", userId)
            .single();

        if (error && error.code !== "PGRST116") return console.error("Error checking product:", error);

        if (existingProduct) {
            await supabase
                .from("Product")
                .update({ 
                    competitorPrice: product.competitorPrice, 
                    aiSuggestedPrice: product.aiSuggestedPrice,
                    priceIntelligence: product.priceIntelligence 
                })
                .eq("id", existingProduct.id);
        } else {
            await supabase.from("Product").insert([{ 
                ...product, 
                userId 
            }]);
        }
    } catch (err) {
        console.error("Error in upsertProduct:", err);
    }
};

export default { fetchProducts };