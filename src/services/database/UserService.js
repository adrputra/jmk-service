/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')

class UserService {
  constructor () {
    this._pool = Pool
  }

  async addUser (data) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO user_access VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values: [null, data.userId, data.fullName, data.shortName, data.password, data.branchCode, data.levelId, createdAt, createdAt]
    }

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

  async getUser (data) {
    const query = {
      text: 'SELECT DISTINCT * FROM user_access WHERE user_id = ?',
      values: [data.userId]
    }
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

  async addSession (data) {
    const createdAt = new Date()
    const expiredAt = new Date(createdAt.getTime() + data.expiredAt * 60 * 60 * 1000)

    const query = {
      text: 'INSERT INTO session_auth VALUES(?, ?, ?, ?, ?, ?)',
      values: [null, data.uid, data.session, data.userId, createdAt, expiredAt]
    }

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

  async getSessionIdByUser (data) {
    const now = new Date()
    const format = now.toISOString().slice(0, 19).replace('T', ' ')
    console.log(format)

    const query = {
      text: 'SELECT session_id FROM session_auth WHERE user_id = ? AND expired_at > ?',
      values: [data.userId, now]
    }

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

  async removeSession (data) {
    const now = new Date()

    const query = {
      text: 'UPDATE session_auth SET expired_at = ? WHERE session_id = ?',
      values: [now, data.sessionId]
    }
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
}

module.exports = { UserService }
