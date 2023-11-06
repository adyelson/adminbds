const axios = require('axios');

const apiKey = '090717be4d7f0172400380905be1120c';
const latitude = -22.310301;
const longitude = -47.1837812;
function sunRiseSet(latitude, longitude) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
               
                    const sunriseTimestamp = response.data.sys.sunrise;
                    const sunsetTimestamp = response.data.sys.sunset;
                    const timezoneOffset = response.data.timezone;

                    const formatTime = (timestamp) => {
                        const date = new Date(timestamp * 1000);
                        const hours = date.getUTCHours();
                        const minutes = date.getUTCMinutes();
                        const seconds = date.getUTCSeconds();
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    };

                    const sunriseTime = formatTime(sunriseTimestamp);
                    const sunsetTime = formatTime(sunsetTimestamp);
                    const timezoneOffsetHours = Math.abs(timezoneOffset / 3600);
                    const timezoneOffsetMinutes = Math.abs((timezoneOffset % 3600) / 60);


                    console.log(`Horário do nascer do sol: ${sunriseTime}`);
                    console.log(`Horário do pôr do sol: ${sunsetTime}`);
                    const fuso = `Fuso horário: ${timezoneOffset > 0 ? '+' : '-'}${timezoneOffsetHours.toString().padStart(2, '0')}:${timezoneOffsetMinutes.toString().padStart(2, '0')}`;
                    return { sunriseTime, sunsetTime, fuso };
                } 
                catch (error) {
                    reject(error);
                }
            });

        }
module.exports = {
            sunRiseSet
        };