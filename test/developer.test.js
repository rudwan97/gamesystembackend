const request = require('supertest');
const server = require('../server');
const app = require('../app');

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/user');
const Developer = require('../models/developer');

const PORT = process.env.PORT || 3000;
const BACKEND_URL = `http://localhost:${PORT}`;
console.log(PORT);

chai.should();
chai.use(chaiHttp);

describe('Developer Controller', () => {

  it('should return developer when posting valid developer', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
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
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              console.log(loginResponse.body);
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .expect((res) => {
                  console.log(res.body);
                  expect(res.body.message).to.equal('Developer added successfully');
                  expect(res.body.developer._doc.name).to.equal(developerRequest.name);
                  expect(res.body.developer._doc.city).to.equal(developerRequest.city);
                  expect(res.body.developer._doc.description).to.equal(developerRequest.description);
                })
                .expect(201, done);
            })
        })
    })
  });

  it('should return error when posting invalid developer', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const invalidDeveloperRequest = {
      'name1': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
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
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              console.log(loginResponse.body);
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(invalidDeveloperRequest)
                .expect((res) => {
                  expect(res.body.message).to.equal('Creating a developer failed!');
                })
                .expect(500, done);
            })
        })
    })
  });
  it('should be able to get all developers via get request ', (done) => {
    request(app)
      .get('/api/developers')
      .expect((res) => {
        expect(res.body.message).to.equal('Developers fetched successfully!');
      })
      .expect(200, done);
  });

  it('should be able to get specific developer via an ID', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
    };
    const developerRequest2 = {
      'name': 'Developer2',
      'city': 'Tilburg',
      'description': 'This is a developer description.',
    }
    request(app)
    .post('/api/user/signup')
    .send(userRequest)
    .then(() => {
      User.findOne({email: userRequest.email})
        .then((user) => {
          const userId = user._id;
          request(app)
            .post('/api/user/login')
            .send(userRequest)
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .then(() => {
                  Developer.findOne({name: developerRequest.name})
                    .then((developer)=> {
                      const developerId = developer._id;
                      request(app)
                        .post('/api/developers')
                        .set('Authorization', 'Bearer ' + token)
                        .send(developerRequest2)
                        .then(() => {
                          request(app)
                          .get('/api/developers/' + developerId)
                          .expect((res) =>{
                            console.log(res.body);
                            expect(res.body._id).to.equal(developerId.toString());
                            expect(res.body.name).to.equal(developerRequest.name);
                            expect(res.body.description).to.equal(developerRequest.description);
                            expect(res.body.city).to.equal(developerRequest.city);
                            expect(res.body.creator).to.equal(user._id.toString());
                          })
                          .expect(200, done);
                        })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to get developer that does not exist', (done) => {
    const nonExistingId = '1';
    request(app)
    .get('/api/developers/'+ nonExistingId)
    .expect((res) => {
      expect(res.body.message).to.equal('Fetching developer failed!');
    })
    .expect(500, done);
  });

  it('should be able to update developer with correct request ', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
    };
    request(app)
    .post('/api/user/signup')
    .send(userRequest)
    .then(() => {
      User.findOne({email: userRequest.email})
        .then((user) => {
          const userId = user._id;
          request(app)
            .post('/api/user/login')
            .send(userRequest)
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .then(() => {
                  Developer.findOne({name: developerRequest.name})
                    .then((developer)=> {
                      const developerId = developer._id;
                      request(app)
                      const developerUpdateRequest = {
                        'id': developerId,
                        'name': 'New_Developer',
                        'city': 'Breda',
                        'description': 'This is a new developer description.'}
                        request(app)
                          .put('/api/developers/' + developerId)
                          .set('Authorization', 'Bearer ' + token)
                          .send(developerUpdateRequest)
                          .expect((res) => {
                            expect(res.body.message).to.equal('Update successful!');
                          })
                          .expect(200, done);
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to update a developer that does not exist', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
    };
    const nonExistingId = '1';
    request(app)
    .post('/api/user/signup')
    .send(userRequest)
    .then(() => {
      User.findOne({email: userRequest.email})
        .then((user) => {
          const userId = user._id;
          request(app)
            .post('/api/user/login')
            .send(userRequest)
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .then(() => {
                  Developer.findOne({name: developerRequest.name})
                    .then((developer)=> {
                      const developerId = developer._id;
                      request(app)
                      const developerUpdateRequest = {
                        'id': nonExistingId,
                        'name': 'New_Developer',
                        'city': 'Breda',
                        'description': 'This is a new developer description.'}
                        request(app)
                          .put('/api/developers/' + nonExistingId)
                          .set('Authorization', 'Bearer ' + token)
                          .send(developerUpdateRequest)
                          .expect((res) => {
                            expect(res.body.message).to.equal('Couldn\'t update game!');
                          })
                          .expect(500, done);
                    })
                })
            })
        })
    })
  });

  it('should be able to remove developer with correct id (and account)', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
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
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              console.log(loginResponse.body);
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .then(() => {
                  Developer.findOne({name: developerRequest.name})
                    .then((developer) =>{
                      request(app)
                        .delete('/api/developers/' + developer._id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect((res) => {
                          expect(res.body.message).to.equal('Deletion of developer successful!');
                        })
                        .expect(200, done);
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to delete non-existing developer', (done) => {
    const userRequest = {
      'email': 'npmtest@testmail.com',
      'password': 'test12345'
    };
    const developerRequest = {
      'name': 'Developer',
      'city': 'Breda',
      'description': 'This is a developer description.',
    };
    const nonExistingId = '1';
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
            .then((loginResponse) => {
              const token = loginResponse.body.token;
              console.log(loginResponse.body);
              request(app)
                .post('/api/developers')
                .set('Authorization', 'Bearer ' + token)
                .send(developerRequest)
                .then(() => {
                  Developer.findOne({name: developerRequest.name})
                    .then((developer) =>{
                      request(app)
                        .delete('/api/developers/' + nonExistingId)
                        .set('Authorization', 'Bearer ' + token)
                        .expect((res) => {
                          expect(res.body.message).to.equal('Deleting developer failed!');
                        })
                        .expect(500, done);
                    })
                })
            })
        })
    })
  });
});
