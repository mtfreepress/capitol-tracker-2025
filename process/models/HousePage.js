import { getLegislativeLeaderDetails } from '../functions.js'

class HousePage {
    constructor({ text, lawmakers }) {
        this.data = {
            text,
            leadership: [
                getLegislativeLeaderDetails(lawmakers, 'Speaker of the House'),
                getLegislativeLeaderDetails(lawmakers, 'House Majority Leader'),
                getLegislativeLeaderDetails(lawmakers, 'House Minority Leader'),
            ]
            // committees: committees.map(c => ({
            //     // select fields only  to manage data size
            //     name: c.data.name,
            //     key: c.data.key,
            //     chamber: c.data.chamber,
            //     members: c.data.members,
            //     overview: c.data.overview,
            // })),
        }
    }
    export = () => ({ ...this.data })

}

export default HousePage