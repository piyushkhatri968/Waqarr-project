# Car Financing System

A comprehensive web application for managing car financing operations.

## Features

- 👤 Customer Management
  - Register and manage customer information
  - Track car details and financing terms
  - Document upload and management
  - Automatic profit calculation

- 💰 Payment Management
  - Automatic payment schedule generation
  - Payment tracking and receipt management
  - Early close-out support
  - Payment status monitoring

- 📄 Document Management
  - Secure document upload and storage
  - Support for driver's ID and passport
  - Payment receipt attachments
  - Document preview functionality

- 📊 Reports & Analytics
  - Real-time financial dashboard
  - Custom report generation
  - Payment history tracking
  - Performance metrics

- 🤖 Telegram Bot Integration
  - Customer information access via Telegram
  - Payment status checking
  - Quick statistics and reports
  - Access the bot at [@car_nihat_bot](https://t.me/car_nihat_bot)

## Tech Stack

- Frontend: React with Tailwind CSS
- Backend: Node.js/Express
- Database: SQLite
- File Storage: Local with Multer
- Authentication: JWT
- Export: PDF/Excel generation
- Bot: Telegram Bot API with Telegraf

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend setup
   cd backend
   npm install

   # Frontend setup
   cd ../frontend
   npm install
   ```

3. Initialize the database:
   ```bash
   cd backend
   node init-db.js
   ```

4. Start the servers:
   ```bash
   # Start backend (from backend directory)
   npm start

   # Start frontend (from frontend directory)
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Login

- Username: admin
- Password: admin123

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/logout

### Customers
- GET /api/customers
- POST /api/customers
- GET /api/customers/:id
- PUT /api/customers/:id
- DELETE /api/customers/:id

### Payments
- GET /api/payments
- POST /api/payments
- PUT /api/payments/:id
- GET /api/payments/customer/:customerId

### Documents
- POST /api/documents/upload
- GET /api/documents/:customerId
- DELETE /api/documents/:id

### Reports
- GET /api/reports/summary
- GET /api/reports/customers
- GET /api/reports/payments
- POST /api/reports/export

### Bot Management
- GET /api/bot/status - Check if the bot is running
- POST /api/bot/toggle - Start or stop the bot

## Telegram Bot

The system includes a Telegram bot for quick access to customer and payment information.

### Bot Commands

- `/start` - Start the bot
- `/help` - Show help information
- `/about` - Information about the bot
- `/customers` - Get customer statistics
- `/payments` - Get payment statistics
- `/search <name or id>` - Search for a customer

### Running the Bot Separately

You can run the bot separately from the main application:

```bash
cd backend
npm run bot
```

For development with auto-restart:
```bash
npm run bot-dev
```

## Security Features

- JWT authentication
- Password hashing
- File upload validation
- Input sanitization
- Error logging
- Secure bot token storage

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request 