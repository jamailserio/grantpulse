export type ScoreTier = "red" | "amber" | "green";

export function getScoreTier(score: number): ScoreTier {
  if (score < 50) {
    return "red";
  }

  if (score < 80) {
    return "amber";
  }

  return "green";
}

export function getScoreIndicatorClasses(score: number): string {
  const tier = getScoreTier(score);

  switch (tier) {
    case "red":
      return "bg-red-600 text-white";
    case "amber":
      return "bg-amber-500 text-care-navy";
    case "green":
      return "bg-green-600 text-white";
  }
}
