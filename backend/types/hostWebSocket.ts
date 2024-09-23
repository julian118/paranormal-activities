import { Host } from "../models/host.model.ts"

export interface HostWebSocket extends WebSocket {
  host: Host
}
