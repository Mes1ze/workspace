import { PrismaClient } from '@prisma/client'
import { broadcastProjectTasks } from '~/server/routes/ws/projects/[id]/tasks'
import { broadcastUserTasks } from '~/server/routes/ws/users/[id]/tasks'
import { broadcastTasks } from '~/server/routes/ws/tasks/index'
import { broadcastTask } from '~/server/routes/ws/tasks/[id]/index'
import helper from '~/server/services/helper-service'

let prisma = new PrismaClient()

async function findProjectIdByTask(task) {
    if(!task.project_id) return false

    const column = await prisma.project_columns.findFirst({
        select: { project_id: true },
        where: { id: task.project_id }
    })
    return column.project_id
}

const client = prisma.$extends({
    name: 'taskChangeNotifier',
    query: {
        tasks: {
            create: async ({ model, args, query }) => {
                return query(args).then(createdTask => {
                    (async () => {
                        const projectId = await findProjectIdByTask(createdTask)
                        console.log(`creating task #${createdTask.id} for project: #${projectId}`)

                        const select = await helper.constructDefaultSelect(client.tasks, [
                            "task_category",
                            "task_performers",
                            "completion_scores",
                            "employee",
                            "project_columns",
                        ])
            
                        const where = {
                            id: createdTask.id
                        }
            
                        const add = await client.tasks.findUnique({
                            select: select,
                            where: where
                        });
                        const userId = add.task_performers?.map(value => value.executor_id)

                        const changes = { action: 'create', task: add }

                        broadcastTasks(changes)
                        if(projectId) broadcastProjectTasks(projectId, changes)
                        if(userId && userId.length != 0) userId.forEach(value => broadcastUserTasks(value, changes))
                    })();

                    return createdTask
                })
            },
            update: async ({ model, args, query }) => {
                return query(args).then(updatedTask => {
                    (async () => {
                        const projectId = await findProjectIdByTask(updatedTask)
                        const taskId = updatedTask.id
                        console.log(`updating task #${taskId} for project: #${projectId}`)

                        const select = await helper.constructDefaultSelect(client.tasks, [
                            "task_category",
                            "task_performers",
                            "completion_scores",
                            "employee",
                            "project_columns",
                        ])
            
                        const where = {
                            id: taskId
                        }
            
                        const add = await client.tasks.findUnique({
                            select: select,
                            where: where
                        });
                        const userId = add.task_performers?.map(value => value.executor_id)

                        const changes = { action: 'update', task: add }

                        broadcastTasks(changes)
                        if(projectId) broadcastProjectTasks(projectId, changes)
                        broadcastTask(taskId, changes)
                        if(userId && userId.length != 0) userId.forEach(value => broadcastUserTasks(value, changes))
                    })();

                    return updatedTask
                })
            },
            delete: async ({ model, args, query }) => {
                return query(args).then(deletedTask => {
                    (async () => {
                        const projectId = await findProjectIdByTask(deletedTask)
                        const taskId = updatedTask.id
                        console.log(`deleting task #${deletedTask.id} for project: #${projectId}`)

                        const select = await helper.constructDefaultSelect(client.tasks, [
                            "task_category",
                            "task_performers",
                            "completion_scores",
                            "employee",
                            "project_columns",
                        ])
            
                        const where = {
                            id: taskId
                        }
            
                        const add = await client.tasks.findUnique({
                            select: select,
                            where: where
                        });

                        const userId = add.task_performers?.map(value => value.executor_id)
                        const changes = { action: 'delete', task: deletedTask }

                        broadcastTasks(changes)
                        if(projectId) broadcastProjectTasks(projectId, changes)
                        broadcastTask(taskId, changes)
                        if(userId && userId.length != 0) userId.forEach(value => broadcastUserTasks(value, changes))
                    })();

                    return deletedTask
                })
            },
        }
    },
})

export { client }