import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

/**
 * @type {Map<number, Set<Peer<any>>}
 */
const projectClients = new Map()

function broadcastProject(projectId, changes) {
    if(projectClients.has(projectId)) projectClients.get(projectId).forEach(peer => {
        peer.send(JSON.stringify(changes))
    })
}

export default defineWebSocketHandler({
    async open(peer) {
        try {
            console.log("[ws] open", peer)

            const projectId = +peer.url.match(/ws\/projects\/(\d+)\/?/)[1]
            
            const authenticated = await authenticate(peer.headers["cookie"])
            if(!authenticated) {
                console.log("failed authentication")
                peer.send(JSON.stringify(await helper.resFormat(401, "Unauthorized")))
                return
            }

            if(!projectClients.has(projectId)) projectClients.set(projectId, new Set())
            projectClients.get(projectId).add(peer)

        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        const projectId = +peer.url.match(/ws\/projects\/(\d+)\/?/)[1]

        projectClients[projectId].delete(peer)
    },
  
    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastProject }