// Favorites functionality
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function initFavorites() {
    const favoritesModal = document.getElementById('favoritesModal');
    const favoriteIcon = document.getElementById('favorite-icon');
    const favoriteBadge = document.getElementById('favorite-badge');
    const favoritesBody = document.getElementById('favoritesBody');
    const favoritesClose = document.querySelector('.favorites-close');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    if (!favoritesModal || !favoriteIcon) return;

    // Update favorite badge
    function updateFavoriteBadge() {
        favoriteBadge.textContent = favorites.length;
        if (favorites.length > 0) {
            favoriteBadge.style.display = 'flex';
        } else {
            favoriteBadge.style.display = 'none';
        }
    }

    // Save favorites to localStorage
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteBadge();
    }

    // Add product to favorites
    function addToFavorites(productId) {
        const product = products[productId];
        if (!product) return;

        if (!favorites.find(item => item.id === productId)) {
            favorites.push({
                id: productId,
                name: product.name,
                image: product.image,
                price: product.price
            });
            saveFavorites();
            updateFavoriteButtons();
            showFavoriteNotification('Added to favorites!', 'success');
        }
    }

    // Remove product from favorites
    function removeFromFavorites(productId) {
        favorites = favorites.filter(item => item.id !== productId);
        saveFavorites();
        updateFavoriteButtons();
        renderFavorites();
        showFavoriteNotification('Removed from favorites', 'info');
    }

    // Toggle favorite
    function toggleFavorite(productId) {
        const isFavorite = favorites.find(item => item.id === productId);
        if (isFavorite) {
            removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }
    }

    // Update favorite buttons state
    function updateFavoriteButtons() {
        favoriteButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            if (productCard) {
                const productId = productCard.getAttribute('data-product');
                if (productId && favorites.find(item => item.id === productId)) {
                    button.querySelector('i').classList.remove('far');
                    button.querySelector('i').classList.add('fas');
                    button.style.color = '#ef4444';
                } else {
                    button.querySelector('i').classList.remove('fas');
                    button.querySelector('i').classList.add('far');
                    button.style.color = '#1a1a1a';
                }
            }
        });
    }

    // Render favorites
    function renderFavorites() {
        if (favorites.length === 0) {
            favoritesBody.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart"></i>
                    <p>Your favorites list is empty</p>
                    <p style="margin-top: 10px; font-size: 14px;">Add items to favorites by clicking the heart icon on products</p>
                </div>
            `;
            return;
        }

        favoritesBody.innerHTML = `
            <div class="favorites-grid">
                ${favorites.map(item => {
                    const product = products[item.id];
                    return `
                        <div class="favorite-item">
                            <div class="favorite-item-image">
                                <img src="${item.image}" alt="${item.name}" style="cursor: pointer;" onclick="openProductModal('${item.id}')">
                                <button class="favorite-item-remove" onclick="removeFromFavorites('${item.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="favorite-item-info">
                                <h3 class="favorite-item-name">${item.name}</h3>
                                <p class="favorite-item-price">${item.price}</p>
                                <div class="favorite-item-actions">
                                    <button class="btn-add-cart" onclick="addToCart('${item.id}')">Add to cart</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Show notification
    function showFavoriteNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'favorite-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#10b981' : '#8b5cf6'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Open favorites modal
    function openFavoritesModal() {
        renderFavorites();
        favoritesModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close favorites modal
    function closeFavoritesModal() {
        favoritesModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Make functions global
    window.removeFromFavorites = removeFromFavorites;
    window.toggleFavorite = toggleFavorite;

    // Add event listeners
    favoriteIcon.addEventListener('click', openFavoritesModal);
    
    if (favoritesClose) {
        favoritesClose.addEventListener('click', closeFavoritesModal);
    }

    favoritesModal.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            closeFavoritesModal();
        }
    });

    // Add click event to favorite buttons on product cards
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product');
            if (productId) {
                toggleFavorite(productId);
            }
        });
    });

    // Initialize
    updateFavoriteBadge();
    updateFavoriteButtons();
    renderFavorites();
}

