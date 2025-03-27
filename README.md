# AI-Dynamic-Pricing-System
Team Name: rm -rf*

Team Members
Prathamesh Naik(Team Leader): Phone No: 8007911907
                              email: naikprathamesh782@gmail.com
                              contribution: Frontend and Backend Development
                              
Sampreet Kalkundrikar       : Phone No: 9356354218
                              email: sampreetkalkundrikar8@gmail.com
                              contribution: Backend Development
                              
Gangavarapu Kaarthikeya     : Phone no: 9371100450
                              email: gkaarthikeya2006@gmail.com
                              contribution: Frontend Development

Folder Structure:
📂 AI-Dynamic-Pricing-System  
 ├── 📂 Backend  
 │   ├── controllers/  
 │   ├── routes/
 │   ├── middleware/
 │   ├── utils/  
 │   ├── prisma/  
 │   │   ├── schema.prisma    # Prisma schema  
 │   ├── app.js            # Express server setup  
 │   ├── package.json  
 │   ├── package-lock.json
 ├── .env (Environment variables)  
 ├── .gitignore
 │  
 ├── 📂 Frontend  
 │   ├── components/  
 │   ├── pages/  
 │   ├── styles/  
 │   ├── hooks/  
 │   ├── next.config.js  
 │   ├── package.json  
 ├── .env (Environment variables)  
 ├── .gitignore
 |
 ├── 📂 Documentation  
 │   ├── README.md  

Approach to Solve the Problem:
In the B2B market, businesses struggle to price their products competitively due to fluctuating market trends and competitor pricing. Our AI-powered pricing system solves this by:
Fetching competitor prices via SerpAPI (Google Shopping Scraper).
Using AI & Market Analysis to suggest optimized pricing based on competitor data, demand trends, and currency exchange rates.
Providing dynamic pricing recommendations that help businesses maximize profits.


Tech Stack:
Backend: Node.js, Express.js, Prisma, Supabase
Frontend: React.js with Next.js
Database: Supabase (PostgreSQL)

APIs Used:
SerpAPI – Fetching competitor prices from Google Shopping
Exchange Rate API – Converting prices based on currency exchange rates
gemini AI – Providing price suggestions to maximize profit


Build and run commands for your project:
cd Backend
npm install
npm start  # Runs the Express server on port 8000

cd Frontend
npm install
npm run dev  # Runs Next.js on localhost:3000

cd Backend
npx prisma migrate dev  # Migrate database schema





  
