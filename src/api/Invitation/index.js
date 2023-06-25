const { InvitationHandler } = require('./handler')
const { invitationRoutes } = require('./routes')

const InvitationPlugin = {
  name: 'invitation',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const invitationHandler = new InvitationHandler(service, validator)
    server.route(invitationRoutes(invitationHandler))
  }
}

module.exports = { InvitationPlugin }
