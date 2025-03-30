// Імпорт бібліотеки Axios для роботи з HTTP-запитами
import axios from "axios";

// Встановлення базової URL-адреси для всіх запитів
const BASE_URL = 'https://www.omdbapi.com';
const API_KEY = '60586037';

// Отримання даних із Pixabay API на основі запиту користувача
export default async function fetchMovies (requestWord, page =1) {

    // Формування параметрів запиту
   

    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                apikey: API_KEY,
                s: requestWord,
                page: page,
             }
        });

        console.log("API response:", response.data);

        if (response.data.Response === 'False') {
            throw new Error(response.data.Error || 'No movies found');
        }
        return response.data;
    }
    // Прокидування помилки для обробки в основному коді
    catch (error) {
        console.log('Error fetching movies:', error.message);
        throw error;
    }
}