
type BroadcastMessage = {
    [key: string]: any
} & {
    event: string
}

export default BroadcastMessage