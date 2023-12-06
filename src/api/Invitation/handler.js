const { v4: uuidv4 } = require('uuid')
const { EncryptData, DecryptData } = require('../../config/modules')
const { responseWrapper } = require('../../config/util')

class InvitationHandler {
  constructor ([invitationService, reditClient], [validatorInvitationCode, validatorInvitationList]) {
    this._service = invitationService
    this._redis = reditClient
    this._validatorInvitationCode = validatorInvitationCode
    this._validatorInvitationList = validatorInvitationList

    this.GetInvitationHandler = this.GetInvitationHandler.bind(this)
    this.GetInvitationListHandler = this.GetInvitationListHandler.bind(this)
    this.AddInvitationHandler = this.AddInvitationHandler.bind(this)
    this.DeleteInvitationHandler = this.DeleteInvitationHandler.bind(this)
    // this.AddInvitationHandler = this.AddInvitationHandler.bind(this)
  }

  async GetInvitationHandler (request, h) {
    try {
      // const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      const data = request.payload
      console.log('GetInvitationHandler', data)

      this._validatorInvitationCode.validateInvitationCodePayload(data)

      const { cache } = await this._redis.GetRedis(data.code)
      if (cache != null) {
        const payload = JSON.parse(cache)
        return responseWrapper(h, 'success', 200, 1, { Description: 'Request Success', Result: payload })
      }

      const { result, err } = await this._service.GetInvitation(data)
      if (err != null) {
        return responseWrapper(h, 'fail', 400, 0, err.message)
      }

      // const jsonResult = JSON.stringify(result)
      // const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
      const payload = JSON.stringify(result)
      await this._redis.SetRedis(data.code, payload, 3600)

      return responseWrapper(h, 'success', 200, 1, { Description: 'Request Success', Result: payload })
    } catch (error) {
      return responseWrapper(h, 'fail', 500, 0, error.message)
    }
  }

  async AddInvitationHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('AddInvitationHandler', data)

      // this._validatorInvitationCode.validateInvitationCodePayload(request.payload)
      const generate8DigitUUID = () => {
        const uuid = uuidv4().split('-')[0] // Generate a UUID and extract the first part
        const eightDigitUUID = uuid.substring(0, 8) // Take the first 8 characters

        return eightDigitUUID
      }

      if (data.act === 'c') {
        const { result, err } = await this._service.EditInvitation(data)
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
          message: { Description: 'Success Change Invitation', Result: payload }
        })
        response.code(200)
        return response
      } else if (data.act === 'a') {
        data.code = generate8DigitUUID()
        const { result, err } = await this._service.AddInvitation(data)
        if (err != null) {
          const response = h.response({
            status: 'fail',
            statusCode: 0,
            message: err.message
          })
          response.code(400)
          return response
        }

        // const jsonResult = JSON.stringify(result)
        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
        const response = h.response({
          status: 'success',
          code: 200,
          statusCode: 1,
          message: { Description: 'Success Create New Invitation', Result: payload }
        })
        response.code(200)
        return response
      } else if (data.act === 'd') {
        const { result, err } = await this._service.DeleteInvitation(data)
        if (err != null) {
          const response = h.response({
            status: 'fail',
            statusCode: 0,
            message: err.message
          })
          response.code(400)
          return response
        }

        // const jsonResult = JSON.stringify(result)
        const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)
        const response = h.response({
          status: 'success',
          code: 200,
          statusCode: 1,
          message: { Description: 'Success Delete Invitation', Result: payload }
        })
        response.code(200)
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

  async GetInvitationListHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('GetInvitationListHandler', data)

      this._validatorInvitationList.validateInvitationListPayload(data)

      const { result, err } = await this._service.GetInvitationList(data)
      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      // const jsonResult = JSON.stringify(result)
      const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Request Success', Result: payload }
      })
      response.code(200)
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

  async DeleteInvitationHandler (request, h) {
    try {
      const data = DecryptData(request.payload.request, process.env.ENCRYPTION_SECRET)
      console.log('DeleteInvitationHandler', data)

      const { result, err } = await this._service.DeleteInvitation(data)
      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      if (result.affectedRows === 0) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: 'Data Not Found'
        })
        response.code(400)
        return response
      }

      // const jsonResult = JSON.stringify(result)
      const payload = EncryptData(result, process.env.ENCRYPTION_SECRET)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Delete Success', Result: payload }
      })
      response.code(200)
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
}

module.exports = { InvitationHandler }
