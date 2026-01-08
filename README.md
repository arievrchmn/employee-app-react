# Employee Attendance App

A modern employee attendance application for Work From Home (WFH) management built with React, Vite and TypeScript.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Query** - Data fetching and caching
- **React Router** - Routing
- **Day.js** - Date/time manipulation
- **Cloudinary** - Image upload and management

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employee-app-react
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
VITE_API_BASE_URL=your_api_url

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:4000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Library configurations
├── pages/           # Page components
└── App.tsx          # Main app component
```

## Features

- Employee attendance check-in/check-out
- Attendance history and summary
- Profile management with image upload
- Responsive design with TailwindCSS
- Type-safe development with TypeScript
