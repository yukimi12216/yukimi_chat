(function () {
  "use strict";

  const path = location.pathname.split("/");
  const roomId = path[path.length - 1];

  const socket = new WebSocket(`ws://${location.host}/index/${roomId}`);

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    const messages = document.getElementById("messages");
    messages.innerHTML +=
      "<tr>" +
      `<td>[${new Date(data.userMessage.createdAt).toDateString()}]</td>` +
      `<td>${data.user.name}さん(ID:${data.user.employee_id})-></td>` +
      `<td>${data.userMessage.message}</td>` +
      "</tr>";
  });

  const submitButton = document.getElementById("submit");
  const messageInput = document.getElementById("message");
  submitButton.addEventListener("click", function () {
    const message = messageInput.value;
    if (message.length > 0) {
      socket.send(message);
      messageInput.value = "";
    }
  });
})();
