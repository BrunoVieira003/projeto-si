import { parseError } from "@/lib/parseErrors";
import axios from "axios";
import Cookies from 'js-cookie';

export async function registerUser(email: string, password: string, cpf: string) {
    try{
        const response = await axios.post('http://localhost:3000/user', {email, password, cpf})
        return {ok: true, message: 'Usuário cadastrado com sucesso'}
    }catch(e: any){
        return parseError(e)
    }
}