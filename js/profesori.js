document.addEventListener('DOMContentLoaded', function () {
    const placeholder = '../images/scoala-bg.jpg';
    const data = {
        music: [
            {
                name: 'Spasova Ella',
                role: 'Profesoară de pian, maestru de concert',
                img: '../images/Savina-Ella.jpeg',
                studii: 'Studii superioare, Universitatea de Stat din Comrat',
                stagiu: '3 ani',
                dob: '26 septembrie 1996',
                desc: 'Maestru de concert, implicată în pregătirea elevilor pentru concerte și concursuri.'
            },
            {
                name: 'Prepeleac Tatiana',
                role: 'Profesoară de solfegiu și teoria muzicii',
                img: placeholder,
                studii: 'Studii profesional tehnice, Colegiul de muzică din Tiraspol',
                stagiu: '3 ani',
                dob: '',
                desc: 'Predă solfegiul și teoria muzicii, focus pe bazele teoretice și auditive ale muzicii.'
            },
            {
                name: 'Burlac Valeriu',
                role: 'Profesor de instrumente aerofone, grad didactic doi',
                img: '../images/Burlac-Valeriu.jpg',
                studii: 'Studii superioare, Institutul de Arte „G. Muzicescu”',
                stagiu: '40 ani',
                dob: '18 mai 1946',
                desc: 'Profesor veteran cu o vastă experiență în interpretare și pedagogie instrumentală.'
            },
            {
                name: 'Dîrul Vladislav',
                role: 'Profesor de clarinet și saxofon',
                img: '../images/Dirul-Vladislav.jpg',
                studii: 'Studii superioare, Universitatea de Stat din Comrat',
                stagiu: '3 ani',
                dob: '16 mai 1996',
                desc: 'Specialist în muzică de cameră și repertoriu pentru instrumente de suflat.'
            },
            {
                name: 'Glinca Ludmila',
                role: 'Profesoară de pian, maestru de concert',
                img: '../images/Glinca-Ludmila.jpg',
                studii: 'Studii profesional tehnice, Colegiul de Muzică „Ștefan Neaga”',
                stagiu: '45 ani',
                dob: '',
                desc: 'Pedagog cu experiență în formarea tehnicii pianistică și sensibilității muzicale.'
            },
            {
                name: 'Manin Nelea',
                role: 'Profesoară de pian, grad didactic doi',
                img: '../images/Manin-Nelea.JPG',
                studii: 'Studii profesional tehnice, Colegiul pedagogic din Bender',
                stagiu: '29 ani',
                dob: '',
                desc: 'Lucrează cu toate vârstele, pune accent pe repertoriu și dezvoltare tehnică.'
            },
            {
                name: 'Ilieș Nina',
                role: 'Profesoară de solfegiu și pian general, grad didactic doi',
                img: '../images/Ilies-Nelea.jpg',
                studii: 'Studii profesional tehnice, Colegiul de muzică „Ștefan Neaga”',
                stagiu: '48 ani',
                dob: '24 noiembrie 1958',
                desc: 'Profesor cu vastă experiență în educația muzicală generală și pregătire teoretică.'
            },
            {
                name: 'Telpis Ecaterina',
                role: 'Profesoară de canto și pian',
                img: '../images/Telpis-Ecaterina.jpg',
                studii: 'Studii superioare, Universitatea de Stat din Comrat',
                stagiu: '3 ani',
                dob: '29 mai 1995',
                desc: 'Lucrează atât vocea, cât și acompaniamentul pianistic, orientare spre expresivitate.'
            },
            {
                name: 'Ala Belenciuc',
                role: 'Profesoară de acordeon, literatură muzicală, grad didactic doi',
                img: '../images/Belenciuc-Ala.jpg',
                studii: 'Studii profesional tehnice, colegiul pedagogic din Bender',
                stagiu: '',
                dob: '',
                desc: 'Specializată în acordeon și repertoriu tradițional, pregătește elevii pentru ansambluri.'
            },
            {
                name: 'Natalia Corețchi',
                role: 'Profesoară de pian și coregrafie, maestru de concert, grad didactic doi',
                img: placeholder,
                studii: 'Studii profesional tehnice, Colegiul de muzică și coregrafie „Ștefan Neaga”',
                stagiu: '',
                dob: '1 martie 1968',
                desc: 'Conduce activ programe mixte, combinând pregătirea muzicală cu elemente coregrafice.'
            },
            {
                name: 'Mîndru Petru',
                role: 'Profesor de vioară și chitară, grad didactic doi, conducător de orchestră populară',
                img: '../images/Mindru-Petru.JPG',
                studii: 'Studii profesional tehnice, Colegiul de Arte din Soroca',
                stagiu: '',
                dob: '10 iulie 1962',
                desc: 'Conducător de orchestră populară, cu experiență în muzică tradițională și interpretare.'
            }
        ],
        creatie: [
            {
                name: 'Bulgaru Ala',
                role: 'Profesoară de coregrafie, grad didactic doi — Conducătoarea colectivului „KorAll”',
                img: placeholder,
                studii: 'Studii superioare, Universitatea de Stat „Ion Creangă”',
                stagiu: '5 ani',
                dob: '21 noiembrie 1996',
                desc: 'Coregraf dedicată lucrului cu formații, axată pe dans contemporan și scenografie.'
            },
            {
                name: 'Sitișco Ruslan',
                role: 'Profesor de coregrafie, grad didactic doi — Conducătorul colectivului „Criodance”',
                img: '../images/Sitisco-Ruslan.jpg',
                studii: 'Studii superioare, Academia de Muzică, Teatru și Arte Plastice',
                stagiu: '14 ani',
                dob: '8 octombrie 1983',
                desc: 'Antrenor și coregraf cu experiență în competiții naționale și internaționale.'
            },
            {
                name: 'Ala Roșcovanu',
                role: 'Profesoară de Arte plastice',
                img: '../images/Roscovanu-Ala.jpg',
                studii: 'Studii superioare de master, Universitatea de Stat „Ion Creangă”',
                stagiu: '5 ani',
                dob: '',
                desc: 'Membra Uniunii Meșterilor Populari din R. Moldova, lucrează în tehnici tradiționale.'
            },
            {
                name: 'Irina Godoroja',
                role: 'Profesoară de coregrafie, antrenor-arbitru internațional la dans modern — Conducătoarea colectivului „Victoria Juniorii”',
                img: '../images/Godoroja-Irina.jpg',
                studii: 'Studii superioare, Universitatea de Stat „Ion Creangă”',
                stagiu: '',
                dob: '25 iunie 1989',
                desc: 'Coregraf și arbitru internațional, cu accent pe dans modern și competiții.'
            },
            {
                name: 'Șerbu Mihail',
                role: 'Profesor Arta plastică, grad didactic doi',
                img: '../images/Serbu-Mihail.jpg',
                studii: 'Studii superioare, Universitatea „Ion Creangă”',
                stagiu: 'peste 35 ani',
                dob: '24 iulie 1967',
                desc: 'Artist și pedagog cu o îndelungată carieră în artele vizuale.'
            }
        ]
    };

    function renderProfessors(list, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        list.forEach((prof, idx) => {
            const card = document.createElement('article');
            card.className = `prof-card reveal ${idx % 2 === 0 ? 'from-left' : 'from-right'} ${idx % 2 === 1 ? 'reverse' : ''}`;

            card.innerHTML = `
                <div class="prof-card-inner">
                    <div class="prof-image">
                        <img src="${prof.img}" alt="${prof.name}" loading="lazy" width="240" height="240">
                    </div>
                    <div class="prof-info">
                        <h3>${prof.name}</h3>
                        <p class="prof-role">${prof.role}</p>
                        <div class="prof-meta">
                            ${prof.studii ? `<p><strong>Studii:</strong> ${prof.studii}</p>` : ''}
                            ${prof.stagiu ? `<p><strong>Stagiu:</strong> ${prof.stagiu}</p>` : ''}
                            ${prof.dob ? `<p><strong>Data nașterii:</strong> ${prof.dob}</p>` : ''}
                        </div>
                        <p class="prof-desc">${prof.desc}</p>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    // Render sections
    renderProfessors(data.music, 'music-professors');
    renderProfessors(data.creatie, 'creatie-professors');

    // Intersection Observer for reveal animations
    const observerOptions = { threshold: 0.12 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    // Set referrer/back links for header buttons (only same-origin; external/direct access uses fallback)
    (function setRefLinks() {
        const fallback = '../pages/despre.html';
        const ref = document.referrer;
        ['referrer-link-top', 'referrer-link-menu'].forEach(id => {
            const a = document.getElementById(id);
            if (!a) return;
            // Check if referrer is same-origin (internal link)
            if (ref && new URL(ref).origin === window.location.origin) {
                a.href = ref;
            } else {
                // External referrer or direct access - use fallback page
                a.href = fallback;
            }
        });
    })();
});
