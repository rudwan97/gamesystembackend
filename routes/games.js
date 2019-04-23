const express = require("express");

const GameController = require("../controllers/games");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, GameController.createGame);
router.put("/:id", checkAuth, GameController.updateGame);
router.get("", GameController.getGames);
router.get("/:id", GameController.getGame);
router.delete("/:id", checkAuth, GameController.deleteGame);


module.exports = router;
