import { post, get, unauthorizedPost } from '@/utils/fetch';
export async function login(data) {
    return await unauthorizedPost('/web/auth/login/', data);
}
export async function refreshToken(refresh) {
    return await unauthorizedPost('/web/auth/refresh/', { refresh }); 
}
export async function getMe() {
    return await get('/web/auth/me/');
}
export async function updateMe(data) {
    return await put('/web/auth/me/', data);
}
