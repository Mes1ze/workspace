import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

/**
 * @type {Map<number, Set<Peer<any>>}
 */
const userTasksClients = new Map()

function broadcastUserTasks(userId, changes) {
    if(userTasksClients.has(userId)) userTasksClients.get(userId).forEach(peer => {
        peer.send(JSON.stringify(changes))
    })
}

export default defineWebSocketHandler({
    async open(peer) {
        try {
            console.log("[ws] open", peer)

            const userId = +peer.url.match(/ws\/users\/(\d+)\/tasks\/?/)[1]
            
            const authenticated = await authenticate(peer.headers["cookie"])
            if(!authenticated) {
                console.log("failed authentication")
                peer.send(JSON.stringify(await helper.resFormat(401, "Unauthorized")))
                return
            }

            if(!userTasksClients.has(userId)) userTasksClients.set(userId, new Set())
            userTasksClients.get(userId).add(peer)
        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        const userId = +peer.url.match(/ws\/users\/(\d+)\/tasks\/?/)[1]

        userTasksClients.get(userId).delete(peer)
    },
  
    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastUserTasks }