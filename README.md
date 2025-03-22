# ShudhuMCQ - Modern MCQ Platform for Academic Excellence

ShudhuMCQ is a comprehensive multiple-choice question platform designed to help students excel in their academic and admission exams through gamified learning, personalized practice, and collaborative problem-solving.

![ShudhuMCQ Platform](https://via.placeholder.com/1200x600)

## 🚀 Features

### 📚 Comprehensive Question Bank

- Subject-based and institution-based organization
- Questions from recent academic and admission exams
- Historical question analysis (5-6 years)

### 🧠 Personalized Learning

- Quick Practice with subject, chapter, and topic filtering
- Mock exams with subject-specific and institution-specific presets
- Immediate feedback and detailed explanations

### 🏆 Gamified Experience

- Points-based reward system
- Weekly leaderboards and achievements
- Performance tracking and analytics

### 💬 Collaborative Learning

- Doubts forum for asking and answering questions
- Community-driven problem solving
- Upvoting and best answer selection

### 📊 Performance Analytics

- Weekly points tracking
- Exam accuracy visualization
- Strength and weakness identification

## 🔍 User Flow

### For Unauthenticated Users

- **Landing Page**: Beautiful UI with animations showcasing platform features
- **Authentication**: Email-password, Google, and Facebook sign-in options
- **Preference Setup**: Academic level, group, and batch selection

### For Authenticated Users

- **Dashboard**: Points tracking, leaderboard, and exam accuracy
- **Mock Exam**: Subject-based and preset institution-based exams
- **Quick Practice**: Filtered practice by subject, chapter, and topic
- **Doubts Forum**: Ask questions and help others
- **Question Bank**: Explore questions by subject or institution
- **Leaderboard**: Track your ranking among peers
- **Profile**: View and manage your performance and preferences

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- **Animation**: Framer Motion
- **State Management**: Context API/Zustand
- **Data Fetching**: React Query
- **Form Handling**: React Hook Form with Zod
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shudhumcq.git

# Navigate to the project directory
cd shudhumcq

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.local.example .env.local

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

The project uses different environment files for various deployment scenarios:

- `.env.local`: For local development (not committed to Git)
- `.env.development`: For development environment deployment
- `.env.staging`: For staging environment deployment
- `.env.production`: For production environment deployment

You'll need to configure the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
NEXT_PUBLIC_API_URL=your_api_url

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url
```

To get Firebase configuration values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Navigate to Project Settings > General
4. Scroll down to "Your apps" section and find the configuration values

For a secure NEXTAUTH_SECRET, you can generate one using:

```bash
openssl rand -base64 32
```

## 🚢 Deployment

### Staging Environment

The project uses Vercel for deployment with the following environments:

- **Staging**: For testing features before production deployment
- **Production**: Live environment for end users

To deploy to the staging environment:

```bash
# Deploy to staging
npm run deploy:staging
# or
yarn deploy:staging
```

The staging environment can be accessed at [https://staging.shudhumcq.com](https://staging.shudhumcq.com).

### Environment Variables

The project uses different environment files for various deployment scenarios:

- `.env.local`: For local development (not committed to Git)
- `.env.development`: For development environment deployment
- `.env.staging`: For staging environment deployment
- `.env.production`: For production environment deployment

## 📱 Responsive Design

ShudhuMCQ is designed with a mobile-first approach, ensuring a seamless experience across all devices:

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Hamburger menu with optimized content display

## 🎨 UI/UX Principles

- **Modern & Sleek**: Clean interfaces with smooth gradients and soft shadows
- **Intuitive Navigation**: Clear hierarchy and consistent layout
- **Engaging Animations**: Subtle motion effects and micro-interactions
- **Accessibility**: High contrast and readable typography
- **Dark/Light Mode**: Support for user preference

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any inquiries, please reach out to [contact@shudhumcq.com](mailto:contact@shudhumcq.com)
