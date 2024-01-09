require('dotenv').config()
const mysql = require('mysql')

const Pool = mysql.createPool({
  connectionLimit: 100, // important
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  debug: process.env.DBDEBUG
})

const amqp = require('amqplib')

class RabbitMQ {
  constructor () {
    this.connection = null
    this.channel = null
  }

  async connect () {
    try {
      this.connection = await amqp.connect('amqp://localhost')
      this.channel = await this.connection.createChannel()
      console.log('Connected to RabbitMQ')
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error.message)
      setTimeout(this.connect(), 5000)
    }
  }

  async closeConnection () {
    if (this.connection) {
      await this.connection.close()
      console.log('Closed RabbitMQ connection')
    }
  }

  async sendMessage (queue, message) {
    try {
      await this.channel.assertQueue(queue, { durable: false })
      this.channel.sendToQueue(queue, Buffer.from(message))
      console.log(`Sent message to ${queue}: ${message}`)
      return `Success Publish MQ - ${queue}`
    } catch (error) {
      console.error(`Error sending message to ${queue}:`, error.message)
      return error.message
    }
  }

  async consume (queue, handler) {
    try {
      await this.channel.assertQueue(queue, { durable: false })

      console.log(`Waiting for messages from ${queue}`)

      this.channel.consume(
        this.queue,
        async (msg) => {
          if (msg !== null) {
            console.log(`Received message from ${this.queue}: ${msg.content.toString()}`)
            await handler(msg)
            // Acknowledge the message to remove it from the queue
            this.channel.ack(msg)
          }
        },
        { noAck: false }
      )
    } catch (error) {
      console.error(`Error consuming messages from ${this.queue}:`, error.message)
    }
  }
}

const redis = require('redis')

class RedisClient {
  constructor () {
    this.client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      // password: process.env.REDIS_PASSWORD,
      legacyMode: true
    })

    // Handle Redis connection events
    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })

    this.client.on('error', (err) => {
      console.error('Error connecting to Redis:', err)
    })

    this.client.on('reconnecting', (delay, attempt) => {
      console.log(`Reconnecting to Redis (attempt ${attempt}) in ${delay} ms`)
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

module.exports = { Pool, RabbitMQ, RedisClient }
