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

I am a Partner and Head of Development working for [FINN Partners](https://www.finnpartners.com/) in London, United Kingdom.

My go-to technologies include [Laravel](https://laravel.com/), [Livewire](https://laravel-livewire.com/), [Inertia](https://inertiajs.com/), [AlpineJS](https://alpinejs.dev/) and [Tailwind](https://tailwindcss.com/) but I am also a firm believer in keeping it simple, utilizing regular HTML5, CSS3 and JavaScript as much as possible.

If you would like to reach out, its best to contact me on [Bluesky](https://bsky.app/profile/jethromay.bsky.social).

### Latest Posts:

- ✨ Read my latest blog post: **[${post.title}](${post.url})**

Last updated on ${updated}.
`

  fs.writeFileSync('README.md', readme, 'utf8')
  console.log(`Updated README with: ${post.title}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
