/* eslint-disable no-unused-vars */
'use strict'

let dbm
let type
let seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db, callback) {
  db.createTable('session_auth', {
    token: {
      type: 'string',
      notNull: true
    },
    session_id: {
      type: 'string',
      notNull: true,
      length: 36
    },
    user_id: {
      type: 'string',
      notNull: true,
      length: 8
    },
    created_at: {
      type: 'datetime'
    },
    expired_at: {
      type: 'datetime'
    }
  }, function (err) {
    if (err) return callback(err)
    return callback()
  })
}

exports.down = function (db, callback) {
  db.dropTable('session_auth', callback)
}

exports._meta = {
  version: 1
}
