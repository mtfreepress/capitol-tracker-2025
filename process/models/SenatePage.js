import { getLegislativeLeaderDetails } from '../functions.js'

class SenatePage {
    constructor({ text, lawmakers }) {
        this.data = {
            text,
            leadership: [
                getLegislativeLeaderDetails(lawmakers, 'Senate President'),
                getLegislativeLeaderDetails(lawmakers, 'Senate Majority Leader'),
                getLegislativeLeaderDetails(lawmakers, 'Senate Minority Leader'),
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

export default SenatePage