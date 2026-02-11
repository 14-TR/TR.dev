import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

export interface ProjectVideoProps {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tech: string[];
  accentColor: string;
  github?: string;
  website?: string;
  isShort?: boolean;
}

// Animated text reveal
const AnimatedText: React.FC<{
  text: string;
  delay: number;
  style?: React.CSSProperties;
}> = ({ text, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 },
  });

  const translateY = interpolate(
    frame - delay,
    [0, 20],
    [40, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Feature item with staggered animation
const FeatureItem: React.FC<{
  feature: string;
  index: number;
  startFrame: number;
  accentColor: string;
}> = ({ feature, index, startFrame, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * 12;

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80 },
  });

  const translateX = interpolate(
    frame - delay,
    [0, 25],
    [-60, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: accentColor,
          boxShadow: `0 0 25px ${accentColor}`,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 36, fontWeight: 500 }}>{feature}</span>
    </div>
  );
};

// Tech badge
const TechBadge: React.FC<{
  tech: string;
  index: number;
  startFrame: number;
}> = ({ tech, index, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * 8;

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 50, stiffness: 200 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 10,
        padding: "14px 28px",
        fontSize: 28,
        fontWeight: 500,
      }}
    >
      {tech}
    </div>
  );
};

export const ProjectVideo: React.FC<ProjectVideoProps> = ({
  title,
  tagline,
  description,
  features,
  tech,
  accentColor,
  github,
  website,
  isShort,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Fade in at start
  const introOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  
  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 45, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  const isVertical = height > width;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "white",
        opacity: introOpacity * outroOpacity,
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200%",
          height: "200%",
          transform: `translate(-50%, -50%) rotate(${gradientRotation}deg)`,
          background: `conic-gradient(from 0deg, transparent, ${accentColor}15, transparent, ${accentColor}08, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Accent glow - centered */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Content - CENTERED */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isVertical ? 60 : 120,
          textAlign: "center",
        }}
      >
        {/* Scene 1: Title (frames 0-120) */}
        <Sequence from={0} durationInFrames={120}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatedText
              text={title}
              delay={0}
              style={{
                fontSize: isVertical ? 90 : 140,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                background: `linear-gradient(135deg, white 30%, ${accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 30,
              }}
            />
            <AnimatedText
              text={tagline}
              delay={20}
              style={{
                fontSize: isVertical ? 40 : 52,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "80%",
              }}
            />
          </div>
        </Sequence>

        {/* Scene 2: Description (frames 120-270) */}
        <Sequence from={120} durationInFrames={150}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatedText
              text={description}
              delay={0}
              style={{
                fontSize: isVertical ? 36 : 44,
                lineHeight: 1.6,
                maxWidth: isVertical ? "90%" : "75%",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            />
          </div>
        </Sequence>

        {/* Scene 3: Features (frames 270-450) */}
        <Sequence from={270} durationInFrames={180}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: 800 }}>
            <AnimatedText
              text="Key Features"
              delay={0}
              style={{
                fontSize: 28,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: accentColor,
                marginBottom: 40,
                alignSelf: "center",
              }}
            />
            {features.map((feature, index) => (
              <FeatureItem
                key={feature}
                feature={feature}
                index={index}
                startFrame={20}
                accentColor={accentColor}
              />
            ))}
          </div>
        </Sequence>

        {/* Scene 4: Tech Stack (frames 450-570) */}
        <Sequence from={450} durationInFrames={120}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatedText
              text="Built With"
              delay={0}
              style={{
                fontSize: 28,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: 40,
              }}
            />
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {tech.map((t, index) => (
                <TechBadge key={t} tech={t} index={index} startFrame={20} />
              ))}
            </div>
          </div>
        </Sequence>

        {/* Scene 5: CTA / URL (frames 570-630) */}
        <Sequence from={570} durationInFrames={60}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatedText
              text={website || github || ""}
              delay={0}
              style={{
                fontSize: isVertical ? 32 : 42,
                fontWeight: 600,
                color: accentColor,
              }}
            />
          </div>
        </Sequence>
      </div>

      {/* TR.dev branding - bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: 0.5,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700 }}>TR</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: accentColor }}>.</span>
        <span style={{ fontSize: 28, fontWeight: 700 }}>dev</span>
      </div>
    </AbsoluteFill>
  );
};
