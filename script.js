// Mobile menu
function toggleMenu() {
    var links = document.getElementById('navLinks');
    var button = document.querySelector('.menu-toggle');
    var open = links.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

// Abstract toggles
function toggleAbstract(button) {
    var abstract = document.getElementById(button.getAttribute('aria-controls'));
    var open = abstract.hidden;
    abstract.hidden = !open;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

// Light / dark theme
(function () {
    var root = document.documentElement;
    var button = document.querySelector('.theme-toggle');
    if (!button) return;

    function render() {
        var dark = root.dataset.theme === 'dark';
        button.querySelector('.theme-label').textContent = dark ? 'Light' : 'Dark';
        button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    button.addEventListener('click', function () {
        var dark = root.dataset.theme !== 'dark';
        if (dark) root.dataset.theme = 'dark';
        else delete root.dataset.theme;
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
        render();
    });

    render();
})();

// Portrait fallback: show initials until img/portrait.jpg exists
(function () {
    var img = document.querySelector('.profile-img');
    if (!img) return;
    function fallback() {
        var box = document.createElement('div');
        box.className = 'profile-fallback';
        box.setAttribute('aria-hidden', 'true');
        box.textContent = 'JVA';
        img.replaceWith(box);
    }
    if (img.complete && img.naturalWidth === 0) fallback();
    else img.addEventListener('error', fallback);
})();
