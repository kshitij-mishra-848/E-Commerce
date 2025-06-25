# Fashion Store E-commerce Website

A modern e-commerce website built with Express.js, featuring a responsive design and intuitive shopping experience for men's and women's clothing.

## Features

- 🛍️ Browse products by category (Men's and Women's clothing)
- 🔍 Real-time search functionality
- 🛒 Shopping cart with local storage
- 👤 User authentication (login/register)
- 📱 Fully responsive design
- 🔐 Secure checkout process
- 🎯 Product filtering and sorting

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript templates)
- Bootstrap 5
- Font Awesome
- Local Storage for cart management

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit `http://localhost:3000` in your browser

## Project Structure

```
fashion-store/
├── config/             # Configuration files
├── models/            # Database models
├── public/            # Static files
│   ├── css/          # Stylesheets
│   ├── js/           # Client-side JavaScript
│   └── images/       # Image assets
├── routes/           # Route handlers
├── views/            # EJS templates
├── app.js           # Application entry point
└── package.json     # Project dependencies
```

## Features to Add

- [ ] User profile management
- [ ] Admin dashboard
- [ ] Payment gateway integration
- [ ] Order history
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Social media authentication

## License

This project is licensed under the MIT License.

## Acknowledgments

- Bootstrap for the responsive design framework
- Font Awesome for the icons
- Express.js community for the excellent documentation
- MongoDB for the database solution 