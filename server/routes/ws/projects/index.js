import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

const projectsClients = new Set()

function broadcastProjects(changes) {
    projectsClients.forEach(peer => {
        peer.send(JSON.stringify(changes))
    })
}

export default defineWebSocketHandler({
    async open(peer) {
        try {
            console.log("[ws] open", peer)
        
            const authenticated = await authenticate(peer.headers["cookie"])
            if(!authenticated) {
                console.log("failed authentication")
                peer.send(JSON.stringify(await helper.resFormat(401, "Unauthorized")))
                return
            }
    
            projectsClients.add(peer)
        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        projectsClients.delete(peer)
    },

    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastProjects }