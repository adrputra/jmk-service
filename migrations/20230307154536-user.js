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
  db.createTable('user_access', {
    user_id: {
      type: 'string',
      notNull: true,
      length: 8,
      primaryKey: true
    },
    full_name: {
      type: 'string',
      notNull: true,
      length: 50
    },
    short_name: {
      type: 'string',
      notNull: true,
      length: 50
    },
    password: {
      type: 'string',
      notNull: true,
      length: 255
    },
    branch_code: {
      type: 'string',
      notNull: true,
      length: 8
    },
    level_id: {
      type: 'string',
      notNull: true,
      length: 3
    },
    created_at: {
      type: 'datetime'
    },
    updated_at: {
      type: 'datetime'
    }
  }, function (err) {
    if (err) return callback(err)
    return callback()
  })
}
exports.down = function (db, callback) {
  db.dropTable('user_access', callback)
}

exports._meta = {
  version: 1
}
