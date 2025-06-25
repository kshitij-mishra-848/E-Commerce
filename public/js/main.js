// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
  
  // Product Detail Page - Color and Size Selection
  const colorOptions = document.querySelectorAll('.color-option');
  const sizeOptions = document.querySelectorAll('.size-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      sizeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Quantity Buttons
  const minusBtn = document.querySelector('.quantity-minus');
  const plusBtn = document.querySelector('.quantity-plus');
  const quantityInput = document.querySelector('.quantity-input');
  
  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });
    
    plusBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      quantityInput.value = value + 1;
    });
  }
  
  // Add to Cart Button
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      // Get product details
      const productId = this.getAttribute('data-id');
      const productName = document.querySelector('.product-detail-info h1').textContent;
      const productPrice = document.querySelector('.product-detail-price').textContent;
      const productQuantity = document.querySelector('.quantity-input').value;
      const selectedColor = document.querySelector('.color-option.active')?.textContent || '';
      const selectedSize = document.querySelector('.size-option.active')?.textContent || '';
      
      // Create cart item object
      const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        color: selectedColor,
        size: selectedSize,
        image: document.querySelector('.product-detail-img img').src
      };
      
      // Get existing cart from localStorage or initialize empty array
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.color === selectedColor && 
        item.size === selectedSize
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity = parseInt(cart[existingItemIndex].quantity) + parseInt(productQuantity);
      } else {
        // Add new item to cart
        cart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart count
      updateCartCount();
      
      // Show success message
      alert('Product added to cart!');
    });
  }
  
  // Update Cart Count
  function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartCountElement) {
      const totalItems = cart.reduce((total, item) => total + parseInt(item.quantity), 0);
      cartCountElement.textContent = totalItems;
    }
  }
  
  // Initialize cart count on page load
  updateCartCount();
  
  // Cart Page Functionality
  if (window.location.pathname.includes('/cart')) {
    displayCartItems();
    
    // Remove item from cart
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-btn')) {
        const itemIndex = e.target.getAttribute('data-index');
        removeCartItem(itemIndex);
      }
    });
  }
  
  // Display Cart Items
  function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItemsContainer) {
      if (cart.length === 0) {
        // Show empty cart message
        document.querySelector('.cart-container').innerHTML = `
          <div class="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <a href="/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        `;
        return;
      }
      
      // Generate cart items HTML
      let cartItemsHTML = '';
      let subtotal = 0;
      
      cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price.replace('$', ''));
        const itemTotal = itemPrice * parseInt(item.quantity);
        subtotal += itemTotal;
        
        cartItemsHTML += `
          <div class="cart-item">
            <div class="cart-item-img">
              <img src="${item.image || '/images/placeholder.jpg'}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h3>${item.name}</h3>
              <p>Color: ${item.color}</p>
              <p>Size: ${item.size}</p>
            </div>
            <div class="cart-item-price">$${itemPrice.toFixed(2)}</div>
            <div class="cart-item-quantity">
              <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
            </div>
            <button class="remove-btn" data-index="${index}">×</button>
          </div>
        `;
      });
      
      cartItemsContainer.innerHTML = cartItemsHTML;
      
      // Calculate and display summary
      const shipping = subtotal > 50 ? 0 : 10;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;
      
      cartSummaryContainer.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-item">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
          <span>Shipping:</span>
          <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item">
          <span>Tax:</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-item summary-total">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary checkout-btn" style="width: 100%; margin-top: 1rem;">Checkout</button>
      `;

      // Add checkout button event listener
      const checkoutBtn = cartSummaryContainer.querySelector('.checkout-btn');
      checkoutBtn.addEventListener('click', handleCheckout);
    }
  }
  
  // Handle checkout process
  function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    // Show checkout form
    const cartContainer = document.querySelector('.cart-container');
    const checkoutForm = `
      <div class="checkout-form">
        <h2 class="section-title">Checkout</h2>
        <form id="payment-form" class="payment-form">
          <div class="form-group">
            <h3>Shipping Information</h3>
            <input type="text" placeholder="Full Name" required>
            <input type="email" placeholder="Email" required>
            <input type="text" placeholder="Address" required>
            <input type="text" placeholder="City" required>
            <input type="text" placeholder="State/Province" required>
            <input type="text" placeholder="ZIP/Postal Code" required>
            <input type="text" placeholder="Country" required>
          </div>
          
          <div class="form-group">
            <h3>Payment Information</h3>
            <input type="text" placeholder="Card Number" required>
            <div class="card-details">
              <input type="text" placeholder="MM/YY" required>
              <input type="text" placeholder="CVV" required>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Place Order</button>
          <button type="button" class="btn btn-secondary" onclick="window.location.href='/cart'">Back to Cart</button>
        </form>
      </div>
    `;
    
    cartContainer.innerHTML = checkoutForm;

    // Add form submission handler
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would typically send the form data to your server
      // For this demo, we'll just show a success message and clear the cart
      alert('Order placed successfully! Thank you for shopping with us.');
      localStorage.removeItem('cart');
      window.location.href = '/';
    });
  }
  
  // Remove Cart Item
  function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    displayCartItems();
    updateCartCount();
  }

  // Add styles for checkout form
  const style = document.createElement('style');
  style.textContent = `
    .checkout-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group h3 {
      margin-bottom: 1rem;
    }

    .payment-form input {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }

    .card-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .payment-form .btn {
      margin-top: 1rem;
    }

    .payment-form .btn-secondary {
      margin-top: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Search functionality
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let allProducts = [];

  // Fetch all products data
  fetch('/api/products')
    .then(response => response.json())
    .then(products => {
      allProducts = products;
    })
    .catch(error => console.error('Error fetching products:', error));

  // Handle search input
  searchInput.addEventListener('input', debounce(handleSearchInput, 300));

  // Close search results when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-container')) {
      searchResults.classList.remove('active');
    }
  });

  function handleSearchInput() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.classList.remove('active');
      return;
    }

    const filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );

    displaySearchResults(filteredProducts);
  }

  function displaySearchResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No products found</div>';
    } else {
      searchResults.innerHTML = results.map(product => `
        <a href="/products/${product.id}" class="search-result-item">
          <img src="${product.image}" alt="${product.name}" class="search-result-img">
          <div class="search-result-info">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
          </div>
        </a>
      `).join('');
    }
    
    searchResults.classList.add('active');
  }

  // Debounce function to limit API calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle search form submission
  window.handleSearch = function(event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
    return false;
  };
}); 