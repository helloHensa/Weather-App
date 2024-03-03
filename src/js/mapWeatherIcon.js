export function mapWeatherIcon(iconCode) {
  const iconMapping = {
    '01d': 'bi-sun-fill', // Bezchmurne niebo (dzień)
    '01n': 'bi-moon-stars-fill', // Bezchmurne niebo (noc)
    '02d': 'bi-cloud-sun-fill', // Niewielkie zachmurzenie (dzień)
    '02n': 'bi-moon-fill', // Niewielkie zachmurzenie (noc)
    '03d': 'bi-cloud-sun-fill', // Częściowe zachmurzenie (dzień)
    '03n': 'bi-cloud-moon-fill', // Częściowe zachmurzenie (noc)
    '04d': 'bi-cloud-fill', // Zachmurzenie (dzień)
    '04n': 'bi-cloud-fill', // Zachmurzenie (noc)
    '09d': 'bi-cloud-drizzle-fill', // Deszcz (dzień)
    '09n': 'bi-cloud-drizzle-fill', // Deszcz (noc)
    '10d': 'bi-cloud-rain-fill', // Deszcz (intensywny, dzień)
    '10n': 'bi-cloud-rain-fill', // Deszcz (intensywny, noc)
    '11d': 'bi-cloud-lightning-rain-fill', // Burza (dzień)
    '11n': 'bi-cloud-lightning-rain-fill', // Burza (noc)
    '13d': 'bi-cloud-snow-fill', // Opady śniegu (dzień)
    '13n': 'bi-cloud-snow-fill', // Opady śniegu (noc)
    '50d': 'bi-cloud-fog-fill', // Mgła (dzień)
    '50n': 'bi-cloud-fog-fill', // Mgła (noc)
  };
  const iconClass = iconMapping[iconCode];

  return iconClass || 'bi-question';
}
