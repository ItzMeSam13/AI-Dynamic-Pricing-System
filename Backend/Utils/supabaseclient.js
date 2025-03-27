import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error(" Supabase credentials are missing. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);



export default supabase;

