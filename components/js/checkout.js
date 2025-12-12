// Checkout functionality
function initCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutClose = document.querySelector('.checkout-close');
    const checkoutForm = document.getElementById('checkoutForm');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');

    if (!checkoutModal || !checkoutBtn) return;

    // Open checkout modal
    function openCheckoutModal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        renderCheckoutItems(cart);
        calculateTotals(cart);
        checkoutModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close checkout modal
    function closeCheckoutModal() {
        checkoutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Render checkout items
    function renderCheckoutItems(cart) {
        const checkoutItems = document.getElementById('checkoutItems');
        
        checkoutItems.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="summary-item">
                    <span class="summary-item-name">${item.name} x${item.quantity}</span>
                    <span class="summary-item-price">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');
    }

    // Calculate totals
    function calculateTotals(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 5.00;
        const total = subtotal + shipping;

        document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    }

    // Toggle card details based on payment method
    function toggleCardDetails() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (selectedMethod === 'card') {
            cardDetails.classList.remove('hidden');
            // Make card fields required
            document.getElementById('cardNumber').required = true;
            document.getElementById('expiryDate').required = true;
            document.getElementById('cvv').required = true;
        } else {
            cardDetails.classList.add('hidden');
            // Remove required from card fields
            document.getElementById('cardNumber').required = false;
            document.getElementById('expiryDate').required = false;
            document.getElementById('cvv').required = false;
        }
    }

    // Format card number
    function formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
        input.value = formattedValue;
    }

    // Format expiry date
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }

    // Format CVV
    function formatCVV(input) {
        input.value = input.value.replace(/\D/g, '').substring(0, 3);
    }

    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const formData = {
                shipping: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('checkoutEmail').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    zipCode: document.getElementById('zipCode').value,
                    country: document.getElementById('country').value
                },
                payment: {
                    method: document.querySelector('input[name="paymentMethod"]:checked').value,
                    cardNumber: document.getElementById('cardNumber').value,
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value
                },
                items: cart,
                total: parseFloat(document.getElementById('checkoutTotal').textContent.replace('$', ''))
            };

            // Save order
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                ...formData
            };
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success message
            showCheckoutSuccess(order);
            
            // Close modals
            closeCheckoutModal();
            if (window.closeCartModal) {
                window.closeCartModal();
            }
            
            // Update cart badge - trigger custom event
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        });
    }

    // Show success message
    function showCheckoutSuccess(order) {
        const successModal = document.createElement('div');
        successModal.className = 'modal show';
        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#1a1a1a' : '#ffffff';
        const subtitleColor = isLightTheme ? '#666666' : '#b0b0b0';
        
        successModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; text-align: center; padding: 40px;">
                <div style="font-size: 64px; color: #10b981; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: ${textColor}; margin-bottom: 15px;">Order Placed Successfully!</h2>
                <p style="color: ${subtitleColor}; margin-bottom: 20px;">Thank you for your purchase. Your order #${order.id} has been confirmed.</p>
                <p style="color: #8b5cf6; font-size: 24px; font-weight: 700; margin-bottom: 30px;">Total: $${order.total.toFixed(2)}</p>
                <button class="btn-primary" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">Close</button>
            </div>
        `;
        document.body.appendChild(successModal);
        document.body.style.overflow = 'hidden';
    }

    // Event listeners
    checkoutBtn.addEventListener('click', openCheckoutModal);
    
    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckoutModal);
    }

    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    // Payment method change
    paymentMethods.forEach(method => {
        method.addEventListener('change', toggleCardDetails);
    });

    // Format inputs
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', () => formatExpiryDate(expiryDateInput));
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', () => formatCVV(cvvInput));
    }

    // Initialize
    toggleCardDetails();
}

