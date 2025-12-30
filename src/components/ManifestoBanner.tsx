"use client";

export default function ManifestoBanner() {
  return (
    <div className="manifesto-banner">
      <div className="manifesto-content">
        <span className="phrase phrase-3">
          <span className="highlight">Human again</span>.
        </span>
        <span className="separator" aria-hidden="true" />
        <span className="phrase phrase-3">Then more than human.</span>
      </div>

      <style jsx>{`
        .manifesto-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 36px;
          background: #1a1918;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          overflow: hidden;
        }

        /* Subtle left-edge ember glow */
        .manifesto-banner::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(
            90deg,
            rgba(199, 91, 57, 0.15) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Subtle right-edge ember glow for balance */
        .manifesto-banner::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(
            270deg,
            rgba(199, 91, 57, 0.08) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .manifesto-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0 16px;
        }

        .phrase {
          font-family: "Söhne", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Helvetica, Arial, sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .phrase-1 {
          color: rgba(250, 248, 245, 0.6);
        }

        .phrase-2 {
          color: rgba(250, 248, 245, 0.7);
        }

        .phrase-3 {
          color: rgba(250, 248, 245, 0.95);
        }

        .separator {
          width: 3px;
          height: 3px;
          background: rgba(199, 91, 57, 0.5);
          border-radius: 50%;
          margin: 0 14px;
          flex-shrink: 0;
        }

        .highlight {
          color: #c9705a;
          position: relative;
        }

        /* Subtle underline glow on highlighted words */
        .highlight::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(199, 91, 57, 0.4) 50%,
            transparent 100%
          );
        }

        /* Tablet */
        @media (max-width: 768px) {
          .manifesto-banner {
            height: 34px;
          }

          .phrase {
            font-size: 11px;
            letter-spacing: 0.03em;
          }

          .separator {
            width: 2px;
            height: 2px;
            margin: 0 10px;
          }
        }

        /* Mobile - stack vertically */
        @media (max-width: 540px) {
          .manifesto-banner {
            height: auto;
            padding: 10px 16px;
          }

          .manifesto-content {
            flex-direction: column;
            gap: 2px;
          }

          .separator {
            display: none;
          }

          .phrase {
            font-size: 11px;
            letter-spacing: 0.02em;
          }

          .phrase-1,
          .phrase-2 {
            color: rgba(250, 248, 245, 0.55);
          }

          .phrase-3 {
            color: rgba(250, 248, 245, 0.9);
            margin-top: 2px;
          }
        }
      `}</style>
    </div>
  );
}
