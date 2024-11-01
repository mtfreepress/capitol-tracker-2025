const geocodeUrl = 'https://gisservicemt.gov/arcgis/rest/services/MSL/AddressLocator/GeocodeServer/findAddressCandidates'
const districtApis = {
    house: 'https://services.arcgis.com/qnjIrwR8z5Izc0ij/arcgis/rest/services/Ql5J5/FeatureServer/0/query',
    senate: 'https://services.arcgis.com/qnjIrwR8z5Izc0ij/arcgis/rest/services/CChZA/FeatureServer/0/query',
}


export default class DistrictMatcher {

    async matchAddressToLawmakers(address, callback, fallback) {
        const locations = await this.geocode(address)
        const location = this.pickAddress(locations)
        if (location) {
            const houseDistrict = await this.getDistrict(location.location, districtApis.house)
            const senateDistrict = await this.getDistrict(location.location, districtApis.senate)
            if (!houseDistrict || !senateDistrict) {
                fallback()
            } else {
                const hd = houseDistrict.features[0].attributes['Name']
                const sd = senateDistrict.features[0].attributes['Name']
                callback({
                    hd,
                    sd,
                    location: location.address,
                })
            }
        } else {
            fallback()
        }

    }

    async geocode(address) {
        const payload = {
            SingleLine: address, // make this dynamic
            f: 'json',
            outSR: "{'wkid': 102100}"
        }
        const url = this.makeQuery(geocodeUrl, payload)
        const data = await fetch(url)
            .then(resp => resp.json())
            .catch(err => console.log(err))
        return data
    }

    async getDistrict(coords, apiUrl) {
        const crs = '{"wkid":102100,"latestWkid":3857}'
        const payload = {
            f: 'json',
            where: '',
            returnGeometry: 'false',
            spatialRel: 'esriSpatialRelIntersects',
            // geometry: `{"x":-12360980.822659303,"y":5726893.814342619,"spatialReference":{"wkid":102100,"latestWkid":3857}}`,
            geometry: `{"x":${coords.x},"y":${coords.y},"spatialReference":${crs}}`,
            geometryType: 'esriGeometryPoint',
            inSR: '102100',
            outFields: '*',
            outSR: '102100',
        }
        const url = this.makeQuery(apiUrl, payload)
        const data = await fetch(url)
            .then(data => data.json())
            .then(res => res)
            .catch(err => console.log(err))
        if (!data || !data.features) return null
        return data
    }

    makeQuery = (url, params) => {
        let string = url + '?'
        for (let key in params) {
            string = string + `${key}=${params[key].replace(/\s/g, '%20')}&`
        }
        return string
    }

    pickAddress = (locations) => {
        if (locations === undefined) return null
        return locations.candidates[0]
    }
}