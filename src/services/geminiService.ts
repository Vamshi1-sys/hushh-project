import { Ambassador } from "../types";

export async function getAmbassadorInsights(ambassadors: Ambassador[]) {
  try {
    const response = await fetch("/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ambassadors }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error getting AI insights:", errorData);
      return errorData.insights || "Unable to generate insights at this time.";
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error("Error calling insights API:", error);
    return "Unable to generate insights at this time.";
  }
}
