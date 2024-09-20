export interface BaseMessage {
    event: string,
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
  
  export type Message = JoinRoomMessage | LeaveRoomMessage;
  