/* eslint-disable no-sequences */
const { Pool } = require('../../config/connection')

class InvitationService {
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

  async GetInvitation (data) {
    const query = {
      text: 'SELECT code, userId, name, level, phoneNumber FROM InvitationCode WHERE code = ?',
      values: [data.code]
    }

    return await this.DB(query)
  }

  async AddInvitation (data) {
    const createdAt = new Date()

    const query = {
      text: 'INSERT INTO InvitationCode VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      values: [data.code, data.userId, data.name, data.level, data.phoneNumber, 'Invited', data.pax, createdAt]
    }

    return await this.DB(query)
  }

  async EditInvitation (data) {
    const createdAt = new Date()

    const query = {
      text: 'UPDATE InvitationCode SET name = ?, level = ?, phoneNumber = ?, status = ?, pax = ?, createdAt = ? WHERE code = ?',
      values: [data.name, data.level, data.phoneNumber, data.status, data.pax, createdAt, data.code]
    }

    return await this.DB(query)
  }

  async GetInvitationList (data) {
    const query = {
      text: 'SELECT code, name, level, phoneNumber, status, pax FROM InvitationCode WHERE userId = ?',
      values: [data.userId]
    }

    return await this.DB(query)
  }

  async DeleteInvitation (data) {
    const query = {
      text: 'DELETE FROM InvitationCode WHERE code = ?',
      values: [data.code]
    }

    return await this.DB(query)
  }
}

module.exports = { InvitationService }
