const redis = require('redis')

class RedisClient {
  constructor () {
    this.client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
      // password: process.env.REDIS_PASSWORD
      // legacyMode: true
    })

    // Handle Redis connection events
    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })

    this.client.on('error', (err) => {
      console.error('Error connecting to Redis:', err)
    })
  }

  connect () {
    console.log('Connecting to Redis...', process.env.REDIS_HOST, process.env.REDIS_PORT)
    this.client.connect()
  }

  quit () {
    this.client.quit()
  }

  async GetRedis (key) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.client.get(key, (err, res) => {
          if (err) {
            reject(err)
          }
          // console.log('CB RES', res)
          resolve(res)
        })
      })
      // console.log('RES SERVICE', result)
      if (result !== null) {
        return { cache: result }
      } else {
        return { cache: null }
      }
    } catch (error) {
      console.log('Error Get Redis', error)
      return { cache: null, err: error }
    }
  }

  async SetRedis (key, value, expiry) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.client.set(key, value, 'EX', expiry, (err, res) => {
          if (err) {
            reject(err)
          }
          // console.log('CB RES', res)
          resolve(res)
        })
      })
      // console.log('RES SERVICE', result)
      if (result !== null) {
        return { cache: result }
      } else {
        return { cache: null }
      }
    } catch (error) {
      console.log('Error Set Redis', error)
      return { cache: null, err: error }
    }
  }
}

module.exports = { RedisClient }
