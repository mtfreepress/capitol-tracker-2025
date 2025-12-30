import fs from 'fs';
import fetch from 'node-fetch';

const writeJson = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), err => {
    if (err) throw err
    console.log('JSON written to', path)
  }
  );
}

const TAG = "2025-legislature" // Replace spaces in tag as seen in CMS with hyphens here
const EXCLUDE_TAG = 'Tracker Exclude'
const QUERY_LIMIT = 100

async function getStories(cursor) {

  const stories = fetch('https://montanafreepress.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
            {
            posts(after: "${cursor}",first: ${QUERY_LIMIT}, where: {tag: "${TAG}"}) {
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                }
                nodes {
                    title
                    date
                    link
                    status
                    tags(first: 100) {
                      nodes {
                        name
                      }
                    }
                    categories(first: 100) {
                      nodes {
                        name
                      }
                    }
                    featuredImage {
                      node {
                        link
                      }
                    }
                    author {
                      node {
                        name
                      }
                    }
                    excerpt
                  }
            }
        }
        `,
    }),
  })
    .then(res => res.json())
    .then(json => json.data)
    .catch(err => console.log(err))

  return stories
}

function clean(raw) {
  return {
    title: raw.title,
    date: raw.date,
    link: raw.link,
    tags: raw.tags.nodes.map(d => d.name),
    categories: raw.categories.nodes.map(d => d.name),
    featuredImage: raw.featuredImage.node.link,
    author: raw.author.node.name,
    // leave excerpt out
  }
}

async function main() {
  let stories = []
  let hasNextPage = true
  let cursor = ""
  while (hasNextPage) {
    const query = await getStories(cursor)
    stories = stories.concat(query.posts.nodes)
    cursor = query.posts.pageInfo.endCursor
    hasNextPage = query.posts.pageInfo.hasNextPage
  }
  const filtered = stories.filter(d => !d.tags.nodes.map(t => t.name).includes(EXCLUDE_TAG))
  console.log(`Found ${stories.length} MTFP stories tagged ${TAG}`)
  console.log(`Returned ${filtered.length} excluding tag ${EXCLUDE_TAG}`)
  const cleaned = stories.map(clean)

  writeJson('./inputs/coverage/articles.json', cleaned)
  console.log('MTFP articles fetch done\n')
}
main()