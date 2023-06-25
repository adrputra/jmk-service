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
    path: '/invitation/list',
    options: {
      auth: { mode: 'required' },
      handler: handler.getInvitationListHandler
    }
  },
  {
    method: 'POST',
    path: '/invitation/add',
    options: {
      auth: { mode: 'required' },
      handler: handler.addInvitationHandler
    }
  }
]

module.exports = { invitationRoutes }
