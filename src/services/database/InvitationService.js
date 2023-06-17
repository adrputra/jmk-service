/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')

class InvitationService {
  constructor () {
    this._pool = Pool
  }

  async getInvitation (data) {
    const query = {
      text: 'SELECT code, user_id, name, level, phone_number FROM invitation_code WHERE code = ?',
      values: [data.code]
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

  async getInvitationList (data) {
    const query = {
      text: 'SELECT code, user_id, name, level, phone_number FROM invitation_code WHERE user_id = ?',
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
}

module.exports = { InvitationService }
