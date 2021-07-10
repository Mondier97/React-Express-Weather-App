const express  = require('express');
const cors     = require('cors');
const path     = require('path')
const getTemps = require('./input.js');

// prepare express and allow for cors requests.
const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

function mean(array) {
    let total = 0;

    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }

    return total / array.length;
}

function median(array) {
    if (!array.length)
        return 0;

    array.sort((x,y) => x-y);

    // odd length
    if (array.length % 2 === 1) {
        const middle = Math.floor(array.length / 2);
        return array[middle];
    }
    // even length
    else {
        const mid1 = Math.floor(array.length / 2);
        const mid2 = mid1 + 1;

        return (array[mid1] + array[mid2]) / 2
    }
}

function mode(array) {
    let frequencies = {};
    let largest = null;

    for (let i = 0; i < array.length; i++) {
        const num = array[i];
        if (frequencies[num]) {
            frequencies[num] += 1;
        } else {
            frequencies[num] = 1;
        }
        if (largest === null || largest < frequencies[num]) {
            largest = num;
        }
    }

    return largest;
}

// serve the compiled react app. intended for production. 
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "./frontend/build")));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './frontend/build/index.html'));
    });
}

// i decided to move the default endpoint to /api so that i could serve
// the react app directly from express. hope that's ok!
app.get('/api', async (req, res) => {
    // convert the params just to check if they are valid or not
    const latitude  = Number.parseFloat(req.query.lat);
    const longitude = Number.parseFloat(req.query.lon);

    // handle bad latitudes or longitudes and exit
    if (isNaN(latitude) || isNaN(longitude) ||
        latitude > 90 || latitude < -90 ||
        longitude > 180 || longitude < -180) {
        return res.status(400).send('Invalid latitude or longitude');
    }

    // contact the weather api
    const array = await getTemps(latitude, longitude);
    
    // build our response and then send it back to the frontend
    const body = {
        "temps"  : array,
        "mean"   : mean(array),
        "median" : median(array),
        "mode"   : mode(array)
    };

    res.send(JSON.stringify(body));
});
  
// start the app and notify the user.
app.listen(port, () => {
    console.log(`SCP Temp App listening at http://localhost:${port}`);
});