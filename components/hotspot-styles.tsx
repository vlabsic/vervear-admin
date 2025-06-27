"use client"

export default function HotspotStyles() {
  return (
    <style jsx global>{`
      .hotspot {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: none;
        background-color: #ff5e1a;
        box-sizing: border-box;
        pointer-events: all;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        transform: translate3d(-50%, -50%, 0);
        transition: all 0.3s ease;
        position: relative;
      }

      .hotspot-visible {
        animation: pulse 2s infinite;
      }

      .hotspot-hidden {
        opacity: 0.7;
      }

      .hotspot-edit-mode {
        cursor: grab;
      }

      .hotspot-edit-mode:active {
        cursor: grabbing;
      }

      @keyframes pulse {
        0% {
          transform: translate3d(-50%, -50%, 0) scale(1);
          box-shadow: 0 0 0 0 rgba(255, 94, 26, 0.7);
        }
        
        70% {
          transform: translate3d(-50%, -50%, 0) scale(1.1);
          box-shadow: 0 0 0 10px rgba(255, 94, 26, 0);
        }
        
        100% {
          transform: translate3d(-50%, -50%, 0) scale(1);
          box-shadow: 0 0 0 0 rgba(255, 94, 26, 0);
        }
      }

      .hotspot:hover {
        background-color: #e54e09;
        transform: translate3d(-50%, -50%, 0) scale(1.2);
      }

      .hotspot-dot {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .hotspot-label {
        position: absolute;
        width: max-content;
        background-color: #ffffff;
        border-radius: 4px;
        padding: 4px 8px;
        color: #000000;
        font-size: 12px;
        font-weight: 500;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .hotspot:hover .hotspot-label {
        opacity: 1;
      }

      .hotspot-content-visible {
        display: block;
        position: absolute;
        transform: translate(calc(-50% + 10px), -30px);
        z-index: 999;
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate(calc(-50% + 10px), -20px);
        }
        to {
          opacity: 1;
          transform: translate(calc(-50% + 10px), -30px);
        }
      }

      model-viewer::part(default-progress-bar) {
        height: 4px;
        background-color: #ff5e1a;
      }
    `}</style>
  )
}
