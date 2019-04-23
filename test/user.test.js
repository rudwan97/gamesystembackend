const request = require('supertest');
const app = require('../app');
const server = require('../server');

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/user');

//const PORT = process.env.PORT || 3000;
//const BACKEND_URL = `http://localhost:${PORT}`;

chai.should();
chai.use(chaiHttp);

describe('User Controller', () => {

  it('should return e-mail and hashed password when signing up', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    request(app)
      .post('/api/user/signup')
      .send(userRequest)
      .expect((res) => {
        expect(res.body.message).to.equal('User created!');
        expect(res.body.result.email).to.equal(userRequest.email);
      })
      .expect(201, done);
  });

  it('should return an error if e-mail already exists when trying to sign up', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    request(app)
      .post('/api/user/signup')
      .send(userRequest)
      .then(() => {
        request(app)
          .post('/api/user/signup')
          .send(userRequest)
          .expect((res) => {
            expect(res.body.message).to.equal('Invalid authentication credentials!');
          })
          .expect(500,done);
      })
  });

  it('should be able to login with valid login credentials', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    request(app)
      .post('/api/user/signup')
      .send(userRequest)
      .then(() => {
        User.findOne({email: userRequest.email})
          .then((user) => {
            const userId = user._id;
            console.log(userId);
            request(app)
              .post('/api/user/login')
              .send(userRequest)
              .expect((res) => {
                console.log(res.body.userId);
                expect(res.body.userId).to.equal(userId.toString());
              })
              .expect(200, done);
          })
      })
  });

  it('shouldn\'t be able to login with invalid login credentials', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };

    const wrongUserRequest = {
      'email': 'wrongemail@testmail.com',
      'password': 'test123445'
    }
    request(app)
      .post('/api/user/signup')
      .send(userRequest)
      .then(() => {
          request(app)
            .post('/api/user/login')
            .send(wrongUserRequest)
            .expect((res) => {
              expect(res.body.message).to.equal('Auth failed');
            })
            .expect(401, done);
      })
  })

});
