export const users = [
  {
    role: 'farmer',
    name: 'Ravi Kumar',
    phone: '+919876543210',
    email: 'ravi@example.com',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    role: 'supplier',
    name: 'AgriSupply Co.',
    phone: '+919812345678',
    email: 'contact@agrisupply.co',
    phoneVerified: true,
    emailVerified: true,
    metadata: { gstNumber: '29ABCDE1234F2Z5' },
  },
  {
    role: 'admin',
    name: 'Admin User',
    phone: '+919800000000',
    email: 'admin@farmchain.io',
    phoneVerified: true,
    emailVerified: true,
  },
]

export const lands = [
  {
    title: 'Main Plot - Survey 123/4A',
    location: {
      lat: 12.9716,
      lon: 77.5946,
      address: 'Village Rampur, Taluk Hoskote',
      district: 'Bangalore Rural',
      state: 'Karnataka',
      pincode: '560067',
    },
    areaSqM: 10117,
    boundaries: {
      north: 'Road',
      south: 'Canal',
      east: 'Neighboring Farm - Singh',
      west: 'Forest Buffer',
    },
    integrationStatus: 'pending',
    documents: [
      {
        type: 'RTC',
        ipfsHash: null,
        gridFsId: null,
        metadata: {
          surveyNo: '123/4A',
          ownerName: 'Ravi Kumar',
        },
      },
    ],
    extractedData: {
      surveyNo: '123/4A',
      ownerName: 'Ravi Kumar',
      khataNo: '45',
      landArea: '2.5 acres',
    },
  },
]

export const products = [
  {
    title: 'Organic Fertilizer Pack',
    description: 'Bio-compost suitable for paddy and wheat',
    price: 1250,
    stock: 50,
    category: 'Fertilizer',
    status: 'active',
    specs: {
      weightKg: 25,
      brand: 'AgriSupply',
      organic: true,
    },
  },
]

export const priceHistory = [
  {
    crop: 'Tomato',
    location: 'Bangalore Rural',
    date: new Date().toISOString(),
    price: 32.5,
    source: 'agmarknet',
  },
  {
    crop: 'Tomato',
    location: 'Bangalore Rural',
    date: new Date(Date.now() - 86400000).toISOString(),
    price: 31.8,
    source: 'agmarknet',
  },
]
