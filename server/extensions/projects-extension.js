import { PrismaClient } from '@prisma/client'
import { broadcastProjects } from '~/server/routes/ws/projects/index'
import { broadcastProject } from '~/server/routes/ws/projects/[id]/index'
import helper from '~/server/services/helper-service'

let prisma = new PrismaClient()

const client = prisma.$extends({
    name: 'taskChangeNotifier',
    query: {
        projects: {
            create: async ({ model, args, query }) => {
                return query(args).then(createdProject => {
                    (async () => {
                        const projectId = createdProject.id
                        console.log(`creating project: #${projectId}`)

                        const changes = { action: 'create', project: createdProject }

                        broadcastProjects(changes)
                        broadcastProject(projectId, changes)
                    })();

                    return createdProject
                })
            },
            update: async ({ model, args, query }) => {
                return query(args).then(updatedProject => {
                    (async () => {
                        const projectId = updatedProject.id
                        console.log(`updating project: #${projectId}`)

                        const changes = { action: 'update', project: updatedProject }

                        broadcastProjects(changes)
                        broadcastProject(projectId, changes)
                    })();

                    return updatedProject
                })
            },
            delete: async ({ model, args, query }) => {
                return query(args).then(deletedProject => {
                    (async () => {
                        const projectId = deletedProject.id
                        console.log(`deleting project: #${projectId}`)

                        const changes = { action: 'delete', project: deletedProject }

                        broadcastProjects(changes)
                        broadcastProject(projectId, changes)
                    })();

                    return deletedProject
                })
            },
        }
    },
})

export { client }