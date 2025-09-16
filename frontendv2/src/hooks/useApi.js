import { useState, useEffect } from 'react'

export function useApi(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock API call - replace with actual fetch in production
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
        
        // Mock response based on URL
        let mockData = {}
        if (url.includes('/weather')) {
          mockData = {
            temperature: 28,
            humidity: 65,
            condition: 'Partly Cloudy',
            forecast: [
              { day: 'Today', high: 32, low: 24, condition: 'Sunny' },
              { day: 'Tomorrow', high: 30, low: 22, condition: 'Cloudy' }
            ]
          }
        } else if (url.includes('/crops')) {
          mockData = [
            { id: 1, name: 'Rice', suitability: 92, expectedYield: '4.2 tons/acre' },
            { id: 2, name: 'Wheat', suitability: 88, expectedYield: '3.8 tons/acre' }
          ]
        } else if (url.includes('/prices')) {
          mockData = [
            { crop: 'Rice', currentPrice: 2850, predictedPrice: 3100, change: 8.8 },
            { crop: 'Wheat', currentPrice: 2200, predictedPrice: 2350, change: 6.8 }
          ]
        }
        
        setData(mockData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchData()
    }
  }, [url])

  const refetch = () => {
    if (url) {
      fetchData()
    }
  }

  return { data, loading, error, refetch }
}

export function usePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const post = async (url, data) => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock API post - replace with actual fetch in production
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful response
      return { success: true, data: { id: Date.now(), ...data } }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error }
}

export default useApi
