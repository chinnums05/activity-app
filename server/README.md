# Activity Social App - Backend

## Setup Instructions

1. Create a `.env` file in the root directory with the following variables:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=activity_social_db
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

2. Install dependencies:
```bash
npm install
```

3. Create the MySQL database:
```sql
CREATE DATABASE activity_social_db;
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Activities
- POST /api/activities - Create a new activity
- GET /api/activities - Get all activities
- GET /api/activities/:id - Get single activity
- POST /api/activities/:id/join - Join an activity
- POST /api/activities/:id/leave - Leave an activity

### Chat
- GET /api/chat - Get all messages
- POST /api/chat - Send a message


File structure should now look like this:

```
server/
├── config/
│   ├── database.js
│   └── init.js
├── controllers/
│   ├── authController.js
│   ├── activityController.js
│   └── chatController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Activity.js
│   └── Message.js
├── routes/
│   ├── auth.js
│   ├── activities.js
│   └── chat.js
├── socket/
│   └── index.js
├── uploads/
│   └── .gitkeep
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

To start using the server:

1. Create and configure your `.env` file
2. Create the MySQL database
3. Run `npm install`
4. Start the server with `npm run dev`
