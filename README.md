# MedScanX 🏥

AI-Powered CT Scan Analysis Platform built with Next.js, Supabase, and Gemini AI.

## Features

- 🔐 **User Authentication** - Secure login/register with Supabase Auth
- 📤 **CT Scan Upload** - Upload medical images to Supabase Storage
- 🤖 **AI Analysis** - Powered by Gemini 2.5 Pro for accurate medical imaging analysis
- 📊 **Detailed Reports** - Comprehensive analysis with severity levels, abnormalities, precautions, and recommendations
- 📱 **Responsive Design** - Beautiful medical-themed UI with Tailwind CSS
- 🔒 **Secure & Private** - Row-level security with Supabase
- 📜 **Scan History** - View all your previous scans and analyses

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom medical theme
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 2.5 Pro

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google AI (Gemini) API key

### Installation

1. **Clone the repository**
   ```bash
   cd c:\projects\MedScanX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor
   - This will create:
     - `scans` table with RLS policies
     - `scans` storage bucket
     - Necessary indexes and triggers

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
MedScanX/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── upload/       # File upload endpoint
│   │   ├── analyze/      # AI analysis endpoint
│   │   └── scans/        # Scan retrieval endpoints
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── upload/           # Scan upload page
│   ├── scan/[id]/        # Detailed scan view
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── SeverityBadge.tsx
│   │   └── Skeleton.tsx
│   └── medical/          # Medical-specific components
│       ├── ScanPreview.tsx
│       ├── AnalysisCard.tsx
│       ├── PrecautionList.tsx
│       ├── RecommendationsCard.tsx
│       └── Disclaimer.tsx
├── lib/
│   ├── supabase/         # Supabase client utilities
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   └── types.ts          # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
└── package.json
```

## Key Features Explained

### Authentication
- Secure user registration and login
- Session management with Supabase Auth
- Protected routes and API endpoints

### File Upload
- Support for JPEG, PNG, and DICOM formats
- Automatic file validation
- Secure storage in Supabase bucket
- Public URL generation

### AI Analysis
- Integration with Gemini 2.5 Pro
- Structured JSON response parsing
- Severity classification (low, medium, high, critical)
- Detailed abnormality detection
- Personalized precautions and recommendations

### User Experience
- Loading states with skeleton screens
- Optimistic UI updates
- Error handling and validation
- Mobile-responsive design
- Print-friendly reports

## Medical Disclaimer

⚠️ **Important**: This AI analysis is for informational purposes only and is **not a substitute for professional medical advice**. Always consult with a qualified radiologist or healthcare provider for accurate diagnosis and treatment.

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions, please open an issue on the repository.
