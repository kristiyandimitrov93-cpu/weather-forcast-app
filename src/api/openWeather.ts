const API_KEY = '31f6815f4687290c1904ada0f6d80bfd'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const fetchByCoordinates = async (latitude, longitude) => {



    const url = `${BASE_URL}/forecast?lat=${latitude}&lon=${latitude}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    return data
}