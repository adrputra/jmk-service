const invitationRoutes = (handler) => [
  {
    method: 'POST',
    path: '/invitation',
    options: {
      auth: { mode: 'try' },
      handler: handler.getInvitationHandler
    }
  },
  {
    method: 'POST',
    path: '/invitationlist',
    options: {
      auth: { mode: 'try' },
      handler: handler.getInvitationListHandler
    }
  }
]

module.exports = { invitationRoutes }
