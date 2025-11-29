<script lang="ts">
  import Card from '$lib/components/ui/card/card.svelte';
  import CardContent from '$lib/components/ui/card/card-content.svelte';
  import CardDescription from '$lib/components/ui/card/card-description.svelte';
  import CardHeader from '$lib/components/ui/card/card-header.svelte';
  import CardTitle from '$lib/components/ui/card/card-title.svelte';

  interface Props {
    title: string;
    description: string;
    pubDate: Date;
    slug: string;
    tags?: string[];
  }

  let { title, description, pubDate, slug, tags = [] }: Props = $props();

  const formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
</script>

<a href={`/blog/${slug}`} class="block hover:opacity-80 transition-opacity">
  <Card class="h-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{formattedDate}</CardDescription>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground">{description}</p>
      {#if tags.length > 0}
        <div class="flex gap-2 mt-4 flex-wrap">
          {#each tags as tag}
            <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </CardContent>
  </Card>
</a>
