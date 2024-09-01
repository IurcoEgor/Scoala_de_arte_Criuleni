var data = new Date();
document.getElementById('an').innerHTML = data.getFullYear();

document.querySelectorAll('aside a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 78,
                behavior: 'smooth'
            });
        }
    });
});