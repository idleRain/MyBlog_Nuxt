import mongoose from 'mongoose'

let isConnected = false

export async function useMongoDB() {
  const config = useRuntimeConfig()

  if (isConnected) {
    return mongoose
  }

  try {
    await mongoose.connect(config.mongodbUri as string)
    isConnected = true
    console.log('MongoDB connected successfully')
    return mongoose
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export async function closeMongoDB() {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
  }
}
