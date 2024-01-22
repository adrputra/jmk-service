/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')

class InvitationService {
  constructor () {
    this._pool = Pool
  }

  async DB (query) {
    console.log('QUERY', query)
    try {
      const result = await new Promise((resolve, reject) => {
        this._pool.query(query.text, query.values, (err, res) => {
          if (err) {
            // console.log('DB ERR', err.message)
            reject(err)
          }
          // console.log('DB RES', res)
          resolve(res)
        })
      })
      console.log('RES DB', result)
      return { result, err: null }
    } catch (error) {
      console.log('ERR DB', error.sqlMessage)
      return { result: null, err: error }
    }
  }

  async GetInvitation (data) {
    const query = {
      text: 'SELECT code, user_id, name, level, phone_number, pax FROM invitation_code WHERE code = ?',
      values: [data.code]
    }

    return await this.DB(query)
  }

  async AddInvitation (data) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO invitation_code VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      values: [data.code, data.user_id, data.name, data.level, data.phone_number, 'Invited', data.pax, createdAt]
    }

    return await this.DB(query)
  }

  async EditInvitation (data) {
    const createdAt = new Date()

    const query = {
      text: 'UPDATE invitation_code SET name = ?, level = ?, phone_number = ?, status = ?, pax = ?, created_at = ? WHERE code = ?',
      values: [data.name, data.level, data.phone_number, data.status, data.pax, createdAt, data.code]
    }

    return await this.DB(query)
  }

  async GetInvitationList (data) {
    const query = {
      text: 'SELECT code, name, level, phone_number, status, pax FROM invitation_code WHERE user_id = ?',
      values: [data.user_id]
    }

    return await this.DB(query)
  }

  async DeleteInvitation (data) {
    const query = {
      text: 'DELETE FROM invitation_code WHERE code = ?',
      values: [data.code]
    }

    return await this.DB(query)
  }
}

module.exports = { InvitationService }
