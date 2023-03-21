async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

const myMap = {
    coordinates: [],
    business: [],
    map: {},
    markers: {},
    generateMap(){
        var map = L.map('map').setView([this.coordinates[0],this.coordinates[1]], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
    var marker = L.marker([this.coordinates[0],this.coordinates[1]]).addTo(map)
    marker.bindPopup("<b>You are here!</b>").openPopup();
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


async function getFoursquare(business){
    const options = {method: 'GET', headers: {accept: 'application/json'}, Authorization: 'fsq3Dy3NqGGBdLMDdyQnThzzYsPuDF5EiMBR6u5NntMEXXA='}

    let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.result
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

