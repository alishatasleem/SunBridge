# SunBridge

A community-powered energy sharing platform for residential solar energy distribution in Calgary, Alberta.

## Overview

SunBridge is a web-based platform that enables homeowners with solar panels to share their surplus energy with neighbors who have energy deficits. The platform incentivizes energy sharing through a points-based rewards system, fostering community collaboration and sustainable energy practices.

## Features

### For Residents

- **Energy Tracking**: Monitor monthly solar production and consumption averages
- **Surplus/Deficit Calculation**: Automatic calculation based on 3-month historical data
- **Energy Sharing**: Transfer surplus energy to households with deficits
- **Points System**: Earn 10 points per kWh shared
- **Rewards Store**: Redeem points for local Calgary community benefits
- **Digital Coupons**: QR code-based coupon system for redeemed rewards
- **Flexible Login**: Sign in using email or unique House ID

### For Administrators

- **Transaction Approval**: Review and approve energy transfer requests
- **Rewards Management**: Create, edit, and delete reward offerings
- **Community Oversight**: Monitor all energy transactions across the platform

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **UI Components**: Lucide React icons
- **Build Tool**: Vite

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Firebase account

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sunbridge.git
cd sunbridge
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Copy your Firebase configuration

4. Update `src/firebase.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

5. Configure Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null;
    }
    
    match /rewards/{rewardId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /ledger/{ledgerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    match /redemptions/{redemptionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

6. Start the development server:
```bash
npm run dev
```

## Usage

### User Registration

1. Navigate to the Register tab
2. Enter your details:
   - Full name
   - Email address
   - Password (minimum 6 characters)
   - House address
   - Unique PO Box number
3. Submit the form to create your account
4. You will receive a unique House ID (format: SB-XXXXX-XXXX)
5. You will be automatically logged in to your dashboard

### Resident Login

Login using either:
- Your email address
- Your House ID (e.g., SB-12345-ABCD)

### Setting Up Energy Data

1. Navigate to your dashboard
2. Enter your last 3 months of solar production data (in kWh)
3. Enter your last 3 months of energy usage data (in kWh)
4. Click "Save Data & Calculate Averages"
5. The system will calculate your monthly averages and determine surplus/deficit

### Sharing Energy

1. Ensure you have entered your 3-month data
2. Select a recipient house from the dropdown (sorted by highest deficit)
3. Enter the amount of energy to share (maximum: your current surplus)
4. Submit the request
5. Earn points upon approval (10 points per kWh)

### Redeeming Rewards

1. Navigate to the Rewards tab
2. Browse available rewards
3. Click "Redeem" on any reward you can afford
4. View your digital coupon with QR code in the Coupons tab

### Admin Login

- Email: admin@sunbridge.com
- Password: admin123

## Project Structure

```
sunbridge/
├── src/
│   ├── components/
│   │   ├── AdminApprovals.jsx
│   │   ├── AdminCoupons.jsx
│   │   ├── AuthPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResidentCoupons.jsx
│   │   ├── ResidentRequests.jsx
│   │   └── ResidentRewards.jsx
│   ├── services/
│   │   ├── auth.js
│   │   ├── ledger.js
│   │   ├── redemptions.js
│   │   ├── rewards.js
│   │   └── users.js
│   ├── App.jsx
│   ├── SunBridge.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  address: string,
  pobox: string,
  houseId: string,
  role: "resident" | "admin",
  points: number,
  coupons: array,
  houseData: {
    production: number,
    consumption: number,
    surplus: number,
    deficit: number
  },
  pastProduction: number[],
  pastUsage: number[],
  createdAt: timestamp
}
```

### Rewards Collection
```javascript
{
  name: string,
  cost: number,
  icon: string,
  desc: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Ledger Collection
```javascript
{
  fromId: string,
  toId: string,
  from: string,
  to: string,
  amount: number,
  timestamp: string,
  approved: boolean,
  status: string,
  createdAt: timestamp,
  approvedAt: timestamp
}
```

### Redemptions Collection
```javascript
{
  userId: string,
  rewardId: string,
  rewardSnapshot: object,
  code: string,
  qr: string,
  status: string,
  createdAt: timestamp
}
```

## Key Features Explained

### Energy Calculation Logic

- **Monthly Average Production**: Sum of last 3 months divided by 3
- **Monthly Average Usage**: Sum of last 3 months divided by 3
- **Surplus**: Production - Usage (if positive)
- **Deficit**: Usage - Production (if positive)

### Points System

- Users earn 10 points for every kWh of energy shared
- Points are awarded immediately upon energy transfer
- Points can be redeemed for community rewards

### Security Features

- Unique PO Box validation prevents duplicate registrations
- Firebase Authentication for secure user management
- Firestore security rules restrict data access
- Role-based access control for admin functions

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- Built for the Calgary, Alberta community
- Promotes sustainable energy practices
- Encourages neighborhood collaboration

---

**Version**: 1.0.0  
**Last Updated**: November 2025