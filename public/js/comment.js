const socket = io();

    // these variables come from backend
    const currentUserId = "<%= currentUser._id %>"; 
    const receiverId = "<%= receiver._id %>"; 

    // join room (sorted so both users get same roomId)
    const roomId = [currentUserId, receiverId].sort().join("_");
    socket.emit("join room", roomId);

    const input = document.getElementById("input");
    const btn = document.getElementById("btn");
    const chat = document.getElementById("chat");

    // send message
    btn.addEventListener("click", () => {
      socket.emit("chat message", {
        text: input.value,
        sender: currentUserId,
        receiver: receiverId
      });
      input.value = "";
    });

    // receive message
    socket.on("chat message", (msg) => {
      const p = document.createElement("p");
      p.textContent = msg.sender === currentUserId ? "Me: " + msg.text : "Them: " + msg.text;
      chat.appendChild(p);
    });