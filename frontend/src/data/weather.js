import {
  Cloud, Sun, CloudRain, CloudSnow,
  Haze, Droplet, CloudFog, Zap
} from "lucide-react"

export const weatherData = [
  { condition: "Clouds",      count: 1530, icon: Cloud },
  { condition: "Clear",       count: 1131, icon: Sun },
  { condition: "Rain",        count: 422,  icon: CloudRain },
  { condition: "Snow",        count: 77,   icon: CloudSnow },
  { condition: "Haze",        count: 60,   icon: Haze },
  { condition: "Drizzle",     count: 18,   icon: Droplet },
  { condition: "Fog",         count: 8,    icon: CloudFog },
  { condition: "Smoke",       count: 3,    icon: Cloud },
  { condition: "Thunderstorm",count: 1,    icon: Zap },
]
