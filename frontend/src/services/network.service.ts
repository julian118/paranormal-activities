/*
export default class NetworkService {
    const backendUrl = "ws://localhost:8080"

    const socket = new WebSocket(`${this.backendUrl}/start_web_socket`)

    // Joining an existing room
    joinRoom(roomCode: string, name: string) {

    this.socket.send(
        JSON.stringify({
        event: "join-room",
        roomCode: roomCode,
        name: name
        }),
    )
    }

    // creating a new room
    createRoom(name: string) {
    this.socket.send(
        JSON.stringify({
        event: "create-room",
        name: name
        }),
    )
    }

    // leaving the current room
    leaveRoom() {
    this.socket.send(
        JSON.stringify({
        event: "leave-room",
        }),
    )
    }

    this.socket.onmessage = (message: any) => {
    const data = JSON.parse(message.data)
    displayData(data)
    }

    socket.onerror = (error) => {
    console.error("WebSocket Error: ", error)
    }

    socket.onclose = () => {
    console.log("Socket closed")
    }
}
*/