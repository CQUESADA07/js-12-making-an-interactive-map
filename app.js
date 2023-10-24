async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

const myMap ={
    coordinates: [],
    business: [],
    map: {},
    markers: {},
    generateMap(){
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 20,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: '14',
            }).addTo(this.map)
            const marker = L.marker(this.coordinates)
            marker
            .addTo(this.map)
            .bindPopup('<p1><b>You are here</b><br></p1>')
            .openPopup()
    },
    addMarkers() {
		for (var i = 0; i < this.business.length; i++) {
		this.markers = L.marker([
			this.business[i].lat,
			this.business[i].long,
		])
			.bindPopup(`<p1>${this.business[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () =>{
    const coords = await getCoords()
    myMap.coordinates = coords
    myMap.generateMap()

    document.getElementById('submit').addEventListener('click', async (event) => {
        event.preventDefault()
        let business = document.getElementById('places').value
        let data = await getFoursquare(business)
        console.log(data)
        myMap.business = processBusinesses(data)
        myMap.addMarkers()
    })
}

