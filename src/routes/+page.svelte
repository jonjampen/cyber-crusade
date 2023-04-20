<script>
    import { marked } from 'marked';

    let markdown = `# Hello\n## How are you?\nThis text is **bold**`;
    let instructions = marked(markdown);
   
</script>

<p>{@html instructions}</p>