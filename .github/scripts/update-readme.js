const fs = require('fs')

const RSS_URL = 'https://jethromay.com/rss/feed.xml'

async function fetchLatestPost() {
  const res = await fetch(RSS_URL)
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`)
  const xml = await res.text()

  const titleMatch = xml.match(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>/)
  const linkMatch = xml.match(/<item>[\s\S]*?<link>(.*?)<\/link>/)

  if (!titleMatch || !linkMatch) throw new Error('Could not parse RSS feed')

  return {
    title: titleMatch[1].trim(),
    url: linkMatch[1].trim(),
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function main() {
  const post = await fetchLatestPost()
  const updated = formatDate(new Date())

  const readme = `## Hey, I'm Jethro. 👋

12+ years in web development. These days I spend as much time in strategy sessions as I do in code — leading engineering teams, scoping enterprise projects, and helping clients turn complex requirements into scalable products. Still deeply technical, still care about doing things properly.

---

### 🔭 Currently

**Building**
- [HygieneScout](https://hygienescout.co.uk) — 600K+ UK food hygiene ratings, updated daily
- Internal AI tooling and automations for agency-scale workflows
- Personal AI projects and experiments using the [Claude API](https://anthropic.com)

**Exploring**
- Agentic systems and how LLMs fit into real production environments
- Writing about it at [jethromay.com](https://jethromay.com)

---

### 🔗 Find me

- 💼 [LinkedIn](https://www.linkedin.com/in/jethromay/)
- 🦋 [Bluesky](https://bsky.app/profile/jethromay.bsky.social)

---

### ✍️ Latest Post

- ✨ **[${post.title}](${post.url})**

---

<p align="right"><sub>Last updated ${updated}</sub></p>
`

  fs.writeFileSync('README.md', readme, 'utf8')
  console.log(`Updated README with: ${post.title}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
