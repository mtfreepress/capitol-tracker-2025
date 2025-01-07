class HousePage {
    constructor({ text }) {
        this.data = {
            text,
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