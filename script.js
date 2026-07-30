const searchBox = document.querySelector('.search-box');
const artCards = document.querySelectorAll('.art-card');

searchBox.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    artCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(keyword) ? '' : 'none';
    });
});

document.querySelector('.discover-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#collection').scrollIntoView({ behavior: 'smooth' });
});

