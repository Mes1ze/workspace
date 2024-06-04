import UserService from '~/server/services/user-service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    try {
        const ctx = getQuery(event)

        const id = getRouterParam(event, 'id')
        
        ctx.id = +id
        ctx.select = {
            subordinates_subordinates_leader_idToemployee: {
                select: {
                    id: true,
                    employee_subordinates_subordinate_idToemployee: true,
                }
            }
        }
        

        const users = await userService.getUser(ctx)
        
        if(users.data.subordinates_subordinates_leader_idToemployee) {
            users.data.subordinates_subordinates_leader_idToemployee.forEach(element => {
                try { delete element.employee_subordinates_subordinate_idToemployee.password_hash } catch(e) {}
            })
        }
        
        setResponseStatus(event, users.status)
        return users
    } catch (e) {
        console.log(e)
    }
})