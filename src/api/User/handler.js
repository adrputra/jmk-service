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
    this.logoutHandler = this.logoutHandler.bind(this)
    this.GetAllUser = this.GetAllUser.bind(this)
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
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('loginHandler', data)
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
        const { result: sessionId } = await this._service.getSessionIdByUser(data)        

        const metadata = {
          userId: result[0].user_id,
          fullName: result[0].full_name,
          shortName: result[0].short_name,
          branchCode: result[0].branch_code,
          levelId: result[0].level_id,
          sessionId: sessionId[0] ? sessionId[0].session_id : uuidv4(8)
        }
        
        const payload = EncryptData(metadata, process.env.ENCRYPTION_SECRET)
        const token = Jwt.sign({
          payload,
          iss: 'eventarry', // Issuer
          sub: 'auth' 
        }, process.env.JWT_SECRET, { expiresIn: '8h' })

        if (!sessionId[0]) {
          const dataSession = {
            uid: uuidv4(8),
            session: metadata.sessionId,
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

  async logoutHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('logoutHandler', data)
      const { result, err } = await this._service.removeSession(data)

      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Logout Successfully', Result: payload }
      })
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

  async GetAllUser (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('GetAllUser', data)
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

      if (result[0].level_id === '0') {
        const { result, err } = await this._service.GetAllUser(data)

        if (err != null) {
          const response = h.response({
            status: 'fail',
            statusCode: 0,
            message: err.message
          })
          response.code(400)
          return response
        }

        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

        const response = h.response({
          status: 'success',
          code: 200,
          statusCode: 1,
          message: { Description: 'Get All User Success', Result: payload }
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
