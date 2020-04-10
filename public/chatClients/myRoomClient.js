const socket = io()
socket.emit('join', roomOwner);
console.log(roomOwner);
$( "#message-form" ).submit( (e) => {
	e.preventDefault()
	const message = `${chatUser}: ${$( "#message" ).val()}`
    console.log('sending event from client')
	socket.emit("chat message", message, roomOwner)
	$( "#message" ).val("")
})

socket.on("chat message", (msg) => {
    console.log('resolve event on server');
	$( "#chat-window" ).append($("<li>").text(msg))
})