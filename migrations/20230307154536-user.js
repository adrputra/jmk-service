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
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: 'string',
      notNull: true,
      length: 8
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
      type: 'date'
    },
    updated_at: {
      type: 'date'
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
