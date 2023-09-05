// const fs = require('fs')
// const Path = require('path')
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const { UserPlugin } = require('./api/User')
const { InvitationPlugin } = require('./api/Invitation')
const { UserService } = require('./services/database/UserService')
const { InvitationService } = require('./services/database/InvitationService')
const { UserValidator, InvitationValidator, InvitationListValidator } = require('./validator')

const init = async () => {
  const userService = new UserService()
  const invitationService = new InvitationService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        credentials: true,
        origin: ['*']
      }
    }
  })

  await server.register([Jwt])

  // server.auth.strategy('session', 'cookie', {
  //   cookie: {
  //     name: 'session',
  //     password: 'look-at-the-stars-look-how-they-shine-for-you',
  //     isSecure: true, // In Prod should be True.
  //     // ttl: 5 * 1000,
  //     ttl: 12 * 60 * 60 * 1000,
  //     isSameSite: 'Lax',
  //     isHttpOnly: false,
  //     path: '/'
  //   },
  //   redirectTo: false,
  //   keepAlive: true
  // })
  // server.auth.default('session')

  // const mockRequest = { payload: { userId: '1111', password: 'qwerty' } }
  // const mockH = {
  //   response: (responseObj) => responseObj
  // }

  const validate = async (request, h) => {
    const verifyToken = (artifact, secret, options = {}) => {
      try {
        Jwt.token.verify(artifact, secret, options)
        return { isValid: true }
      } catch (err) {
        return {
          isValid: false,
          error: err.message
        }
      }
    }
    return verifyToken(request, process.env.JWT_SECRET)
  }

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET, // Use a proper secret key from your environment
    verify: { aud: false, iss: 'eventarry', sub: 'auth' }, // Optional: Audience verification
    validate
  })

  server.auth.default('jwt')

  await server.register([{
    plugin: UserPlugin,
    options: {
      service: userService,
      validator: UserValidator
    }
  },
  {
    plugin: InvitationPlugin,
    options: {
      service: invitationService,
      validator: [InvitationValidator, InvitationListValidator]
    }
  }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
