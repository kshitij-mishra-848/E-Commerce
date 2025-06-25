document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('#searchForm');
    const searchInput = document.querySelector('#searchInput');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length < 2) {
                e.preventDefault();
                alert('Please enter at least 2 characters to search');
                return false;
            }
        });
    }

    // Real-time search suggestions
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function(e) {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 2) {
                try {
                    const response = await fetch(`/api/products`);
                    const products = await response.json();
                    
                    const filteredProducts = products.filter(product => 
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    updateSearchSuggestions(filteredProducts.slice(0, 5));
                } catch (error) {
                    console.error('Error fetching search suggestions:', error);
                }
            } else {
                clearSearchSuggestions();
            }
        }, 300));

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                clearSearchSuggestions();
            }
        });
    }
});

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

function updateSearchSuggestions(products) {
    let suggestionsContainer = document.querySelector('#searchSuggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'search-suggestions';
        document.querySelector('.search-container').appendChild(suggestionsContainer);
    }

    if (products.length > 0) {
        const html = products.map(product => `
            <div class="suggestion-item" onclick="window.location.href='/products/${product.id}'">
                <img src="${product.image}" alt="${product.name}" class="suggestion-image">
                <div class="suggestion-details">
                    <div class="suggestion-name">${product.name}</div>
                    <div class="suggestion-price">$${product.price}</div>
                </div>
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
    } else {
        clearSearchSuggestions();
    }
}

function clearSearchSuggestions() {
    const suggestionsContainer = document.querySelector('#searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
} 