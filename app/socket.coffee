app = module.parent.exports
io = app.get "io"

redis = require "redis"
redisCli = redis.createClient()
redisCli.subscribe "twitter"
redisCli.on "message", (channel, data) ->
    d = JSON.parse data
    io.sockets.emit "message", {value:d}

io.sockets.on 'connection', (socket) ->
    socket.on 'message', (data) ->
        addr = socket.handshake.address.address
        console.log "message", addr, data
        return

