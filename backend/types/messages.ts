export interface BaseMessage {
  event: string
  deviceId: string
}

export interface JoinRoomMessage extends BaseMessage {
  event: "join-room"
  name: string
  roomCode: string
}

export interface LeaveRoomMessage extends BaseMessage {
  event: "leave-room"
}

export interface CreateRoomMessage extends BaseMessage {
  event: "create-room"
}
export interface InformativeMessage extends BaseMessage {
  event: "informative-message"
  message: string
  playerNameArray: string[]
  roomCode: string
}
export interface ClearMessage extends BaseMessage {
  event: "clear-message"
  playerNameArray: string[]
  roomCode: string
}

export type Message =
  | JoinRoomMessage
  | LeaveRoomMessage
  | CreateRoomMessage
  | InformativeMessage
  | ClearMessage
