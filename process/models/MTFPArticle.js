import { standardLawmakerNames } from '../functions.js'

const govTagTest = tag => tag.match(/(Greg Gianforte|Steve Bullock)/)
const billTagTest = tag => tag.match(/(House|Senate|Joint) (Bill|Resolution) [0-9]{1,4}/)
const lawmakerTagTest = tag => standardLawmakerNames.includes(tag)

const cleanBillTags = tag => tag.replace('House ', 'H').replace('Senate ', 'S').replace('Joint', 'J')
    .replace('Bill', 'B').replace('Resolution', 'R')

export default class Article {
    constructor({ article }) {
        this.tags = article.tags.nodes.map(d => d.name)
        this.data = {
            title: article.title,
            category: article.categories.nodes[0].name,
            subtitle: '', // Hard to get
            date: new Date(article.date),
            link: article.link,
            // tags: this.tags,
            author: article.author.node.name,
            imageUrl: article.featuredImage && article.featuredImage.node.link,

            billTags: this.tags.filter(billTagTest).map(cleanBillTags),
            lawmakerTags: this.tags.filter(lawmakerTagTest),
            governorTags: this.tags.filter(govTagTest),
        }
    }

    export = () => ({ ...this.data })


}