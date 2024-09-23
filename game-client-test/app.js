let joinButton = document.getElementById("join")
let createButton = document.getElementById("create")

const backendUrl = "ws://localhost:8080"
let receivedData = null

const socket = new WebSocket(
  `${backendUrl}/start_host_web_socket`,
)

function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId")

  if (!deviceId) {
    let newDeviceId = crypto.randomUUID()
    localStorage.setItem("deviceId", newDeviceId)
    deviceId = newDeviceId
  }
  return deviceId
}

function createRoom() {
  socket.send(
    JSON.stringify({
      event: "create-room",
      deviceId: getDeviceId(),
    }),
  )
}

function informativeMessage() {
  const message = JSON.stringify({
    event: "informative-message",
    message: `WARNING ${receivedData.room.playerList[0].name} SMELLS REALL BAD!`,
    roomCode: receivedData.room.roomCode,
    playerNameArray: receivedData.room.playerList.map((player) => player.name),
  })
  console.log(message)
  socket.send(
    message
  );
}

function clearMessage() {
  const message = JSON.stringify({
    event: "clear-message",
    roomCode: receivedData.room.roomCode,
    playerNameArray: receivedData.room.playerList.map((player) => player.name),
  })
  console.log(message)
  socket.send(
    message
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
  receivedData = data

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
