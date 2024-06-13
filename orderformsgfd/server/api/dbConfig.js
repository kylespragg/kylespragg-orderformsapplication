const knex = require('knex'); //requires functionality of knex

const config = require('../knexfile'); //requires development

const db = knex(config.development); // we are using only development

module.exports = db;