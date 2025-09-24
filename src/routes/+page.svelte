<script lang="ts">
        type PostMetadata = {
                title?: string;
                author?: string;
                categories?: unknown;
                excerpt?: string;
                readingTime?: unknown;
                slug?: string;
                draft?: boolean;
                published?: string | null;
                lastUpdated?: string | null;
                keywords?: unknown;
                date?: string;
        };

        type Post = {
                slug: string;
                title: string;
                author: string;
                categories: string[];
                excerpt: string;
                readingTime: string | number | null;
                draft: boolean;
                published: string | null;
                lastUpdated: string | null;
                keywords: string[];
                date: string;
        };

        const modules = import.meta.glob('./*/+page.svx', { eager: true }) as Record<
                string,
                { metadata?: PostMetadata }
        >;

        let posts: Post[] = Object.entries(modules).map(([filePath, mod]) => {
                const folderName = filePath.split('/')[1];
                const metadata = mod.metadata ?? {};
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
                } = metadata;

                const normalizedCategories = Array.isArray(categories)
                        ? categories.map(String)
                        : [];
                const normalizedKeywords = Array.isArray(keywords) ? keywords.map(String) : [];
                const normalizedReadingTime =
                        typeof readingTime === 'number' || typeof readingTime === 'string'
                                ? readingTime
                                : null;
                const normalizedAuthor = typeof author === 'string' ? author : 'Unknown';

                return {
                        slug,
                        title,
                        author: normalizedAuthor,
                        categories: normalizedCategories,
                        excerpt,
                        readingTime: normalizedReadingTime,
                        draft: Boolean(draft),
                        published,
                        lastUpdated,
                        keywords: normalizedKeywords,
                        date
                } satisfies Post;
        });


        posts = posts.filter((post) => !post.draft);
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const totalPosts = posts.length;
        const featuredPost: Post | null = totalPosts > 0 ? posts[0] : null;

        function truncateText(text: string | undefined, maxLength = 100) {
                if (!text) return '';
                return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        }

        function formatDate(dateString: string | null | undefined) {
                if (!dateString) return '';
                const parsed = new Date(dateString);
                if (Number.isNaN(parsed.getTime())) return dateString;

                return parsed.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                });
        }
</script>

<section class="hero">
        <div class="hero-layout">
                <div class="hero-copy">
                        <span class="eyebrow">Security research • Systems tinkering • Curiosity</span>
                        <h1>
                                Hey, I’m Gaanesh<span class="accent">.</span>
                        </h1>
                        <p>
                                I love Cybersecurity!
                        </p>

                        <div class="hero-actions">
                                {#if featuredPost}

                                        <a
                                                class="cta primary"
                                                href={'/' + featuredPost.slug}
                                                data-sveltekit-preload-data
                                        >
                                                Read My Latest Post
                                        </a>

                                {/if}
                                <a class="cta ghost" href="#posts">My Previous Posts</a>
                        </div>

                        <div class="hero-stats">
                                <div class="stat">
                                        <span>{totalPosts}</span>
                                        <p>Post in the archive</p>
                                </div>
                                {#if featuredPost?.date}
                                        <div class="stat">
                                                <span>{formatDate(featuredPost.date)}</span>
                                                <p>Latest post</p>
                                        </div>
                                {/if}
                                {#if featuredPost?.readingTime}
                                        <div class="stat">
                                                <span>{featuredPost.readingTime} min</span>
                                                <p>Time to read</p>
                                        </div>
                                {/if}
                        </div>
                </div>

                {#if featuredPost}
                        <article class="hero-feature">
                                <span class="badge">New post</span>
                                <h3>{featuredPost.title}</h3>
                                <p>{truncateText(featuredPost.excerpt, 160)}</p>

                                <div class="feature-meta">
                                        {#if featuredPost.date}<span>{formatDate(featuredPost.date)}</span>{/if}
                                        {#if featuredPost.author}<span>by {featuredPost.author}</span>{/if}
                                        {#if featuredPost.readingTime}<span>{featuredPost.readingTime} min read</span>{/if}
                                </div>

                                {#if featuredPost.categories.length}
                                        <div class="chip-row">
                                                {#each featuredPost.categories as category}
                                                        <span class="chip">{category}</span>
                                                {/each}
                                        </div>
                                {/if}


                                <a
                                        class="feature-link"
                                        href={'/' + featuredPost.slug}
                                        data-sveltekit-preload-data
                                >

                                        Click to read!
                                </a>
                        </article>
                {/if}
        </div>
</section>

<section class="feed" id="posts">
        <div class="feed-header">
                <h2>Latest Writings</h2>
                <p>My Thinkspace</p>
        </div>

        {#if posts.length === 0}
                <p class="empty-state">I'm still writing the next one. Check back soon.</p>
        {:else}
                <div class="grid">
                        {#each posts as post}
                                <article class={`post-card ${post.slug === featuredPost?.slug ? 'is-featured' : ''}`}>
                                        <div class="card-top">
                                                <h3>{post.title}</h3>
                                                <p class="excerpt">{truncateText(post.excerpt, 130)}</p>
                                        </div>

                                        {#if post.categories.length}
                                                <div class="chip-row">
                                                        {#each post.categories as category}
                                                                <span class="chip">{category}</span>
                                                        {/each}
                                                </div>
                                        {/if}

                                        <div class="card-footer">
                                                <div class="meta">
                                                        {#if post.date}
                                                                <span>{formatDate(post.date)}</span>
                                                        {/if}
                                                        {#if post.readingTime}
                                                                <span>{post.readingTime} min read</span>
                                                        {/if}
                                                </div>

                                                <a
                                                        class="post-link"
                                                        href={'/' + post.slug}
                                                        data-sveltekit-preload-data
                                                >

                                                        Read this post
                                                </a>
                                        </div>
                                </article>
                        {/each}
                </div>
        {/if}
</section>
