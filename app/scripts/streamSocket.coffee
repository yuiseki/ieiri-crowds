config = require "config"

redis = require "redis"
redisCli = redis.createClient()

twitterApi = require "ntwitter"
twitter = new twitterApi
    consumer_key: config.twitter.consumerKey
    consumer_secret: config.twitter.consumerSecret
    access_token_key: config.twitter.testAccessTokenKey
    access_token_secret: config.twitter.testAccessTokenSecret


process = (data) ->
    console.log data.user.name, data.text
    redisCli.publish "twitter", JSON.stringify data


twitter.stream "statuses/filter", {"track":"渋谷"}, (stream) ->
    stream.on 'data', process
    stream.on 'error', (data) ->
        console.log "error", data
