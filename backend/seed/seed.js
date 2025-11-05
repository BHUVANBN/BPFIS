import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import Land from '../models/Land.js'
import Product from '../models/Product.js'
import PriceHistory from '../models/PriceHistory.js'
import Agreement from '../models/Agreement.js'
import Order from '../models/Order.js'
import { users, lands, products, priceHistory } from './sampleData.js'

const withObjectId = (doc) => ({ ...doc, _id: new mongoose.Types.ObjectId() })

const seed = async () => {
  try {
    await connectDB()

    console.log('Clearing existing collections...')
    await Promise.all([
      User.deleteMany({}),
      Land.deleteMany({}),
      Product.deleteMany({}),
      PriceHistory.deleteMany({}),
      Agreement.deleteMany({}),
      Order.deleteMany({}),
    ])

    console.log('Inserting users...')
    const userDocs = await User.insertMany(users.map(withObjectId))
    const farmer = userDocs.find((u) => u.role === 'farmer')
    const supplier = userDocs.find((u) => u.role === 'supplier')

    console.log('Inserting lands...')
    await Land.insertMany(
      lands.map((land) => ({
        ...land,
        ownerId: farmer?._id,
      }))
    )

    console.log('Inserting products...')
    await Product.insertMany(
      products.map((product) => ({
        ...product,
        supplierId: supplier?._id,
      }))
    )

    console.log('Inserting price history...')
    await PriceHistory.insertMany(priceHistory)

    console.log('Seed data inserted successfully!')
  } catch (err) {
    console.error('Seed failed:', err)
  } finally {
    await mongoose.connection.close()
    console.log('Connection closed.')
  }
}

seed()
