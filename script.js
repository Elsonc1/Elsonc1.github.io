document.addEventListener('DOMContentLoaded', function () {

    // === Language preference ===
    const languageLinks = document.querySelectorAll('.language-option');
    languageLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var lang = this.getAttribute('href').replace('.html', '');
            localStorage.setItem('preferredLanguage', lang);
        });
    });

    var preferredLanguage = localStorage.getItem('preferredLanguage');
    if (preferredLanguage && !window.location.pathname.includes(preferredLanguage + '.html')) {
        window.location.href = preferredLanguage + '.html';
    }

    // === Scroll-reveal animations ===
    var revealElements = document.querySelectorAll('.reveal');

    function checkReveal() {
        var windowHeight = window.innerHeight;
        revealElements.forEach(function (el) {
            var top = el.getBoundingClientRect().top;
            if (top < windowHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });

    // === Navbar hide/show on scroll ===
    var nav = document.querySelector('.top-nav');
    var lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
        var currentY = window.scrollY;
        if (currentY > lastScrollY && currentY > 120) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollY = currentY;
    }, { passive: true });

    // === Active nav link on scroll ===
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        var scrollPos = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // === Smooth scroll for nav links ===
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Staggered stat card animation ===
    var statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(function (card, index) {
        card.style.transitionDelay = (index * 0.1) + 's';
    });

    // === Animate stat numbers ===
    var animated = false;

    function animateNumbers() {
        if (animated) return;
        var firstStat = document.querySelector('.stat-number');
        if (!firstStat) return;
        var rect = firstStat.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            animated = true;
            document.querySelectorAll('.stat-number').forEach(function (el) {
                var text = el.textContent.trim();
                var hasPlus = text.includes('+');
                var num = parseInt(text.replace('+', ''), 10);
                if (isNaN(num)) return;
                var current = 0;
                var step = Math.max(1, Math.floor(num / 30));
                var interval = setInterval(function () {
                    current += step;
                    if (current >= num) {
                        current = num;
                        clearInterval(interval);
                    }
                    el.textContent = current + (hasPlus ? '+' : '');
                }, 30);
            });
        }
    }

    window.addEventListener('scroll', animateNumbers, { passive: true });
    animateNumbers();

    // === Force PDF download (GitHub Pages serves inline) ===
    document.querySelectorAll('a[download]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var url = this.href;
            var filename = this.getAttribute('download') || url.split('/').pop();
            fetch(url)
                .then(function (response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.blob();
                })
                .then(function (blob) {
                    var a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                })
                .catch(function () {
                    window.open(url, '_blank');
                });
        });
    });
});