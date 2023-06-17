/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
const { EncryptPassword, DecryptPassword } = require('../../config/modules')
const { v4: uuidv4 } = require('uuid')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addUserHandler = this.addUserHandler.bind(this)
    this.loginHandler = this.loginHandler.bind(this)
    // this.qrcodeHandler = this.qrcodeHandler.bind(this)
  }

  async addUserHandler (request, h) {
    try {
      this._validator.validateUserPayload(request.payload)
      const data = request.payload
      
      data.password = EncryptPassword(data.password)

      const { result, err } = await this._service.addUser(data)

      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }
      
      const response = h.response({
        status: 'success',
        code: 201,
        statusCode: 1,
        message: { Description: 'Registered Successfully', result }
      })
      response.code(201)
      return response
      
    } catch (error) {
      const response = h.response({
        status: 'fail',
        statusCode: 0,
        message: error.message
      })
      response.code(400)
      return response
    }
  }

  async loginHandler (request, h) {
    try {

      const data = request.payload
      const { result, err } = await this._service.getUser(data)

      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      if (DecryptPassword(data.password, result[0].password)) {
        const dataSession = {
          uid: uuidv4(100),
          session: uuidv4(),
          userId: data.userId
        }
        const { errSession } = await this._service.addSession(dataSession)

        if (errSession != null) {
          const response = h.response({
            status: 'fail',
            statusCode: 0,
            message: err.message
          })
          response.code(400)
          return response
        }

        // const jsonResult = JSON.stringify(result)
        const cookie = { uid: dataSession.uid, session: dataSession.session, userId: dataSession.userId }
        
        const response = h.response({
          status: 'success',
          code: 200,
          statusCode: 1,
          message: { Description: 'Login Successfully', Result: result }
        })
        
        request.cookieAuth.set(cookie)
        response.header('Access-Control-Expose-Headers', 'set-cookie')

        return response
      } else {
        const response = h.response({
          status: 'fail',
          code: 404,
          statusCode: 0,
          message: { Description: 'Login Failed' }
        })

        return response
      }
    } catch (error) {
      const response = h.response({
        status: 'fail',
        statusCode: 0,
        message: error.message
      })
      response.code(400)
      return response
    }
  }
}

module.exports = { UserHandler }
