import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';

// the wonderful thing about typescript is the explicitness with how you
// can describe props and otherwise unknown return types to the compiler.
// i think it makes for much more sane coding
type tempRequestBody = {
  temps: number[],
  mean: number,
  median: number,
  mode: number
}

type CoodinatesInputProps = {
  coordinate: string,
  setCoordinate: (num: string) => void
}
type ReadOnlyInputProps = {
  value: string | number
}

// grab the correct url from our environment variables.
// create-react-app reads in env variables and will replace this
// inline with a string for production. handy when switching between
// environments!
const backendUrl = process.env.REACT_APP_BACKEND_URL as string;

// contact the backend and return a promise encapsulating the json response
function getTemps(latitude: number, longitude: number): Promise<tempRequestBody> {
  return fetch(backendUrl + `?lat=${latitude}&lon=${longitude}`).then(res => res.json())
}

function CoordinatesInput({ coordinate, setCoordinate }: CoodinatesInputProps) {
  return <input value={coordinate} onChange={e => setCoordinate(e.target.value)} />
}

// react doesn't like switching from a non controlled input to a controlled input
// i.e. react wasnt supplying a value to it and now it is. to get around that,
// i made it into a component so it rerenders when that occurs and all is well
function ReadOnlyInput({ value }: ReadOnlyInputProps) {
  return <input className='readOnlyInput' readOnly disabled value={value} />
}

function App() {
  const [temps, setTemps]             = useState<number[] | null>(null);
  const [mean, setMean]               = useState<number | null>(null);
  const [median, setMedian]           = useState<number | null>(null);
  const [mode, setMode]               = useState<number | null>(null);
  const [latitude, setLatitude]       = useState('30.2241');
  const [longitude, setLongitude]     = useState('-92.0198');
  const [searchError, setSearchError] = useState(false);

  // I wanted to search as soon as the page starts up with the default of layette.
  // an annoying feature of useEffect is that eslint gives a warning for a non
  // exhaustive dependency list, but an empty one is how you get it to only run once
  useEffect(() => {
    onTempSearch();
  // eslint-disable-next-line
  }, []);

  // get the temperature from the backend, if valid inputs
  async function onTempSearch() {
    const latNumber  = Number.parseFloat(latitude);
    const longNumber = Number.parseFloat(longitude);

    // if they didn't enter a number, or if the lat
    // or long is out of range, dont proceed
    if (isNaN(latNumber) || isNaN(longNumber) ||
        latNumber > 90 || latNumber < -90 ||
        longNumber > 180 || longNumber < -180) {
      setSearchError(true);
      return;
    }
    
    // grab our temps and notify the user if there was an error
    getTemps(latNumber, longNumber).then(body => {
      setTemps(body.temps);
      setMean(body.mean);
      setMedian(body.median);
      setMode(body.mode);
    }).catch(() => {
      alert('There was an error contacting the server.');
    });
  }

  return (
    <div className="App">
      <div className='tempCard'>

        <table className='tempTable'>
          <tbody>
            <tr>
              <td style={{ width: '25%' }}>Latitude: </td>
              <td><CoordinatesInput coordinate={latitude} setCoordinate={setLatitude} /></td>
            </tr>
            <tr>
              <td style={{ width: '25%' }}>Longitude: </td>
              <td><CoordinatesInput coordinate={longitude} setCoordinate={setLongitude} /></td>
            </tr>
          </tbody>
        </table>

        {searchError ? (
          <div className='errorText'>
            Please enter valid latitude and longitude coordinates
          </div>
        ) : <></>}

        <div className='tempButton' onClick={onTempSearch}>
          Search
        </div>

        <table className='tempTable'>
          <tbody>
            <tr>
              <td style={{ width: '25%' }}>Temps:</td>
              <td><ReadOnlyInput value={temps ? temps.join(', ') : ''} /></td>
            </tr>

            <tr>
              <td style={{ width: '25%' }}>Mean:</td>
              <td><ReadOnlyInput value={mean ? mean : ''} /></td>
            </tr>

            <tr>
              <td style={{ width: '25%' }}>Median:</td>
              <td><ReadOnlyInput value={median ? median : ''} /></td>
            </tr>

            <tr>
              <td style={{ width: '25%' }}>Mode:</td>
              <td><ReadOnlyInput value={mode ? mode : ''} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
