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
    [0, 15],
    [30, 0],
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
  const delay = startFrame + index * 8;

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80 },
  });

  const translateX = interpolate(
    frame - delay,
    [0, 20],
    [-50, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}`,
        }}
      />
      <span style={{ fontSize: 32, fontWeight: 500 }}>{feature}</span>
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
  const delay = startFrame + index * 5;

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
        borderRadius: 8,
        padding: "12px 24px",
        fontSize: 24,
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

  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
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
        opacity: outroOpacity,
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "150%",
          height: "150%",
          transform: `translate(-50%, -50%) rotate(${gradientRotation}deg)`,
          background: `conic-gradient(from 0deg, transparent, ${accentColor}20, transparent, ${accentColor}10, transparent)`,
          opacity: 0.5,
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? "10%" : "20%",
          right: isVertical ? "50%" : "10%",
          transform: isVertical ? "translateX(50%)" : "none",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          padding: isVertical ? 60 : 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: isVertical ? "flex-start" : "center",
          height: "100%",
          paddingTop: isVertical ? 120 : 100,
        }}
      >
        {/* Title Section - 0-60 frames */}
        <Sequence from={0} durationInFrames={isShort ? 90 : 120}>
          <div>
            <AnimatedText
              text={title}
              delay={0}
              style={{
                fontSize: isVertical ? 80 : 120,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                background: `linear-gradient(135deg, white, ${accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 20,
              }}
            />
            <AnimatedText
              text={tagline}
              delay={15}
              style={{
                fontSize: isVertical ? 36 : 48,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            />
          </div>
        </Sequence>

        {/* Description - 60-150 frames */}
        <Sequence from={isShort ? 60 : 90} durationInFrames={isShort ? 90 : 120}>
          <AnimatedText
            text={description}
            delay={0}
            style={{
              fontSize: isVertical ? 32 : 40,
              lineHeight: 1.5,
              maxWidth: isVertical ? "100%" : "70%",
              color: "rgba(255, 255, 255, 0.85)",
              marginTop: 60,
            }}
          />
        </Sequence>

        {/* Features - 150-300 frames */}
        <Sequence from={isShort ? 120 : 180} durationInFrames={isShort ? 90 : 150}>
          <div style={{ marginTop: 60 }}>
            {features.map((feature, index) => (
              <FeatureItem
                key={feature}
                feature={feature}
                index={index}
                startFrame={0}
                accentColor={accentColor}
              />
            ))}
          </div>
        </Sequence>

        {/* Tech Stack - 300-400 frames */}
        <Sequence from={isShort ? 180 : 300} durationInFrames={isShort ? 60 : 120}>
          <div style={{ marginTop: 60 }}>
            <AnimatedText
              text="Built with"
              delay={0}
              style={{
                fontSize: 24,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: 20,
              }}
            />
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {tech.map((t, index) => (
                <TechBadge key={t} tech={t} index={index} startFrame={15} />
              ))}
            </div>
          </div>
        </Sequence>

        {/* CTA / URL - 400-450 frames */}
        <Sequence from={isShort ? 220 : 380} durationInFrames={70}>
          <div style={{ marginTop: 60 }}>
            <AnimatedText
              text={website || github || ""}
              delay={0}
              style={{
                fontSize: isVertical ? 28 : 36,
                fontWeight: 600,
                color: accentColor,
              }}
            />
          </div>
        </Sequence>

        {/* TR.dev branding */}
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? 60 : 40,
            right: isVertical ? 60 : 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.6,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700 }}>TR</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: accentColor }}>.</span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>dev</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
