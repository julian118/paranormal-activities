let joinButton = document.getElementById("join")
let createButton = document.getElementById("create")

const backendUrl = "ws://localhost:8080"

const socket = new WebSocket(
  `${backendUrl}/start_web_socket`,
)

// Joining an existing room
function joinRoom() {
  let nameInput = document.getElementById("name")
  let roomCodeInput = document.getElementById("room-code")

  socket.send(
    JSON.stringify({
      event: "join-room",
      roomCode: roomCodeInput.value,
      name: nameInput.value,
    }),
  )
}

// creating a new room
function createRoom() {
  let nameInput = document.getElementById("name-create")
  socket.send(
    JSON.stringify({
      event: "create-room",
      name: nameInput.value,
    }),
  )
}

// leaving the current room
function leaveRoom() {
  socket.send(
    JSON.stringify({
      event: "leave-room",
    }),
  )
}

socket.onmessage = (message) => {
  const data = JSON.parse(message.data)
  displayData(data)
}

socket.onerror = (error) => {
  console.error("WebSocket Error: ", error)
}

socket.onclose = () => {
  console.log("Socket closed")
}

function displayData(data) {
  console.log(data)

  // Update room code
  document.getElementById("room-code-display").innerHTML = "Room code: " +
    data.room.roomCode

  // Only update the username if the 'player' property exists
  if (data.player) {
    document.getElementById("username").innerHTML = "username: " +
      data.player.name
  }

  // Update the player list
  document.getElementById("joined").innerHTML = ""
  for (let i = 0; i < data.room.playerList.length; i++) {
    let newListItem = document.createElement("li")
    newListItem.innerText = data.room.playerList[i].name
    document.getElementById("joined").appendChild(newListItem)
  }
}
