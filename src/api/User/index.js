const { UserHandler } = require('./handler')
const { userRoutes } = require('./routes')

const UserPlugin = {
  name: 'user',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandler = new UserHandler(service, validator)
    server.route(userRoutes(userHandler))
  },
  loginHandler: async (request, h) => {
    const userHandler = new UserHandler(request.server.services(), request.server.validators()) // Use the appropriate methods to access services and validators from the server instance
    return userHandler.loginHandler(request, h)
  }
}

module.exports = { UserPlugin }
