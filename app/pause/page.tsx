import type { Metadata } from "next";
import { BreathingSpace } from "@/components/breathing-space";

export const metadata: Metadata = {
  title: "Take a breath",
  description:
    "A paced breathing space you can step into at any point, and step back out of exactly where you left off.",
};

export default function PausePage() {
  return <BreathingSpace />;
}
