const miniSocket = io()
miniSocket.emit('join', currentUser);

miniSocket.on("chat message", (msg) => {
  $(".mini-chat").prepend($("<li>").text(msg))
})