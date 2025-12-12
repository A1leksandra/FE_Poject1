// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.getElementById('cart-icon');
    const cartBadge = document.getElementById('cart-badge');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    const cartClose = document.querySelector('.cart-close');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const modalAddToCart = document.getElementById('modalAddToCart');

    if (!cartModal || !cartIcon || !cartBadge) return;

    // Update cart badge
    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
    }

    // Add product to cart
    function addToCart(productId) {
        const product = products[productId];
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                image: product.image,
                price: parseFloat(product.price.replace('$', '')),
                quantity: 1
            });
        }

        saveCart();
        renderCart();
        showCartNotification();
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
    }

    // Update item quantity
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCart();
            }
        }
    }

    // Render cart
    function renderCart() {
        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = '$0.00';
            return;
        }

        let total = 0;
        cartBody.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Show cart notification
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Item added to cart!';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #8b5cf6;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Open cart modal
    function openCartModal() {
        renderCart();
        cartModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close cart modal
    function closeCartModal() {
        cartModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Make functions global for onclick handlers
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    window.addToCart = addToCart;

    // Add event listeners
    cartIcon.addEventListener('click', openCartModal);
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCartModal);
    }

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    // Add to cart buttons
    addToCartButtons.forEach(button => {
        if (button.id !== 'modalAddToCart') {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productId = productCard.getAttribute('data-product');
                if (productId) {
                    addToCart(productId);
                }
            });
        }
    });

    // Modal add to cart button
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', () => {
            const currentProductId = window.getCurrentModalProductId ? window.getCurrentModalProductId() : null;
            if (currentProductId) {
                addToCart(currentProductId);
                if (window.closeProductModal) {
                    window.closeProductModal();
                }
            }
        });
    }

    // Initialize cart
    updateCartBadge();
    renderCart();
}

