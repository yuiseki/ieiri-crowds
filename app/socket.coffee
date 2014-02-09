app = module.parent.exports
io = app.get "io"

io.sockets.on 'connection', (socket) ->
    socket.on 'message', (data) ->
        addr = socket.handshake.address.address
        console.log "message", addr, data
        return

