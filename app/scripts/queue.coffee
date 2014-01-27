
config = require "config"
kue = require "kue"
jobs = kue.createQueue()

{TwitterClient} = require "../twitterClient"

concurrency = 5

jobs.process 'autoTweet', concurrency, (job, done) ->
    console.log "job autoTweet exec"
    console.log job.data.key, job.data.secret
    client = new TwitterClient job.data.key, job.data.secret
    client.autoTweet(done)

jobs.process 'autoRT', concurrency, (job, done) ->
    client = new TwitterClient job.data.key, job.data.secret
    client.autoRT(job.data.status_id, done)

console.log "listen 3030"
kue.app.listen 3030

# つかいかた
###
job = jobs.create 'autoTweet',
    key: api_key
    secret: api_secret
job.on "complete", ->
    console.log "complete"
job.save()
###
