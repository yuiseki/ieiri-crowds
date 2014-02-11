redis = require "redis"
redisCli = redis.createClient()

twitterApi = require "ntwitter"
twitter = new twitterApi
    consumer_key: "aiuceLsQSPnEL8UmKWE4A"
    consumer_secret: "rZQ3GKvwrguTgc3y6z7XJglToJdiPynno59EdzHCw"
    access_token_key: "2158391-ueIGEk37I49K5GFNZpd69S92FokSRFXvBG3txxx5G0"
    access_token_secret: "zthyVeYFw8DYj7A2c0uvSoMY9Umucuuj0fAAr7jkvfmei"


process = (data) ->
    #console.log data.user.name, data.text
    redisCli.publish "twitter", JSON.stringify data


twitter.stream "statuses/filter", {"track":"渋谷"}, (stream) ->
    stream.on 'data', process
    stream.on 'error', (data) ->
        console.log "error", data
