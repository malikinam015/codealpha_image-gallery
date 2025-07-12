document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // State
    let currentImageIndex = 0;
    let activeCategory = 'all';
    let activeCategoryImages = [];

    // Initialize - Set default active filter and load first image
    function initializeGallery() {
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');  
        filterGallery('all');
        updateActiveCategoryImages('all');
        
        // Display first image in lightbox if available
        if (activeCategoryImages.length > 0) {
            lightboxImage.src = activeCategoryImages[0].src;
            lightboxCaption.textContent = activeCategoryImages[0].nextElementSibling.textContent;
        }
    }

    // Filter visible gallery items
    function filterGallery(category) {
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Update array of images for current category
    function updateActiveCategoryImages(category) {
        if (category === 'all') {
            activeCategoryImages = Array.from(document.querySelectorAll('.gallery-image'));
        } else {
            activeCategoryImages = Array.from(
                document.querySelectorAll(`.gallery-item[data-category="${category}"] .gallery-image`)
            );
        }
    }

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            activeCategory = this.dataset.filter;
            filterGallery(activeCategory);
            updateActiveCategoryImages(activeCategory);
            currentImageIndex = 0;
            updateLightbox();
        });
    });

    // Lightbox navigation
    lightboxPrev.addEventListener('click', function() {
        if (activeCategoryImages.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + activeCategoryImages.length) % activeCategoryImages.length;
        updateLightbox();
    });

    lightboxNext.addEventListener('click', function() {
        if (activeCategoryImages.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % activeCategoryImages.length;
        updateLightbox();
    });

    // Image click handler
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-image');
        img.addEventListener('click', function() {
            const category = item.dataset.category;
            
            if (category !== activeCategory) {
                activeCategory = category;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
                filterGallery(category);
                updateActiveCategoryImages(category);
                currentImageIndex = activeCategoryImages.indexOf(img);
            } else {
                currentImageIndex = activeCategoryImages.indexOf(img);
            }
            
            updateLightbox();
        });
    });

    // Update lightbox display
    function updateLightbox() {
        if (activeCategoryImages.length > 0) {
            lightboxImage.style.opacity = 0;
            setTimeout(() => {
                lightboxImage.src = activeCategoryImages[currentImageIndex].src;
                lightboxCaption.textContent = activeCategoryImages[currentImageIndex].nextElementSibling.textContent;
                lightboxImage.style.opacity = 1;
            }, 300);
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    initializeGallery();
});