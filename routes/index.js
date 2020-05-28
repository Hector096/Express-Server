var express = require("express"),
    router = express.Router();


var { isLoggedIn, forwardAuthenticated } = require("../config/auth");

// Get Landing Page
router.get("/", forwardAuthenticated, function(request, response) {
    response.render("index");
});


module.exports = router;