class FlipHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async inquiryRekening (request, h) {
    try {
      const data = request.payload

      console.log(data)

      const response = h.response({
        status: 'success',
        code: 200,
        statusCode: 1,
        message: { Description: 'Webhook Successfully', data }
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

module.exports = { FlipHandler }
