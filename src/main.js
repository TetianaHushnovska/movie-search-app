// Імпорт бібліотеки iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Імпорт бібліоткеки Axios
import axios from "axios";

// Імпорт модулів
import fetchMovies from './js/omdb-api';
import { initLightbox, createMovieCard } from './js/rebder-funstoins';

const form = document.querySelector('.form');
const input = document.querySelector('.js-input');
const gallery = document.querySelector('.gallery');
const loaderInit = document.querySelector('.initial-loader');
const loaderAdd = document.querySelector('.aditional-loader');
const loadMoreBtn = document.querySelector('.load-more-btn');
const lightbox = initLightbox();

let currentSearchQuery = '';
let page = 1;
let totalPages = 0;

// // Показати loader
function showLoader(loader) {
    loader.classList.remove('visually-hidden');
}

// Приховати loader
function hideLoader(loader) {
    loader.classList.add('visually-hidden');
}

// Показати кнопку додаткової загрузки
function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('visually-hidden');
}

// Призовати кнопку додаткової загрузки
function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('visually-hidden');
}

// Повідомлення
const errorMessage = {
    message: 'Sorry, there are no movies matching your search query. Please try again!',
    messageColor: '#fff',
    backgroundColor: '#ef4040',
    position: 'topRight',
}

const warning = {
    message: 'Enter your search request!',
    messageColor: '#000',
    backgroundColor: '#f5c386',
    position:'topRight',
}

const info = {
    message: `We're sorry, but you've reached the end of search results.`,
    messageColor: '#000',
    backgroundColor: '#78afe0',
    position:'topRight',
}

// // Обробка пошуку
form.addEventListener('submit', async event => {
    event.preventDefault();

    const request = input.value.trim();
    if (request === '') {
        gallery.innerHTML = '';
        iziToast.warning(warning);
        return;
    }

    // Новий запит пошуку / скидування сторінки
    currentSearchQuery = request;
    page = 1;
    totalPages = 0;
    gallery.innerHTML = '';

    try {
        const data = await fetchMovies(request, page);
        console.log('API response:', data);

        const movies = data?.Search ?? [];

        if (movies.length === 0) {
            iziToast.error(errorMessage);
            return;
        }

        totalPages = Math.ceil(Number(data.totalResults) /10);

        gallery.innerHTML = movies.map(createMovieCard).join('');

        if (page < totalPages) {
            showLoadMoreBtn();
        }
    }
    catch (error) {
        iziToast.error(errorMessage);
        console.log('Error request:', error);
    }
    finally {
        input.value = '';
    }
})

// // Завантаження додаткових фільмів
loadMoreBtn.addEventListener('click', async () => {
    page += 1;
    hideLoadMoreBtn();
    showLoader(loaderAdd);

    try {
        const data = await fetchMovies(currentSearchQuery, page);
        const movies = data?.Search ?? [];
        
        if (movies.length === 0) {
            hideLoadMoreBtn();
            iziToast.error(errorMessage);
            return;
        }

        gallery.insertAdjacentHTML('beforeend', movies.map(createMovieCard).join(''));

        // Плавний скрол до нових карток
        const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 1.7,
            behavior: 'smooth',
        });

        if (page * 10 >= totalPages) {
            iziToast.info(info);
            hideLoadMoreBtn();
        }
        else {
            showLoadMoreBtn();
        }
    }
    catch (error) {
        iziToast.error(errorMessage);
        console.log('Error loading more:', error);
    }
    finally {
        hideLoader(loaderAdd);
    }
})

const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Показуємо/ховаємо кнопку при скролі
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Показати, якщо прокрутили більше 300px
        scrollToTopBtn.classList.remove('visually-hidden');
    } else {
        scrollToTopBtn.classList.add('visually-hidden');
    }
});

// Плавний скрол на початок сторінки при кліку
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});