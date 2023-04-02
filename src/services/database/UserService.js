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
    const expiredAt = new Date(createdAt.getTime() + 8 * 60 * 60 * 1000)

    const query = {
      text: 'INSERT INTO session_auth VALUES(?, ?, ?, ?, ?)',
      values: [data.uid, data.session, data.userId, createdAt, expiredAt]
    }

    try {
      const result = await new Promise((resolve, reject) => {
        this._pool.query(query.text, query.values, (err, res) => {
          if (err) {
            console.log('CB ERR', err.message)
            reject(err)
          }
          console.log('CB RES', res)
          resolve(res)
        })
      })
      console.log('RES SERVICE', result)
      return { result, err: null }
    } catch (error) {
      console.log('ERR SERVICE', error.sqlMessage)
      return { result: null, err: error }
    }
  }
}

module.exports = { UserService }
