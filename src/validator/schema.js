const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  full_name: Joi.string().required(),
  short_name: Joi.string().required(),
  password: Joi.string().required(),
  level_id: Joi.string().required(),
  act: Joi.string().required()
})

const InvitationCodeSchema = Joi.object({
  code: Joi.string().required()
})

const InvitationListSchema = Joi.object({
  user_id: Joi.string().required()
})

module.exports = { UserPayloadSchema, InvitationCodeSchema, InvitationListSchema }
