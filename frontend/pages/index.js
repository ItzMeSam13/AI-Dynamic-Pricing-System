import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  BarChart2, 
  Target 
} from 'lucide-react';
import { useRouter } from "next/navigation";


const AIPricingLandingPage = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const heroRef = useRef(null);
  const [prices, setPrices] = useState({
    iPhone: 999,
    MacBook: 1999,
  });
  const [demand, setDemand] = useState({
    iPhone: 50,
    MacBook: 70,
  });
  const router = useRouter();

  // Dynamic Pricing Visualization Component
  const DynamicPricingVisualization = () => {
    const [products, setProducts] = useState([
      { 
        name: "iPhone 15", 
        basePrice: 999, 
        aiPrice: 1049, 
        demand: 0.87, 
        competitorPrice: 1020 
      },
      { 
        name: "MacBook Pro", 
        basePrice: 1999, 
        aiPrice: 1950, 
        demand: 0.65, 
        competitorPrice: 1980 
      }
    ]);

    useEffect(() => {
      const interval = setInterval(() => {
        setProducts(prev => prev.map(product => ({
          ...product,
          aiPrice: product.aiPrice + (Math.random() * 10 - 5),
          demand: Math.min(1, Math.max(0, product.demand + (Math.random() * 0.1 - 0.05)))
        })));
      }, 1500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            height="100%" 
            viewBox="0 0 1440 620" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,320 Q360,200 720,260 Q1080,320 1440,200 L1440,620 L0,620 Z" 
              fill="url(#aiGradient)"
            />
            <path 
              d="M0,380 Q360,260 720,320 Q1080,380 1440,260 L1440,620 L0,620 Z" 
              fill="url(#aiGradient)" 
              opacity="0.5"
            />
          </svg>
        </div>
        
        <div className="relative z-10 p-8">
          <div className="grid grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.name} 
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300"
                style={{
                  transform: `scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.05})`,
                  opacity: 0.9
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="text-green-400 font-semibold">
                    AI Optimized
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-300">Base Price</p>
                    <p className="text-white font-bold">${product.basePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">AI Price</p>
                    <p className="text-green-400 font-bold">
                      ${product.aiPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Demand</p>
                    <p className="text-blue-400 font-bold">
                      {(product.demand * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 relative h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full"
                    style={{ 
                      width: `${product.demand * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHeroSection = () => (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 text-white flex items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 600" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,100 Q300,300 600,200 Q900,100 1200,300" 
              fill="none" 
              stroke="url(#aiGradient)" 
              strokeWidth="4" 
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Revolutionizing Pricing: AI That Adapts in Real-Time
            </h1>
            <p className="text-xl mb-10 max-w-2xl text-gray-200">
              Intelligent pricing algorithms that optimize revenue, predict demand, and outmaneuver competitors with unprecedented precision.
            </p>

            <div className="flex space-x-4">
              <button className="
                px-8 py-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                rounded-full 
                text-white 
                font-bold 
                hover:scale-105 
                transition-transform
                shadow-2xl
              ">
                Get Started
              </button>
              <button className="
                px-8 py-4 
                border-2 border-white/30 
                rounded-full 
                text-white 
                font-bold 
                hover:bg-white/10 
                transition-colors
                shadow-xl
              ">
                Learn More
              </button>
            </div>
          </div>

          <div>
            <DynamicPricingVisualization />
          </div>
        </div>
      </div>
    </section>
  );

  // How It Works Section
  const HowItWorksSection = () => (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How Our AI Pricing Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <TrendingUp className="w-12 h-12 text-blue-500" />,
              title: "Market Analysis",
              description: "Continuously monitor market trends, competitor pricing, and demand fluctuations in real-time."
            },
            {
              icon: <Zap className="w-12 h-12 text-yellow-500" />,
              title: "Intelligent Optimization",
              description: "Apply advanced machine learning algorithms to predict and suggest optimal pricing strategies."
            },
            {
              icon: <Target className="w-12 h-12 text-green-500" />,
              title: "Dynamic Pricing",
              description: "Automatically adjust prices based on real-time market conditions and demand signals."
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Features Demo Section
  const FeaturesDemoSection = () => (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features Demo</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl p-8">
            <BarChart2 className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Real-Time Price Optimization</h3>
            <p className="text-gray-600 mb-6">
              Watch our AI dynamically adjust prices based on market demand, competitor pricing, and other critical factors.
            </p>
            <DynamicPricingVisualization />
          </div>
<div className="bg-gray-100 rounded-xl p-8">
  <Shield className="w-12 h-12 text-green-500 mb-4" />
  <h3 className="text-2xl font-bold mb-4 text-gray-800">Why Choose AI-Powered Pricing?</h3>
  <div className="grid grid-cols-2 gap-6">
    {[
      { label: "Real-Time Adjustments", value: "Instant ⚡" },
      { label: "Smart Discounts", value: "Automated 🤖" },
      { label: "Competitive Edge", value: "Always Ahead 🚀" },
      { label: "No Manual Work", value: "Effortless 🎯" },
      { label: "Dynamic Adaptation", value: "AI-Powered 🔄" },
      { label: "Customer Behavior", value: "Understood 🔍" }
    ].map((stat, index) => (
      <div 
        key={index} 
        className="bg-white rounded-lg p-5 text-center shadow-md transition-transform transform hover:scale-110 hover:shadow-lg"
      >
        <p className="text-2xl font-bold text-blue-600 animate-pulse">{stat.value}</p>
        <p className="text-sm text-gray-500">{stat.label}</p>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </section>

    
  );

  // Get Started Section
  const GetStartedSection = () => (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Start Optimizing Your Pricing Today</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join hundreds of businesses leveraging AI to transform their pricing strategy and maximize profitability.
        </p>
        <div className="flex justify-center space-x-4">
        <button
      className="
        px-10 py-4 
        bg-white 
        text-blue-600 
        rounded-full 
        font-bold 
        hover:bg-gray-100 
        transition-colors 
        shadow-2xl
      "
      onClick={() => router.push("/signup")}
    >
      Get started now
    </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {renderHeroSection()}
      <HowItWorksSection />
      <FeaturesDemoSection />
      <GetStartedSection />
    </div>
  );
};

export default AIPricingLandingPage;