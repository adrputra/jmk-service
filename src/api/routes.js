const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/user/register',
    handler: handler.postUserHandler
  },
  {
    method: 'POST',
    path: '/user/login',
    handler: handler.loginHandler
  }
]

module.exports = { userRoutes }
