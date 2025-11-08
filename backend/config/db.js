const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb+srv://bhuvanbn01_db_user:JxtgUj7f3vVZm89c@cluster0.rkbd9dx.mongodb.net/BPFIS?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAMES = {
  FARMER: 'farmchain_farmers',
  SUPPLIER: 'farmchain_suppliers',
  ADMIN: 'farmchain_admin',
};

const connections = {};

const connectDB = async (dbName) => {
  // Use the default URI directly since it's already the full connection string
  const uri = DEFAULT_URI; // Directly use the Atlas connection string

  // Return existing connection if available
  if (connections[dbName]) {
    return connections[dbName];
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.createConnection(uri, {
      // Remove deprecated options for newer MongoDB driver
      // useNewUrlParser and useUnifiedTopology are not needed in MongoDB Node.js Driver v4.0.0 and above
    }).asPromise();

    console.log(`MongoDB connected to Atlas cluster`);
    connections[dbName] = conn;
    return conn;
  } catch (err) {
    console.error(`MongoDB connection error (${dbName}):`, err);
    process.exit(1);
  }
};

// Create connections
const farmerDB = () => connections[DB_NAMES.FARMER] || connectDB(DB_NAMES.FARMER);
const supplierDB = () => connections[DB_NAMES.SUPPLIER] || connectDB(DB_NAMES.SUPPLIER);
const adminDB = () => connections[DB_NAMES.ADMIN] || connectDB(DB_NAMES.ADMIN);

// Initialize all connections on startup
const initializeConnections = async () => {
  try {
    await Promise.all([
      connectDB(DB_NAMES.FARMER),
      connectDB(DB_NAMES.SUPPLIER),
      connectDB(DB_NAMES.ADMIN)
    ]);
    console.log('All database connections established');
  } catch (error) {
    console.error('Failed to initialize database connections:', error);
    process.exit(1);
  }
};

module.exports = {
  farmerDB,
  supplierDB,
  adminDB,
  initializeConnections,
  DB_NAMES,
  connectDB
};
