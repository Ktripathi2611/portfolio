"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Section from "@/components/layout/Section";
import ContentContainer from "@/components/layout/ContentContainer";
import PageTransition from "@/components/layout/PageTransition";

// Dynamic imports for performance
const HeroSection = dynamic(() => import("@/components/hero/HeroSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <PageTransition>
      {/* Hero Section - full viewport, no extra padding needed */}
      <HeroSection />

      {/* Intro Section */}
      <Section size="md">
        <ContentContainer size="md">
          <div className="stack stack-lg text-center">
            <h2 className="text-heading font-display gradient-text">
              Building the Future, One Line at a Time
            </h2>
            <p className="text-body text-muted" style={{ maxWidth: '45ch', marginInline: 'auto' }}>
              I&apos;m a passionate developer who loves creating efficient, scalable,
              and user-friendly applications. With expertise in Python and modern
              web technologies, I bring ideas to life through clean code.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 'var(--space-md)' }}>
              <Link href="/about" className="btn-secondary">
                Learn more about me →
              </Link>
              <Link href="/projects" className="btn-primary">
                View my projects →
              </Link>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Quick Stats */}
      <Section size="sm">
        <ContentContainer>
          <div className="grid-auto">
            {[
              { value: "3+", label: "Years Experience" },
              { value: "15+", label: "Projects Completed" },
              { value: "10+", label: "Technologies" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card text-center"
              >
                <div className="text-display font-display gradient-text">
                  {stat.value}
                </div>
                <div className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ContentContainer>
      </Section>
    </PageTransition>
  );
}
