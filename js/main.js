// Data
var data = new Date();
document.getElementById('an').innerHTML = data.getFullYear();

//  Defilarea
document.querySelectorAll('aside a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const { offsetTop } = targetElement;
            window.scrollTo({
                top: offsetTop - 78,
                behavior: 'smooth'
            });
        }
    });
});

//  Meniu mobil
const hamburgerMenu = document.querySelector('.hamburger-menu');
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('show');
    });
}

//Acasa
const homeMenu = document.querySelector('.home-menu');
const navHome = document.querySelector('.nav-home');

if (homeMenu && navHome) {
    const showMenu = () => navHome.classList.add('show');
    const hideMenu = () => navHome.classList.remove('show');

    homeMenu.addEventListener('mouseover', showMenu);
    homeMenu.addEventListener('mouseout', hideMenu);
    navHome.addEventListener('mouseover', showMenu);
    navHome.addEventListener('mouseout', hideMenu);
}
