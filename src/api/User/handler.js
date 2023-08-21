/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
const { EncryptPassword, DecryptPassword, EncryptData, DecryptData } = require('../../config/modules')
const { v4: uuidv4 } = require('uuid')
const Jwt = require('jsonwebtoken')

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
      console.log(request)
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
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

      const metadata = {
        userId: result[0].user_id,
        fullName: result[0].full_name,
        shortName: result[0].short_name,
        branchCode: result[0].branch_code,
        levelId: result[0].level_id
      }
      
      // const payload = EncryptMessage(process.env.JWT_SECRET, JSON.stringify(metadata))
      const payload = EncryptData(metadata, process.env.ENCRYPTION_SECRET)
      const token = Jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '8h' })

      if (DecryptPassword(data.password, result[0].password)) {
        const dataSession = {
          uid: uuidv4(8),
          session: token,
          userId: data.userId,
          expiredAt: 8
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
        // const cookie = { uid: dataSession.uid, session: dataSession.session, userId: dataSession.userId }
        
        const response = h.response({
          status: 'success',
          code: 200,
          statusCode: 1,
          message: { Description: 'Login Successfully', token }
        })
        
        // request.cookieAuth.set(cookie)
        // response.header('Access-Control-Expose-Headers', 'set-cookie')

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
