# Deploying Car Financing System to Hostinger

This guide walks through the process of deploying the Car Financing System on Hostinger.

## Prerequisites

- A Hostinger account with Node.js hosting plan
- Domain name (optional)
- SSH access to your Hostinger account
- Git installed on your local machine

## Step 1: Prepare Your Project for Production

### Backend Preparation

1. Create a production config file in `backend/.env.production`:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your_strong_secret_key
DB_PATH=/home/username/public_html/database.sqlite
BOT_TOKEN=your_telegram_bot_token
```

2. Update your package.json scripts to include:

```json
"scripts": {
  "start": "node app.js",
  "build": "echo 'No build step required for backend'"
}
```

### Frontend Preparation

1. Create a `.env.production` file in the frontend directory:

```
REACT_APP_API_URL=https://yourdomain.com/api
```

2. Build the production version of the frontend:

```bash
cd frontend
npm run build
```

## Step 2: Set Up Hostinger

1. **Login to Hostinger Account**: Go to hPanel.

2. **Create a Node.js Website**:
   - Click on "Websites" > "Create Website"
   - Select "Website" > "Node.js"
   - Select your domain or create a new one
   - Complete the setup process

3. **Access SSH Terminal**:
   - From hPanel, go to "Advanced" > "SSH Access"
   - Note your SSH hostname, username, and port
   - Click on "Enable SSH" if not already enabled
   - Upload your SSH public key or use password authentication

## Step 3: Deploy the Application

### Via SSH (Command Line)

1. **Connect to Hostinger via SSH**:

```bash
ssh username@hostname -p port
```

2. **Create project directories**:

```bash
mkdir -p ~/car-financing/{backend,frontend}
```

3. **Upload your code** (from your local machine):

```bash
# For backend
scp -P port -r ./backend/* username@hostname:~/car-financing/backend/

# For frontend build
scp -P port -r ./frontend/build/* username@hostname:~/car-financing/frontend/
```

4. **Install dependencies**:

```bash
cd ~/car-financing/backend
npm install --production
```

5. **Set up database**:

```bash
cd ~/car-financing/backend
node scripts/init-db.js
```

### Via Git (Alternative Method)

1. **Set up Git repository access on Hostinger**:

```bash
cd ~
git clone https://github.com/yourusername/car-financing.git car-financing
cd car-financing
npm install --production
```

## Step 4: Configure Node.js Application

1. **Create Application Entry Point** in Hostinger hPanel:
   - Go to your website management in hPanel
   - Under "Node.js" section, click "Edit" button
   - Set entry point to `car-financing/backend/app.js`
   - Set Node.js version to a compatible version (14.x or higher)
   - Save changes

2. **Configure Environment Variables** in Hostinger hPanel:
   - Find "Environment Variables" section
   - Add all variables from your `.env.production` file
   - Save changes

## Step 5: Set Up Nginx Reverse Proxy

Create a custom Nginx configuration file (contact Hostinger support if needed):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /home/username/car-financing/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        rewrite ^/api/(.*) /$1 break;
    }

    # Telegram webhook (if needed)
    location /webhook {
        proxy_pass http://localhost:3000/webhook;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 6: Start Your Application

1. **Start the application**:

```bash
cd ~/car-financing/backend
npm start
```

2. **Set Up PM2 for Process Management**:

```bash
# Install PM2 globally
npm install -g pm2

# Start your application with PM2
pm2 start app.js --name car-financing

# Make sure the app starts on server reboot
pm2 startup
pm2 save
```

## Step 7: Configure Telegram Bot (Optional)

1. **Update the bot webhook URL** to your domain:

```bash
curl -F "url=https://yourdomain.com/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

2. **Verify webhook setup**:

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

## Step 8: Database Considerations

For a production environment, consider:

1. Regular database backups:
```bash
# Set up a cron job for daily backups
echo "0 0 * * * cp /home/username/public_html/database.sqlite /home/username/backups/database-$(date +%Y%m%d).sqlite" >> ~/crontab
crontab ~/crontab
```

2. For larger installations, migrate to MySQL/PostgreSQL

## Troubleshooting

1. **Application not starting**:
   - Check logs with `pm2 logs car-financing`
   - Ensure environment variables are correctly set
   - Verify Node.js version compatibility

2. **Cannot connect to database**:
   - Check file permissions on SQLite database file
   - Ensure path is correct in environment variables

3. **"502 Bad Gateway" errors**:
   - Check if Node.js app is running
   - Verify Nginx configuration
   - Check port configuration

4. **Telegram bot not responding**:
   - Verify webhook URL configuration
   - Check bot token validity

## Support

If you encounter issues specific to Hostinger, contact their customer support through:
- Help Center: https://support.hostinger.com/
- Live Chat: Available from your hPanel
- Email: support@hostinger.com 