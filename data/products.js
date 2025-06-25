const products = [
  {
    id: '1',
    name: 'Men\'s Casual T-Shirt',
    price: 24.99,
    description: 'Comfortable cotton t-shirt with a modern fit. Perfect for everyday wear.',
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    category: 'men',
    featured: true,
    inStock: true,
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Women\'s Summer Dress',
    price: 49.99,
    description: 'Lightweight floral dress perfect for summer days. Features a flattering A-line cut.',
    image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    category: 'women',
    featured: true,
    inStock: true,
    colors: ['Floral Print', 'Blue', 'Red'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '3',
    name: 'Men\'s Slim Fit Jeans',
    price: 59.99,
    description: 'Classic slim fit jeans with a modern touch. Made from high-quality denim.',
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    category: 'men',
    featured: false,
    inStock: true,
    colors: ['Blue', 'Black', 'Grey'],
    sizes: ['30', '32', '34', '36']
  },
  {
    id: '4',
    name: 'Women\'s Blouse',
    price: 34.99,
    description: 'Elegant blouse suitable for both casual and formal occasions.',
    image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    category: 'women',
    featured: false,
    inStock: true,
    colors: ['White', 'Black', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '5',
    name: 'Men\'s Formal Shirt',
    price: 44.99,
    description: 'Classic formal shirt made from premium cotton. Perfect for business meetings.',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    category: 'men',
    featured: true,
    inStock: true,
    colors: ['White', 'Light Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '6',
    name: 'Women\'s Jeans',
    price: 54.99,
    description: 'Comfortable and stylish jeans with a perfect fit. Made from stretchy denim material.',
    image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    category: 'women',
    featured: true,
    inStock: true,
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['26', '28', '30', '32', '34']
  },
  {
    id: '7',
    name: 'Men\'s Hoodie',
    price: 39.99,
    description: 'Warm and comfortable hoodie perfect for cooler days. Features a kangaroo pocket.',
    image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
    category: 'men',
    featured: false,
    inStock: true,
    colors: ['Grey', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '8',
    name: 'Women\'s Cardigan',
    price: 45.99,
    description: 'Soft and cozy cardigan that can be layered over any outfit. Perfect for fall and winter.',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    category: 'women',
    featured: false,
    inStock: true,
    colors: ['Beige', 'Grey', 'Black'],
    sizes: ['S', 'M', 'L']
  }
];

// Get all products
function getAllProducts() {
  return products;
}

// Get products by category
function getProductsByCategory(category) {
  return products.filter(product => product.category === category);
}

// Get featured products
function getFeaturedProducts() {
  return products.filter(product => product.featured);
}

// Get product by ID
function getProductById(id) {
  return products.find(product => product.id === id);
}

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductById
}; 