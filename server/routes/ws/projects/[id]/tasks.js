import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

/**
 * @type {Map<number, Set<Peer<any>>}
 */
const projectTasksClients = new Map()

function broadcastProjectTasks(projectId, changes) {
    if(projectTasksClients.has(projectId)) projectTasksClients.get(projectId).forEach(peer => {
        peer.send(JSON.stringify(changes))
    })
}

export default defineWebSocketHandler({
    async open(peer) {
        try {
            console.log("[ws] open", peer)

            const projectId = +peer.url.match(/ws\/projects\/(\d+)\/tasks\/?/)[1]
            
            const authenticated = await authenticate(peer.headers["cookie"])
            if(!authenticated) {
                console.log("failed authentication")
                peer.send(JSON.stringify(await helper.resFormat(401, "Unauthorized")))
                return
            }

            if(!projectTasksClients.has(projectId)) projectTasksClients.set(projectId, new Set())
            projectTasksClients.get(projectId).add(peer)
        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        const projectId = +peer.url.match(/ws\/projects\/(\d+)\/?/)[1]

        projectTasksClients[projectId].delete(peer)
    },
  
    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastProjectTasks }