import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * A single-page, scrollable love letter site.
 *
 * Note on implementation: the reveal/scroll animations below are built with
 * native CSS transitions + IntersectionObserver rather than Framer Motion,
 * since Framer Motion isn't available in this preview environment. The look
 * and pacing are the same — soft fade, blur, and gentle upward motion. If
 * you're dropping this into your own React/Next.js project where you run
 * `npm install framer-motion`, the Reveal component below is a clean 1:1
 * swap for <motion.div initial/whileInView/viewport>.
 *
 * Fonts load via Google Fonts @import — no extra setup needed.
 */

// ---------- design tokens ----------
const COLOR = {
  ivory: "#FBF4ED",
  blush: "#F3D6CF",
  mauve: "#C99A98",
  champagne: "#D7B47C",
  ink: "#463338",
  rose: "#9C5B53",
  eyebrow: "#A87E72",
};

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Jost', sans-serif";
const SCRIPT = "'Mrs Saint Delafield', cursive";

// ---------- reveal-on-scroll primitives ----------
function useReveal(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, className = "", delay = 0, threshold }) {
  const [ref, inView] = useReveal(threshold);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "1100ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(26px)",
        filter: inView ? "blur(0px)" : "blur(6px)",
      }}
    >
      {children}
    </div>
  );
}

function UnderlineDraw() {
  const [ref, inView] = useReveal(0.6);
  return (
    <span
      ref={ref}
      style={{
        display: "block",
        marginTop: "1.1rem",
        height: "1px",
        background: COLOR.champagne,
        width: inView ? "110px" : "0px",
        transition: "width 1300ms cubic-bezier(0.22, 1, 0.36, 1) 250ms",
      }}
    />
  );
}

// ---------- ambient floating light motes (signature motif) ----------
function Particles({ count = 16 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        duration: 16 + Math.random() * 14,
        delay: Math.random() * 12,
        peak: 0.18 + Math.random() * 0.22,
      })),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="lls-mote"
          style={{
            left: `${p.left}%`,
            bottom: "-6%",
            width: p.size,
            height: p.size,
            "--peak": p.peak,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ---------- sections ----------
function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 38%, rgba(244,201,160,0.40) 0%, rgba(251,244,237,0) 65%)",
        }}
      />
      <p
        style={{
          fontFamily: SANS,
          fontSize: "11px",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: COLOR.eyebrow,
          marginBottom: "1.5rem",
        }}
      >
        a little something
      </p>
      <h1
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          color: COLOR.ink,
          fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
          lineHeight: 1.1,
        }}
      >
        just for you
      </h1>
      <div
        style={{
          marginTop: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          opacity: 0.7,
        }}
      >
        <span
          style={{
            height: "40px",
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${COLOR.mauve})`,
          }}
        />
        <span
          style={{
            fontFamily: SANS,
            fontSize: "10px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: COLOR.eyebrow,
          }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}

const REVEALS = [
  "Hey bae \u{1F44B}",
  "I was thinking today about ideas, ambition, and all the ways I could build something meaningful from the things I already carry in my heart and mind\u2026 and then it came to me. \u{1F4A1}",
  "Why not begin with the one thing I\u2019ve always felt most deeply and understood most clearly?",
  "My love for you.",
  "So, like any true entrepreneur, the first thing I did was build a website to share and showcase that passion. The concept is simple, the intention is sincere, and the audience is wonderfully exclusive.",
  "So simple, in fact, that it can be said in the form of a love letter.",
];

function RevealSequence() {
  return (
    <section className="relative px-6">
      {REVEALS.map((line, i) => (
        <div
          key={i}
          className="flex items-center justify-center"
          style={{ minHeight: "78vh" }}
        >
          <Reveal>
            {i === 3 ? (
              <div className="flex flex-col items-center">
                <p
                  className="text-center"
                  style={{
                    fontFamily: SCRIPT,
                    color: COLOR.rose,
                    fontSize: "clamp(3rem, 9vw, 5rem)",
                    lineHeight: 1,
                  }}
                >
                  {line}
                </p>
                <UnderlineDraw />
              </div>
            ) : (
              <p
                className="mx-auto text-center"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  color: COLOR.ink,
                  fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)",
                  lineHeight: 1.4,
                  maxWidth: "42rem",
                }}
              >
                {line}
              </p>
            )}
          </Reveal>
        </div>
      ))}
    </section>
  );
}

const LETTER_PARAGRAPHS = [
  "Since the beginning, I knew you were different. There was something about you that my soul seemed to recognize before my mind could even make sense of it. I can\u2019t fully explain the feeling, only that I was drawn to you in a way that felt gentle, natural, and deeply certain.",
  "It was as if some quiet part of me already knew that with you, I would be in good hands. That with you, my heart would find softness. That with you, parts of my soul I didn\u2019t even realize were tired would begin to heal.",
  "The more I came to know you, the more that feeling only grew. You never felt temporary. You felt important. Safe. Rare. Like the kind of person who changes not just someone\u2019s days, but the way they experience love altogether.",
  "You have a way of bringing peace into my life that words can barely hold. You make things feel lighter, warmer, more meaningful. And in loving you, I\u2019ve realized that sometimes the greatest blessing is simply finding someone whose presence feels like both comfort and wonder at the same time.",
  "That is what you have been to me. Comfort and wonder. Peace and beauty. A love that feels restorative. A person who makes my heart feel seen, held, and understood.",
];

function Ornament({ flip }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        marginTop: flip ? "3rem" : 0,
      }}
    >
      <span style={{ height: "1px", width: "48px", background: COLOR.champagne, opacity: 0.6 }} />
      <span
        style={{
          height: "6px",
          width: "6px",
          transform: "rotate(45deg)",
          background: COLOR.champagne,
        }}
      />
      <span style={{ height: "1px", width: "48px", background: COLOR.champagne, opacity: 0.6 }} />
    </div>
  );
}

function LoveLetterSection() {
  return (
    <section className="relative px-6" style={{ paddingTop: "8rem", paddingBottom: "9rem" }}>
      <Reveal className="mx-auto" >
        <div
          className="mx-auto"
          style={{
            maxWidth: "42rem",
            position: "relative",
            borderRadius: "2px",
            border: "1px solid rgba(215,180,124,0.4)",
            background: "rgba(255,252,248,0.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 30px 60px -25px rgba(70,51,56,0.25)",
            padding: "3.5rem 1.75rem",
          }}
        >
          <Ornament />
          <div
            style={{
              marginTop: "2.5rem",
              fontFamily: SERIF,
              fontSize: "1.2rem",
              lineHeight: 1.85,
              color: COLOR.ink,
              display: "flex",
              flexDirection: "column",
              gap: "1.4rem",
            }}
          >
            {LETTER_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p style={{ paddingTop: "0.5rem" }}>
              So if this is my love letter to you, let it begin with the truth I felt from the start:
              <br />
              my soul knew there was something special about you before I ever knew how to say it.
              <br />
              And every day since has only proven it right.
            </p>
          </div>
          <Ornament flip />
        </div>
      </Reveal>
    </section>
  );
}

function ClosingSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "65vh", paddingBottom: "8rem" }}
    >
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: COLOR.ink,
            fontSize: "clamp(1.5rem, 3.4vw, 2.1rem)",
          }}
        >
          Every love letter ends somewhere.
        </p>
        <p
          style={{
            fontFamily: SCRIPT,
            color: COLOR.rose,
            fontSize: "clamp(2.2rem, 5vw, 3rem)",
            marginTop: "0.25rem",
          }}
        >
          Ours never really does.
        </p>
      </Reveal>
    </section>
  );
}

// ---------- root ----------
export default function LoveLetterSite() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{ backgroundColor: COLOR.ivory, color: COLOR.ink, minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&family=Mrs+Saint+Delafield&display=swap');

        ::selection { background: ${COLOR.blush}; }

        @keyframes lls-float-up {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          12%  { opacity: var(--peak, 0.25); }
          50%  { transform: translateY(-50vh) translateX(8px); }
          88%  { opacity: var(--peak, 0.25); }
          100% { transform: translateY(-105vh) translateX(-8px); opacity: 0; }
        }
        .lls-mote {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(215,180,124,0.95) 0%, rgba(243,214,207,0.45) 60%, transparent 80%);
          filter: blur(1px);
          animation-name: lls-float-up;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .lls-mote { animation: none !important; opacity: 0.15 !important; }
          * { transition-duration: 1ms !important; }
        }
      `}</style>

      <Particles />

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(243,214,207,0.45) 0%, rgba(251,244,237,0) 60%)",
        }}
      />

      <main className="relative" style={{ zIndex: 10 }}>
        <HeroSection />
        <RevealSequence />
        <LoveLetterSection />
        <ClosingSection />
      </main>
    </div>
  );
}
