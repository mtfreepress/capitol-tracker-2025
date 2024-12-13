import { getCorrespondingSenateDistrictNumber } from '../lib/utils';

const BASE_PATH = 'https://39tcu96a0k.execute-api.us-west-2.amazonaws.com/prod';
const GEOCODE_API_URL = `${BASE_PATH}/geocode`;
const HOUSE_DISTRICT_API_URL = `${BASE_PATH}/hd-lookup`;

export default class DistrictMatcher {
    async matchAddressToLawmakers(address, callback, fallback) {
        const locations = await this.geocode(address);
        const location = this.pickAddress(locations);
        if (location) {
            const houseDistrict = await this.getDistrict(location.location, HOUSE_DISTRICT_API_URL);
            if (!houseDistrict) {
                fallback();
            } else {
                const hd = houseDistrict.features[0].attributes['District'];
                const sd = getCorrespondingSenateDistrictNumber(hd); // Directly calculate the senate district
                callback({
                    hd: `HD ${hd}`,
                    sd: `SD ${sd}`,
                    location: location.address,
                });
                
            }
        } else {
            fallback();
        }
    }

    async geocode(address) {
        const payload = {
            SingleLine: address,
            f: 'json',
            outSR: "{'wkid': 102100}"
        };
        const url = this.makeQuery(GEOCODE_API_URL, payload);
        const data = await fetch(url)
            .then(resp => resp.json())
            .catch(err => console.error(err));
        return data;
    }

    async getDistrict(coords, apiUrl) {
        const crs = '{"wkid":102100,"latestWkid":3857}';
        const payload = {
            f: 'json',
            where: '',
            returnGeometry: 'false',
            spatialRel: 'esriSpatialRelIntersects',
            geometry: `{"x":${coords.x},"y":${coords.y},"spatialReference":${crs}}`,
            geometryType: 'esriGeometryPoint',
            inSR: '102100',
            outFields: '*',
            outSR: '102100',
        };
        const url = this.makeQuery(apiUrl, payload);
        const data = await fetch(url)
            .then(resp => resp.json())
            .catch(err => console.error(err));
        if (!data || !data.features) return null;
        return data;
    }

    makeQuery = (url, params) => {
        let string = url + '?';
        for (let key in params) {
            string = string + `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
        }
        return string.slice(0, -1);
    };

    pickAddress = (locations) => {
        if (!locations || locations.candidates.length === 0) return null;
        return locations.candidates[0];
    };
}
