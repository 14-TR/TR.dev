# Article Sharing Automation

When TR publishes an article on TR.dev, Jig can automatically share it to social media.

## Workflow

### Manual Trigger
```
"Share TR.dev article [title or URL]"
```

Jig will:
1. Extract article metadata (title, description, tags)
2. Draft social posts for each platform
3. Present drafts for approval
4. Post to approved platforms

---

## Platform-Specific Posts

### LinkedIn
- **Format:** Professional, technical
- **Length:** 1-3 paragraphs + link
- **Hashtags:** 3-5 relevant tags
- **Example:**
  ```
  This week I built an autonomous SWE team that fixed 3 critical bugs in under an hour for $0.04.
  
  The system uses batch execution mode to prevent runaway costs, with MiniMax agents handling implementation while Opus stays in planning mode. Cost efficiency: 99% under budget.
  
  Read the full breakdown: [link]
  
  #AI #DevOps #Automation #SoftwareEngineering #CostOptimization
  ```

### X (Twitter)
- **Format:** Punchy, concise
- **Length:** Thread (3-5 tweets)
- **Style:** Tech Twitter aesthetic
- **Example:**
  ```
  1/ Just shipped an autonomous SWE team that fixes bugs while you sleep 🤖
  
  3 critical bugs fixed in 35 minutes for $0.04. Here's how it works:
  
  2/ Batch execution mode = time-boxed sessions with hard cost limits
  
  MiniMax agents ($0.01/task) handle implementation
  Opus stays in planning mode (10-50x cheaper)
  
  No runaway costs. Ever.
  
  3/ Today's results:
  ✅ SQLite connection pooling
  ✅ Discord reactions API fix  
  ✅ JSON file locking (data loss prevention)
  
  All merged to main. All tests passing.
  
  Full writeup: [link]
  ```

### Discord (Optional)
- Post link in #big-ideas with 1-2 sentence summary
- Optional: Pin if major milestone

---

## Automation Options

### Option A: Manual Approval (Current)
1. TR: "Share [article]"
2. Jig drafts posts for all platforms
3. TR approves/edits each
4. Jig posts to approved platforms

### Option B: Auto-Draft Only
1. When article is published (git push detected)
2. Jig auto-drafts social posts
3. Saves to `articles/social-drafts/[slug].md`
4. TR reviews/posts manually or approves via Discord

### Option C: Fully Automated (Future)
1. Article published → auto-drafts
2. If article has `autoShare: true` in frontmatter
3. Auto-post to all platforms
4. TR gets notification after posting

**Current:** Option A (manual approval)

---

## LinkedIn API Setup

When ready to automate LinkedIn posting:

1. TR logs into LinkedIn in Chrome
2. Attach Browser Relay tab
3. Jig uses `browser` tool with `profile="chrome"`
4. Navigate to create post UI
5. Fill form, click post

**Safety:** Always show draft before posting. Never auto-post without approval.

---

## X API Setup

**Option 1:** Twitter API v2 (requires developer account)
- Apply at https://developer.twitter.com
- Get Bearer Token
- Use API for posting

**Option 2:** Browser automation (no API needed)
- Same as LinkedIn approach
- Attach Chrome tab with X open
- Use browser tool to create thread

**Recommendation:** Browser automation for now (no API signup needed)

---

## Template Variables

Available for draft generation:
- `{title}` - Article title
- `{url}` - Full article URL
- `{date}` - Publication date
- `{tags}` - Comma-separated tags
- `{summary}` - First paragraph or explicit summary
- `{key_points}` - Bullet list of main points

---

## Social Post Checklist

Before posting:
- [ ] Title accurate and compelling?
- [ ] URL works (test link)
- [ ] Hashtags relevant (not spam)
- [ ] Tone appropriate for platform
- [ ] Length within platform limits
- [ ] Call-to-action clear?
- [ ] Attribution correct?

---

## Analytics (Future)

Track which articles get most engagement:
- LinkedIn: views, likes, comments
- X: impressions, retweets, replies
- Use data to optimize future post style

For now: manual observation.
