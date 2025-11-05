import { config } from '../config/config.js';
import { adminDB } from '../config/db.js';
import bcrypt from 'bcryptjs';

const Admin = adminDB().models.Admin || adminDB().model('Admin', new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true }));

const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const admin = new Admin({
      name: 'System Administrator',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    
  } catch (error) {
    console.error('Error initializing admin user:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the initialization
initAdmin();
