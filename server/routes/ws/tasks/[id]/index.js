import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

/**
 * @type {Map<number, Set<Peer<any>>}
 */
const taskClients = new Map()

function broadcastTask(taskId, changes) {
    if(taskClients.has(taskId)) taskClients.get(taskId).forEach(peer => {
        peer.send(JSON.stringify(changes))
    })
}

export default defineWebSocketHandler({
    async open(peer) {
        try {
            console.log("[ws] open", peer)

            const taskId = +peer.url.match(/ws\/tasks\/(\d+)\/?/)[1]
            
            const authenticated = await authenticate(peer.headers["cookie"])
            if(!authenticated) {
                console.log("failed authentication")
                peer.send(JSON.stringify(await helper.resFormat(401, "Unauthorized")))
                return
            }

            if(!taskClients.has(taskId)) taskClients.set(taskId, new Set())
            taskClients.get(taskId).add(peer)
        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        const taskId = +peer.url.match(/ws\/tasks\/(\d+)\/?/)[1]

        taskClients.get(taskId).delete(peer)
    },
  
    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastTask }