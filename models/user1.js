var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
var UserSchema = new mongoose.Schema({
    username: String,
    googleId: String

});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User1", UserSchema);