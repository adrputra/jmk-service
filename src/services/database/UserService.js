const { Pool } = require('../../config/connection')
const { InvariantError, NotFoundError } = require('../../exceptions/ErrorHandler')

class UserService {
  constructor () {
    this._pool = Pool
  }

  async addUser ({ userId, fullName, shortName, branchCode, levelId }) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO user_access VALUES(?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
      values: [null, userId, fullName, shortName, branchCode, levelId, createdAt, createdAt]
    }

    await this._pool.query(query.text, query.values, (err, rows) => {
      if (err) {
        throw new InvariantError('Failed to add user.')
      }
      console.log('AAA', rows)
      return rows
    })
    // if (!result.rows) {
    //   throw new InvariantError('Failed to add user.')
    // }
    // return result.rows
  }

  async editUser ({ userId, fullName, shortName, branchCode, levelId }) {
    const updatedAt = Date.now()

    const query = {
      text: 'UPDATE user_access SET ful_name = $1, short_name = $2, branch_code = $3, level_id = $4, updated_at = $5 RETURNING id, user_id, full_name, short_name, branch_code, level_id, created_at, updated_at',
      values: [fullName, shortName, branchCode, levelId, updatedAt]
    }
    const result = await this._pool.query(query)

    if (!result.rows) {
      throw new NotFoundError('Failed to edit user.')
    }
    return result.rows
  }
}

module.exports = { UserService }
