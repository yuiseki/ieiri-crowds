express = require "express"

RedisStore = require("connect-redis")(express)

passport = require "passport"
TwitterStrategy = require("passport-twitter").Strategy

mongoose = require "mongoose"
mongoose.connect "mongodb://localhost/ieiri_crowds_test"
{User} = require "./models/user"

consumerKey = "aiuceLsQSPnEL8UmKWE4A"
consumerSecret = "rZQ3GKvwrguTgc3y6z7XJglToJdiPynno59EdzHCw"
passport.serializeUser (user, done) ->
    done null, user.uid
passport.deserializeUser (uid, done) ->
    User.findOne {uid: uid}, (err, user) ->
        done err, user
passport.use new TwitterStrategy
    consumerKey: consumerKey
    consumerSecret: consumerSecret
    callbackURL: "http://localhost:3000/auth/twitter/callback"
    , (token, tokenSecret, profile, done) ->
        User.loginTwitter token, tokenSecret, profile, done

app = express()
app.configure ->
    app.set "views", __dirname + '/views'
    app.set "view engine", "jade"
    app.use "/static", express.static 'static'
    app.use express.logger "dev"
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use express.cookieParser("secret", "hogehoge")
    app.use express.session
        secret:"hogehoge"
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
        store: new RedisStore({db: 1, prefix: "ieiri-sessions:"})
    app.use passport.initialize()
    app.use passport.session()

app.get "/auth/twitter",
    passport.authenticate "twitter"
app.get "/auth/twitter/callback",
    passport.authenticate "twitter",
        successRedirect: "/top",
        failureRedirect: "/"


app.get "/top", (req, res) ->
    if not req.user?
        res.redirect "/"
    else
        res.send "top"

app.get "/user", (req, res) ->
    if not req.user?
        res.redirect "/auth/twitter"
    else
        res.send req.user

app.get "/join_ieiri", (req, res) ->
    if not req.user?
        res.redirect "/auth/twitter"
    else
        res.render "ieiri", {user:req.user}

# TODO CSRF対策
app.post "/join_ieiri", (req, res) ->
    console.log req.body
    if req.body.over_20 == "on"
        req.user.updateTwitter req, ()->
            res.send "done"
    else
        res.send "fail"

exports = app
if not module.parent
    app.listen 3000
    console.log "app start 3000"
