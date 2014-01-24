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

# Static methods
userSchema.statics.loginTwitter = (token, tokenSecret, profile, done) ->
    @findOne {uid: profile.id} , (err, user) ->
        if user?
            user.displayName = profile.displayName
            user.twitterToken = token
            user.twitterTokenSecret = tokenSecret
            user.save (err)->
                if err
                    done err
                else
                    done null, user
        else
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

# MapReduce
userSchema.statics.execByAutoTweet = (o, done) ->
    @model("User").collection.mapReduce o, {task:{"auto_tweet":"on"}}, done
userSchema.statics.execByAutoRT = (o, done) ->
    @model("User").collection.mapReduce o, {task:{"auto_rt":"on"}}, done


# Instance methods
userSchema.methods.updateTwitter = (req, done) ->
    # ユーザーの設定をモデルに保存
    @task = req.body
    @save (err) =>
        # すぐすべき処理を実行
        client = new TwitterClient @twitterToken, @twitterTokenSecret
        if req.body.change_icon == "on"
            client.changeIconIeiri @name, ()->
                done()
        else
            done()
exports.userSchema = userSchema
User = mongoose.model "User", userSchema
exports.User = User
