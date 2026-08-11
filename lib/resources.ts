/**
 * Outbound support resources. Kept in one place so every surface that offers
 * help — the in-flow safety pause, the results crisis note, the PDF — points at
 * the same reviewed destination rather than a hard-coded string copied around.
 *
 * This is the only URL Orenda ever sends a user to. It is an international
 * directory that lets people pick their own country's crisis line, so Orenda
 * never has to invent or hard-code a helpline number it cannot keep current.
 */
export const HELPLINE_DIRECTORY = "https://findahelpline.com";
