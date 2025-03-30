// Імпорт бібліотеки SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

// Ініціалізація SimpleLightbox для перегляду великих зображень у галереї
export function initLightbox() {
    lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionType: 'attr',
    captionDelay: 250,
    animationSpeed: 350,
    captionPosition: 'bottom',
    });
    
    // Обробка подій SimpleLightbox
    lightbox.on('show.simplelightbox', function () { });
    
    lightbox.on('error.simplelightbox', function (e) {
        console.log(e);
    });

    return lightbox;
}

// Створення HTML-розмітки для однієї картки з фільмом
export function createMovieCard(movie) {
  const {
    Title,
    Year,
    imdbID,
    Type,
    Poster
  } = movie;

  const posterSrc = Poster !== 'N/A' ? Poster : "https://via.placeholder.com/200x300?text=No+Image";

  return `
    <li class="movie-card">
            <img src="${posterSrc}" alt="${Title}" class="movie-poster">
            <h3 class="movie-title">${Title}</h3>
            <p class="movie-info">Year: ${Year} | Type: ${Type}</p>
        </li>
  `;
}
