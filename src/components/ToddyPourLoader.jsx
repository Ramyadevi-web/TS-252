import React, { useEffect, useRef, useState } from 'react';
import '/src/ToddyPourLoader.css';

const ToddyPourLoader = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window for high-DPI crispness
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId;
    let progress = 0; // 0 to 100
    let waveAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // --- 1. DRAW STREAM (Realistic curved white toddy stream) ---
      if (progress < 100) {
        ctx.save();
        ctx.beginPath();
        // Pouring curve from bottle tip to glass opening
        const startX = centerX - 120;
        const startY = centerY - 40;
        const endX = centerX - 15;
        const endY = centerY + 30;

        ctx.moveTo(startX, startY);
        // Quadratic curve to simulate natural gravity arc of liquid
        ctx.quadraticCurveTo(centerX - 60, centerY - 10, endX, endY);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 4 + Math.sin(waveAngle * 2) * 0.5; // Slight organic thickness fluctuation
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. DRAW GLASS & RISING LIQUID ---
      const glassX = centerX - 40;
      const glassY = centerY + 30;
      const glassWidth = 50;
      const glassHeight = 100;

      // Max fill height calculations
      const currentFillHeight = (progress / 100) * glassHeight;
      const liquidTopY = glassY + glassHeight - currentFillHeight;

      ctx.save();
      // Clip drawing strictly inside the glass shape
      ctx.beginPath();
      ctx.rect(glassX, glassY, glassWidth, glassHeight);
      ctx.clip();

      // Milk-white Toddy Liquid Body
      const gradient = ctx.createLinearGradient(glassX, liquidTopY, glassX + glassWidth, glassY + glassHeight);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(1, 'rgba(220, 220, 210, 0.9)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(glassX, liquidTopY, glassWidth, currentFillHeight + 10);

      // Organic Wave Surface on top of the liquid inside the glass
      if (progress > 0 && progress < 100) {
        ctx.beginPath();
        ctx.moveTo(glassX, liquidTopY);
        for (let x = 0; x <= glassWidth; x += 5) {
          const waveY = liquidTopY + Math.sin(x * 0.15 + waveAngle) * 3;
          ctx.lineTo(glassX + x, waveY);
        }
        ctx.lineTo(glassX + glassWidth, glassY + glassHeight);
        ctx.lineTo(glassX, glassY + glassHeight);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }
      ctx.restore();

      // --- 3. GLASS OUTLINE & HIGHLIGHTS ---
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(glassX, glassY, glassWidth, glassHeight);
      ctx.restore();

      // --- 4. INCREMENT PROGRESS ---
      if (progress < 100) {
        progress += 0.6; // Adjust speed: lower = slower pour, higher = faster pour
        waveAngle += 0.15;
        animationFrameId = requestAnimationFrame(render);
      } else {
        // --- 5. AUTOMATICALLY OPEN HOME PAGE UPON COMPLETION ---
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete(); // Triggers transition to Home Page
        }, 800); // Matches CSS fade duration
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <div className={`toddy-loader-wrapper ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="brand-title">
        <h1>TS252</h1>
        <div className="red-line"></div>
      </div>
      <canvas ref={canvasRef} className="pouring-canvas" />
      <div className="loading-hint">Pouring Secret Toddy...</div>
    </div>
  );
};

export default ToddyPourLoader;