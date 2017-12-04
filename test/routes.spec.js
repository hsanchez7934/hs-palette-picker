const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile.js')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);
// before()

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it(`should return 404 error for nonexistent route`, () => {
    return chai.request(server)
    .get('/nonexistentroute')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(error => {
      throw error;
    });
  })

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    })
  })

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  })

  it(`should fetch projects`, () => {
    return chai.request(server)
    .get(`/api/v1/projects`)
    .then(response => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(3);
      response.body[0].should.have.property('name');
      response.body[0].should.have.property('id');
      response.body[0].name.should.equal('Project 2');
      response.body[0].id.should.equal(1);
    })
    .catch(error => {
      throw error;
    })
  });

  it(`should fetch color palette from targeted project`, ()=> {
    return chai.request(server)
    .get(`/api/v1/projects/2/palettes`)
    .then(response => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].should.have.property('id');
      response.body[0].should.have.property('project_id');
      response.body[0].should.have.property('color1');
      response.body[0].should.have.property('color2');
      response.body[0].should.have.property('color3');
      response.body[0].should.have.property('color4');
      response.body[0].should.have.property('color5');

      response.body[0].name.should.equal('Mountains');
      response.body[0].id.should.equal(6);
      response.body[0].project_id.should.equal(2);
      response.body[0].color1.should.equal('#545F66');
      response.body[0].color2.should.equal('#829399');
      response.body[0].color3.should.equal('#D0F4EA');
      response.body[0].color4.should.equal('#E8FCC2');
      response.body[0].color5.should.equal('#B1CC74');
    })
  });

  it(`should be able to post project to database`, () => {
    
  });
});
