// Product Modal functionality
let currentModalProductId = null;

function initProductModal() {
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const productImages = document.querySelectorAll('.product-img');

    if (!modal) return;

    // Function to open modal
    function openModal(productId) {
        const product = products[productId];
        if (!product) return;

        currentModalProductId = productId;

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

    // Export functions for use in other modules
    window.openProductModal = openModal;
    window.closeProductModal = closeModal;
    window.getCurrentModalProductId = () => currentModalProductId;
}

