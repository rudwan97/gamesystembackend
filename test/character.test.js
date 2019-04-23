const request = require('supertest');
const server = require('../server');
const app = require('../app');

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/user');
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
  'developer': developerRequest.name
};
const invalidId = '1';
const characterRequest = {
  'name': 'Character',
  'game': gameRequest.title
};
const invalidCharacterRequest = {
  'name1': 'Character',
  'game': gameRequest.title
};

describe('Character Controller', () => {
  it('should return a character when posting valid character', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .expect((res) => {
                        expect(res.body.message).to.equal('Character added successfully');
                        expect(res.body.character._doc.name).to.equal(characterRequest.name);
                      })
                      .expect(201, done)
                    })
                })
            })
        })
    })
  });

  it('should return an error when posting invalid character', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(invalidCharacterRequest)
                      .expect((res) => {
                        expect(res.body.message).to.equal('Creating a character failed!');
                      })
                      .expect(500, done)
                    })
                })
            })
        })
    })
  });

  it('should be able to get all characters', (done) => {
    request(app)
    .get('/api/characters')
    .expect((res) => {
      expect(res.body.message).to.equal('Posts fetched successfully!');
    })
    .expect(200, done)
  });

  it('should be able to get a specific character via valid ID', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                          .then((foundCharacter) => {
                            request(app)
                            .get('/api/characters/'+ foundCharacter._id)
                            .expect((res) => {
                              expect(res.body._id).to.equal(foundCharacter._id.toString());
                              expect(res.body.name).to.equal(foundCharacter.name);
                            })
                            .expect(200, done)
                          })
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to get non-existing character Id', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                          .then((foundCharacter) => {
                            request(app)
                            .get('/api/characters/'+ invalidId)
                            .expect((res) => {
                              expect(res.body.message).to.equal('Fetching character failed!');
                            })
                            .expect(500, done);
                          })
                      })
                    })
                })
            })
        })
    })
  });

  it('should be able to update a specific character via valid ID', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                          .then((foundCharacter) => {
                            const updatedCharacterRequest = {
                              'id': foundCharacter._id,
                              'name': 'New Character name',
                              'game': gameRequest.title
                            }
                            request(app)
                            .put('/api/characters/'+ foundCharacter._id)
                            .set('Authorization', 'Bearer ' + token)
                            .send(updatedCharacterRequest)
                            .expect((res) => {
                              expect(res.body.message).to.equal('Update successful!');
                            })
                            .expect(200, done);
                          })
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to update character with non-existing ID', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                          .then((foundCharacter) => {
                            const updatedCharacterRequest = {
                              'id': foundCharacter._id,
                              'name': 'New Character name',
                              'game': gameRequest.title
                            }
                            request(app)
                            .put('/api/characters/'+ invalidId)
                            .set('Authorization', 'Bearer ' + token)
                            .send(updatedCharacterRequest)
                            .expect((res) => {
                              expect(res.body.message).to.equal('Couldn\'t update character!');
                            })
                            .expect(500, done);
                          })
                      })
                    })
                })
            })
        })
    })
  });

  it('should be able to delete character with valid Id', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                        .then((foundCharacter) => {
                          request(app)
                          .delete('/api/characters/'+foundCharacter._id)
                          .set('Authorization', 'Bearer ' + token)
                          .expect((res) => {
                            expect(res.body.message).to.equal('Deletion successful!');
                          })
                          .expect(200, done);
                        })
                      })
                    })
                })
            })
        })
    })
  });

  it('should receive an error when trying to delete character with invalid Id', (done) => {
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
                    .then(() => {
                      request(app)
                      .post('/api/characters')
                      .set('Authorization', 'Bearer ' + token)
                      .send(characterRequest)
                      .then(() => {
                        Character.findOne({name: characterRequest.name})
                        .then((foundCharacter) => {
                          request(app)
                          .delete('/api/characters/'+invalidId)
                          .set('Authorization', 'Bearer ' + token)
                          .expect((res) => {
                            expect(res.body.message).to.equal('Deleting character(s) failed!');
                          })
                          .expect(500, done);
                        })
                      })
                    })
                })
            })
        })
    })
  });

});
