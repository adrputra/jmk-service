const { v4: uuidv4 } = require('uuid')
class InvitationHandler {
  constructor (service, [validatorInvitationCode, validatorInvitationList]) {
    this._service = service
    this._validatorInvitationCode = validatorInvitationCode
    this._validatorInvitationList = validatorInvitationList

    this.getInvitationHandler = this.getInvitationHandler.bind(this)
    this.getInvitationListHandler = this.getInvitationListHandler.bind(this)
    this.addInvitationHandler = this.addInvitationHandler.bind(this)
    // this.addInvitationHandler = this.addInvitationHandler.bind(this)
  }

  async getInvitationHandler (request, h) {
    try {
      this._validatorInvitationCode.validateInvitationCodePayload(request.payload)

      const { result, err } = await this._service.getInvitation(request.payload)
      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      const jsonResult = JSON.stringify(result)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Request Success', Result: jsonResult }
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

  async addInvitationHandler (request, h) {
    try {
      // this._validatorInvitationCode.validateInvitationCodePayload(request.payload)
      const generate8DigitUUID = () => {
        const uuid = uuidv4().split('-')[0] // Generate a UUID and extract the first part
        const eightDigitUUID = uuid.substring(0, 8) // Take the first 8 characters

        return eightDigitUUID
      }

      request.payload.code = generate8DigitUUID()

      const { result, err } = await this._service.addInvitation(request.payload)
      if (err != null) {
        const response = h.response({
          status: 'fail',
          statusCode: 0,
          message: err.message
        })
        response.code(400)
        return response
      }

      const jsonResult = JSON.stringify(result)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Success Create New Invitation', Result: jsonResult }
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

  async getInvitationListHandler (request, h) {
    try {
      this._validatorInvitationList.validateInvitationListPayload(request.payload)

      const { result, err } = await this._service.getInvitationList(request.payload)
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

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Request Success', Result: result }
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
