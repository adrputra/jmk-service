class InvitationHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.getInvitationHandler = this.getInvitationHandler.bind(this)
    this.getInvitationListHandler = this.getInvitationListHandler.bind(this)
    // this.addInvitationHandler = this.addInvitationHandler.bind(this)
  }

  async getInvitationHandler (request, h) {
    try {
      this._validator.validateInvitationPayload(request.payload)

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

  async getInvitationListHandler (request, h) {
    try {
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
