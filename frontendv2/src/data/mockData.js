// Mock data for the Agrovardhan application

export const features = [
  {
    id: 1,
    title: "Integrate Land",
    description: "Pool your farmland with neighbors to create larger, more efficient agricultural units through blockchain-verified smart contracts.",
    icon: "MapPin"
  },
  {
    id: 2,
    title: "Crop & Price Prediction",
    description: "AI-powered insights help you choose the right crops and predict market prices for maximum profitability.",
    icon: "TrendingUp"
  },
  {
    id: 3,
    title: "Government Schemes",
    description: "Access and apply for relevant government agricultural schemes and subsidies tailored to your farm profile.",
    icon: "FileText"
  },
  {
    id: 4,
    title: "Weather Forecasting",
    description: "Get accurate, location-specific weather predictions to plan your farming activities effectively.",
    icon: "Cloud"
  }
]

export const statistics = [
  {
    id: 1,
    title: "Farmers Onboarded",
    value: "12,450+",
    subtitle: "Active farmers",
    trend: "up",
    trendValue: "+15%",
    icon: "Users"
  },
  {
    id: 2,
    title: "Land Integrated",
    value: "8,750",
    subtitle: "Acres pooled",
    trend: "up",
    trendValue: "+23%",
    icon: "MapPin"
  },
  {
    id: 3,
    title: "Schemes Applied",
    value: "3,200+",
    subtitle: "Government schemes",
    trend: "up",
    trendValue: "+8%",
    icon: "FileCheck"
  },
  {
    id: 4,
    title: "Revenue Generated",
    value: "₹2.4Cr",
    subtitle: "Total farmer income",
    trend: "up",
    trendValue: "+31%",
    icon: "IndianRupee"
  }
]

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Farmer, Punjab",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "Agrovardhan helped me pool my 5-acre farm with my neighbors. Our combined 50-acre unit now attracts better buyers and higher prices."
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Agricultural Seller, Maharashtra",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    quote: "The platform connects me directly with farmer groups. I can source quality produce at fair prices while supporting local agriculture."
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    role: "Agricultural Officer, Gujarat",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "As an admin, I can efficiently verify land documents and monitor agricultural activities. The blockchain ensures complete transparency."
  }
]

export const cropPredictions = [
  {
    id: 1,
    crop: "Rice",
    suitability: 92,
    expectedYield: "4.2 tons/acre",
    season: "Kharif",
    icon: "Wheat"
  },
  {
    id: 2,
    crop: "Wheat",
    suitability: 88,
    expectedYield: "3.8 tons/acre",
    season: "Rabi",
    icon: "Wheat"
  },
  {
    id: 3,
    crop: "Cotton",
    suitability: 85,
    expectedYield: "2.1 tons/acre",
    season: "Kharif",
    icon: "Flower"
  },
  {
    id: 4,
    crop: "Sugarcane",
    suitability: 78,
    expectedYield: "45 tons/acre",
    season: "Annual",
    icon: "TreePine"
  }
]

export const pricePredictions = [
  {
    id: 1,
    crop: "Rice",
    currentPrice: 2850,
    predictedPrice: 3100,
    change: 8.8,
    trend: "up",
    unit: "per quintal"
  },
  {
    id: 2,
    crop: "Wheat",
    currentPrice: 2200,
    predictedPrice: 2350,
    change: 6.8,
    trend: "up",
    unit: "per quintal"
  },
  {
    id: 3,
    crop: "Cotton",
    currentPrice: 6800,
    predictedPrice: 6500,
    change: -4.4,
    trend: "down",
    unit: "per quintal"
  },
  {
    id: 4,
    crop: "Sugarcane",
    currentPrice: 350,
    predictedPrice: 380,
    change: 8.6,
    trend: "up",
    unit: "per quintal"
  }
]

export const governmentSchemes = [
  {
    id: 1,
    title: "PM-KISAN Scheme",
    description: "Direct income support of ₹6,000 per year to small and marginal farmers",
    eligibility: "Farmers with up to 2 hectares of land",
    amount: "₹6,000/year",
    status: "Active",
    link: "https://pmkisan.gov.in"
  },
  {
    id: 2,
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers in case of crop loss",
    eligibility: "All farmers growing notified crops",
    amount: "Up to ₹2 lakh coverage",
    status: "Active",
    link: "https://pmfby.gov.in"
  },
  {
    id: 3,
    title: "Soil Health Card Scheme",
    description: "Free soil testing and nutrient recommendations for optimal crop production",
    eligibility: "All farmers",
    amount: "Free service",
    status: "Active",
    link: "https://soilhealth.dac.gov.in"
  }
]

export const weatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    rainfall: 0
  },
  forecast: [
    { day: "Today", high: 32, low: 24, condition: "Sunny", rainfall: 0 },
    { day: "Tomorrow", high: 30, low: 22, condition: "Cloudy", rainfall: 5 },
    { day: "Wed", high: 28, low: 20, condition: "Rainy", rainfall: 15 },
    { day: "Thu", high: 29, low: 21, condition: "Partly Cloudy", rainfall: 2 },
    { day: "Fri", high: 31, low: 23, condition: "Sunny", rainfall: 0 },
    { day: "Sat", high: 33, low: 25, condition: "Hot", rainfall: 0 },
    { day: "Sun", high: 30, low: 22, condition: "Cloudy", rainfall: 8 }
  ]
}

export const farmerProfile = {
  id: 1,
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@email.com",
  location: "Village Rampur, Punjab",
  totalLand: "5.2 acres",
  registeredLands: 2,
  cropsGrown: ["Rice", "Wheat", "Cotton"],
  joinedDate: "2023-06-15",
  verificationStatus: "Verified"
}

export const sellerAnalytics = {
  todayRevenue: 45000,
  weekRevenue: 280000,
  monthRevenue: 1200000,
  totalOrders: 156,
  pendingOrders: 12,
  completedOrders: 144,
  averageRating: 4.7,
  totalProducts: 28
}
