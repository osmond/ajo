export const stateCities = {
  CA: ["Los Angeles", "San Francisco", "San Diego"],
  TX: ["Houston", "Austin", "Dallas"],
  WI: ["Madison", "Milwaukee", "Green Bay"],
  NY: ["New York City", "Buffalo", "Albany"],
};

export function getCities(abbr) {
  return stateCities[abbr] || ["Example City"];
}
