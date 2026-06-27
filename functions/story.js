(function(){
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('image-counter');
    let currentIndex = 0;

    // Change this to the path or URL of your next HTML file
    const NEXT_PAGE_URL = "maze-game.html";

    function handleAdvance() {
        if (currentIndex === slides.length - 1) {
            window.location.href = NEXT_PAGE_URL;
            return;
        }

        slides[currentIndex].classList.remove('active');
        currentIndex++;
        slides[currentIndex].classList.add('active');
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleAdvance();
        }
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('kbd')) {
            handleAdvance();
        }
    });
})();
