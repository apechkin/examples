var expect  = require('chai').expect;
var request = require('supertest');
var app = require('../helpers/app');

describe('Router root', function() {

  before(function(done) {
    app.get('models').sequelize.sync({force: true}).then(function() {
      done();
    });
  });

  describe('GET /', function() {
    it('returns json {\'status\':\'OK\'}', function() {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          res.body.status = res.body.status.toUpperCase();
        })
        .expect(200, {'status': 'OK'});
    });
  });

  describe('GET /foo/bar', function() {
    it('returns status 404', function() {
      request(app)
        .get('/foo/bar')
        .expect(404);
    });
  });

});
