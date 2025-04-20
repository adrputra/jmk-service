/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')

class UserService {
  constructor () {
    this._pool = Pool
  }

  async DB (query) {
    try {
      const result = await new Promise((resolve, reject) => {
        this._pool.query(query.text, query.values, (err, res) => {
          if (err) {
            // console.log('CB ERR', err.message)
            reject(err)
          }
          // console.log('CB RES', res)
          resolve(res)
        })
      })
      // console.log('RES SERVICE', result)
      return { result, err: null }
    } catch (error) {
      // console.log('ERR SERVICE', error.sqlMessage)
      return { result: null, err: error }
    }
  }

  async addUser (data) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO User VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values: [null, data.userId, data.fullName, data.shortName, data.password, data.userId, data.levelId, createdAt, createdAt]
    }

    return await this.DB(query)
  }

  async editUser (data) {
    const updatedAt = new Date()

    const query = {
      text: 'UPDATE User SET fullName = ?, shortName = ?, levelId = ?, updatedAt = ? WHERE userId = ?',
      values: [data.fullName, data.shortName, data.levelId, updatedAt, data.userId]
    }

    return await this.DB(query)
  }

  async deleteUser (data) {
    const query = {
      text: 'DELETE FROM User WHERE userId = ?',
      values: [data.userId]
    }

    return await this.DB(query)
  }

  async getUser (data) {
    const query = {
      text: 'SELECT DISTINCT * FROM User WHERE userId = ?',
      values: [data.userId]
    }

    return await this.DB(query)
  }

  async addSession (data) {
    const createdAt = new Date()
    const expiredAt = new Date(createdAt.getTime() + data.expiredAt * 60 * 60 * 1000)

    const query = {
      text: 'INSERT INTO SessionAuth VALUES(?, ?, ?, ?, ?, ?)',
      values: [null, data.uid, data.session, data.userId, createdAt, expiredAt]
    }

    return await this.DB(query)
  }

  async getSessionIdByUser (data) {
    const now = new Date()
    // const format = now.toISOString().slice(0, 19).replace('T', ' ')

    const query = {
      text: 'SELECT session_id FROM SessionAuth WHERE userId = ? AND expiredAt > ?',
      values: [data.userId, now]
    }

    return await this.DB(query)
  }

  async removeSession (data) {
    const now = new Date()

    const query = {
      text: 'UPDATE SessionAuth SET expiredAt = ? WHERE session_id = ?',
      values: [now, data.sessionId]
    }

    return await this.DB(query)
  }

  async getAllUser (data) {
    const query = {
      text: 'SELECT userId, levelId, fullName, shortName FROM User WHERE userId != ?',
      values: [data.userId]
    }

    return await this.DB(query)
  }
}

module.exports = { UserService }
