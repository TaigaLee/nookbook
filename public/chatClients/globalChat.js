const socket = io()

$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = `${chatUser}: ${$( "#message" ).val()}`
	socket.emit("chat message", message)
	$( "#message" ).val("")
})

socket.on("chat message", (msg) => {
	$( "#chat-window" ).append($("<li>").text(msg))
})