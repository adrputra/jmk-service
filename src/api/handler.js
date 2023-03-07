const { ClientError } = require('../exceptions/ErrorHandler')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler (request, h) {
    try {
      this._validator.validateUserPayload(request.payload)
      const { userId, fullName, shortName, branchCode, levelId } = request.payload

      const result = await this._service.addUser({ userId, fullName, shortName, branchCode, levelId })
      const response = h.response({
        status: 'success',
        data: {
          result
        }
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
}

module.exports = { UserHandler }
