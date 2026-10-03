import React, { useEffect, useRef, useState } from 'react';
import { Flame, Layers } from 'lucide-react';

type StateMode = 'solid' | 'liquid' | 'gas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
}

interface ParticleVisualizerProps {
  isDark?: boolean;
}

export const ParticleVisualizer: React.FC<ParticleVisualizerProps> = ({ isDark = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stateMode, setStateMode] = useState<StateMode>('solid');
  const [isHeated, setIsHeated] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    const particles: Particle[] = [];

    if (stateMode === 'solid') {
      const solidRadius = 9;
      const diameter = solidRadius * 2; // 18px - touching with zero gaps
      const rows = 5;
      const cols = 10;
      const startX = (width - cols * diameter) / 2 + solidRadius;
      const startY = height - 16 - rows * diameter + solidRadius;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * diameter;
          const by = startY + r * diameter;
          particles.push({
            x: bx,
            y: by,
            baseX: bx,
            baseY: by,
            vx: 0,
            vy: 0,
            radius: solidRadius
          });
        }
      }
    } else if (stateMode === 'liquid') {
      const radius = 8;
      const count = 38;
      for (let i = 0; i < count; i++) {
        const x = 30 + Math.random() * (width - 60);
        const y = height - 100 + Math.random() * 85;
        const speed = isHeated ? 1.5 : 0.8;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius
        });
      }
    } else {
      // Gas
      const radius = 6.5;
      const count = 18;
      for (let i = 0; i < count; i++) {
        const x = 20 + Math.random() * (width - 40);
        const y = 20 + Math.random() * (height - 40);
        const speed = isHeated ? 4.5 : 2.5;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          radius
        });
      }
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Draw container boundary
      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(15, 20);
      ctx.lineTo(15, height - 12);
      ctx.lineTo(width - 15, height - 12);
      ctx.lineTo(width - 15, 20);
      ctx.stroke();

      if (stateMode === 'solid') {
        const amp = isHeated ? 1.0 : 0.4;
        particles.forEach((p, idx) => {
          const angle = tick * 0.25 + idx * 1.3;
          p.x = p.baseX + Math.cos(angle) * amp;
          p.y = p.baseY + Math.sin(angle) * amp;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#38bdf8' : '#2563eb';
          ctx.fill();
          ctx.strokeStyle = isDark ? '#0284c7' : '#1d4ed8';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      } else if (stateMode === 'liquid') {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 25) { p.x = 25; p.vx *= -1; }
          if (p.x > width - 25) { p.x = width - 25; p.vx *= -1; }
          if (p.y < height - 105) { p.y = height - 105; p.vy *= -1; }
          if (p.y > height - 20) { p.y = height - 20; p.vy *= -1; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#06b6d4' : '#0284c7';
          ctx.fill();
          ctx.strokeStyle = isDark ? '#0891b2' : '#0369a1';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      } else {
        // Gas
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 25) { p.x = 25; p.vx *= -1; }
          if (p.x > width - 25) { p.x = width - 25; p.vx *= -1; }
          if (p.y < 25) { p.y = 25; p.vy *= -1; }
          if (p.y > height - 20) { p.y = height - 20; p.vy *= -1; }

          ctx.strokeStyle = isDark ? '#f43f5e' : '#fda4af';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#fb7185' : '#e11d48';
          ctx.fill();
          ctx.strokeStyle = isDark ? '#e11d48' : '#be123c';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stateMode, isHeated, isDark]);

  return (
    <div
      className={`rounded-3xl p-5 border transition-all ${
        isDark ? 'glass-panel-dark' : 'glass-panel'
      }`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
          <h4 className="font-black text-sm">محاكي النموذج الجُسيمي</h4>
        </div>
        <span
          className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          حالات المادة
        </span>
      </div>

      {/* State Switcher Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => setStateMode('solid')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            stateMode === 'solid'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          الحالة الصلبة
        </button>
        <button
          onClick={() => setStateMode('liquid')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            stateMode === 'liquid'
              ? 'bg-cyan-600 text-white shadow-xs'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-cyan-100'
          }`}
        >
          الحالة السائلة
        </button>
        <button
          onClick={() => setStateMode('gas')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            stateMode === 'gas'
              ? 'bg-rose-600 text-white shadow-xs'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-rose-100'
          }`}
        >
          الحالة الغازية
        </button>
      </div>

      <div
        className={`relative rounded-2xl overflow-hidden flex justify-center py-2 border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={160}
          className={`rounded-xl shadow-inner max-w-full ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}
        />
      </div>

      {/* State description */}
      <div
        className={`mt-3 p-3 rounded-2xl border text-xs space-y-1 ${
          isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        {stateMode === 'solid' && (
          <>
            <p className="font-bold text-blue-500">خصائص الحالة الصلبة:</p>
            <p>• الجُسيمات متراصة ومنتظمة في مواقع محددة.</p>
            <p>• تهتز في مواضعها ولا تتدفق، وقوى التجاذب بينها قوية جداً.</p>
            <p>• لها شكل ثابت وحجم ثابت، وغير قابلة للانضغاط.</p>
          </>
        )}
        {stateMode === 'liquid' && (
          <>
            <p className="font-bold text-cyan-500">خصائص الحالة السائلة:</p>
            <p>• الجُسيمات متقاربة ومتلامسة لكن ليس لها ترتيب ثابت.</p>
            <p>• تنزلق وتتحرك ببطء بعضها فوق بعض مما يسمح لها بالتدفق.</p>
            <p>• ليس لها شكل ثابت (تأخذ شكل الوعاء)، ولها حجم ثابت، وغير قابلة للانضغاط.</p>
          </>
        )}
        {stateMode === 'gas' && (
          <>
            <p className="font-bold text-rose-500">خصائص الحالة الغازية:</p>
            <p>• الجُسيمات متباعدة جداً وبينهما فراغات كبيرة.</p>
            <p>• تتحرك بحرية وسرعة كبيرة في جميع الاتجاهات وتتصادم.</p>
            <p>• ليس لها شكل ثابت ولا حجم ثابت (تنتشر لتملأ الوعاء)، وقابلة للانضغاط بسهولة.</p>
          </>
        )}
      </div>

      {/* Temperature Toggle */}
      <div
        className={`mt-3 flex items-center justify-between p-2.5 rounded-2xl border ${
          isDark
            ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>تأثير التسخين (زيادة طاقة الحركة):</span>
        </span>
        <button
          onClick={() => setIsHeated(!isHeated)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isHeated
              ? 'bg-amber-600 text-white shadow-xs'
              : isDark
              ? 'bg-amber-900/60 text-amber-200 hover:bg-amber-900'
              : 'bg-amber-200 text-amber-950 hover:bg-amber-300'
          }`}
        >
          {isHeated ? 'إلغاء التسخين' : 'تسخين 🔥'}
        </button>
      </div>
    </div>
  );
};
