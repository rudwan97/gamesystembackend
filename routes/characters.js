const express = require("express");

const CharacterController = require("../controllers/characters");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, CharacterController.createCharacter);
router.put("/:id", checkAuth, CharacterController.updateCharacter);
router.get("", CharacterController.getCharacters);
router.get("/:id", CharacterController.getCharacter);
router.delete("/:id", checkAuth, CharacterController.deleteCharacter);

module.exports = router;
