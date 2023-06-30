// const fs = require('fs')
// const Path = require('path')
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const cookie = require('@hapi/cookie')
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
    // tls: {
    //   key: fs.readFileSync(Path.resolve(__dirname, 'ssl/private.key')),
    //   cert: fs.readFileSync(Path.resolve(__dirname, 'ssl/certificate.crt'))
    // }
  })

  await server.register(cookie)

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'session',
      password: 'look-at-the-stars-look-how-they-shine-for-you',
      isSecure: true, // In Prod should be True.
      // ttl: 5 * 1000,
      ttl: 12 * 60 * 60 * 1000,
      isSameSite: 'Lax',
      isHttpOnly: true,
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
      validator: [InvitationValidator, InvitationListValidator]
    }
  }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
