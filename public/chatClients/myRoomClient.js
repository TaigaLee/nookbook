const socket = io("/" + roomOwner)


$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = `${chatUser}: ${$( "#message" ).val()}`
	socket.emit("room message", message)
	$( "#message" ).val("")
})

socket.on("room message", (msg) => {
	$( "#chat-window" ).append($("<li>").text(msg))
})