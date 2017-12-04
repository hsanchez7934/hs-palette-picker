const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../server.js');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile.js')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

});

describe('API Routes', () => {

});
