import { ReactNode } from "react";
import screenImage from "@/assets/evento-qr-web.png";

type IphoneMockup3DProps = {
  className?: string;
  children?: ReactNode;
  showIsland?: boolean;
};

const IphoneMockup3D = ({ className, children, showIsland = true }: IphoneMockup3DProps) => {
  return (
    <div className={["iphone-mockup-perspective", className].filter(Boolean).join(" ")}>
      <div className="iphone-mockup-float">
        <div className="iphone-mockup-body">
          <div className="iphone-mockup-bezel">
            <div className="iphone-mockup-screen">
              {children ?? <img src={screenImage} alt="Revelao en iPhone" className="iphone-mockup-image" />}
            </div>
            {showIsland ? <div className="iphone-mockup-island" /> : null}
          </div>
        </div>
        <div className="iphone-mockup-shadow" />
      </div>
      <style>{`
        .iphone-mockup-perspective {
          perspective: 1200px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .iphone-mockup-float {
          position: relative;
          transform-style: preserve-3d;
          animation: iphone-tilt 6s ease-in-out infinite;
          transition: transform 0.4s ease;
          width: 100%;
          height: 700px;
        }

        .iphone-mockup-perspective:hover .iphone-mockup-float {
          transform: scale(1.03);
        }

        .iphone-mockup-body {
          width: 100%;
          max-width: 380px;
          aspect-ratio: 9 / 19.5;
          transform-style: preserve-3d;
        }

        .iphone-mockup-perspective.h-full .iphone-mockup-body {
          height: 100%;
          width: auto;
          max-width: none;
        }

        .iphone-mockup-bezel {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 42px;
          padding: 12px;
          background: linear-gradient(145deg, #1a1a1d, #0c0c0e);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
        }

        .iphone-mockup-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
          background: #111;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.08);
        }

        .iphone-mockup-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .iphone-mockup-island {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 34%;
          height: 18px;
          border-radius: 999px;
          background: #0a0a0a;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .iphone-mockup-island::before {
          content: "";
          position: absolute;
          right: 5px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #0f0f10;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .iphone-mockup-island::after {
          content: "";
          position: absolute;
          left: 8px;
          top: 6px;
          width: 40%;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          opacity: 0.25;
        }

        .iphone-mockup-shadow {
          position: absolute;
          left: 50%;
          bottom: -28px;
          width: 70%;
          height: 18px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.35), rgba(0,0,0,0));
          filter: blur(6px);
        }

        @keyframes iphone-tilt {
          0% { transform: rotateY(-6deg) rotateX(2deg) translateY(0); }
          50% { transform: rotateY(6deg) rotateX(-2deg) translateY(-8px); }
          100% { transform: rotateY(-6deg) rotateX(2deg) translateY(0); }
        }

        @media (max-width: 768px) {
          .iphone-mockup-body {
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default IphoneMockup3D;
