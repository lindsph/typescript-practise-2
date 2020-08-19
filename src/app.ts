import axios from 'axios';

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = 'insert key here';

// https://stackoverflow.com/questions/42759393/cannot-find-name-google-while-using-google-maps-on-ionic2
// declare var google: any;

// installed @types/googlemaps to remove the need for above
// https://www.npmjs.com/package/@types/googlemaps

// return does have more than what's shown here, but I'll just put in the response data I'm interested in
interface GoogleGeocodingResponse { 
    results: { 
        geometry: { 
            location: { 
                lat: number, 
                lng: number 
            } 
        } 
    }[];
    // https://developers.google.com/maps/documentation/geocoding/overview#geocoding-requests
    status: 'OK' | 'ZERO-RESULTS' 
}

const searchAddressHandler = (event: Event) => {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // send to Google's Geocoding API: https://developers.google.com/maps/documentation/geocoding/start
        // using axios: https://github.com/axios/axios
            // has built in TS support
    
    // encodeURI converts enteredAddress string into a URL compatible string
    // tells TS the response type
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
        .then(response => {
            const status = response.data.status;
            
            if (status !== 'OK') {
                throw new Error('Could not fetch location.');
            } else {
                const coordinates = response.data.results[0].geometry.location;

                // https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-typescript
                const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                    center: coordinates,
                    zoom: 12
                });

                new google.maps.Marker({position: coordinates, map: map});
            }
        })
        .catch(error => {
            alert(error.message);
        });
}

form.addEventListener('submit', searchAddressHandler);