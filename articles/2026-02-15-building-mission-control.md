# How Our System Works: Building Fleet Ops Dashboard (Week of Feb 9-15, 2026)

*A week of dashboards, self-improving agents, and ruthless system cleanup.*

---

When you're running a multi-agent AI system with dozens of cron jobs, two machines, and automated content pipelines, you eventually need to see what's happening. This week, I built the Fleet Ops dashboard—a real-time monitoring system for OpenClaw—and discovered something unexpected about AI-assisted development along the way.

## The Problem with Flying Blind

My setup has grown. Jig runs on my MacBook Pro. Jag lives on an Alienware Windows machine. Between them, they manage nightly Git-Map builds, daily faceless youtube videos, self-improvement cycles, and a handful of other automated workflows. Each piece worked, but I had no single view into the system.

I'd SSH into Jag to check if it was overheating. I'd grep through logs to see if crons fired. I'd ask Jig "what's running?" and trust the response. It worked, but it didn't scale. I needed a dashboard.

## Fleet Ops Dashboard: 100% AI-Assisted, $0.20 Total

Here's where it gets interesting. I built the Fleet Ops dashboard entirely with AI assistance—specifically using MiniMax, a cost-efficient model that handles structured frontend work remarkably well.

The stack: Next.js 16, Tailwind v4, Server Components, and a JARVIS-inspired dark theme (because if you're building a fleet ops dashboard, commit to the aesthetic).

**The pages:**
- **Home**: Quick stats—active agents, session count, cron health at a glance
- **Ops**: System health, cron job status, real-time monitoring
- **Agents**: All agents with their metrics and status and sub-agent spawn monitoring
- **Content**: YouTube, X, LinkedIn, TikTok pipeline overviews
- **Logs**: Real-time log viewer with filtering

**Total cost for the entire build: approximately $0.20.**

Compare that to what it would have cost using a more expensive model ($50-100 worth of tokens for the same work). MiniMax handled the React components, Tailwind styling, API wiring, and responsive design without breaking a sweat. For structured UI tasks with clear requirements, it's become my default choice dev agents. 90th percentile of Opus4-6 code quality and fraction of the cost. Just needs complex reasoning of real Opus to point it in the right direction.

The dashboard runs on Tailscale port with a LaunchAgent for auto-start. No public internet exposure—just accessible from my devices anywhere.

## Agent Lightning: Teaching Agents to Improve Themselves

While building the dashboard, I finished integrating Agent Lightning—a performance tracing system that wraps every cron job and collects metrics. The idea is simple: if we can measure how well each pipeline performs, we can optimize it automatically.

Here's what's now tracked:
- **16 of 17 cron jobs** have tracing spans
- **23 reward functions** evaluate success (ranging from -1.0 to +1.0)
- **APO Agent** (Automatic Prompt Optimization) runs daily at 3 AM, analyzing traces and proposing improvements

The self-improvement loop is officially closed. Pipelines run → traces collect → APO analyzes → optimizations get proposed → pipelines improve. No manual intervention required.

Early results are promising. The self-improve pipeline shows consistent 1.0 rewards. Git-Map nightly builds average 0.875. Bookmark-digest hovers around 0.65 (there's room to grow). Real data only—I purged all synthetic test traces to keep the metrics honest.

## Cleanup Week: Killing Dead Weight

Sometimes the best work is deletion. I spent part of the week interviewing myself about what was actually in use versus what was theoretical.

**Deleted:**
- `voice-assistant` good idea that proved not so useful, just use discord
- `job-scanner`, `resume-engine`, `interview-prep`—for a goal 6+ months out, reinstall when needed, but completely one shoted 
- `codesession`—cost tracker I never wired up, api providers have plenty of trackers just pin the webpage
- `Know-Flow`—absorbed by ProjectIQ back in early February

**Kept:**
- Everything actively running
- `autonomous-swe-team`—proved useful this week, fixed 3 bugs autonomously
- `agent-lightning`—the performance system described above
- `linkedin`—for future article cross-posting

**Archived:** Know-Flow got a proper burial in `~/Desktop/Archives/` before deletion. It had working code; I might reference it later. Eventually will be brought back when ProjectIQ is opensourced

The disk space savings were minimal (~120KB), but the cognitive overhead reduction was significant. Fewer moving parts means fewer things to remember, debug, and maintain. More brain to build with.

## Content Pipeline Upgrades

Built out content generation and deployment for two YouTube formats:

**Daily shorts pipeline**: 8 new shader animations (breathing, gentle waves, meditation, floating, rain, mist, calm ocean, morning) with slower, contemplative pacing. Automated publishing every day.

**Sunday weekly pipeline**: 5-passage videos with AI-generated meanings via local Ollama. The format interleaves passages with their interpretations, ending with a prayer CTA. Auto-deploys every Sunday at 4 PM MT.

The combined schedule runs 7 daily shorts + 1 weekly long-form video.

## Git-Map: Quiet Progress

Meanwhile, Git-Map hit 450+ tests with PRs 63-66 landing this week:
- Lazy imports in `__init__.py` for faster startup
- 90%+ coverage on `remote.py`
- Fixed pytest configuration for fresh clones
- Cleaned up 19 unused imports

Boring work, but it matters. Each PR makes the codebase more maintainable.

## What's Next

- **Mac Mini migration**: When the M4s arrive, they becomes the permanent 24/7 OpenClaw hosts each its own "main" agent with mirrored architecture patterns throughout. Jag (the Alienware) eventually gets retired. Minis = Lower power, silent, no sleep/battery issues.
- **TR.dev weekly articles**: This is the first one! The workflow: Sunday night auto-draft → Monday review → publish → cross-post to LinkedIn and X.
- **Expert Board completion**: 15 papers remain in the queue. Finish, then pause.

The system is getting more observable, more self-improving, and leaner. That's the trajectory we want.

---

*This article was drafted by Jig based on the week's development activity, then reviewed and published by TR.*
