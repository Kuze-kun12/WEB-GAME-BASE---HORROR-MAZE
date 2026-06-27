(function(){
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('counter');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        counter.textContent = `${index + 1} / ${slides.length}`;
    }

    function advance() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            showSlide(currentIndex);
        } else {
            window.location.href = 'maze-game.html';
        }
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            advance();
        }
    });

    document.addEventListener('click', () => advance());
})();
