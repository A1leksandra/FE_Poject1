// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

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

    // Product Modal functionality
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const productImages = document.querySelectorAll('.product-img');
    
    // Product data
    const products = {
        'pink-blouse': {
            name: 'Pink Blouse',
            image: 'images/pink dress.jpg',
            price: '$19.99',
            rating: 4.5,
            description: 'Elegant pink blouse with a modern design. Made from high-quality materials, this blouse features a comfortable fit and stylish appearance. Perfect for both casual and semi-formal occasions. The soft pink color adds a touch of femininity to any outfit.'
        },
        'top-brown': {
            name: 'Top Brown',
            image: 'images/brown top.jpg',
            price: '$24.99',
            rating: 4.5,
            description: 'Stylish brown crop top with open shoulders and voluminous sleeves. This trendy piece features button closure and pairs perfectly with high-waisted pants. Made from comfortable fabric that ensures all-day comfort. A must-have for your wardrobe.'
        },
        'leather-yellow': {
            name: 'Leather Yellow',
            image: 'images/yellow-jaket.jpg',
            price: '$49.99',
            rating: 4.5,
            description: 'Bold yellow leather bomber jacket that makes a statement. This eye-catching piece features a loose fit and can be worn over a white top. The vibrant yellow color adds energy to any outfit. Perfect for those who love to stand out with their fashion choices.'
        },
        'light-sweater': {
            name: 'Light Sweater',
            image: 'images/light sweater.jpg',
            price: '$29.99',
            rating: 4.5,
            description: 'Cozy cream-colored oversized sweater with a high collar. This comfortable piece features a relaxed fit and soft texture. Perfect for layering or wearing on its own. The neutral cream color makes it versatile and easy to pair with various bottoms.'
        }
    };

    // Function to open modal
    function openModal(productId) {
        const product = products[productId];
        if (!product) return;

        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = product.price;
        document.getElementById('modalProductDescription').textContent = product.description;
        
        // Set rating
        const ratingHtml = Array(5).fill(0).map((_, i) => {
            if (i < Math.floor(product.rating)) {
                return '<i class="fas fa-star"></i>';
            } else if (i < product.rating) {
                return '<i class="fas fa-star-half-alt"></i>';
            } else {
                return '<i class="far fa-star"></i>';
            }
        }).join('') + ` <span>${product.rating}</span>`;
        document.getElementById('modalProductRating').innerHTML = ratingHtml;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Add click event to product images
    productImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = img.closest('.product-card');
            const productId = productCard.getAttribute('data-product');
            if (productId) {
                openModal(productId);
            }
        });
    });

    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});

