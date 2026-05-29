import { supabase } from "../../mainApp.js";
const spClient = supabase
export class Query {

   
   static async updateUserProfile(id: string, actionArg: Record<string, unknown>, action: string = 'update'){
        
        try {
       //actionArg  is an object
        const { error, data } = await ((spClient.from('profiles') as any  ) [action](actionArg) as any).eq('id', id).select().single()
        if(error) throw error
        return { success: true, data };
        }catch(e){
            const error = e as Error;
            console.error(error.message, 'error obj', error)
            return { success: false, error: error.message };
        }
    }
   static async readProfileData(column: string, columnValue: unknown, selArg: string = '*'){
      
        try {
        
        const { error, data } = await spClient.from('profiles').select(selArg).eq(column,columnValue)
        if(error) throw error
        return { success: true, data };
        }catch(e){
            const error = e as Error;
            console.error(error.message, 'error obj', error)
            return { success: false, error: error.message };
        }
    }
}