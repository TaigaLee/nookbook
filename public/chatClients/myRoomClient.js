const socket = io("/" + roomOwner)

// socket.on("connection", (socket) => {
// 	socket.emit("Join Room", roomOwner)	
// 	console.log("Joined")
// })

$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = `${chatUser}: ${$( "#message" ).val()}`
	socket.emit("room message", message)
	$( "#message" ).val("")
})

socket.on("room message", (msg) => {
	$( "#chat-window" ).append($("<li>").text(msg))
})