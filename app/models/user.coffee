mongoose = require "mongoose"
{TwitterClient} = require "../twitterClient"
Schema = mongoose.Schema
userSchema = new Schema
    provider: String
    uid: String
    name: String
    displayName: String
    originalDisplayName: String
    twitterToken: String
    twitterTokenSecret: String
    task:
        over_20: String
        change_name: String
        change_icon: String
        auto_rt: String
        auto_tweet: String
    created: Date
    updated: Date
userSchema.pre "save", (next) ->
    if @isNew
        @created = new Date()
    @updated = new Date()
    next()

userSchema.set "toJSON",
    transform: (doc, ret, options)->
        return {
            name: ret.name
            displayName: ret.displayName
            ieiriIcon: "/icons/ieiri/#{ret.name.slice(0,2)}/#{ret.name}.png"
        }


# Static methods
userSchema.statics.loginTwitter = (token, tokenSecret, profile, done) ->
    @findOne {uid: profile.id} , (err, user) =>
        if user?
            console.log "loginTwitter exists", user.name
            user.displayName = profile.displayName
            user.twitterToken = token
            user.twitterTokenSecret = tokenSecret
            user.save (err)->
                if err
                    done err
                else
                    done null, user
        else
            console.log "loginTwitter create", profile.username
            User = @model "User"
            user = new User()
            user.provider = "twitter"
            user.uid = profile.id
            user.name = profile.username
            user.displayName = profile.displayName
            user.originalDisplayName = profile.displayName
            user.twitterToken = token
            user.twitterTokenSecret = tokenSecret
            user.save (err)->
                if err
                    done err
                else
                    # アイコンの保存と生成が完了したらログイン完了とする
                    client = new TwitterClient token, tokenSecret
                    client.createIeiriIcon user.name, (error)->
                        done null, user

userSchema.statics.forEach = () ->
userSchema.statics.getAutoTweet = (proc) ->
    console.log "getAutoTweet"
    stream = @model("User").find({task:{auto_twitter:"on"}}).stream()
    stream.on "error", (err)->
        console.log err
    stream.on "data", (doc)->
        console.log "on data"
        proc doc

# MapReduce
userSchema.statics.execByAutoTweet = (o, done) ->
    @model("User").collection.mapReduce o, {task:{"auto_tweet":"on"}}, done
userSchema.statics.execByAutoRT = (o, done) ->
    @model("User").collection.mapReduce o, {task:{"auto_rt":"on"}}, done


# Instance methods
userSchema.methods.updateTwitter = (req, done) ->
    # ユーザーの設定をモデルに保存
    delete req.body._csrf
    console.log req.body
    #@task = req.body
    @task.over_20 = req.body.over_20
    @task.auto_tweet = req.body.auto_tweet
    @task.auto_rt = req.body.auto_rt
    @save (err) =>
        console.log err
        # すぐすべき処理を実行
        client = new TwitterClient @twitterToken, @twitterTokenSecret
        if req.body.change_icon == "on"
            client.changeIconIeiri @displayName, () =>
                if req.body.change_name == "on"
                    client.changeNameIeiri @name, ()->
                        done()
                else
                    done()
        else
            done()
exports.userSchema = userSchema
User = mongoose.model "User", userSchema
exports.User = User
