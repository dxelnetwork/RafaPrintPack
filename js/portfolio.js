/* ====== PORTFOLIO INTERACTION LOGIC ====== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- FACTORY & AWARDS DATA --- */
    const factoryImages = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "g (1).JPG", "g (2).jpg", "g (3).jpg", "g (4).jpg"
    ];

    const awardImages = [
        "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg", "10.jpeg",
        "11.jpeg", "12.jpeg", "13.jpeg", "14.jpeg", "15.jpeg", "16.jpeg", "17.jpeg", "18.jpeg", "19.jpeg", "20.jpeg",
        "21.jpeg", "22.jpeg", "23.jpeg", "24.jpeg", "25.jpeg"
    ];

    /* --- 1. POPULATE CAROUSELS --- */
    const factoryCarousel = document.getElementById('factoryCarousel');
    const awardsSlider = document.getElementById('awardsSlider');

    // Factory
    factoryCarousel.innerHTML = factoryImages.map((src) => 
        `<div class="carousel-3d-item"><img src="Project Images/portfolio/factory/${src}" alt="Factory Image"></div>`
    ).join('');

    // Awards
    awardsSlider.innerHTML = awardImages.map((src) => 
        `<div class="award-card"><img src="Project Images/portfolio/awards/${src}" alt="Award Image"></div>`
    ).join('');

    const factoryItems = document.querySelectorAll('.carousel-3d-item');
    const awardCards = document.querySelectorAll('.award-card');

    /* --- 2. FACTORY 3D CAROUSEL LOGIC --- */
    const factoryPrev = document.getElementById('factoryPrev');
    const factoryNext = document.getElementById('factoryNext');
    
    let factoryAngle = 0;
    const itemsCount = factoryItems.length;
    const theta = 360 / itemsCount;
    // Radius calculation based on width to avoid overlap
    const radius = Math.round((400 / 2) / Math.tan(Math.PI / itemsCount));

    function setupFactory() {
        factoryItems.forEach((item, i) => {
            const angle = theta * i;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            item.addEventListener('click', () => rotateTo(i));
        });
    }

    function rotateTo(index) {
        factoryAngle = -theta * index;
        factoryCarousel.style.transform = `rotateY(${factoryAngle}deg)`;
        factoryItems.forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    factoryNext.addEventListener('click', () => {
        factoryAngle -= theta;
        factoryCarousel.style.transform = `rotateY(${factoryAngle}deg)`;
        updateActiveByAngle();
    });

    factoryPrev.addEventListener('click', () => {
        factoryAngle += theta;
        factoryCarousel.style.transform = `rotateY(${factoryAngle}deg)`;
        updateActiveByAngle();
    });

    function updateActiveByAngle() {
        // Calculate which index is currently at the front based on total angle
        const normalizedAngle = ((factoryAngle % 360) + 360) % 360;
        const index = Math.round((360 - normalizedAngle) / theta) % itemsCount;
        factoryItems.forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    setupFactory();
    rotateTo(0);


    /* --- 3. STACKED AWARDS SLIDER LOGIC --- */
    const awardPrev = document.getElementById('awardPrev');
    const awardNext = document.getElementById('awardNext');
    const awardCounter = document.getElementById('awardCounter');
    const awardTitle = document.getElementById('awardTitle');
    const awardDate = document.getElementById('awardDate');
    
    let awardIndex = 0;

    function updateAwards() {
        const total = awardCards.length;
        
        awardCards.forEach((card, i) => {
            card.className = 'award-card'; 
            
            if (i === awardIndex) {
                card.classList.add('active');
            } else if (i === (awardIndex - 1 + total) % total) {
                card.classList.add('prev');
            } else if (i === (awardIndex + 1) % total) {
                card.classList.add('next');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Dynamic title - generic but professional
        awardTitle.style.opacity = 0;
        awardDate.style.opacity = 0;
        
        setTimeout(() => {
            awardTitle.textContent = `Award for Packaging Excellence — Row #${awardIndex + 1}`;
            awardDate.textContent = `Honored for outstanding printing quality and innovation across Bangladesh.`;
            awardTitle.style.opacity = 1;
            awardDate.style.opacity = 1;
        }, 300);

        awardCounter.textContent = `${awardIndex + 1} / ${total}`;
    }

    awardNext.addEventListener('click', () => {
        awardIndex = (awardIndex + 1) % awardCards.length;
        updateAwards();
    });

    awardPrev.addEventListener('click', () => {
        awardIndex = (awardIndex - 1 + awardCards.length) % awardCards.length;
        updateAwards();
    });
    
    updateAwards();

});
