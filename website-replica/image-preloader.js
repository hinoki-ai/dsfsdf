
// Image preloader for better performance
document.addEventListener('DOMContentLoaded', function() {
    const imageElements = document.querySelectorAll('.product-image, .item-image, .category-image');

    imageElements.forEach(img => {
        if (img.style.backgroundImage && img.style.backgroundImage !== 'none') {
            const imgUrl = img.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (imgUrl && imgUrl[1]) {
                const fullUrl = imgUrl[1];

                // Create a temporary image to preload
                const tempImg = new Image();
                tempImg.onload = function() {
                    // Image loaded successfully
                    img.style.opacity = '1';
                };
                tempImg.onerror = function() {
                    // Fallback to gradient if image fails to load
                    img.style.backgroundImage = 'linear-gradient(135deg, hsl(var(--amber-100)), hsl(var(--burgundy-100)))';
                };
                tempImg.src = fullUrl;
            }
        }
    });

    console.log('🍷 ARAMAC image preloader initialized');
});
