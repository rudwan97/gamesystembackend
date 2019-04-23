const express = require("express");

const DeveloperController = require("../controllers/developers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, DeveloperController.createDeveloper);
router.put("/:id", checkAuth, DeveloperController.updateDeveloper);
router.get("", DeveloperController.getDevelopers);
router.get("/:id", DeveloperController.getDeveloper);
router.delete("/:id", checkAuth, DeveloperController.deleteDeveloper);

module.exports = router;
