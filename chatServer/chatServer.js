let server = null

const initialize = (s) => {
	server = s
}
const io = require("socket.io")(server)

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(msg)
    io.emit("chat message", msg)
  })
})

module.exports = initialize