import CategoryModel from "~/server/models/category-model"
import helper from "~/server/services/helper-service"

const categoryModel = new CategoryModel()

class CategoryService {
    async addCategory(ctx) {
        try {
            const context = {
                data: {
                    category_id: +ctx.category_id,
                    task_id: +ctx.task_id
                }
            }
            const result = await categoryModel.create(context)
            if(result) return helper.resFormat(200, result)
            else return helper.resFormat(404)
        }catch(e){
            console.log(e);
            return helper.resFormat(500)
        }
    }

    async deleteCategory(id){
        try{
            const result = await categoryModel.delete(id)
            if (result) return helper.resFormat(200, result)
            else return helper.resFormat(404)
        }catch(e){
            console.log(e)
            return helper.resFormat(500)
        }
    }
}

export default CategoryService