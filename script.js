document.addEventListener('DOMContentLoaded', function () {
    const languageLinks = document.querySelectorAll('.language-option');

    languageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const lang = this.getAttribute('href').replace('.html', '');
            localStorage.setItem('preferredLanguage', lang);
        });
    });

    const preferredLanguage = localStorage.getItem('preferredLanguage');
    if (preferredLanguage && !window.location.pathname.includes(preferredLanguage + '.html')) {
        window.location.href = preferredLanguage + '.html';
    }
});