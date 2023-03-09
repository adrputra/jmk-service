const { Pool } = require('../../config/connection')
const { InvariantError, NotFoundError } = require('../../exceptions/ErrorHandler')

class UserService {
  constructor () {
    this._pool = Pool
  }

  async addUser ({ userId, fullName, shortName, password, branchCode, levelId }) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO user_access VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values: [null, userId, fullName, shortName, password, branchCode, levelId, createdAt, createdAt]
    }

    await this._pool.query(query.text, query.values, (err, rows) => {
      if (err) {
        throw new InvariantError('Failed to add user.')
      }
      return rows
    })
    // if (!result.rows) {
    //   throw new InvariantError('Failed to add user.')
    // }
    // return result.rows
  }

  async editUser ({ userId, fullName, shortName, password, branchCode, levelId }) {
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

  async loginUser ({ userId }) {
    const query = {
      text: 'SELECT * FROM user_access WHERE user_id = ?',
      values: [userId]
    }
    await this._pool.query(query.text, query.values, (err, rows) => {
      if (err) {
        throw new NotFoundError('User ID not found.')
      }
      // console.log('DATA', rows[0].password)
      return rows
    })
  }
}

module.exports = { UserService }
