// Mobile menu
function setMenu(open) {
    var links = document.getElementById('navLinks');
    var button = document.querySelector('.menu-toggle');
    if (!links || !button) return;
    links.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function toggleMenu() {
    setMenu(!document.getElementById('navLinks').classList.contains('open'));
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav') || e.target.closest('#navLinks a')) setMenu(false);
});

// Abstract / BibTeX toggles. Collapsed panels use hidden="until-found",
// so the browser's find-in-page can still reach (and open) them.
function toggleAbstract(button) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    var open = panel.hasAttribute('hidden');
    if (open) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', 'until-found');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

document.querySelectorAll('.paper-abstract, .paper-bibtex').forEach(function (panel) {
    panel.addEventListener('beforematch', function () {
        var button = document.querySelector('[aria-controls="' + panel.id + '"]');
        if (button) button.setAttribute('aria-expanded', 'true');
    });
});

// Announce links that open in a new tab
document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    var note = document.createElement('span');
    note.className = 'visually-hidden';
    note.textContent = ' (opens in new tab)';
    a.appendChild(note);
});

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

// Media page: filter by type and/or outlet
(function () {
    var types = document.querySelector('.filters');
    var outlets = document.querySelector('.outlet-badges');
    if (!types) return;
    var empty = document.querySelector('.media-empty');
    var kind = 'all';
    var outlet = null;

    function apply() {
        types.querySelectorAll('button').forEach(function (b) {
            b.setAttribute('aria-pressed', b.dataset.f === kind ? 'true' : 'false');
        });
        if (outlets) outlets.querySelectorAll('button').forEach(function (b) {
            b.setAttribute('aria-pressed', b.dataset.outlet === outlet ? 'true' : 'false');
        });
        var shown = 0;
        document.querySelectorAll('.media-year').forEach(function (year) {
            var visible = 0;
            year.querySelectorAll('li[data-kind]').forEach(function (li) {
                var okKind = kind === 'all' || li.dataset.kind === kind;
                var okOutlet = !outlet || (' ' + li.dataset.outlet + ' ').indexOf(' ' + outlet + ' ') !== -1;
                li.hidden = !(okKind && okOutlet);
                if (!li.hidden) visible++;
            });
            year.hidden = visible === 0;
            shown += visible;
        });
        if (empty) empty.hidden = shown !== 0;
    }

    types.addEventListener('click', function (e) {
        var button = e.target.closest('button');
        if (!button) return;
        kind = button.dataset.f;
        if (kind === 'all') outlet = null;
        apply();
    });

    if (outlets) outlets.addEventListener('click', function (e) {
        var button = e.target.closest('button');
        if (!button) return;
        outlet = outlet === button.dataset.outlet ? null : button.dataset.outlet;
        apply();
    });
})();

// News: fade the bottom edge while older items remain below
(function () {
    var box = document.querySelector('.news-scroll');
    if (!box) return;
    function update() {
        var more = box.scrollHeight - box.clientHeight - box.scrollTop > 4;
        box.classList.toggle('has-more', more);
        box.classList.toggle('has-prev', box.scrollTop > 4);
    }
    box.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
