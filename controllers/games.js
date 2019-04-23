const Game = require("../models/game");
const Developer = require("../models/developer");
const Character = require("../models/character");

var ObjectID = require('mongodb').ObjectID;

exports.createGame = (req, res, next) => {
  const game = new Game({
    title: req.body.title,
    genre: req.body.genre,
    developer: req.body.developer,
    creator: req.userData.userId
  });

  Developer.findOne({name: req.body.developer})
  .then(foundDeveloper => {
    const validGame = new Game({
      title: req.body.title,
      genre: req.body.genre,
      developer: foundDeveloper._id,
      creator: req.userData.userId
    });
    validGame
    .save()
    .then(createdGame => {
      res.status(201).json({
        message: "Game added successfully",
        game:{
          ...createdGame,
          id: createdGame._id
        }
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a Game failed!"
      });
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a Game failed!"
    });
  });
};


exports.updateGame = (req, res, next) => {
  Developer.findOne({name: req.body.developer})
  .then( foundDeveloper => {
    const game = new Game({
      _id: req.body.id,
      title: req.body.title,
      genre: req.body.genre,
      developer: foundDeveloper._id,
      creator: req.userData.userId
    });
    Game.updateOne({ _id: req.params.id, creator: req.userData.userId}, game)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update Game!"
      });
    })
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update Game!"
    });
  });
};

exports.getGames = (req, res, next) => {
  const gamePageSize = +req.query.pagesize;
  const currentGamePage = +req.query.page;
  const gameQuery = Game.find();
  let fetchedGames;
  if (gamePageSize && currentGamePage) {
    gameQuery.skip(gamePageSize * (currentGamePage - 1)).limit(gamePageSize);
  }
  gameQuery
    .populate('developer', 'name')
    .then(documents => {
      fetchedGames = documents;
      return Game.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Games fetched successfully!",
        games: fetchedGames,
        maxGames: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching games failed!"
      });
    });
};

exports.getGame = (req, res, next) => {
  Game.findById(req.params.id)
    .populate('developer', 'name')
    .then(game => {
      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404).json({ message: "Game not found!" });
      }
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching game failed!"
    });
  });
};

exports.deleteGame = (req, res, next) => {
  Character.remove({game: req.params.id })
  .then( removedCharacters => {
    console.log(removedCharacters);
    Game.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Deleting game(s) failed!"
      });
    });
};

