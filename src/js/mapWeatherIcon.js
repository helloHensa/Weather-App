export function mapWeatherIcon(iconCode) {
  const iconMapping = {
    '01d': 'bi-sun', // Bezchmurne niebo (dzień)
    '01n': 'bi-moon', // Bezchmurne niebo (noc)
    '02d': 'bi-cloud-sun', // Niewielkie zachmurzenie (dzień)
    '02n': 'bi-cloud-moon', // Niewielkie zachmurzenie (noc)
    '03d': 'bi-cloud', // Częściowe zachmurzenie (dzień)
    '03n': 'bi-cloud', // Częściowe zachmurzenie (noc)
    '04d': 'bi-cloudy', // Zachmurzenie (dzień)
    '04n': 'bi-cloudy', // Zachmurzenie (noc)
    '09d': 'bi-cloud-drizzle', // Deszcz (dzień)
    '09n': 'bi-cloud-drizzle', // Deszcz (noc)
    '10d': 'bi-cloud-rain', // Deszcz (intensywny, dzień)
    '10n': 'bi-cloud-rain', // Deszcz (intensywny, noc)
    '11d': 'bi-cloud-lightning', // Burza (dzień)
    '11n': 'bi-cloud-lightning', // Burza (noc)
    '13d': 'bi-snow', // Opady śniegu (dzień)
    '13n': 'bi-snow', // Opady śniegu (noc)
    '50d': 'bi-fog', // Mgła (dzień)
    '50n': 'bi-fog', // Mgła (noc)
  };
  const iconClass = iconMapping[iconCode];

  return iconClass || 'bi-question';
}
