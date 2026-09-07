import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/';

export default class ApiClient {

    static async get(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            credentials: 'include'
        });
        return await this.checarResposta(response);
    }

    static async post(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async put(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async patch(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await this.checarResposta(response);
    }

    static async delete(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return await this.checarResposta(response);
    }

    static async checarResposta(response) {
        if (response.ok) {
            return await response.json();
        } else {
            if (response.status !== 404 && response.status !== 401) {
                const json = await response.json();
                toast.error(json?.msg || 'Erro inesperado.');
            }
            return null;
        }
    }
}
