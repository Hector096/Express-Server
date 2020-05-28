var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: "Personal"
    },
    duedate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "New"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    archived: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Todo", todoSchema);