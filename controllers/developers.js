const Developer = require("../models/developer");
const Game = require("../models/game");
const Character = require("../models/character");

exports.createDeveloper = (req, res, next) => {
  console.log(req.userData.userId);
  console.log(req.body);
  const developer = new Developer({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    creator: req.userData.userId
  });
  developer
    .save()
    .then(createdDeveloper => {
      res.status(201).json({
        message: "Developer added successfully",
        developer: {
          ...createdDeveloper,
          id: createdDeveloper._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a developer failed!"
      });
    });
};

exports.updateDeveloper = (req, res, next) => {
  const developer = new Developer({
    _id: req.body.id,
    name: req.body.name,
    city: req.body.city,
    description: req.body.description,
    creator: req.userData.userId
  })

  console.log(req.userData);
  Developer.updateOne({ _id: req.params.id, creator: req.userData.userId}, developer)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        console.log(developer);
        console.log(result);
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update game!"
      });
    });
};

exports.getDevelopers = (req, res, next) => {
  const developerPageSize = +req.query.pagesize;
  const currentDeveloperPage = +req.query.page;
  const developerQuery = Developer.find();
  let fetchedDevelopers;
  if (developerPageSize && currentDeveloperPage) {
    developerQuery.skip(developerPageSize * (currentDeveloperPage - 1)).limit(developerPageSize);
  }
  developerQuery
    .then(documents => {
      fetchedDevelopers = documents;
      return Developer.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Developers fetched successfully!",
        developers: fetchedDevelopers,
        maxDevelopers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching developers failed!"
      });
    });
};

exports.getDeveloper = (req, res, next) => {
  console.log('Getting developer!')
  Developer.findById(req.params.id)
    .then(developer => {
      if (developer) {
        res.status(200).json(developer);
      } else {
        res.status(404).json({ message: "Developer not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching developer failed!"
      });
    });
};

exports.deleteDeveloper = (req, res, next) => {
  const developerId = req.params.id;
  Game.find({developer: developerId})
  .then( foundGames => {
    for (var i = 0; i < foundGames.length; i++) {
      Character.remove({game: foundGames[i]._id})
      .then( removedCharacters => {
        console.log(removedCharacters);
        Game.remove({developer: developerId})
        .then( removedGames => {
          console.log(removedGames);
        });
      });
    }
    Developer.deleteOne({_id: developerId})
    .then(removedDeveloper => {
      if(removedDeveloper.n > 0) {
        res.status(200).json({ message: "Deletion of developer successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting developer failed!"
    });
  });
};
