# TR.dev Weekly Articles

**"How Our System Works"** - Weekly blog posts about development work, system evolution, and interesting problems solved.

## Workflow

1. **Sunday 8 PM MT:** Automated cron job drafts article
   - Reviews past week's memory files
   - Checks merged PRs from tr-jig and Git-Map
   - Identifies key themes and accomplishments
   - Drafts 800-1200 word article
   - Saves as `YYYY-MM-DD-[slug].md`
   - Announces in Discord #jig

2. **Monday Morning:** TR reviews draft
   - Edit for clarity, tone, accuracy
   - Add personal insights
   - Polish conclusion

3. **When Ready:** TR publishes
   - Build TR.dev site with new article
   - Deploy to production
   - Share link to LinkedIn, X, etc. (automated via Jig)

## Article Structure

```markdown
---
title: "How Our System Works: [Theme]"
date: YYYY-MM-DD
author: TR
tags: [tag1, tag2, tag3]
---

# How Our System Works: [Theme]

[Hook - what we accomplished this week]

## [Section 1: Main Work]

[Details about primary feature/fix/improvement]

## [Section 2: Interesting Problem]

[Technical challenge and how we solved it]

## [Section 3: System Evolution]

[Workflow improvements, new capabilities]

## What's Next

[Tease upcoming work]
```

## Tone

- **First-person from TR's perspective** ("I built", "we solved")
- **Technical but accessible** - explain concepts for non-experts
- **Story-driven** - show the journey, not just the result
- **Authentic** - include challenges, not just wins

## Publishing Checklist

- [ ] Frontmatter complete (title, date, author, tags)
- [ ] Code snippets have syntax highlighting
- [ ] Links work (internal references, external resources)
- [ ] Images optimized (if any)
- [ ] SEO: clear title, first paragraph hooks readers
- [ ] Build site: `npm run build`
- [ ] Test locally: `npm run preview`
- [ ] Deploy: `git push origin main` (auto-deploys via GitHub Pages)
- [ ] Share on socials (LinkedIn, X)

## Archive

Published articles move to `articles/published/` after deployment.
Drafts stay in `articles/` until published or archived.
