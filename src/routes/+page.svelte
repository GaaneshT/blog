<script>
	const modules = import.meta.glob('./*/+page.svx', { eager: true });
	let posts = Object.entries(modules).map(([filePath, mod]) => {
		const folderName = filePath.split('/')[1];
		const {
			title = 'Untitled',
			author = 'Unknown',
			categories = [],
			excerpt = '',
			readingTime = null,
			slug = folderName, 
			draft = false,
			published = null,
			lastUpdated = null,
			keywords = [],
			date = ''
		} = mod.metadata ?? {};

		return {
			slug,
			title,
			author,
			categories,
			excerpt,
			readingTime,
			draft,
			published,
			lastUpdated,
			keywords,
			date
		};
	});


	posts = posts.filter((post) => !post.draft);
	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	function truncateText(text, maxLength = 100) {
		if (!text) return '';
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	}
</script>


<section class="hero">
	<h1>Hey, I’m Gaanesh!</h1>
	<p>
		Exploring Cybersecurity, One Byte at a Time
	</p>
</section>

<!-- Post List -->
<div class="main-container">
	<div class="grid">
		{#each posts as post}
			<article class="post-card">
				<h2>{post.title}</h2>
				<div class="meta">
					{#if post.date}{post.date}{/if}
					{#if post.author}
						&bull; by {post.author}{/if}
					{#if post.readingTime}
						&bull; {post.readingTime} min read{/if}
				</div>

				{#if post.categories.length}
					<!-- If categories exist, excerpt has smaller margin-bottom -->
					<p class="excerpt with-categories">
						{truncateText(post.excerpt, 120)}
					</p>
					<p class="categories">Categories: {post.categories.join(', ')}</p>
				{:else}
					<!-- No categories, excerpt can have larger margin -->
					<p class="excerpt no-categories">
						{truncateText(post.excerpt, 120)}
					</p>
				{/if}

				<a href={'/' + post.slug} rel="external">Read more...</a>

				<!-- If you want, show lastUpdated, published, or keywords -->
				{#if post.lastUpdated}
					<p>Last updated: {post.lastUpdated}</p>
				{/if}
				{#if post.published}
					<p>Published: {post.published}</p>
				{/if}
				{#if post.keywords.length}
					<p>Keywords: {post.keywords.join(', ')}</p>
				{/if}
			</article>
		{/each}
	</div>
</div>
