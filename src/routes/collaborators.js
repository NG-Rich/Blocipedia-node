const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const collabController = require("../controllers/collabController");

router.get("/wikis/:id/collaborators",
  helper.ensureAuthenticated,
  collabController.show);
router.post("/wikis/:id/collaborators/add", collabController.add);
router.post("/wikis/:id/collaborators/remove", collabController.remove);


module.exports = router;
