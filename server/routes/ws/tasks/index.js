import { authenticate } from "~/server/middleware/auth"
import helper from "~/server/services/helper-service"

const tasksClients = new Set()

function broadcastTasks(changes) {
    tasksClients.forEach(peer => {
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
    
            tasksClients.add(peer)
        } catch(error) {
            console.log(error)
        }
    },

    async close(peer, event) {
        console.log("[ws] close", peer, event)

        tasksClients.delete(peer)
    },
  
    async error(peer, error) {
        console.log("[ws] error", peer, error)
    },
})

export { broadcastTasks }