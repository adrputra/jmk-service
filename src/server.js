// const fs = require('fs')
// const Path = require('path')
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const { validate } = require('./config/auth')
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

  await server.register([Jwt])

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
