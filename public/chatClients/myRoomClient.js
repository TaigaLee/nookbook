const socket = io()
socket.emit('join', roomOwner);


$("#message-form").submit((e) => {
  e.preventDefault()
  const message = `${chatUser}: ${$( "#message" ).val()}`
  socket.emit("chat message", message, roomOwner)
  $("#message").val("")
})

socket.on("chat message", (msg) => {
  $("#chat-window").prepend($("<li>").text(msg))
})