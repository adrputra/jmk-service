const { UserPayloadSchema, InvitationCodeSchema } = require('./schema')
const { InvariantError } = require('../exceptions/ErrorHandler')

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

const InvitationValidator = {
  validateInvitationPayload: (payload) => {
    const validationResult = InvitationCodeSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = { UserValidator, InvitationValidator }
