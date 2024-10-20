import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

interface AuthState {
    token: string;
    user: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') || null,
    }),
    getters: {
        isAuthenticated: (state): boolean => !!state.token,
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post('http://localhost:3001/api/login', { username, password });
                this.token = response.data.token;
                console.log('response :>> ', response);
                this.user = response.data.user;
                console.log('response.data.user :>> ', response.data.user);
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                router.push('/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
            }
        },
        async register(payload: any) {
            try {
                console.log('payloadq :>> ', payload);
                const response = await axios.post('http://localhost:3001/api/register', payload);
                if (response.status === 201) {
                    await this.login(payload.username, payload.password);
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
