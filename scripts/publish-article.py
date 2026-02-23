#!/usr/bin/env python3
"""
weekly-article publisher
Reads build-log/current-week.md → AI formats it → pushes to TR.dev articles.json → resets log
"""

import os, json, base64, datetime, subprocess, urllib.request, urllib.error

BUILD_LOG  = os.path.expanduser('~/Desktop/tr-jig/build-log/current-week.md')
REPO       = '14-TR/TR.dev'
ARTICLES_PATH = 'public/articles.json'
GH_TOKEN_CMD  = ['gh', 'auth', 'token']

def gh_token():
    return subprocess.check_output(GH_TOKEN_CMD).decode().strip()

def gh_get(path, token):
    req = urllib.request.Request(f'https://api.github.com/repos/{REPO}/contents/{path}')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Accept', 'application/vnd.github+json')
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def gh_put(path, content_str, sha, message, token):
    body = json.dumps({
        'message': message,
        'content': base64.b64encode(content_str.encode()).decode(),
        'sha': sha,
    }).encode()
    req = urllib.request.Request(f'https://api.github.com/repos/{REPO}/contents/{path}',
                                  data=body, method='PUT')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Accept', 'application/vnd.github+json')
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def ai_format_article(log_content):
    now   = datetime.datetime.now()
    week  = now.strftime('Week %U')
    year  = now.strftime('%Y')
    prompt = f"""You are a technical writer for a developer's personal blog.
Convert this raw weekly build log into a polished article.

Return ONLY valid JSON with these fields:
- title: string (punchy, specific, e.g. "Week 08 · What We Shipped: [topic]")
- date: string (e.g. "{now.strftime('%b %d, %Y')}")
- excerpt: string (2 sentences, engaging summary for the article card, ~150 chars)
- tags: array of 3-4 relevant tags

Build log:
{log_content}
"""
    payload = json.dumps({
        'model': 'qwen2.5:14b',
        'prompt': prompt,
        'stream': False,
        'options': {'temperature': 0.4, 'num_predict': 500}
    }).encode()
    req = urllib.request.Request('http://localhost:11434/api/generate', data=payload)
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=90) as r:
        result = json.loads(r.read())
    raw = result.get('response', '').strip()
    # Extract JSON from response
    start = raw.find('{')
    end   = raw.rfind('}') + 1
    return json.loads(raw[start:end])

def reset_build_log():
    now  = datetime.datetime.now()
    next_week = now + datetime.timedelta(days=7)
    with open(BUILD_LOG, 'w') as f:
        f.write(f"""# Build Log — Week of {next_week.strftime('%Y-%m-%d')}

## Shipped

## Pain Points

## OpenClaw Enhancements Noticed

## Next
""")

def main():
    print("Reading build log...")
    if not os.path.exists(BUILD_LOG):
        print("No build log found at", BUILD_LOG)
        return

    with open(BUILD_LOG) as f:
        log_content = f.read().strip()

    if len(log_content) < 100:
        print("Build log too sparse — skipping publish")
        return

    print("Formatting article with AI...")
    try:
        article = ai_format_article(log_content)
        article['link'] = '#'
        print(f"Article: {article['title']}")
    except Exception as e:
        print(f"AI formatting failed: {e}")
        return

    print("Fetching current articles.json from GitHub...")
    token = gh_token()
    try:
        file_data   = gh_get(ARTICLES_PATH, token)
        current     = json.loads(base64.b64decode(file_data['content']).decode())
        sha         = file_data['sha']
    except Exception as e:
        print(f"Failed to fetch articles.json: {e}")
        return

    updated = [article] + current   # prepend new article
    updated = updated[:12]          # keep last 12 articles

    print("Pushing updated articles.json...")
    try:
        gh_put(
            ARTICLES_PATH,
            json.dumps(updated, indent=2),
            sha,
            f"article: {article['title']}",
            token
        )
        print("Published!")
    except Exception as e:
        print(f"Push failed: {e}")
        return

    print("Resetting build log for next week...")
    reset_build_log()
    print("Done.")

if __name__ == '__main__':
    main()
