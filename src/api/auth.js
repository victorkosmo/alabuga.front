import { post, get, unauthorizedPost } from '@/utils/fetch';
export async function login(data) {
    return await unauthorizedPost('/auth/login/', data);
}
export async function refreshToken(refresh) {
    return await unauthorizedPost('/auth/refresh/', { refresh }); 
}
export async function getMe() {
    return await get('/auth/me/');
}
export async function updateMe(data) {
    return await put('/auth/me/', data);
}
