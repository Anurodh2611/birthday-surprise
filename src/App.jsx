import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ==========================================
// ⚙️ SURPRISE CONFIGURATION
// Customize these values for your friend!
// ==========================================
const friendName = "EKTA";
const friendPhoto = "ekta.jpeg";
const birthdayMessage =
  "Happy Birthday! I hope this year brings you amazing memories, lots of happiness, and everything you've been wishing for. I wish the best for you, keep going and take care of yourself. Thank you for everything. Stay amazing and keep being you. ❤️";
const birthdaySong = "/happy-birthday.mp3";

// ==========================================
// 🎵 WEB AUDIO SYNTHESIZER (For interactive sound effects)
// ==========================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) { }
  }

  playTick(pitchMult = 1) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 * pitchMult, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600 * pitchMult, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) { }
  }

  playFanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) { }
  }
}

const sfx = new SoundEffects();

const FLOATING_ITEMS = [
  { icon: '✨', size: '24px', left: '10%', top: '15%', delay: '0s', duration: '6s' },
  { icon: '🎈', size: '32px', left: '80%', top: '20%', delay: '1s', duration: '8s' },
  { icon: '🎁', size: '28px', left: '15%', top: '75%', delay: '2s', duration: '7s' },
  { icon: '⭐', size: '20px', left: '85%', top: '70%', delay: '0.5s', duration: '9s' },
  { icon: '🌸', size: '26px', left: '50%', top: '85%', delay: '1.5s', duration: '7.5s' },
  { icon: '🎉', size: '24px', left: '75%', top: '45%', delay: '2.5s', duration: '6.5s' },
  { icon: '💫', size: '22px', left: '20%', top: '40%', delay: '3s', duration: '8.5s' },
];

export default function App() {
  // Stage state: 1 -> 2 -> 3 -> 4 -> 5 (countdown) -> 6 (reveal) -> 7 (photo + message)
  const [stage, setStage] = useState(1);
  const [countdown, setCountdown] = useState(5);
  const [isExploding, setIsExploding] = useState(false);
  const [interactiveHearts, setInteractiveHearts] = useState([]);

  // Birthday Song Audio State & Ref
  const audioRef = useRef(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [audioAutoplayBlocked, setAudioAutoplayBlocked] = useState(false);

  // Helper to trigger song playback safely
  const playBirthdaySong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlayingSong(true);
          setAudioAutoplayBlocked(false);
        })
        .catch((err) => {
          console.log("Audio autoplay blocked by browser policy:", err);
          setIsPlayingSong(false);
          setAudioAutoplayBlocked(true);
        });
    }
  };

  // Toggle play/pause for song
  const toggleSong = (e) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    sfx.playClick();
    if (isPlayingSong) {
      audioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlayingSong(true);
          setAudioAutoplayBlocked(false);
        })
        .catch((err) => {
          console.log("Play failed:", err);
        });
    }
  };

  // Trigger confetti bursts
  const triggerConfettiBurst = () => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#3B82F6', '#FF5D5D', '#F59E0B', '#10B981', '#EC4899']
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#3B82F6', '#FF5D5D', '#F59E0B', '#10B981', '#EC4899']
    });
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C']
    });
  };

  const nextStage = () => {
    sfx.playClick();
    if (stage === 4) {
      setStage(5);
      setCountdown(5);
    } else {
      setStage(prev => prev + 1);
    }
  };

  // Handle countdown effect in stage 5
  useEffect(() => {
    if (stage === 5) {
      sfx.playTick(1 + (5 - countdown) * 0.15);
      if (countdown > 1) {
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 900);
        return () => clearTimeout(timer);
      } else if (countdown === 1) {
        const timer = setTimeout(() => {
          // Explosion transition into birthday reveal!
          setIsExploding(true);
          sfx.playFanfare();
          triggerConfettiBurst();

          setTimeout(() => {
            setIsExploding(false);
            setStage(6); // Reveal screen!
            // Play song exact moment birthday reveal starts
            playBirthdaySong();
          }, 300);
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [stage, countdown]);

  // Stage 6 automatically transitions to Stage 7 for photo/message card
  useEffect(() => {
    if (stage === 6) {
      const timer = setTimeout(() => {
        setStage(7);
        triggerConfettiBurst();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Handle tapping screen on final stage to throw floating hearts/sparkles
  const handleTapScreen = (e) => {
    if (stage >= 6) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newHeart = {
        id: Date.now() + Math.random(),
        x,
        y,
        emoji: ['💖', '🎉', '✨', '🎈', '⭐'][Math.floor(Math.random() * 5)]
      };
      setInteractiveHearts(prev => [...prev.slice(-10), newHeart]);
      sfx.playClick();
    }
  };

  const stopSurprise = (e) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingSong(false);
    setAudioAutoplayBlocked(false);
    setStage(8);
  };

  const restartSurprise = () => {
    sfx.playClick();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingSong(false);
    setAudioAutoplayBlocked(false);
    setStage(1);
    setCountdown(5);
  };

  return (
    <div className="surprise-app" onClick={handleTapScreen}>
      {/* HTML5 Audio Element for Birthday Song */}
      <audio
        ref={audioRef}
        src={birthdaySong}
        loop
        preload="auto"
        onPlay={() => setIsPlayingSong(true)}
        onPause={() => setIsPlayingSong(false)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          user-select: none;
          -webkit-user-select: none;
        }

        .surprise-app {
          min-height: 100dvh;
          width: 100%;
          background: #FAF7F2;
          background-image: 
            radial-gradient(at 10% 20%, rgba(255, 107, 107, 0.12) 0px, transparent 50%),
            radial-gradient(at 90% 80%, rgba(37, 99, 235, 0.12) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(245, 158, 11, 0.08) 0px, transparent 60%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1E2022;
        }

        .floating-bg-item {
          position: absolute;
          pointer-events: none;
          opacity: 0.55;
          animation: floatAnimation infinite ease-in-out alternate;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
        }

        @keyframes floatAnimation {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(-25px) rotate(12deg) scale(1.1);
          }
        }

        .content-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 32px;
          padding: 36px 28px;
          box-shadow: 
            0 20px 40px -15px rgba(30, 32, 34, 0.07),
            0 0 0 1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .title-main {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(2.2rem, 8vw, 3rem);
          line-height: 1.15;
          margin: 0 0 14px 0;
          letter-spacing: -0.02em;
          color: #1E2022;
        }

        .subtitle-text {
          font-size: clamp(1.05rem, 4.2vw, 1.2rem);
          font-weight: 500;
          color: #5A6065;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF5D5D 0%, #FF8E53 100%);
          color: #FFFFFF;
          border: none;
          outline: none;
          padding: 18px 36px;
          font-size: 1.15rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          border-radius: 99px;
          cursor: pointer;
          box-shadow: 0 12px 28px -6px rgba(255, 93, 93, 0.45);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 320px;
          position: relative;
          overflow: hidden;
          animation: pulseButton 2.5s infinite ease-in-out;
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 16px 36px -6px rgba(255, 93, 93, 0.55);
        }

        .btn-primary:active {
          transform: translateY(1px) scale(0.96);
          box-shadow: 0 6px 16px -4px rgba(255, 93, 93, 0.4);
        }

        .btn-blue {
          background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
          box-shadow: 0 12px 28px -6px rgba(37, 99, 235, 0.45);
        }
        .btn-blue:hover {
          box-shadow: 0 16px 36px -6px rgba(37, 99, 235, 0.55);
        }

        .btn-gold {
          background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
          color: #1E2022;
          box-shadow: 0 12px 28px -6px rgba(245, 158, 11, 0.45);
        }

        @keyframes pulseButton {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .countdown-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .countdown-number {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(6.5rem, 28vw, 9.5rem);
          color: #2563EB;
          text-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
          line-height: 1;
          margin: 0;
          animation: popCount 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;
        }

        @keyframes popCount {
          0% {
            transform: scale(0.6) rotate(-4deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.9;
          }
        }

        .explosion-flash {
          position: fixed;
          inset: 0;
          background: #FFFFFF;
          z-index: 999;
          animation: flashOut 0.3s ease-out forwards;
        }

        @keyframes flashOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }

        .reveal-header {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 7.5vw, 2.8rem);
          font-weight: 900;
          background: linear-gradient(135deg, #FF5D5D 0%, #2563EB 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          animation: bouncyEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .friend-name-display {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.4rem, 9vw, 3.5rem);
          font-weight: 900;
          color: #1E2022;
          margin: 0 0 12px 0;
          letter-spacing: -0.03em;
          text-transform: capitalize;
          animation: bouncyEntrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bouncyEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          70% {
            transform: translateY(-8px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .photo-card-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin: 20px 0 24px 0;
          transform: rotate(-3deg);
          animation: photoSpring 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes photoSpring {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-12deg) translateY(40px);
          }
          70% {
            transform: scale(1.04) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-2deg) translateY(0);
          }
        }

        .photo-img {
          width: 100%;
          aspect-ratio: 6 / 7;
          object-fit: cover;
          border-radius: 24px;
          border: 4px solid #FFFFFF;
          box-shadow: 
            0 16px 36px -10px rgba(30, 32, 34, 0.18),
            0 0 0 1px rgba(0,0,0,0.06);
          background-color: #E2E8F0;
          display: block;
        }

        .photo-badge {
          position: absolute;
          bottom: -12px;
          right: -10px;
          background: #FFFFFF;
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 6px;
          animation: floatBadge 3s ease-in-out infinite alternate;
        }

        @keyframes floatBadge {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }

        .message-box {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 20px;
          padding: 20px;
          margin-top: 10px;
          text-align: left;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .message-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          margin: 0 0 8px 0;
          color: #1E2022;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .message-body {
          font-size: 1rem;
          line-height: 1.6;
          color: #4A5568;
          margin: 0;
          white-space: pre-line;
        }

        /* Music Floating Control Button */
        .music-control-btn {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 99px;
          padding: 8px 16px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          color: #1E2022;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }

        .music-control-btn:active {
          transform: scale(0.95);
        }

        .autoplay-banner {
          background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 99px;
          padding: 12px 24px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          margin-bottom: 16px;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
          animation: pulseButton 2s infinite ease-in-out;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .tap-heart {
          position: absolute;
          pointer-events: none;
          font-size: 1.8rem;
          z-index: 100;
          animation: floatUpFade 1.2s ease-out forwards;
        }

        @keyframes floatUpFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            transform: translate(-50%, -100px) scale(1.3) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -160px) scale(1) rotate(-15deg);
          }
        }
      `}</style>

      {/* Floating Animated Background Items */}
      {FLOATING_ITEMS.map((item, idx) => (
        <div
          key={idx}
          className="floating-bg-item"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Flash effect on countdown finish */}
      {isExploding && <div className="explosion-flash" />}

      {/* Tap interactive hearts */}
      {interactiveHearts.map(h => (
        <div
          key={h.id}
          className="tap-heart"
          style={{ left: h.x, top: h.y }}
        >
          {h.emoji}
        </div>
      ))}

      {/* MAIN EXPERIENCE CONTENT */}
      <div className="content-container">

        {/* SCREEN 1 — SECRET INTRO */}
        {stage === 1 && (
          <div className="card-box">
            <h1 className="title-main">Hey... 👀</h1>
            <p className="subtitle-text">I made something for you.</p>
            <button className="btn-primary" onClick={nextStage}>
              Let's see →
            </button>
          </div>
        )}

        {/* SCREEN 2 — FIRST INTERACTION */}
        {stage === 2 && (
          <div className="card-box">
            <h1 className="title-main">Wait... before we continue...</h1>
            <p className="subtitle-text">I need you to do something first.</p>
            <button className="btn-primary btn-blue" onClick={nextStage}>
              I'm ready ✨
            </button>
          </div>
        )}

        {/* SCREEN 3 — SECOND INTERACTION */}
        {stage === 3 && (
          <div className="card-box">
            <h1 className="title-main">Okay, one more thing...</h1>
            <p className="subtitle-text">Are you REALLY ready for this?</p>
            <button className="btn-primary btn-gold" onClick={nextStage}>
              YESSS →
            </button>
          </div>
        )}

        {/* SCREEN 4 — BUILD-UP */}
        {stage === 4 && (
          <div className="card-box">
            <h1 className="title-main">Alright...</h1>
            <p className="subtitle-text">This is your last chance 👀</p>
            <button className="btn-primary" onClick={nextStage}>
              REVEAL MY SURPRISE 🎁
            </button>
          </div>
        )}

        {/* SCREEN 5 — COUNTDOWN */}
        {stage === 5 && (
          <div className="countdown-wrapper">
            <div className="countdown-number" key={countdown}>
              {countdown}
            </div>
            <p style={{ marginTop: '20px', color: '#5A6065', fontWeight: 600, fontSize: '1.1rem' }}>
              Hold tight... ✨
            </p>
          </div>
        )}

        {/* SCREEN 6 & 7 — BIRTHDAY REVEAL + PHOTO & MESSAGE */}
        {(stage === 6 || stage === 7) && (
          <div className="card-box">

            {/* Music Autoplay Fallback Banner if blocked */}
            {audioAutoplayBlocked && (
              <button className="autoplay-banner" onClick={toggleSong}>
                🎵 Tap to play the birthday song
              </button>
            )}

            {/* Elegant Music Control Button */}
            {!audioAutoplayBlocked && (
              <button className="music-control-btn" onClick={toggleSong}>
                <span>{isPlayingSong ? "🔊" : "🔇"}</span>
                <span>{isPlayingSong ? "Song Playing" : "Song Paused"}</span>
              </button>
            )}

            <div className="reveal-header">🎉 HAPPY BIRTHDAY! 🎂</div>
            <div className="friend-name-display">{friendName}</div>
            <p style={{ color: '#5A6065', fontWeight: 600, margin: '0 0 10px 0' }}>
              Today is officially your day ✨
            </p>

            {/* Photo display with spring animation */}
            <div className="photo-card-wrapper">
              <img
                src={friendPhoto}
                alt={friendName}
                className="photo-img"
              />
              <div className="photo-badge">
                <span>⭐</span> Birthday Star
              </div>
            </div>

            {/* Personal Message Card */}
            <div className="message-box">
              <div className="message-title">
                A little message for you 💌
              </div>
              <p className="message-body">
                {birthdayMessage}
              </p>
            </div>

            {/* Interactive action buttons */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '24px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '14px 18px', fontSize: '0.95rem', background: '#EF4444', color: '#FFFFFF', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)' }}
                onClick={stopSurprise}
              >
                End Surprise 🛑
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '14px 18px', fontSize: '0.95rem', background: '#E2E8F0', color: '#1E2022', boxShadow: 'none' }}
                onClick={(e) => {
                  e.stopPropagation();
                  restartSurprise();
                }}
              >
                Replay 🔄
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 8 — FINAL END SCREEN */}
        {stage === 8 && (
          <div className="card-box">
            <h1 className="title-main">Surprise Completed! ❤️</h1>
            <p className="subtitle-text">
              Hope this brought a big smile to your face today. Have the most wonderful year ahead! ✨
            </p>
            <button className="btn-primary" onClick={restartSurprise}>
              Play Again 🔄
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
