# CAConnect Frontend

A comprehensive React application for Chartered Accountancy students and professionals, built with modern web technologies.

## 🚀 Features

### 🎯 Core Functionality
- **User Authentication** with Keycloak OAuth2 PKCE
- **Profile Management** with location-based networking
- **Study Resources** browser with categories and favorites
- **Mock Tests** platform with performance analytics
- **Mentorship Network** connecting students with qualified CAs
- **Job Board** for articleship and career opportunities
- **Responsive Design** with beautiful UI/UX

### 🛠 Technical Stack
- **Frontend**: React 19, Vite, React Router
- **State Management**: Redux Toolkit
- **Authentication**: OAuth2 PKCE with Keycloak
- **UI Components**: Custom components with Material Design
- **Styling**: CSS-in-JS with responsive design
- **API Integration**: Axios with interceptors
- **Development**: ESLint, Hot Module Replacement

## 📁 Project Structure

```
src/
├── api/                    # API integration layer
│   ├── index.js           # Central API exports
│   ├── profileApi.js      # Profile service API
│   ├── userApi.js         # User service API
│   ├── locationApi.js     # Location service API
│   └── studyApi.js        # Study resources API (mock)
├── components/            # Reusable UI components
│   ├── AuthGuard.jsx      # Authentication guard
│   └── ui/               # UI component library
├── context/              # React context providers
├── hooks/                # Custom React hooks
│   ├── useApi.js         # API hook
│   └── useAuth.js        # Authentication hook
├── pages/                # Page components
│   ├── HomePage.jsx      # Landing page
│   ├── Dashboard.jsx     # User dashboard
│   ├── StudyMaterials.jsx # Study resources
│   ├── MockTests.jsx     # Mock test platform
│   ├── Mentorship.jsx    # Mentorship network
│   ├── Jobs.jsx          # Job board
│   ├── CreateProfile.jsx  # Profile creation
│   ├── ProfileView.jsx   # Profile viewing
│   └── NearbyPeers.jsx   # Location-based peers
├── store/                # Redux store
├── utils/                # Utility functions
│   └── tokenManager.js   # Token management
└── styles/               # Global styles
```

## 🌐 Backend Integration

The frontend integrates with multiple microservices:

- **User Service** (Port 8081): User management and authentication
- **Profile Service** (Port 8083): Profile CRUD operations
- **Location Service** (Port 8082): Location-based features
- **Study Service** (Port 8084): Study materials and mock tests (planned)
- **Gateway** (Port 8080): API Gateway
- **Eureka** (Port 8761): Service Discovery
- **Keycloak** (Port 8090): Authentication service

## 🔐 Authentication

The application uses OAuth2 PKCE flow with Keycloak:

1. **Login Flow**: Redirects to Keycloak for authentication
2. **Token Management**: Automatic token refresh and storage
3. **Route Protection**: AuthGuard component protects sensitive routes
4. **Session Management**: Secure token storage and cleanup

### Authentication Features
- JWT token parsing and validation
- Automatic token refresh
- Secure logout with Keycloak session termination
- Role-based access control (ready for implementation)

## 📱 Pages & Features

### 🏠 HomePage
- Landing page with hero section
- Feature showcase
- Authentication state handling
- Responsive navigation

### 📊 Dashboard
- Personalized welcome banner
- Study progress overview
- Performance analytics
- Quick action buttons
- Recent activity feed

### 📚 Study Materials
- Category-based browsing
- Search and filtering
- Download tracking
- Favorites system
- Rating system

### 📝 Mock Tests
- Test browser by category
- Performance analytics
- Progress tracking
- Test taking interface (ready)

### 👥 Mentorship
- Mentor directory
- Expertise filtering
- Mentor profiles
- Contact system
- Verified CA badges

### 💼 Jobs
- Articleship opportunities
- Full-time positions
- Company profiles
- Application tracking
- Location-based search

### 👤 Profile Management
- Profile creation with validation
- Profile viewing and editing
- Location-based peer discovery
- Professional information display

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Navy blue with gold accents
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Components**: Glass morphism effects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

### Key UI Features
- Gradient backgrounds and glass effects
- Smooth animations and transitions
- Hover states and interactive elements
- Loading states and error handling
- Accessibility considerations

## 🔧 Development

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_PROFILE_API=/api/profiles
VITE_USER_API_URL=http://localhost:8081
VITE_LOCATION_API_URL=http://localhost:8082
VITE_STUDY_API_URL=http://localhost:8084
```

### Development Features
- Hot Module Replacement (HMR)
- ESLint integration
- Component-based architecture
- Custom hooks for reusable logic
- Error boundaries and error handling

## 🔍 API Integration

### API Layer Features
- Centralized API configuration
- Request/response interceptors
- Automatic token attachment
- Error handling and normalization
- Mock data for development

### Available APIs
- **Profile API**: Create, read, update profiles
- **User API**: User registration and validation
- **Location API**: Location-based services
- **Study API**: Study materials and mock tests

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Considerations
- Environment-specific configuration
- API endpoint configuration
- Keycloak realm configuration
- SSL/TLS setup for production
- Performance optimization

## 🧪 Testing & Quality

### Code Quality
- ESLint configuration
- Component structure standards
- Error handling patterns
- Performance considerations

### Testing (Planned)
- Unit tests with Jest
- Component testing with React Testing Library
- Integration tests for API calls
- E2E testing with Cypress

## 🔄 State Management

### Redux Store Structure
```
store/
├── authSlice.js         # Authentication state
└── store.js            # Store configuration
```

### State Features
- Authentication state management
- User data persistence
- Token management
- Session handling

## 🛡️ Security

### Security Features
- OAuth2 PKCE authentication
- Secure token storage
- CSRF protection
- Input validation
- XSS prevention
- Secure logout implementation

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 900px
- Desktop: > 900px

### Mobile Features
- Touch-friendly interface
- Optimized navigation
- Responsive layouts
- Performance optimization

## 🚀 Performance

### Optimization Features
- Code splitting (ready for implementation)
- Lazy loading (ready for implementation)
- Image optimization
- Bundle size optimization
- Caching strategies

## 🔄 Future Enhancements

### Planned Features
- TypeScript migration
- Advanced analytics dashboard
- Real-time notifications
- Chat/messaging system
- Video conferencing for mentorship
- Mobile app (React Native)
- Advanced search with filters
- Offline mode support

### Technical Improvements
- Complete test coverage
- Performance monitoring
- Error tracking
- A/B testing framework
- Progressive Web App (PWA)

## 🤝 Contributing

### Development Guidelines
- Follow existing code patterns
- Use semantic naming conventions
- Implement proper error handling
- Add appropriate comments
- Test thoroughly before deployment

## 📞 Support

For any questions or issues related to the CAConnect frontend application, please refer to the development team or create an issue in the project repository.

---

**Built with ❤️ for the CA Community**
