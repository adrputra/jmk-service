const { ClientError } = require('../exceptions/ErrorHandler')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
    this.loginHandler = this.loginHandler.bind(this)
  }

  async postUserHandler (request, h) {
    try {
      this._validator.validateUserPayload(request.payload)
      const data = request.payload

      // const result = this._service.addUser(data)
      const { result, err } = await this._service.addUser(data)
      console.log('AAA', result, err)
      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: '0',
          message: err.message
        })
        response.code(400)
        return response
      }
      console.info('AAA', result)
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
    const { userId, password } = request.payload
    const result = await this._service.getUser({ userId })
    if (password === result.password) {
      console.log(result)
      const response = h.response({
        status: 'success',
        data: {
          result
        }
      })
      response.code(201)
      return response
    }
  }
}

module.exports = { UserHandler }
