let joinButton = document.getElementById("join")
let createButton = document.getElementById("create")

const backendUrl = "ws://localhost:8080"
let recievedData = null

const socket = new WebSocket(
  `${backendUrl}/start_host_web_socket`,
)

function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId")

  if (!deviceId) {
    newDeviceId = crypto.randomUUID()
    localStorage.setItem("deviceId", newDeviceId)
    deviceId = newDeviceId
  }
  return deviceId
}
// Joining an existing room
/*
function joinRoom() {
  let nameInput = document.getElementById("name")
  let roomCodeInput = document.getElementById("room-code")

  socket.send(
    JSON.stringify({
      event: "join-room",
      roomCode: roomCodeInput.value,
      name: nameInput.value,
      deviceId: getDeviceId()
    }),
  )
}
*/

// creating a new room
function createRoom() {
  socket.send(
    JSON.stringify({
      event: "create-room",
      deviceId: getDeviceId(),
    }),
  )
}

function informativeMessage() {
  console.log(recievedData.room.playerList.map((player) => player.deviceId))

  socket.send(
    JSON.stringify({
      event: "informative-message",
      message: "test message for all players",
      playerDeviceIdList: recievedData.room.playerList.map((player) =>
        player.deviceId
      ),
    }),
  )
}

/*
// leaving the current room
function leaveRoom() {
  socket.send(
    JSON.stringify({
      event: "leave-room",
    }),
  )
}

*/

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
  recievedData = data

  console.log(data)
  // Update room code
  document.getElementById("room-code-display").innerHTML = "Room code: " +
    data.room.roomCode

  // Update the player list
  document.getElementById("joined").innerHTML = ""
  for (let i = 0; i < data.room.playerList.length; i++) {
    let newListItem = document.createElement("li")
    newListItem.innerText = data.room.playerList[i].name
    document.getElementById("joined").appendChild(newListItem)
  }
}
