/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
const { ClientError } = require('../exceptions/ErrorHandler')
const { EncryptPassword, DecryptPassword } = require('../config/modules')
const { v4: uuidv4 } = require('uuid')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addUserHandler = this.addUserHandler.bind(this)
    this.loginHandler = this.loginHandler.bind(this)
  }

  async addUserHandler (request, h) {
    try {
      this._validator.validateUserPayload(request.payload)
      const data = request.payload
      
      const hashedPassword = EncryptPassword(data.password)
      console.log('AAAA', hashedPassword)

      const { result, err } = await this._service.addUser(data)

      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: '0',
          message: err.message
        })
        response.code(400)
        return response
      }
      
      const response = h.response({
        status: 'success',
        code: 201,
        statusCode: '1',
        message: { Description: 'Registered Successfully', result }
      })
      response.code(201)
      return response
      
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async loginHandler (request, h) {
    const data = request.payload
    const { result, err } = await this._service.getUser(data)
    if (err != null) {
      const response = h.response({
        status: 'fail',
        statusCode: '0',
        message: err.message
      })
      response.code(400)
      return response
    }
    if (DecryptPassword(data.password, result.password)) {
      const response = h.response({
        status: 'success',
        code: 201,
        statusCode: '1',
        message: { Description: 'Registered Successfully', result }
      })
      request.cookieAuth.set({ uid: uuidv4(100) })
      response.code(200)
      return response
    }
  }
}

module.exports = { UserHandler }
