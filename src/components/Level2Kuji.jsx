// Level2Kuji.jsx — 仿 gachago 風格一番賞（兩次抽獎版）

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from './GameLayout'
import Scene from './Scene'
import NPC from './NPC'

// ── 獎項資料 ──
const PRIZES = [
  { id: 'SP', rank: '特別賞', name: '恭喜！你抽到了', name2: '全世界最可愛的另一半🤗', emoji: '',
    img: '/一番賞圖片/肉肉.png',
    sealColor: '#f0a875', ticketStripe: '#f59e0b', ticketDark: '#78350f' },
  { id: 'A', rank: 'A 賞', name: '瞬移石', name2: '冒險旅費補助', name3: '下次旅遊我全包', emoji: '',
    img: '/一番賞圖片/瞬移石.png',
    imgStyle: { objectFit: 'contain', transform: 'scale(1.3) translateX(-1px)', transformOrigin: 'center' },
    sealColor: '#f4a0b5', ticketStripe: '#ec4899', ticketDark: '#831843' },
  { id: 'B', rank: 'B 賞', name: '護身符', name2: '體力恢復券', name3: '高級按摩全額補助', emoji: '',
    img: '/一番賞圖片/護身符.png',
    sealColor: '#a5b4fc', ticketStripe: '#6366f1', ticketDark: '#3730a3' },
  { id: 'C', rank: 'C 賞', name: '神秘背包', name2: '購物車清空特權', name3: '（最多五家店家😂）', emoji: '',
    img: '/一番賞圖片/神秘背包.png',
    sealColor: '#6ee7b7', ticketStripe: '#10b981', ticketDark: '#065f46' },
]

// 堆疊卡片資料（固定，避免重繪）
const PILE_DATA = [
  { color:'#f9c5d1', rotate:-22, x:-80, y:18 },
  { color:'#fde68a', rotate: 15, x:-45, y:-15 },
  { color:'#c4b5fd', rotate:-8,  x: 0,  y:8  },
  { color:'#a5f3fc', rotate: 30, x: 55, y:-10 },
  { color:'#fbcfe8', rotate:-35, x: 85, y: 22 },
  { color:'#bbf7d0', rotate: 5,  x:-90, y:-5  },
  { color:'#fcd34d', rotate:-18, x: 30, y:-25 },
  { color:'#f9a8d4', rotate: 25, x:-25, y: 30 },
  { color:'#93c5fd', rotate:-5,  x: 70, y: 5  },
  { color:'#d9f99d', rotate: 42, x:-60, y:-20 },
  { color:'#fca5a5', rotate:-28, x: 20, y: 15 },
  { color:'#e9d5ff', rotate: 12, x:-10, y:-30 },
]

function generateScatter() {
  return PILE_DATA.map(() => ({
    x: (Math.random() - 0.5) * 260,
    y: (Math.random() - 0.5) * 160,
    rotate: (Math.random() - 0.5) * 140,
  }))
}

// ── 卡通風卡片 ──
function Card({ color, pileX, pileY, pileRotate, scatterX, scatterY, scatterRotate, phase, onClick, idx }) {
  const [hovered, setHovered] = useState(false)

  const anim =
    phase === 'shaking'
      ? {
          x: [pileX, pileX+(idx%2===0?14:-14), pileX+(idx%2===0?-10:10), pileX+5, pileX],
          y: [pileY, pileY-10, pileY+8, pileY-4, pileY],
          rotate: [pileRotate, pileRotate+18, pileRotate-14, pileRotate+7, pileRotate],
          transition: { duration: 0.6, delay: idx * 0.025 },
        }
      : phase === 'scattered'
      ? {
          x: scatterX, y: scatterY, rotate: scatterRotate,
          transition: { type: 'spring', stiffness: 160, damping: 12, delay: idx * 0.04 },
        }
      : {
          x: pileX, y: pileY, rotate: pileRotate,
          transition: { type: 'spring', stiffness: 220, damping: 20, delay: idx * 0.02 },
        }

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: 96, height: 64,
        left: 'calc(50% - 48px)',
        top: 'calc(50% - 32px)',
        zIndex: hovered ? 50 : idx,
      }}
      animate={anim}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 1.18 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(color)}
    >
      <div className="w-full h-full rounded-2xl relative overflow-hidden"
        style={{
          background: color,
          border: hovered ? '3px solid #ef4444' : '2.5px solid rgba(0,0,0,0.18)',
          boxShadow: hovered
            ? '0 0 0 2px #ef4444, 3px 4px 0 rgba(0,0,0,0.18)'
            : '3px 4px 0 rgba(0,0,0,0.18)',
        }}>
        <div className="absolute top-1.5 left-2 w-7 h-1.5 rounded-full bg-white/50" />
        <div className="absolute top-3.5 left-2 w-4 h-1 rounded-full bg-white/35" />
        <div className="absolute bottom-2 left-3 right-3 flex flex-col gap-1">
          {[1,2,3].map(n => (
            <div key={n} className="h-1 rounded-full"
              style={{ background:'rgba(0,0,0,0.12)', width: n===2?'65%':'100%' }} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── 卡片堆組件 ──
function CardPile({ onDraw, subtitle }) {
  const [phase, setPhase] = useState('pile')
  const [scatterData, setScatterData] = useState(() => generateScatter())

  function shake() {
    if (phase === 'scattered') {
      setPhase('pile')
    } else {
      setScatterData(generateScatter())
      setPhase('shaking')
      setTimeout(() => setPhase('scattered'), 650)
    }
  }

  return (
    <div className="flex flex-col h-full"
      style={{ background:'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)', borderTop:'3px solid #B8925A', boxShadow:'inset 0 3px 0 rgba(255,255,255,0.9)' }}>
      <div className="pt-3 text-center text-xs tracking-widest"
        style={{ fontFamily:"'Noto Sans TC', sans-serif", color:'#7A4E1A' }}>
        STAGE 2 — 一番賞
      </div>
      {subtitle && (
        <div className="text-center text-xs font-bold mt-0.5"
          style={{ color:'#B07000', fontFamily:"'Noto Sans TC', sans-serif" }}>
          {subtitle}
        </div>
      )}
      <p className="text-center text-sm mt-1" style={{ color:'#8B6010', fontFamily:"'Noto Sans TC', sans-serif" }}>
        {phase === 'scattered' ? '點任一張牌抽獎！' : '搖一搖，再點任一張抽獎！'}
      </p>

      <div className="flex-1 relative min-h-0 overflow-hidden">
        {PILE_DATA.map((c, i) => (
          <Card
            key={i}
            color={c.color}
            pileX={c.x} pileY={c.y} pileRotate={c.rotate}
            scatterX={scatterData[i].x} scatterY={scatterData[i].y} scatterRotate={scatterData[i].rotate}
            phase={phase}
            idx={i}
            onClick={onDraw}
          />
        ))}
      </div>

      <div className="flex gap-3 justify-center pb-4 pt-1">
        <motion.button
          onClick={shake}
          whileTap={{ scale:0.9 }}
          className="pixel-btn font-bold px-5 py-2 rounded-lg text-sm"
          style={{ background:'rgba(255,248,230,0.95)', color:'#3A1F00',
            border:'2px solid #9A7540',
            boxShadow:'2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)',
            fontFamily:"'Noto Sans TC', sans-serif" }}>
          {phase === 'scattered' ? '🃏 收回' : '🫙 搖一搖'}
        </motion.button>
        <motion.button
          onClick={() => onDraw(PILE_DATA[Math.floor(Math.random() * PILE_DATA.length)].color)}
          whileTap={{ scale:0.9 }}
          className="pixel-btn font-bold px-5 py-2 rounded-lg text-sm"
          style={{ background:'rgba(255,248,230,0.95)', color:'#3A1F00',
            border:'2px solid #9A7540',
            boxShadow:'2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)',
            fontFamily:"'Noto Sans TC', sans-serif" }}>
          🎟️ 抽獎
        </motion.button>
      </div>
    </div>
  )
}

// ── 點擊開封票券 ──
function RevealTicket({ prize, onComplete, nextLabel }) {
  const W = 280, H = 130
  const [opening, setOpening] = useState(false)
  const [revealed, setRevealed] = useState(false)

  function handleClick() {
    if (opening || revealed) return
    setOpening(true)
    setTimeout(() => setRevealed(true), 420)
  }

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale:0.55, opacity:0 }}
      animate={{ scale:1, opacity:1 }}
      transition={{ type:'spring', stiffness:200, damping:16 }}
    >
      {!revealed && (
        <p className="text-sm mb-3" style={{ color:'#8B6010', fontFamily:"'Noto Sans TC', sans-serif" }}>
          👇 點擊票券開封！
        </p>
      )}

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ width:W, height:H,
          boxShadow:'4px 6px 0 rgba(0,0,0,0.18)',
          cursor: revealed ? 'default' : 'pointer' }}
        onClick={handleClick}
      >
        {/* ── 底層：揭露後的票券 ── */}
        <div className="absolute inset-0 flex items-center px-5 gap-4"
          style={{ background:`linear-gradient(135deg, #ffffff 0%, ${prize.sealColor} 100%)`,
            border:`3px solid rgba(0,0,0,0.1)`, borderRadius:16 }}>

          {/* 賞別徽章：A/B/C 顯示道具圖，特別賞顯示文字 */}
          <div className="flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden"
            style={{ width:62, height:62,
              background: prize.sealColor,
              border:'3px solid rgba(255,255,255,0.85)',
              boxShadow:`0 0 0 3px ${prize.sealColor}88, 2px 3px 0 rgba(0,0,0,0.12)` }}>
            {prize.img ? (
              <img src={prize.img} alt={prize.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', ...(prize.imgStyle ?? {}) }} />
            ) : (
              <span style={{
                fontFamily:"'Noto Sans TC', sans-serif",
                fontSize: 15, fontWeight: 'bold',
                color:'#fff', textShadow:'1px 2px 0 rgba(0,0,0,0.22)', lineHeight:1 }}>
                特別
              </span>
            )}
          </div>

          {/* 文字區 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full w-fit"
              style={{ background:'rgba(0,0,0,0.09)', color:'#444',
                fontFamily:"'Noto Sans TC', sans-serif" }}>
              {prize.rank}
            </span>
            {(() => {
              const isSP = prize.id === 'SP'
              return (
                <div className="flex flex-col gap-0.5" style={{ maxWidth: 165 }}>
                  <span className="text-sm font-bold leading-snug"
                    style={{ color:'#1A1A3A', fontFamily:"'Noto Sans TC', sans-serif" }}>
                    {prize.emoji ? `${prize.emoji} ` : ''}{prize.name}
                  </span>
                  {prize.name2 && (
                    <span className={isSP ? 'text-sm font-bold leading-snug' : 'text-xs leading-snug'}
                      style={{ color: isSP ? '#1A1A3A' : '#5C3A00', fontFamily:"'Noto Sans TC', sans-serif" }}>
                      {prize.name2}
                    </span>
                  )}
                  {prize.name3 && (
                    <span className="text-xs leading-snug"
                      style={{ color:'#5C3A00', fontFamily:"'Noto Sans TC', sans-serif" }}>
                      {prize.name3}
                    </span>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── 上半封面（往上滑走） ── */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ top:0, height:'50%', zIndex:10, overflow:'hidden' }}
          animate={opening ? { y:'-100%' } : { y:0 }}
          transition={{ duration:0.38, ease:[0.4, 0, 0.9, 1] }}
        >
          <div className="absolute inset-0"
            style={{ background:prize.sealColor,
              border:'3px solid rgba(0,0,0,0.16)',
              borderBottom:'none',
              borderRadius:'16px 16px 0 0' }}>
            <div className="absolute top-2 left-3 w-8 h-1.5 rounded-full bg-white/55" />
            <div className="absolute top-4 left-3 w-5 h-1 rounded-full bg-white/35" />
            <div className="absolute top-2 left-8 right-8 flex justify-between">
              {Array.from({length:13}).map((_,i) => (
                <div key={i} className="rounded-full bg-white/50" style={{ width:5, height:5 }} />
              ))}
            </div>
            <div className="absolute bottom-0 left-3 right-3 border-b-2 border-dashed"
              style={{ borderColor:'rgba(255,255,255,0.45)' }} />
          </div>
        </motion.div>

        {/* ── 下半封面（往下滑走） ── */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ bottom:0, height:'50%', zIndex:10, overflow:'hidden' }}
          animate={opening ? { y:'100%' } : { y:0 }}
          transition={{ duration:0.38, ease:[0.4, 0, 0.9, 1] }}
        >
          <div className="absolute inset-0"
            style={{ background:prize.sealColor,
              border:'3px solid rgba(0,0,0,0.16)',
              borderTop:'none',
              borderRadius:'0 0 16px 16px' }}>
            <div className="absolute bottom-2 left-8 right-8 flex justify-between">
              {Array.from({length:13}).map((_,i) => (
                <div key={i} className="rounded-full bg-white/50" style={{ width:5, height:5 }} />
              ))}
            </div>
            <div className="absolute top-0 left-3 right-3 border-t-2 border-dashed"
              style={{ borderColor:'rgba(255,255,255,0.45)' }} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.button
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.15 }}
            onClick={onComplete}
            whileTap={{ scale:0.95 }}
            className="mt-4 pixel-btn font-bold px-8 py-3 rounded-lg text-base"
            style={{ fontFamily:"'Noto Sans TC', sans-serif",
              background:'rgba(255,248,230,0.95)', color:'#3A1F00',
              border:'2px solid #9A7540',
              boxShadow:'2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)' }}>
            {nextLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── 主元件 ──
export default function Level2Kuji({ onComplete }) {
  const [phase, setPhase] = useState('pile1')  // pile1 | scratch1 | pile2 | scratch2
  const [prize1, setPrize1] = useState(null)
  const [prize2, setPrize2] = useState(null)

  function handleDraw1(color) {
    setPrize1({ ...PRIZES[0], sealColor: color })
    setPhase('scratch1')
  }

  function handleDraw2(color) {
    const pool = PRIZES.slice(1)
    const idx = Math.floor(Math.random() * pool.length)
    setPrize2({ ...pool[idx], sealColor: color })
    setPhase('scratch2')
  }

  const sceneEl = <Scene><NPC state="idle" /></Scene>

  const panelStyle = {
    background: 'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)',
    borderTop: '3px solid #B8925A',
    boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.9)',
  }

  let dialogEl
  if (phase === 'pile1') {
    dialogEl = <CardPile onDraw={handleDraw1} subtitle="✦ 第 1 抽" />
  } else if (phase === 'scratch1') {
    dialogEl = (
      <div className="flex flex-col h-full items-center justify-center gap-1 px-4" style={panelStyle}>
        <div className="text-xs font-bold tracking-widest mb-2"
          style={{ fontFamily:"'Noto Sans TC', sans-serif", color:'#7A4E1A' }}>
          STAGE 2 — 一番賞
        </div>
        <RevealTicket prize={prize1} onComplete={() => setPhase('pile2')} nextLabel="🎊 繼續抽第二次！" />
      </div>
    )
  } else if (phase === 'pile2') {
    dialogEl = <CardPile onDraw={handleDraw2} subtitle="✦ 第 2 抽" />
  } else {
    dialogEl = (
      <div className="flex flex-col h-full items-center justify-center gap-1 px-4" style={panelStyle}>
        <div className="text-xs font-bold tracking-widest mb-2"
          style={{ fontFamily:"'Noto Sans TC', sans-serif", color:'#7A4E1A' }}>
          STAGE 2 — 一番賞
        </div>
        <RevealTicket prize={prize2} onComplete={onComplete} nextLabel="前往第 3 關 →" />
      </div>
    )
  }

  return <GameLayout scene={sceneEl} dialog={dialogEl} />
}
