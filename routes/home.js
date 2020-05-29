var express = require("express"),
    router = express.Router();

var { isLoggedIn, forwardAuthenticated } = require("../config/auth");
var User = require("../models/user");
var Todo = require("../models/todo");

var todos_list = [];

// Get Homepage
router.get("/", isLoggedIn, function(request, response) {
    User.findById(request.user._id).populate("todos").exec(function(error, user) {
        if (error) {
            response.render("home", { todo_list: todos_list });
            return console.log("\n" + error);
        }
        todos_list = user.todos;
        response.render("home", { todo_list: user.todos });
    });
});

router.post("/add-todo", isLoggedIn, function(request, response) {
    var { title, label, duedate, status } = request.body;
    var creator = request.user._id;
    var errors = [];
    if (!title) {
        response.redirect("/home");
        return;
    }
    if (!duedate) {
        errors.push({ msg: "Please select any due date." });
        response.render("home", { errors, title, label, duedate, status, todo_list: todos_list });
        return;
    }
    var newTodo = new Todo({ title, label, duedate, status, creator });
    newTodo.save(function(error, todo) {
        if (error) {
            response.redirect("/home");
            return console.log("\n" + error);
        }
        User.findById(request.user._id).populate("todos").exec(function(error, user) {
            user.todos.push(todo);
            user.save(function(error, updatedUser) {
                if (error) {
                    response.redirect("/home");
                    return console.log("\n" + error);
                }
                response.redirect("/home");
            });
        });
    });
});

router.get("/archive-to-do/:id/:value", isLoggedIn, function(request, response) {
    Todo.findById(request.params.id, function(error, foundTodo) {
        if (error) {
            response.redirect("/home");
            return console.log("\n" + error);
        }
        foundTodo.archived = (request.params.value === "true") ? true : false;
        foundTodo.save(function(error, updatedTodo) {
            if (error) {
                response.redirect("/home");
                return console.log("\n" + error);
            }
            response.redirect("/home");
        });
    });
});



module.exports = router;