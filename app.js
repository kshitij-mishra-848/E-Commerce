const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const productsData = require(path.join(__dirname, 'data', 'products'));
const ejsLayouts = require('express-ejs-layouts');

// Passport config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection with retry logic
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fashion_store';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Set up middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session with updated MongoStore configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fashion_store',
        ttl: 24 * 60 * 60 // Session TTL (1 day)
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production' // Set to true in production
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Set up EJS with layouts
app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Global variables middleware (before routes)
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.error = req.flash('error');
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    next();
});

// CORS handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/auth', require('./routes/auth'));

// Protected route middleware
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in to view this resource');
    res.redirect('/auth/login');
};

// API Routes
app.get('/api/products', (req, res) => {
    try {
        const products = productsData.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Routes
app.get('/', (req, res) => {
    try {
        res.render('index', { 
            title: 'Fashion Store - Home',
            products: productsData.getFeaturedProducts(),
            productsData
        });
    } catch (error) {
        next(error);
    }
});

app.get('/products', (req, res, next) => {
  try {
    const category = req.query.category ? req.query.category.toLowerCase() : null;
    const searchQuery = req.query.search ? req.query.search.trim() : null;
    
    // Validate category
    if (category && !['men', 'women'].includes(category)) {
      return res.status(400).render('error', {
        title: 'Invalid Category',
        message: 'Invalid category specified',
        productsData
      });
    }

    let products;
    
    if (searchQuery) {
      // Search functionality with validation
      if (searchQuery.length < 2) {
        return res.status(400).render('error', {
          title: 'Invalid Search',
          message: 'Search query must be at least 2 characters long',
          productsData
        });
      }
      
      products = productsData.getAllProducts().filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      res.render('products', { 
        title: `Search Results for "${searchQuery}"`,
        products,
        category: null,
        searchQuery,
        productsData
      });
    } else if (category) {
      products = productsData.getProductsByCategory(category);
      res.render('products', { 
        title: category === 'men' ? 'Men\'s Clothing' : 'Women\'s Clothing',
        products,
        category,
        searchQuery: null,
        productsData
      });
    } else {
      products = productsData.getAllProducts();
      res.render('products', { 
        title: 'All Products',
        products,
        category: null,
        searchQuery: null,
        productsData
      });
    }
  } catch (error) {
    next(error);
  }
});

app.get('/products/:id', (req, res, next) => {
  try {
    const product = productsData.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).render('404', { 
        title: 'Product Not Found',
        productsData
      });
    }
    
    res.render('product-detail', { 
      title: product.name,
      product,
      productsData
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
app.get('/cart', ensureAuthenticated, (req, res, next) => {
    try {
        res.render('cart', { 
            title: 'Shopping Cart',
            productsData
        });
    } catch (error) {
        next(error);
    }
});

app.get('/orders', ensureAuthenticated, (req, res, next) => {
    try {
        res.render('orders', { 
            title: 'My Orders',
            productsData
        });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong! Please try again later.',
        productsData
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { 
        title: '404 - Page Not Found',
        productsData
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 