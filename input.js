const axios = require('axios');

// the url to talk to our backend. normally id hide this secret key
// but i made an exception for the sake of simplicity this time
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=f90ffa402b1a12909c586da8e0625072&units=imperial`;

// asyncronously contact the weather api and get the temps we want
// this could be done synchronously but that is anti pattern and bad
// node.js in my opinion
async function getTemps(latitude, longitude) {
    // i decided to not handle errors here. for the sake of this app, i think
    // letting the request give a 500 is a sufficient response if we aren't
    // able to contact open weather
    return axios.get(weatherApiUrl + `&lat=${latitude}&lon=${longitude}`).then(json => {
        const list = json.data['list'];

        let tempatureArray = [];

        // we only need 3 temps and they give them in 3 hour intervals so get
        // every 8th one. one for the first 3 days respectively
        for (let i = 0; i < 24; i+=8) {
            const temp = list[i]['main']['temp'];
            tempatureArray.push(temp);
        }
        
        return tempatureArray;
    });
}

module.exports = getTemps;