const governorName = 'Greg Gianforte'

class Governor {
    constructor({ text, articles }) {
        this.data = {
            text,
            articles,
        }
    }

    export = () => ({ ...this.data })

}

export default Governor