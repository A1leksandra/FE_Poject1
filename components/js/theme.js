// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!themeToggle) return;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

