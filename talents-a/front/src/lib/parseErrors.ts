import { isAxiosError } from "axios";

interface IOptions{
    messages: {
        400?: string
        401?: string
        404?: string
        500?: string
    }
}

export function parseError(error: any | unknown, options?: IOptions): {ok: boolean, message: string, data: null}{
    if(isAxiosError(error)){
        if(error.status === 500) return {ok: false, message: options?.messages[500] || 'Um erro ocorreu no servidor. Tente novamente', data: null};
        if(error.status === 400) return {ok: false, message: options?.messages[400] || error.response?.data.message[0], data: null}
        if(error.status === 401) return {ok: false, message: options?.messages[401] || 'Acesso não autorizado', data: null};
        if(error.status === 404) return {ok: false, message: options?.messages[404] || 'Não encontrado', data: null}
    }
    
    console.error(error)
    return {ok: false, message: error.message, data: null}
}