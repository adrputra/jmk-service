const { UserHandler, InvitationHandler } = require('./handler')
const { userRoutes, invitationRoutes } = require('./routes')

const UserPlugin = {
  name: 'user',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandler = new UserHandler(service, validator)
    server.route(userRoutes(userHandler))
  }
}

const InvitationPlugin = {
  name: 'invitation',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const invitationHandler = new InvitationHandler(service, validator)
    server.route(invitationRoutes(invitationHandler))
  }
}

module.exports = { UserPlugin, InvitationPlugin }
