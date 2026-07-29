# Orenda 🌿
**An Interactive Psychological Screening Tool for Self-Discovery and Emotional Balance.**

## 1. Project Overview
**Orenda** is a web application designed to provide an initial screening for emotional well-being and depression, based on scientifically validated psychological scales (like the PHQ-9). The name "Orenda" refers to a mystical force present in all people that empowers them to affect the world or effect change in their own lives, reflecting the app's mission to empower rather than diagnose.

### Core Principles
1. **Zero Data Leakage:** All answers and score calculations are processed entirely on the client side (in the user's browser). No personal or sensitive health data is ever sent to or stored on external servers, ensuring absolute privacy.
2. **Low Cognitive Load:** Only one question is displayed per screen. This prevents the user from feeling overwhelmed and reduces mental fatigue.
3. **Empathetic UX:** No stressful timers, the use of calming color palettes, and seamless, soft transitions between questions.

---

## 2. Tech Stack
* **Framework:** Next.js (App Router) - For high performance and smooth routing.
* **Language:** TypeScript - To ensure strict data typing and minimize runtime errors.
* **Styling:** Tailwind CSS - For rapid, responsive, and custom UI development.
* **Animations:** Framer Motion - For smooth fade-in/fade-out and micro-interactions.
* **State Management:** React Hooks (`useState`, `useReducer`) - To manage the assessment flow and score accumulation.

---

## 3. UI/UX Design System
The visual language is designed to evoke feelings of safety, containment, and calmness.

### A. Color Palette
* **Background Color:** Warm Cream / Off-White (`#F9F8F6`) - Easy on the eyes, avoiding harsh, bright whites.
* **Primary Color:** Sage Green (`#8DA399`) or Muted Indigo (`#6B7A8F`) - Used for active states, progress bars, and selected buttons. These colors psychologically represent stability and growth.
* **Text Color:** Charcoal Gray (`#2D3748`) - Reduces contrast sharpness compared to pure black, making reading more comfortable.

### B. Interactions & Micro-interactions
* **Auto-Advance:** When a user selects an answer, the button highlights (visual feedback), waits for `500ms`, and then automatically transitions to the next question using a soft fade. No "Next" button is required.
* **Progress Bar:** A subtle, slow-moving progress bar at the top of the screen to indicate completion status without inducing urgency.
* **Buttons:** Large touch targets with fully rounded corners (`rounded-full` in Tailwind) to appear more welcoming and less rigid.

---

## 4. Data Schema & Logic (TypeScript)
Below is the core architectural schema that dictates how the application manages questions, answers, and the overall assessment state.

```typescript
// 1. Answer Schema
export interface Answer {
  id: string;
  text: string;     // The label shown to the user (e.g., "Several days")
  score: number;    // The numerical value attached to the answer (e.g., 1)
}

// 2. Question Schema
export interface Question {
  id: string;
  category: "emotional" | "depression"; 
  text: string;       // The question text (e.g., "Little interest or pleasure in doing things?")
  answers: Answer[];  // Array of possible answers
}

// 3. Result Level Schema
export interface ResultLevel {
  minScore: number;
  maxScore: number;
  label: string;       // The classification (e.g., "Mild emotional distress")
  message: string;     // Empathetic and supportive feedback message
  actionCall: string;  // Next steps (e.g., "Talk to a professional", "Read this guide")
}

// 4. Assessment State Management Schema
export interface AssessmentState {
  currentQuestionIndex: number; // Tracks the current active question
  totalScore: number;           // The cumulative score
  answersRecord: Record<string, number>; // Maps question IDs to selected scores (allows going "Back")
  isCompleted: boolean;         // Flag to trigger the Result Screen
}