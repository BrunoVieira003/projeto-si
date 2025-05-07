// lib/auth.ts
'use client';

import { parseError } from '@/lib/parseErrors';
import axios from 'axios';
import Cookies from 'js-cookie';

export async function login(email: string, password: string) {
    try{
        const response = await axios.post('http://localhost:3000/auth/login', {email, password})
        Cookies.set('token', response.data.access_token, { expires: 1 });
        return {ok: true, message: 'Logado com sucesso'}
    }catch(e: any){
        return parseError(e, {messages: {"401": 'Email ou senha inválidos'} })
    }
}

export function logout() {
  Cookies.remove('token');
}

export function isLoggedIn(): boolean {
  return !!Cookies.get('token');
}
