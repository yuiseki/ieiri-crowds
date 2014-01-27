
config = require "config"
mongoose = require "mongoose"
mongoose.connect "mongodb://#{config.mongodb.host}/#{config.mongodb.db}"
{User} = require "../models/user"

User.find {}, (err, doc)->
    console.log doc



