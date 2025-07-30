import React from "react";
export const cartoAttribution =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>";

function getUrl() {
  const isDark = document.documentElement.classList.contains("dark");
  return `https://{s}.basemaps.cartocdn.com/${isDark ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`;
}

export function useCartoTileURL() {
  const [url, setUrl] = React.useState(getUrl());
  React.useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setUrl(getUrl()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return url;
}
