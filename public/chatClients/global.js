const socket = io()

$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = $( "#message" ).val()
	console.log(message)
	socket.emit("chat message", message)
	$( "#message" ).val("")
})

socket.on("chat message", (msg) => {
	$( "#chat-window" ).append($("<li>").text(msg))
})