const Character = require("../models/character");
const Game = require("../models/game");

exports.createCharacter = (req, res, next) => {
  Game.findOne({title: req.body.game})
  .then( foundGame => {
    const validCharacter = new Character({
      name: req.body.name,
      game: foundGame._id,
      creator: req.userData.userId
    });
    validCharacter
    .save()
    .then(createdCharacter => {
      res.status(201).json({
        message: "Character added successfully",
        character: {
          ...createdCharacter,
          id: createdCharacter._id
        }
      });
    })
    //added
    .catch(err => {
      res.status(500).json({
        message: "Creating a character failed!"
      });
    })
    //^added
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating a character failed!"
      });
    });
};

exports.updateCharacter = (req, res, next) => {
  Game.findOne({title: req.body.game})
  .then( foundGame => {
    const character = new Character({
      _id: req.body.id,
      name: req.body.name,
      game: foundGame._id,
      creator: req.userData.userId
    });
    Character.updateOne({ _id: req.params.id, creator: req.userData.userId }, character)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update character!"
      });
    })
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update character!"
    });
  });
};

exports.getCharacters = (req, res, next) => {
  const characterPageSize = +req.query.pagesize;
  const currentCharacterPage = +req.query.page;
  const characterQuery = Character.find();
  let fetchedCharacters;
  if (characterPageSize && currentCharacterPage) {
    characterQuery.skip(characterPageSize * (currentCharacterPage - 1)).limit(characterPageSize);
  }
  characterQuery
    .populate('game', 'title')
    .then(documents => {
      fetchedCharacters = documents;
      return Character.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        characters: fetchedCharacters,
        maxCharacters: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching characters failed!"
      });
    });
};

exports.getCharacter = (req, res, next) => {
  console.log('Getting character: ' + req.params.id);
  Character.findById(req.params.id)
    .populate('game', 'title')
    .then(character => {
      if (character) {
        res.status(200).json(character);
      } else {
        res.status(404).json({ message: "Character not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching character failed!"
      });
    });
};

exports.deleteCharacter = (req, res, next) => {
  Character.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting character(s) failed!"
      });
    });
};
