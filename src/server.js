require('dotenv').config()

const Hapi = require('@hapi/hapi')
const cookie = require('@hapi/cookie')
const { UserPlugin } = require('./api')
const { UserService } = require('./services/database/UserService')
const { UserValidator } = require('./validator')

const init = async () => {
  const userService = new UserService()
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
      ttl: 60 * 60 * 1000,
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
  }
  ])

  // server.auth.strategy('login', 'cookie', {
  //   cookie: {
  //     name: 'session',
  //     password: 'kemayoran20231234567890',
  //     isSecure: false
  //   },
  //   redirectTo: '/login'
  //   // validateFunc: async (request, session) => {

  //   // }
  // })

  // server.auth.default('login')

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
