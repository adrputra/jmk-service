const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const { validate } = require('./config/auth')
const { UserPlugin } = require('./api/User')
const { InvitationPlugin } = require('./api/Invitation')
const { UserService } = require('./services/database/UserService')
const { InvitationService } = require('./services/database/InvitationService')
const { RedisClient, RabbitMQ } = require('./config/connection')
const { UserValidator, InvitationValidator, InvitationListValidator } = require('./validator')

const init = async () => {
  const userService = new UserService()
  const invitationService = new InvitationService()
  const redisClient = new RedisClient()
  const rabbitMQ = new RabbitMQ()
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

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET, // Use a proper secret key from your environment
    verify: { aud: false, iss: 'eventarry', sub: 'auth', exp: true, maxAgeSec: 14400 }, // Optional: Audience verification
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
      service: [invitationService, redisClient, rabbitMQ],
      validator: [InvitationValidator, InvitationListValidator]
    }
  }
  ])

  // await redisClient.connect()
  // await rabbitMQ.connect()

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
