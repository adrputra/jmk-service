const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.postUserHandler
  }
]

module.exports = { userRoutes }
