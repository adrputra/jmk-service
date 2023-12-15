/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
const { EncryptPassword, DecryptPassword, EncryptData, DecryptData } = require('../../config/modules')
const { v4: uuidv4 } = require('uuid')
const Jwt = require('jsonwebtoken')
const { responseWrapper } = require('../../config/util')

class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.userHandler = this.userHandler.bind(this)
    this.loginHandler = this.loginHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
    this.GetAllUser = this.GetAllUser.bind(this)
    // this.qrcodeHandler = this.qrcodeHandler.bind(this)
  }

  async userHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('RegisterHandler', data)

      if (data.act === 'c') {
        const { result, err } = await this._service.editUser(data)
        if (err != null) {
          return responseWrapper(h, 'fail', 400, 0, err.message)
        }

        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
        return responseWrapper(h, 'success', 200, 1, { Description: 'Success Change User Data', Result: payload })

      } else if (data.act === 'a') {
        data.password = EncryptPassword(data.password)
        
        const { result, err } = await this._service.addUser(data)

        if (err != null) {
          return responseWrapper(h, 'fail', 400, 0, err.message)
        }
      
        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
        return responseWrapper(h, 'success', 200, 1, { Description: 'Success Create User', Result: payload })
      } else if (data.act === 'd') {
        
        const { result, err } = await this._service.deleteUser(data)

        if (err != null) {
          return responseWrapper(h, 'fail', 400, 0, err.message)
        }
      
        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
        return responseWrapper(h, 'success', 200, 1, { Description: 'Success Delete User', Result: payload })
      }
    } catch (error) {
      return responseWrapper(h, 'fail', 500, 0, error.message)
    }
  }

  async loginHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('loginHandler', data)

      const query = {
        text: 'SELECT DISTINCT * FROM user_access WHERE user_id = ?',
        values: [data.user_id]
      }

      const { result, err } = await this._service.DB(query)

      if (err != null) {
        return responseWrapper(h, 'fail', 400, 0, err.message)
      }

      if (DecryptPassword(data.password, result[0].password)) {

        const { result: sessionId } = await this._service.getSessionIdByUser(data)        

        const metadata = {
          user_id: result[0].user_id,
          full_name: result[0].full_name,
          short_name: result[0].short_name,
          branch_code: result[0].branch_code,
          level_id: result[0].level_id,
          sessionId: sessionId[0] ? sessionId[0].session_id : uuidv4(8)
        }
        
        const payload = EncryptData(metadata, process.env.ENCRYPTION_SECRET)
        const token = Jwt.sign({
          payload,
          iss: 'eventarry', // Issuer
          sub: 'auth' 
        }, process.env.JWT_SECRET, { expiresIn: '4h' })

        if (!sessionId[0]) {
          const dataSession = {
            uid: uuidv4(8),
            session: metadata.sessionId,
            user_id: data.user_id,
            expiredAt: 4
          }
          const { errSession } = await this._service.addSession(dataSession)
          
          if (errSession != null) {
            return responseWrapper(h, 'fail', 400, 0, err.message)
          }
        }

        // const jsonResult = JSON.stringify(result)
        // const cookie = { uid: dataSession.uid, session: dataSession.session, user_id: dataSession.user_id }
        
        return responseWrapper(h, 'success', 200, 1, { Description: 'Login Successfully', token })

      } else {
        return responseWrapper(h, 'fail', 404, 1, { Description: 'Login Failed. Incorrect Username or Password' })

      }
    } catch (error) {
      return responseWrapper(h, 'fail', 500, 0, error.message)
    }
  }

  async logoutHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('logoutHandler', data)
      const { result, err } = await this._service.removeSession(data)

      if (err != null) {
        return responseWrapper(h, 'fail', 400, 0, err.message)
      }

      const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

      return responseWrapper(h, 'success', 200, 1, { Description: 'Logout Successfully', Result: payload })

    } catch (error) {
      return responseWrapper(h, 'fail', 500, 0, error.message)
    }
  }

  async GetAllUser (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('GetAllUser', data)

      const { result, err } = await this._service.getUser(data)

      if (err != null) {
        return responseWrapper(h, 'fail', 400, 0, err.message)
      }

      if (result[0].level_id === '0') {

        const { result, err } = await this._service.getAllUser(data)

        if (err != null) {
          return responseWrapper(h, 'fail', 400, 0, err.message)
        }

        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

        return responseWrapper(h, 'success', 200, 1, { Description: 'Success Get All User', Result: payload })

      }

    } catch (error) {
      return responseWrapper(h, 'fail', 500, 0, error.message)
    }
  }

}

module.exports = { UserHandler }
