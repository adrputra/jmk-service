const { UserPayloadSchema, InvitationCodeSchema, InvitationListSchema } = require('./schema')
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
  validateInvitationCodePayload: (payload) => {
    const validationResult = InvitationCodeSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

const InvitationListValidator = {
  validateInvitationListPayload: (payload) => {
    const validationResult = InvitationListSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = { UserValidator, InvitationValidator, InvitationListValidator }
