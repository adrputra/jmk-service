const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  fullName: Joi.string().required(),
  shortName: Joi.string().required(),
  password: Joi.string().required(),
  branchCode: Joi.string().required(),
  levelId: Joi.string().required()
})

const InvitationCodeSchema = Joi.object({
  code: Joi.string().required()
})

const InvitationListSchema = Joi.object({
  userId: Joi.string().required()
})

module.exports = { UserPayloadSchema, InvitationCodeSchema, InvitationListSchema }
