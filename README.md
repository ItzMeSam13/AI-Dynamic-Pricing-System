# AI-Dynamic-Pricing-System
Team Name: rm -rf*

Team Members
Prathamesh Naik(Team Leader): email: naikprathamesh782@gmail.com
                              contribution: Frontend and Backend Development
                              
Sampreet Kalkundrikar       : email: sampreetkalkundrikar8@gmail.com
                              contribution: Backend Development
                              
Gangavarapu Kaarthikeya     : email: gkaarthikeya2006@gmail.com
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
<br>
Fetching competitor prices via SerpAPI (Google Shopping Scraper).
Using AI & Market Analysis to suggest optimized pricing based on competitor data, demand trends, and currency exchange rates.
<br>
Providing dynamic pricing recommendations that help businesses maximize profits.


Tech Stack:
Backend: Node.js, Express.js, Prisma, Supabase
<br>
Frontend: React.js with Next.js
<br>
Database: Supabase (PostgreSQL)

APIs Used:
SerpAPI – Fetching competitor prices from Google Shopping
<br>
Exchange Rate API – Converting prices based on currency exchange rates
<br>
gemini AI – Providing price suggestions to maximize profit


Build and run commands for your project:
cd Backend
<br>
npm install
<br>
npm start  # Runs the Express server on port 8000

cd Frontend
<br>
npm install
<br>
npm run dev  # Runs Next.js on localhost:3000

cd Backend
<br>
npx prisma migrate dev  # Migrate database schema





  
