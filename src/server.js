require('dotenv').config()

const Hapi = require('@hapi/hapi')
const cookie = require('@hapi/cookie')
const { UserPlugin, InvitationPlugin } = require('./api')
const { UserService } = require('./services/database/UserService')
const { InvitationService } = require('./services/database/InvitationService')
const { UserValidator, InvitationValidator } = require('./validator')

const init = async () => {
  const userService = new UserService()
  const invitationService = new InvitationService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register(cookie)

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'session',
      password: 'super-secure-cookie-pass-at-least-32chars',
      isSecure: false, // In Prod should be True.
      ttl: 12 * 60 * 60 * 1000,
      isSameSite: 'Lax',
      path: '/'
    },
    redirectTo: false,
    keepAlive: true
  })
  server.auth.default('session')

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
      validator: InvitationValidator
    }
  }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
