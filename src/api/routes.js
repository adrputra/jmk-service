const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/user/register',
    options: {
      auth: { mode: 'optional' },
      handler: handler.addUserHandler
    }
  },
  {
    method: 'POST',
    path: '/user/login',
    options: {
      auth: { mode: 'try' },
      handler: handler.loginHandler
    }
  }
]

module.exports = { userRoutes }
