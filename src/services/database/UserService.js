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
      text: 'INSERT INTO user_access VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values: [null, data.user_id, data.full_name, data.short_name, data.password, data.user_id, data.level_id, createdAt, createdAt]
    }

    return await this.DB(query)
  }

  async editUser (data) {
    const updatedAt = new Date()

    const query = {
      text: 'UPDATE user_access SET full_name = ?, short_name = ?, level_id = ?, updated_at = ? WHERE user_id = ?',
      values: [data.full_name, data.short_name, data.level_id, updatedAt, data.user_id]
    }

    return await this.DB(query)
  }

  async deleteUser (data) {
    const query = {
      text: 'DELETE FROM user_access WHERE user_id = ?',
      values: [data.user_id]
    }

    return await this.DB(query)
  }

  async getUser (data) {
    const query = {
      text: 'SELECT DISTINCT * FROM user_access WHERE user_id = ?',
      values: [data.user_id]
    }

    return await this.DB(query)
  }

  async addSession (data) {
    const createdAt = new Date()
    const expiredAt = new Date(createdAt.getTime() + data.expiredAt * 60 * 60 * 1000)

    const query = {
      text: 'INSERT INTO session_auth VALUES(?, ?, ?, ?, ?, ?)',
      values: [null, data.uid, data.session, data.user_id, createdAt, expiredAt]
    }

    return await this.DB(query)
  }

  async getSessionIdByUser (data) {
    const now = new Date()
    // const format = now.toISOString().slice(0, 19).replace('T', ' ')

    const query = {
      text: 'SELECT session_id FROM session_auth WHERE user_id = ? AND expired_at > ?',
      values: [data.user_id, now]
    }

    return await this.DB(query)
  }

  async removeSession (data) {
    const now = new Date()

    const query = {
      text: 'UPDATE session_auth SET expired_at = ? WHERE session_id = ?',
      values: [now, data.sessionId]
    }

    return await this.DB(query)
  }

  async getAllUser (data) {
    const query = {
      text: 'SELECT user_id, level_id, full_name, short_name FROM user_access WHERE user_id != ?',
      values: [data.user_id]
    }

    return await this.DB(query)
  }
}

module.exports = { UserService }
