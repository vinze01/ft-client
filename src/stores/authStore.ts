import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

interface AuthState {
    token: string;
    user: object | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    }),
    getters: {
        isAuthenticated: (state): boolean => !!state.token,
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post('http://localhost:3001/api/login', { username, password });
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                await router.push('/dashboard');
                return response;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },

        async register(payload: any) {
            try {
                const response = await axios.post('http://localhost:3001/api/register', payload);
                if (response.status === 201) {
                    await router.push('/login')
                }
            } catch (error) {
                console.error('Registration failed', error);
                throw new Error('Registration failed');
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            router.push('/login');
        },
    },
});
