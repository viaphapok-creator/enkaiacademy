const searchBox = document.querySelector('.search-box');
const artCards = document.querySelectorAll('.art-card-link');

if (searchBox) {
    searchBox.addEventListener('input', e => {
        const kw = e.target.value.toLowerCase().trim();
        artCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = (!kw || text.includes(kw)) ? '' : 'none';
        });
    });
}

const copyBtn = document.querySelector('.copy-btn');
const linkInput = document.querySelector('.link-input');
if (copyBtn && linkInput) {
    linkInput.value = window.location.href;
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(linkInput.value);
            copyBtn.classList.add('copied');
            copyBtn.textContent = '✅ Đã sao chép!';
        } catch {
            linkInput.select();
            document.execCommand('copy');
            copyBtn.classList.add('copied');
            copyBtn.textContent = '✅ Đã sao chép!';
        }
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.textContent = 'Sao chép Link';
        }, 2500);
    });
}
