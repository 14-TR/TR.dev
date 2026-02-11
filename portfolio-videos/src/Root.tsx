import { Composition } from "remotion";
import { ProjectVideo, ProjectVideoProps } from "./ProjectVideo";

// Project data for each video
const projects: ProjectVideoProps[] = [
  {
    title: "Know-Flow",
    tagline: "Interactive Context Graphs for AI",
    description: "Visual knowledge management platform that creates interactive context graphs for AI-powered workflows.",
    features: [
      "Real-time collaboration",
      "SQLite-backed persistence", 
      "Intelligent context retrieval",
      "D3.js visualizations"
    ],
    tech: ["React", "Express", "SQLite", "D3.js", "WebSockets"],
    accentColor: "#a855f7", // purple
    github: "github.com/14-TR/Know-Flow"
  },
  {
    title: "OpenWorker",
    tagline: "AI Agents on Cloudflare's Edge",
    description: "Multi-agent automation platform deployed on Cloudflare Workers with sub-50ms global latency.",
    features: [
      "24/7 autonomous agents",
      "Shell & browser automation",
      "Multi-channel messaging",
      "Zero Trust security"
    ],
    tech: ["Cloudflare Workers", "R2", "AI Gateway", "TypeScript"],
    accentColor: "#f97316", // orange
    website: "openworker.org"
  },
  {
    title: "Git-Map",
    tagline: "Version Control for ArcGIS Maps",
    description: "Git-like version control system for ArcGIS web maps with branching, merging, and history tracking.",
    features: [
      "540+ tests",
      "CLI + REST API",
      "Branch & merge",
      "Configuration diffing"
    ],
    tech: ["Python", "ArcGIS API", "FastAPI", "PostgreSQL", "Pytest"],
    accentColor: "#22c55e", // green
    github: "github.com/14-TR/Git-Map"
  },
  {
    title: "ProjectIQ",
    tagline: "AI-Powered Project Intelligence",
    description: "Comprehensive project management platform with 67+ specialized tools for project operations.",
    features: [
      "170+ tests",
      "Process workflows",
      "Compliance tracking",
      "React dashboard"
    ],
    tech: ["TypeScript", "React", "Python", "SQLite", "OpenClaw"],
    accentColor: "#3b82f6", // blue
    // No public GitHub
  },
  {
    title: "ConflictIQ",
    tagline: "Natural Language Spatial Analytics",
    description: "GeoAI system that converts natural-language queries into executable SQL over PostGIS databases.",
    features: [
      "NLQ to SQL",
      "PostGIS integration",
      "Predictive analytics",
      "Enterprise production"
    ],
    tech: ["Python", "FastAPI", "PostGIS", "OpenAI API", "React"],
    accentColor: "#ec4899", // pink
    // No public GitHub - enterprise project
  }
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {projects.map((project) => (
        <Composition
          key={project.title}
          id={project.title.replace(/[^a-zA-Z0-9]/g, "")}
          component={ProjectVideo}
          durationInFrames={630} // 21 seconds at 30fps
          fps={30}
          width={1920}
          height={1080}
          defaultProps={project}
        />
      ))}
      
      {/* Short versions for social */}
      {projects.map((project) => (
        <Composition
          key={`${project.title}-short`}
          id={`${project.title.replace(/[^a-zA-Z0-9]/g, "")}-Short`}
          component={ProjectVideo}
          durationInFrames={270} // 9 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // Vertical for TikTok/Reels
          defaultProps={{ ...project, isShort: true }}
        />
      ))}
    </>
  );
};
