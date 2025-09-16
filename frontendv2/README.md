# Agri3 - Blockchain Farmland Integration System

A comprehensive frontend application for blockchain-powered farmland integration, built with React, Tailwind CSS, and shadcn/ui components.

## 🌾 Features

### 🏠 Landing Page
- Hero section with compelling messaging
- Feature showcase with interactive cards
- Statistics section with growth metrics
- User testimonials carousel
- Step-by-step "How It Works" process
- Professional footer with links
- **Testimonials**: User stories and feedback carousel
- **How It Works**: Step-by-step process visualization

### 🔐 Authentication System
- **Dual Registration**: Separate flows for farmers and sellers
- **Responsive Forms**: Clean, accessible form design
- **Toggle Interface**: Easy switching between login/register modes
- **Validation**: Real-time form validation and error handling

### 👨‍🌾 Farmer Dashboard
- **Land Management**: Register and verify farmland ownership
- **Crop Predictions**: AI-powered crop recommendations
- **Price Forecasting**: Market price predictions and trends
- **Weather Integration**: Location-specific weather forecasts
- **Government Schemes**: Access to relevant subsidies and programs
- **Land Pooling**: Collaborate with neighboring farmers

### 🏪 Seller Dashboard
- **Product Management**: Add, edit, and manage agricultural products
- **Order Processing**: Track and fulfill customer orders
- **Analytics**: Sales performance and revenue tracking
- **Customer Management**: View and manage customer relationships

### 👨‍💼 Admin Dashboard
- **Verification System**: Review and approve land registrations
- **Land Pooling Oversight**: Monitor collaborative farming initiatives
- **Transaction Monitoring**: Track blockchain transactions
- **User Management**: Oversee platform users and activities
- **System Health**: Monitor platform performance metrics

### 🛠 Multi-Step Wizards
- **Land Registration**: Guided process for land documentation
- **Document Upload**: Drag-and-drop file management
- **Location Mapping**: GPS integration for land coordinates
- **Progress Tracking**: Visual stepper component

## 🚀 Technology Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.13
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Font**: Google Roboto
- **State Management**: React Hooks (useState, useEffect)

## 🎨 Design System

### Color Palette
- **Primary Green**: #2E7D32 (earthy, agricultural theme)
- **Accent Yellow**: #FFD54F (golden highlights)
- **Neutral Background**: Light gray/white
- **Text**: Various gray shades for hierarchy

### Typography
- **Font Family**: Roboto (Google's default)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Scaling**: Mobile-first approach

### Components
- **Cards**: Rounded corners (xl), soft shadows
- **Buttons**: Multiple variants with hover states
- **Forms**: Clean inputs with validation states
- **Navigation**: Sticky header with mobile responsiveness

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid System**: CSS Grid and Flexbox
- **Touch Friendly**: Large tap targets and gestures

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontendv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── tabs.jsx
│   │   ├── progress.jsx
│   │   └── badge.jsx
│   └── common/             # Business logic components
│       ├── Navbar.jsx
│       ├── HeroBanner.jsx
│       ├── FeatureCard.jsx
│       ├── StatisticCard.jsx
│       ├── Sidebar.jsx
│       ├── Stepper.jsx
│       ├── FileUploader.jsx
│       └── FloatingActionButton.jsx
├── pages/                  # Page components
│   ├── LandingPage.jsx
│   ├── AuthPage.jsx
│   ├── FarmerDashboard.jsx
│   ├── SellerDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── LandRegistration.jsx
├── data/                   # Mock data and constants
│   └── mockData.js
├── lib/                    # Utility functions
│   └── utils.js
├── styles/                 # Global styles
└── hooks/                  # Custom React hooks
```

## 🎯 Key Features Implementation

### Authentication Flow
- Multi-step registration for farmers and sellers
- Form validation and error handling
- User type detection and routing
- Persistent user state management

### Dashboard Navigation
- Responsive sidebar with collapsible menu
- Tab-based content switching
- Breadcrumb navigation
- Mobile-optimized hamburger menu

### Land Registration Wizard
- 4-step process with validation
- File upload with drag-and-drop
- GPS location integration
- Progress tracking with visual indicators

### Data Management
- Mock data for development and testing
- Structured data models for all entities
- API-ready data formatting
- State management patterns

## 🔮 Future Enhancements

### Planned Features
- **Dark Mode**: Theme switching capability
- **Multilingual Support**: i18n implementation
- **Real-time Notifications**: WebSocket integration
- **Offline Support**: PWA capabilities
- **Advanced Analytics**: Chart.js integration
- **Map Integration**: Google Maps/Mapbox
- **Payment Gateway**: Stripe/Razorpay integration
- **Blockchain Integration**: Web3 wallet connection

### API Integration Points
- User authentication and management
- Land verification services
- Weather data APIs
- Market price feeds
- Government scheme databases
- Blockchain transaction monitoring

## 🧪 Testing

### Testing Strategy
- Component unit tests with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress/Playwright
- Visual regression testing
- Performance testing with Lighthouse

### Mock Data
- Comprehensive mock data for all features
- Realistic user scenarios and edge cases
- Development-ready data structures
- Easy API integration transition

## 🚀 Deployment

### Build Optimization
- Code splitting and lazy loading
- Asset optimization and compression
- Bundle analysis and optimization
- Performance monitoring setup

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with form handling
- **AWS S3 + CloudFront**: Enterprise solution
- **Firebase Hosting**: Google ecosystem integration

## 🤝 Contributing

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety (future enhancement)
- Implement responsive design patterns
- Write comprehensive tests
- Document component APIs

### Code Style
- ESLint configuration for consistency
- Prettier for code formatting
- Conventional commits for git history
- Component naming conventions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki
- Join the community Discord

---

**Built with ❤️ for the agricultural community**
