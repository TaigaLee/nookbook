const socket = io()

$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = `${chatUser}: ${$( "#message" ).val()}`
	socket.emit("chat global", message)
	$( "#message" ).val("")
})

socket.on("chat global", (msg) => {
	$( "#chat-window" ).append($("<li>").text(msg))
})