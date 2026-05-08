import axios from 'axios';

// ==========================================
// 1. CONFIGURACIÓN DE LA INSTANCIA DE AXIOS
// ==========================================

// Creamos la instancia apuntando a la raíz de tu servidor
const api = axios.create({
    baseURL: 'http://localhost:8000'
});

// ==========================================
// 2. FUNCIONES CRUD PARA CURSO2
// ==========================================


// Apunta a curso2 (API REST con Django REST Framework)
const BASE_URL = '/api/cursos'; 

// 1. LISTAR (GET)
export const read = () => {
    return api.get(`${BASE_URL}/`);
};

// 2. CREAR (POST)
export const create = (data) => {
    return api.post(`${BASE_URL}/`, data);
};

// 3. ACTUALIZAR (PUT)
export const update = (id, data) => {
    return api.put(`${BASE_URL}/${id}/`, data);
};

// 4. ELIMINAR (DELETE)
export const deleteM = (id) => {
    return api.delete(`${BASE_URL}/${id}/`);
};
