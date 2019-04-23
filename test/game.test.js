const request = require('supertest');
const server = require('../server');
const app = require('../app');

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/user');
const Developer = require('../models/developer');
const Game = require('../models/game');
const Character = require('../models/character');

// const PORT = process.env.PORT || 3000;
// const BACKEND_URL = `http://localhost:${PORT}`;
// console.log(PORT);

chai.should();
chai.use(chaiHttp);

const userRequest = {
  'email': 'npmtest@testmail.com',
  'password': 'test12345'
};
const developerRequest = {
  'name': 'Developer',
  'city': 'Breda',
  'description': 'This is a developer description.'
};
const gameRequest = {
  'title': 'Game',
  'genre': 'RPG',
  'developer': developerRequest.name
};
const invalidGameRequest = {
  'title1': 'invalidGame',
  'genre': 'RPG',
  'developer': developerRequest.name,
};
const invalidId = '1';

describe('Game Controller', () => {

  it('should return game when posting game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .expect((res) => {
                      expect(res.body.message).to.equal('Game added successfully');
                      expect(res.body.game._doc.title).to.equal(gameRequest.title);
                      expect(res.body.game._doc.genre).to.equal(gameRequest.genre);
                    })
                    .expect(201, done);

                })
            })
        })
    })
  });

  it('should return an error when posting invalid game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(invalidGameRequest)
                    .expect((res) => {
                      expect(res.body.message).to.equal('Creating a Game failed!');
                    })
                    .expect(500, done);
                })
            })
        })
    })
  });

  it('should be able to get all games via get request ', (done) => {
    request(app)
      .get('/api/games')
      .expect((res) => {
        expect(res.body.message).to.equal('Games fetched successfully!');
      })
      .expect(200, done);
  });

  it('should be able to get specific game via an ID', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        request(app)
                        .get('/api/games/' + foundGame._id)
                        .expect((res)=> {
                          expect(res.body.title).to.equal(gameRequest.title);
                          expect(res.body.genre).to.equal(gameRequest.genre);
                        })
                        .expect(200, done)
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error while trying to get non-existing game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        request(app)
                        .get('/api/games/' + invalidId)
                        .expect((res)=> {
                          expect(res.body.message).to.equal('Fetching game failed!');
                        })
                        .expect(500, done)
                      })
                    })
                })
            })
        })
    })
  });

  it('should be able to delete game via an id', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        request(app)
                        .delete('/api/games/' + foundGame._id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect((res)=> {
                          expect(res.body.message).to.equal('Deletion successful!');
                        })
                        .expect(200, done)
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to delete non-existing game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        request(app)
                        .delete('/api/games/' + invalidId)
                        .set('Authorization', 'Bearer ' + token)
                        .expect((res)=> {
                          expect(res.body.message).to.equal('Deleting game(s) failed!');
                        })
                        .expect(500, done)
                      })
                    })
                })
            })
        })
    })
  });

  it('should be able to update existing game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        const gameUpdatedRequest = {
                          'id': foundGame._id,
                          'title': 'Updated game',
                          'genre': 'Shooter',
                          'developer': developerRequest.name
                        }
                        request(app)
                        .put('/api/games/' + foundGame._id)
                        .set('Authorization', 'Bearer ' + token)
                        .send(gameUpdatedRequest)
                        .expect((res)=> {
                          expect(res.body.message).to.equal('Update successful!');
                        })
                        .expect(200, done)
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to update non-existing game', (done) => {
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
                .then (() => {
                    request(app)
                    .post('/api/games')
                    .set('Authorization', 'Bearer ' + token)
                    .send(gameRequest)
                    .then(()=> {
                      Game.findOne({title: gameRequest.title})
                      .then((foundGame) => {
                        const invalidGameUpdatedRequest = {
                          'id': foundGame._id,
                          'title': 'Updated game',
                          'genre': 'Shooter',
                          'developer': developerRequest.name
                        }
                        request(app)
                        .put('/api/games/' + invalidId)
                        .set('Authorization', 'Bearer ' + token)
                        .send(invalidGameUpdatedRequest)
                        .expect((res)=> {
                          expect(res.body.message).to.equal('Couldn\'t update Game!');
                        })
                        .expect(500, done)
                      })
                    })
                })
            })
        })
    })
  });

});
