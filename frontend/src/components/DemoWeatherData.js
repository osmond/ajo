// src/components/DemoWeatherData.js
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Haze,
  Droplet,
  CloudFog,
  Zap,
} from 'lucide-react';

export const temperatureData = [
  { label: 'Frigid',      range: '<\u202f20\u00b0F', count: 57 },
  { label: 'Very\u202fCold',   range: '20-29\u00b0F', count: 147 },
  { label: 'Cold',        range: '30-39\u00b0F', count: 340 },
  { label: 'Cool',        range: '40-49\u00b0F', count: 586 },
  { label: 'Mild',        range: '50-59\u00b0F', count: 843 },
  { label: 'Comfortable', range: '60-69\u00b0F', count: 758 },
  { label: 'Warm',        range: '70-79\u00b0F', count: 427 },
  { label: 'Hot',         range: '80-89\u00b0F', count: 89 },
  { label: 'Very\u202fHot',    range: '\u2265\u202f90\u00b0F', count: 4 },
];

export const weatherData = [
  { condition: 'Clouds', count: 1530, icon: Cloud },
  { condition: 'Clear', count: 1131, icon: Sun },
  { condition: 'Rain', count: 422, icon: CloudRain },
  { condition: 'Snow', count: 77, icon: CloudSnow },
  { condition: 'Haze', count: 60, icon: Haze },
  { condition: 'Drizzle', count: 18, icon: Droplet },
  { condition: 'Fog', count: 8, icon: CloudFog },
  { condition: 'Smoke', count: 3, icon: Cloud },
  { condition: 'Thunderstorm', count: 1, icon: Zap },
];
