// Level4Gacha.jsx
// 第 4 關（最終關）：扭蛋機動畫，上半 NPC / 下半扭蛋

import { useState, useRef } from 'react'
import GameLayout from './GameLayout'
import Scene from './Scene'
import NPC from './NPC'

// ── 修改這裡換獎品內容 ──────────────────────────────
const PRIZE = {
  title: '恭喜獲得稱號！',
  badgeText: '🎊 四週年快樂 🎊',   // ← NPC 頭上的稱號橫幅文字
  message: '🎊 慶祝四週年快樂 🎊',
  footer: '我愛你 ❤️',
}
// ────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FFD700','#C8843A','#D4A853','#E8A840','#FF9F43','#B07000','#F8B4D9']

function spawnConfetti(el) {
  if (!el) return
  el.innerHTML = ''
  for (let i = 0; i < 44; i++) {
    const div = document.createElement('div')
    const size  = 6 + (i % 5) * 2
    const dur   = 1.4 + (i % 7) * 0.18
    const delay = (i % 11) * 0.07
    div.style.cssText = `
      position:absolute;top:-12px;
      width:${size}px;height:${size + (i % 3) * 2}px;
      left:${(i * 2.3) % 100}%;
      background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
      border-radius:${i % 3 === 0 ? '50%' : '2px'};
      animation:confetti-fall ${dur}s ${delay}s linear forwards;
    `
    el.appendChild(div)
  }
}

// ── 扭蛋球體 SVG（正圓，上奶白下金色） ──
function GachaBallSVG({ openTop, openBot }) {
  return (
    <svg
      viewBox="-32 -32 64 64"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', width: '100%', height: '100%' }}
    >
      {/* 下半（金色） */}
      <path
        d="M -30 0 A 30 30 0 0 0 30 0 Z"
        fill="#D4A853"
        stroke="#3A1F00"
        strokeWidth="2.2"
        style={openBot ? { animation: 'gachaponBottomOpen 0.55s ease forwards' } : undefined}
      />
      {/* 上半（奶白） */}
      <g
        style={{
          transformOrigin: '50% 100%',
          ...(openTop ? { animation: 'gachaponTopOpen 0.55s cubic-bezier(0.2,0,0.4,1) forwards' } : {}),
        }}
      >
        <path d="M -30 0 A 30 30 0 0 1 30 0 Z" fill="#FFF8E6" stroke="#3A1F00" strokeWidth="2.2"/>
        <circle cx="10" cy="-11" r="7" fill="white" fillOpacity="0.65"/>
        <path d="M 8 -20 Q 18 -14 20 -7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      </g>
      {/* 整圓輪廓 */}
      <circle r="30" fill="none" stroke="#3A1F00" strokeWidth="2.2"/>
      {/* 分隔線 */}
      <path d="M -30 0 H 30" stroke="#3A1F00" strokeWidth="2"/>
      {/* 條紋 */}
      <path d="M -24 10 Q 0 13 24 10" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.35"/>
      <path d="M -16 20 Q 0 22 16 20" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.25"/>
    </svg>
  )
}

const KEYFRAMES = `
  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(3deg)} }
  @keyframes float-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-5px) rotate(-4deg)} }
  @keyframes float-c { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-9px) rotate(2deg)} }
  @keyframes float-d { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(-3deg)} }
  @keyframes machineControlShake {
    0%{transform:translate(0,0)} 20%{transform:translate(2px,1px)}
    40%{transform:translate(-1px,0)} 60%{transform:translate(2px,1px)}
    80%{transform:translate(-1px,0)} 100%{transform:translate(0,0)}
  }
  @keyframes machineControlRotate {
    0%{transform:rotate(0deg)} 50%{transform:rotate(180deg)} 100%{transform:rotate(360deg)}
  }
  @keyframes gachaponGroupJump {
    0%{transform:translate(0,0)} 20%{transform:translate(-2px,3px)}
    40%{transform:translate(0,-1px)} 60%{transform:translate(2px,1px)}
    80%{transform:translate(-1px,-2px)} 100%{transform:translate(0,0)}
  }
  @keyframes gachaponDown {
    0%{top:59%} 40%{top:84%} 70%{top:78%} 100%{top:81%}
  }
  @keyframes capWait {
    0%,100%{transform:scale(1)} 50%{transform:scale(1.06)}
  }
  @keyframes gachaponCenter {
    0%{width:22%;top:81%;left:39%} 100%{width:52%;top:22%;left:24%}
  }
  @keyframes gachaponTopOpen {
    0%  {transform:translate(0,0) rotate(0deg);opacity:1}
    100%{transform:translate(-8px,-34px) rotate(-30deg);opacity:0}
  }
  @keyframes gachaponBottomOpen {
    0%  {transform:translateY(0);opacity:1}
    100%{transform:translateY(24px);opacity:0}
  }
  @keyframes confetti-fall {
    0%{transform:translateY(-10px) rotate(0deg);opacity:1}
    85%{opacity:1}
    100%{transform:translateY(110vh) rotate(360deg);opacity:0}
  }
  @keyframes card-pop {
    0%{transform:scale(0) rotate(-6deg);opacity:0}
    65%{transform:scale(1.06) rotate(1deg);opacity:1}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes emoji-in {
    0%{transform:scale(0)} 70%{transform:scale(1.25)} 100%{transform:scale(1)}
  }
  @keyframes btn-pulse-center {
    0%,100%{transform:scale(1)} 50%{transform:scale(1.05)}
  }
`

// ── 主元件 ──
export default function Level4Gacha({ onComplete }) {
  // idle → shaking → dropping → waiting → flying → opening → revealed
  const [phase, setPhase] = useState('idle')
  const [npcState, setNpcState] = useState('idle')
  const confettiRef = useRef(null)

  const handleStart = () => {
    if (phase !== 'idle') return
    setPhase('shaking')
    setTimeout(() => {
      setPhase('dropping')
      setTimeout(() => setPhase('waiting'), 750)
    }, 650)
  }

  const handleBallClick = () => {
    if (phase !== 'waiting') return
    setPhase('flying')
    setTimeout(() => {
      setPhase('opening')
      setTimeout(() => {
        setPhase('revealed')
        setNpcState('spin')
        spawnConfetti(confettiRef.current)
      }, 420)
    }, 580)
  }

  // 依 phase 計算扭蛋球樣式（% 相對於 aspect-ratio 機台容器）
  const getBallStyle = () => {
    const base = { position: 'absolute', aspectRatio: '1', zIndex: 15 }
    switch (phase) {
      case 'dropping':
        return { ...base, width: '22%', top: '59%', left: '39%', cursor: 'default',
          animation: 'gachaponDown 0.7s cubic-bezier(0.22,1,0.36,1) forwards' }
      case 'waiting':
        return { ...base, width: '22%', top: '81%', left: '39%', cursor: 'pointer',
          animation: 'capWait 1.2s ease-in-out infinite' }
      case 'flying':
        return { ...base, width: '22%', top: '81%', left: '39%', cursor: 'default',
          animation: 'gachaponCenter 0.55s cubic-bezier(0.34,1.2,0.64,1) forwards' }
      case 'opening':
        return { ...base, width: '52%', top: '22%', left: '24%', cursor: 'default' }
      default:
        return { ...base, display: 'none' }
    }
  }

  const showBall = ['dropping','waiting','flying','opening'].includes(phase)

  // ── 場景（上半）──
  const sceneEl = (
    <Scene>
      <NPC
        state={npcState}
        showTitle={phase === 'revealed'}
        titleText={PRIZE.badgeText}
      />
    </Scene>
  )

  // ── 對話區（下半）：楓之谷面板 + 扭蛋機 ──
  const dialogEl = (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)',
      borderTop: '3px solid #B8925A',
      boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.9)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Noto Sans TC', sans-serif",
    }}>
      <style>{KEYFRAMES}</style>

      {/* 標題列 */}
      <div style={{
        position: 'absolute', top: 8, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '0 16px',
        zIndex: 5,
      }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', color: '#7A4E1A' }}>STAGE 4 — 最終扭蛋</span>
        <span style={{ fontSize: 11, color: '#8B6010' }}>✨ 通關紀念</span>
      </div>

      {/* 機台容器：以 aspectRatio 讓 % 定位對齊 SVG 座標 */}
      <div style={{
        position: 'relative',
        height: 'calc(100% - 72px)',
        aspectRatio: '360 / 600',
        flexShrink: 0,
        marginTop: 28,
      }}>
        {/* 扭蛋機 SVG */}
        <svg
          viewBox="0 0 360 600"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%', height: '100%', display: 'block',
            animation: phase === 'shaking' ? 'machineControlShake 0.8s ease' : undefined,
          }}
        >
          <defs>
            <clipPath id="domeClip"><circle cx="180" cy="225" r="168"/></clipPath>
            {/* 金色球 */}
            <g id="bm">
              <circle r="28" fill="#D4A853" stroke="#3A1F00" strokeWidth="2"/>
              <path d="M -28 0 A 28 28 0 0 1 28 0 Z" fill="white" fillOpacity="0.82"/>
              <path d="M -28 0 H 28" stroke="#3A1F00" strokeWidth="1.5"/>
              <path d="M -22 9 Q 0 12 22 9" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.35"/>
              <path d="M -14 17 Q 0 19 14 17" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.25"/>
              <circle cx="10" cy="-10" r="6" fill="white" fillOpacity="0.65"/>
              <path d="M 8 -18 Q 16 -13 18 -6" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6"/>
            </g>
            {/* 琥珀球 */}
            <g id="bl">
              <circle r="28" fill="#E8A840" stroke="#3A1F00" strokeWidth="2"/>
              <path d="M -28 0 A 28 28 0 0 1 28 0 Z" fill="white" fillOpacity="0.82"/>
              <path d="M -28 0 H 28" stroke="#3A1F00" strokeWidth="1.5"/>
              <path d="M -22 9 Q 0 12 22 9" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.35"/>
              <path d="M -14 17 Q 0 19 14 17" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.25"/>
              <circle cx="10" cy="-10" r="6" fill="white" fillOpacity="0.65"/>
              <path d="M 8 -18 Q 16 -13 18 -6" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6"/>
            </g>
            {/* 奶白球 */}
            <g id="bw">
              <circle r="28" fill="#FFF8E6" stroke="#3A1F00" strokeWidth="2"/>
              <path d="M -28 0 A 28 28 0 0 1 28 0 Z" fill="white" fillOpacity="0.92"/>
              <path d="M -28 0 H 28" stroke="#3A1F00" strokeWidth="1.5"/>
              <path d="M -22 9 Q 0 12 22 9" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.3"/>
              <path d="M -14 17 Q 0 19 14 17" stroke="#3A1F00" strokeWidth="0.9" fill="none" opacity="0.2"/>
              <circle cx="10" cy="-10" r="6" fill="white" fillOpacity="0.5"/>
              <path d="M 8 -18 Q 16 -13 18 -6" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5"/>
            </g>
          </defs>

          {/* 頂部小球 */}
          <circle cx="180" cy="38" r="20" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>
          <circle cx="180" cy="38" r="20" fill="white" fillOpacity="0.18"/>
          <ellipse cx="174" cy="32" rx="7" ry="4" fill="white" fillOpacity="0.5" transform="rotate(-15 174 32)"/>

          {/* 頸部領圈 */}
          <path d="M135 52 Q135 68 145 72 H215 Q225 68 225 52 Z" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>

          {/* 玻璃球槽背景 */}
          <circle cx="180" cy="225" r="168" fill="#FFF3D0" stroke="#3A1F00" strokeWidth="4"/>

          {/* 球球群 */}
          <g
            clipPath="url(#domeClip)"
            style={{ animation: phase === 'shaking' ? 'gachaponGroupJump 0.8s ease' : undefined }}
          >
            <g style={{ animation: 'float-c 2.1s 0s ease-in-out infinite' }}><use href="#bw"  transform="translate(120,108) rotate(-15)"/></g>
            <g style={{ animation: 'float-a 1.9s .3s ease-in-out infinite' }}><use href="#bm"  transform="translate(180,95)  rotate(10)"/></g>
            <g style={{ animation: 'float-b 2.3s .7s ease-in-out infinite' }}><use href="#bw"  transform="translate(242,108) rotate(20)"/></g>
            <g style={{ animation: 'float-d 1.8s .1s ease-in-out infinite' }}><use href="#bl"  transform="translate(80,158)  rotate(-30)"/></g>
            <g style={{ animation: 'float-a 2.0s .5s ease-in-out infinite' }}><use href="#bw"  transform="translate(148,150) rotate(15)"/></g>
            <g style={{ animation: 'float-c 2.4s .2s ease-in-out infinite' }}><use href="#bm"  transform="translate(215,148) rotate(-8)"/></g>
            <g style={{ animation: 'float-b 1.7s .8s ease-in-out infinite' }}><use href="#bl"  transform="translate(278,155) rotate(28)"/></g>
            <g style={{ animation: 'float-a 2.2s .4s ease-in-out infinite' }}><use href="#bm"  transform="translate(60,210)  rotate(20)"/></g>
            <g style={{ animation: 'float-d 1.9s .9s ease-in-out infinite' }}><use href="#bw"  transform="translate(128,200) rotate(-15)"/></g>
            <g style={{ animation: 'float-b 2.1s .0s ease-in-out infinite' }}><use href="#bl"  transform="translate(195,205) rotate(32)"/></g>
            <g style={{ animation: 'float-c 1.8s .6s ease-in-out infinite' }}><use href="#bm"  transform="translate(260,200) rotate(-22)"/></g>
            <g style={{ animation: 'float-a 2.3s .3s ease-in-out infinite' }}><use href="#bw"  transform="translate(315,210) rotate(12)"/></g>
            <g style={{ animation: 'float-b 2.0s .7s ease-in-out infinite' }}><use href="#bl"  transform="translate(75,260)  rotate(-28)"/></g>
            <g style={{ animation: 'float-c 1.7s .2s ease-in-out infinite' }}><use href="#bw"  transform="translate(143,255) rotate(22)"/></g>
            <g style={{ animation: 'float-d 2.2s .5s ease-in-out infinite' }}><use href="#bm"  transform="translate(210,257) rotate(-10)"/></g>
            <g style={{ animation: 'float-a 1.9s .8s ease-in-out infinite' }}><use href="#bl"  transform="translate(278,258) rotate(26)"/></g>
            <g style={{ animation: 'float-b 2.4s .1s ease-in-out infinite' }}><use href="#bw"  transform="translate(330,262) rotate(-16)"/></g>
            <g style={{ animation: 'float-c 2.0s .4s ease-in-out infinite' }}><use href="#bm"  transform="translate(90,312)  rotate(14)"/></g>
            <g style={{ animation: 'float-a 1.8s .9s ease-in-out infinite' }}><use href="#bw"  transform="translate(158,308) rotate(-22)"/></g>
            <g style={{ animation: 'float-d 2.3s .3s ease-in-out infinite' }}><use href="#bl"  transform="translate(225,310) rotate(30)"/></g>
            <g style={{ animation: 'float-b 2.1s .6s ease-in-out infinite' }}><use href="#bm"  transform="translate(293,312) rotate(-8)"/></g>
            <g style={{ animation: 'float-a 1.9s .2s ease-in-out infinite' }}><use href="#bw"  transform="translate(120,360) rotate(18)"/></g>
            <g style={{ animation: 'float-c 2.2s .7s ease-in-out infinite' }}><use href="#bl"  transform="translate(190,365) rotate(-14)"/></g>
            <g style={{ animation: 'float-d 1.7s .4s ease-in-out infinite' }}><use href="#bm"  transform="translate(258,360) rotate(26)"/></g>
          </g>

          {/* 玻璃反光 */}
          <circle cx="180" cy="225" r="168" fill="white" fillOpacity="0.10"/>
          <ellipse cx="155" cy="145" rx="52" ry="30" fill="white" fillOpacity="0.5" transform="rotate(-20 155 145)"/>
          <ellipse cx="142" cy="160" rx="22" ry="13" fill="white" fillOpacity="0.3" transform="rotate(-20 142 160)"/>
          <circle cx="180" cy="225" r="168" fill="none" stroke="#3A1F00" strokeWidth="4"/>

          {/* 金色赤道環 */}
          <ellipse cx="180" cy="393" rx="168" ry="22" fill="#D4A853" stroke="#3A1F00" strokeWidth="3"/>
          <ellipse cx="180" cy="393" rx="168" ry="22" fill="white" fillOpacity="0.2"/>

          {/* 橫槓 */}
          <rect x="24" y="387" width="312" height="30" rx="14" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>

          {/* 機身 */}
          <rect x="44" y="415" width="272" height="105" rx="10" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>

          {/* 楓棕轉盤面板 */}
          <rect x="68" y="428" width="148" height="80" rx="8" fill="#9A7540" stroke="#3A1F00" strokeWidth="3"/>
          <rect x="80" y="440" width="124" height="56" rx="5" fill="#9A7540" stroke="#3A1F00" strokeWidth="2.5"/>

          {/* 把手（轉動動畫） */}
          <g style={{
            transformOrigin: '142px 468px',
            animation: phase === 'shaking' ? 'machineControlRotate 0.8s ease forwards' : undefined,
          }}>
            <path d="M 88 488 L 196 440" stroke="#3A1F00" strokeWidth="3.5" strokeLinecap="round"/>
            <ellipse cx="165" cy="452" rx="14" ry="14" fill="#9A7540" stroke="#3A1F00" strokeWidth="2.5"/>
          </g>
          <circle cx="82"  cy="434" r="5" fill="#3A1F00"/>
          <circle cx="204" cy="434" r="5" fill="#3A1F00"/>
          <circle cx="82"  cy="492" r="5" fill="#3A1F00"/>
          <circle cx="204" cy="492" r="5" fill="#3A1F00"/>

          {/* 出口拱門 */}
          <path d="M 134 520 Q 134 490 165 490 Q 196 490 196 520 Z" fill="#3A1F00"/>
          <rect x="126" y="518" width="108" height="8" rx="3" fill="#3A1F00"/>

          {/* 梯形基座 */}
          <path d="M 30 520 H 330 L 316 545 H 44 Z" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>
          <path d="M 14 545 H 346 L 336 570 H 24 Z" fill="#C8843A" stroke="#3A1F00" strokeWidth="3"/>
        </svg>

        {/* ── 浮動扭蛋（掉落 → 等待 → 飛到中央 → 打開） ── */}
        {showBall && (
          <div
            onClick={phase === 'waiting' ? handleBallClick : undefined}
            style={getBallStyle()}
          >
            <GachaBallSVG
              openTop={phase === 'opening'}
              openBot={phase === 'opening'}
            />
          </div>
        )}
      </div>

      {/* ── 開始按鈕（機台正下方） ── */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute', bottom: 14, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 10,
          animation: 'btn-pulse-center 1s ease-in-out infinite',
        }}>
          <button
            onClick={handleStart}
            style={{
              background: 'rgba(255,248,230,0.95)', color: '#3A1F00',
              border: '2px solid #9A7540', borderRadius: 10, padding: '8px 20px',
              fontSize: 14, fontWeight: 'bold', cursor: 'pointer',
              fontFamily: "'Noto Sans TC', sans-serif",
              boxShadow: '2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)',
              whiteSpace: 'nowrap',
            }}
          >
            開始扭蛋
          </button>
        </div>
      )}

      {/* ── 彩紙層（fixed 全螢幕） ── */}
      <div
        ref={confettiRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 30 }}
      />

      {/* ── 獎品區（下半部，不蓋滿全螢幕） ── */}
      {phase === 'revealed' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)',
          borderTop: '3px solid #B8925A',
        }}>
          <div style={{
            textAlign: 'center',
            width: '85%',
            animation: 'card-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            fontFamily: "'Noto Sans TC', sans-serif",
            padding: '0 8px',
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#B07000', marginBottom: 8 }}>
              {PRIZE.title}
            </div>
            <div style={{ fontSize: 17, color: '#5C3A00', lineHeight: 1.7, marginBottom: 12, whiteSpace: 'pre-line' }}>
              {PRIZE.message}
            </div>
            <div style={{ fontSize: 16, color: '#8B6010' }}>
              {PRIZE.footer}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return <GameLayout scene={sceneEl} dialog={dialogEl} sceneHeight={phase === 'revealed' ? '70%' : '50%'} />
}
