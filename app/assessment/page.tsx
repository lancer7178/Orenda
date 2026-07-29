import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment-flow";

export const metadata: Metadata = {
  title: "Check-in",
  description:
    "Thirteen questions, one at a time. Answers are scored in your browser and never sent anywhere.",
  // Nothing here is worth surfacing in search, and the page is meaningless
  // without the state a visitor builds up themselves.
  robots: { index: false, follow: true },
};

export default function AssessmentPage() {
  return <AssessmentFlow />;
}
