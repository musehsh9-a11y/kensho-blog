import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET({ site }: { site?: URL }) {
	const siteUrl = site?.toString().replace(/\/$/, '') ?? '';

	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const lines = [
		`# ${SITE_TITLE}`,
		'',
		`> ${SITE_DESCRIPTION}`,
		'',
		'## 記事一覧',
		'',
		...posts.map((post) => {
			const desc = post.data.summary ?? post.data.description;
			return `- [${post.data.title}](${siteUrl}/blog/${post.id}/)${desc ? `: ${desc}` : ''}`;
		}),
		'',
		'## その他',
		'',
		`- [ブログトップ](${siteUrl}/): ${SITE_TITLE}のトップページ`,
		`- [RSS フィード](${siteUrl}/rss.xml): 最新記事の配信フィード`,
		'',
	];

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
