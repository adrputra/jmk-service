/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')
const { InvariantError, NotFoundError } = require('../../exceptions/ErrorHandler')

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

  async editUser ({ fullName, shortName, password, branchCode, levelId }) {
    const updatedAt = Date.now()

    const query = {
      text: 'UPDATE user_access SET ful_name = $1, short_name = $2, password = $3 branch_code = $4, level_id = $5, updated_at = $6 RETURNING id, user_id, full_name, short_name, branch_code, level_id, created_at, updated_at',
      values: [fullName, shortName, password, branchCode, levelId, updatedAt]
    }
    const result = await this._pool.query(query)

    if (!result.rows) {
      return new NotFoundError('Failed to edit user.')
    }
    return result.rows
  }

  async getUser ({ userId }) {
    const query = {
      text: 'SELECT * FROM user_access WHERE user_id = ?',
      values: [userId]
    }
    await this._pool.query(query.text, query.values, (err, result) => {
      if (err) {
        throw new NotFoundError('User ID not found.')
      }
      // console.log('DATA', rows[0].password)
      return result
    })
  }
}

module.exports = { UserService }
