<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Project Documentation: The Sanctuary
The Sanctuary is a clinical-grade health companion application designed to empower patients by helping them identify symptoms, prepare for medical consultations, and connect with the right specialists. It bridges the gap between initial discomfort and professional diagnosis through an intuitive, AI-driven triage experience.
🚀 Tech Stack
Framework: React 18+ with TypeScript
Build Tool: Vite
Styling: Tailwind CSS 4 (Utility-first CSS)
Animations: Motion (formerly Framer Motion) for fluid UI transitions and liquid effects
Icons: Lucide React
Routing: React Router DOM
State Management: React Context API (Custom AssessmentProvider)
Voice Integration: Web Speech API for hands-free symptom description
✨ Key Features
1. Interactive Geometric Body Map
A custom-built, SVG-based anatomical interface allowing users to tap specific body parts (Head, Chest, Abdomen, etc.) to indicate discomfort.
Features real-time visual feedback and precise hotspot selection.
2. Multilingual Support (i18n)
Fully localized experience in English, Telugu, and Hindi.
Dynamic translation switching across all screens, including clinical summaries and help sections.
3. Smart Clinical Assessment
A guided 4-step triage process:
Symptom Duration: Tracks the timeline of the condition.
Pain Intensity: Interactive 1-10 visual scale.
Mobility & Stiffness: Evaluates functional impact and morning stiffness.
Medication Adherence: Logs current treatment compliance.
4. Dynamic Specialist Recommendations
Logic-based engine that matches symptoms to specific medical fields (e.g., Cardiologist for chest pain, Neurologist for head-related issues).
5. Accessibility First
Dynamic Font Scaling: Users can toggle between A+ (Large), A (Medium), and A- (Small) font sizes globally.
Voice Input: Integrated microphone support for users who prefer speaking over typing.
6. Clinical Summary Generation
Automatically generates a professional clinical note that patients can share with their doctors to ensure no detail is missed during a visit.
🎨 Design Philosophy
Clinical Aesthetic: Uses a professional palette of clinical blues, soft grays, and high-contrast typography.
Micro-interactions: Includes "liquid/gooey" button effects and smooth page transitions to reduce user anxiety during health assessments.
Mobile-First Responsive Design: Optimized for both desktop clinical use and on-the-go mobile access.
📂 Project Structure
/src/screens/: Contains all primary views (Onboarding, Home, Assessment, Results, Settings, About).
/src/hooks/: Custom logic like useVoiceInput.
/src/translations.ts: Centralized dictionary for all supported languages.
/src/App.tsx: Main application shell, routing, and global state provider.
/src/types.ts: Type definitions for the clinical assessment state.
⚠️ Medical Disclaimer
The Sanctuary is an informational tool designed to assist in clinical preparation. It does not provide medical diagnoses or replace professional medical advice.


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3c14d542-02c9-47ad-a717-5c181029df9e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
