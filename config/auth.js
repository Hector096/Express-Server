module.exports = {
    isLoggedIn: function(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        request.flash("error_msg", "You need to log in first");
        response.redirect("/users/login");
    },
    forwardAuthenticated: function(request, response, next) {
        if (!request.isAuthenticated()) {
            return next();
        }
        response.redirect("/home");
    }
};