import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017';
const DB_NAMES = {
  FARMER: 'farmchain_farmers',
  SUPPLIER: 'farmchain_suppliers',
  ADMIN: 'farmchain_admin',
};

const connections = {};

const connectDB = async (dbName) => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  const dbUri = `${uri}/${dbName}`;

  // Return existing connection if available
  if (connections[dbName]) {
    return connections[dbName];
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.createConnection(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${uri}/${dbName}`);
    connections[dbName] = conn;
    return conn;
  } catch (err) {
    console.error(`MongoDB connection error (${dbName}):`, err);
    process.exit(1);
  }
};

const farmerDB = () => connectDB(DB_NAMES.FARMER);
const supplierDB = () => connectDB(DB_NAMES.SUPPLIER);
const adminDB = () => connectDB(DB_NAMES.ADMIN);

// Initialize all connections on startup
const initializeConnections = async () => {
  try {
    await Promise.all([
      farmerDB(),
      supplierDB(),
      adminDB()
    ]);
    console.log('All database connections established');
  } catch (error) {
    console.error('Failed to initialize database connections:', error);
    process.exit(1);
  }
};

export {
  farmerDB,
  supplierDB,
  adminDB,
  initializeConnections,
  DB_NAMES
};

export default connectDB;
