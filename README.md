# MiniMeteo - Weather Forecast Application

A modern weather forecast application built with React, TypeScript, and Vite that provides accurate weather information based on user's location.

## Key Features

- Real-time weather data display
- 3-day weather forecast
- Location-based weather information
- Responsive design with Tailwind CSS

## Technical Implementation

### Geolocation
The application uses browser's built-in geolocation API for determining user's location. This approach was chosen because:
- Provides high accuracy
- Gives users control over their location data
- Works across different devices and browsers
- No need for additional API keys or services

### Error Handling
The application implements comprehensive error handling:
- User permission denial scenarios
- Geolocation service unavailability
- Network connectivity issues
- API response errors

### Data Management
- Efficient API calls with proper caching
- Type-safe data handling with TypeScript
- Optimized state management

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Weather API

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Project Structure

- `src/components/` - React components
- `src/types/` - TypeScript type definitions
- `src/services/` - API and utility services
- `src/hooks/` - Custom React hooks
