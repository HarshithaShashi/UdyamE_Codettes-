# 🚀 Udyami Project Setup Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SAP HANA Cloud instance (running)
- Expo CLI (for mobile development)

## 🔧 Environment Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
# SAP HANA Cloud Configuration
SAP_HANA_HOST=your-sap-hana-host.cloud.com
SAP_HANA_PORT=443
SAP_HANA_UID=your-username
SAP_HANA_PWD=your-password
SAP_HANA_DB=your-database-name
SAP_HANA_SCHEMA=UDYAMI_SCHEMA

# Backend Server Configuration
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## 🗄️ Database Setup

### 1. Test Database Connection

```bash
npm run db:test
```

### 2. Initialize Database Tables

```bash
npm run db:init
```

This will:
- Connect to SAP HANA Cloud
- Create the UDYAMI_SCHEMA
- Create all required tables:
  - USERS
  - SELLERS
  - BUYERS
  - JOBS
  - SERVICES
  - PORTFOLIO
  - RATINGS
  - FOLLOWS
  - NOTIFICATIONS
- Insert sample data

## 🚀 Start the Application

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001`

### 2. Start Frontend (Expo)

```bash
npm run dev
```

## 📱 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/phone/:phoneNumber` - Get user by phone
- `PUT /api/users/:id` - Update user

### Sellers
- `POST /api/sellers` - Create seller profile
- `GET /api/sellers` - Get all sellers
- `GET /api/sellers/:id` - Get seller by ID

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/user/:userId` - Get jobs by user
- `PUT /api/jobs/:id/status` - Update job status

### Services
- `POST /api/services` - Create service
- `GET /api/services` - Get all services
- `GET /api/services/seller/:sellerId` - Get services by seller

### Follows
- `POST /api/follows` - Follow seller
- `DELETE /api/follows` - Unfollow seller
- `GET /api/follows/user/:userId` - Get followed sellers

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/user/:userId` - Get notifications by user

## 🔍 Troubleshooting

### Database Connection Issues

1. **Check Environment Variables**
   ```bash
   npm run db:test
   ```

2. **Verify SAP HANA Cloud Status**
   - Ensure your instance is running
   - Check IP whitelist
   - Verify credentials

3. **Test Connection Manually**
   ```bash
   node scripts/testConnection.ts
   ```

### Frontend-Backend Connection Issues

1. **Check Backend Server**
   ```bash
   curl http://localhost:3001
   ```

2. **Check API Endpoints**
   ```bash
   curl http://localhost:3001/api/users
   ```

3. **Check CORS Configuration**
   - Backend has CORS enabled
   - Frontend uses correct API URL

### Common Issues

1. **"SAP HANA host not configured"**
   - Set `SAP_HANA_HOST` in `.env` file

2. **"Connection failed"**
   - Check SAP HANA Cloud credentials
   - Verify network connectivity

3. **"API request failed"**
   - Ensure backend server is running
   - Check API endpoint URLs

## 📊 Database Schema

The application uses the following tables:

- **USERS**: User profiles and authentication
- **SELLERS**: Seller-specific data (skills, ratings, bio)
- **BUYERS**: Buyer-specific data (interests, following)
- **JOBS**: Job postings with requirements and status
- **SERVICES**: Service offerings by sellers
- **PORTFOLIO**: Work samples and portfolio items
- **RATINGS**: Reviews and ratings system
- **FOLLOWS**: Social following relationships
- **NOTIFICATIONS**: User notifications

## 🎯 Next Steps

1. Configure your SAP HANA Cloud credentials
2. Run database initialization
3. Start backend server
4. Start frontend development server
5. Test the complete flow

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure SAP HANA Cloud is accessible
4. Test each component individually 