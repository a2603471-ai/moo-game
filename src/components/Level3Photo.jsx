// Level3Photo.jsx
// 第 3 關：看題目，點選正確照片

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from './GameLayout'
import Scene from './Scene'
import NPC from './NPC'

// ── 題庫：answerIdx = 正確答案的 index（0/1/2）
//         src = 照片路徑（null 時顯示 placeholder）
// ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    text: '我們第一次約會的甜點？',
    answerIdx: 0,
    options: [
      { src: '/photos/甜點A.jpg', label: '甜點 A', bg: '#fde68a' },
      { src: '/photos/甜點B.jpg', label: '甜點 B', bg: '#fbcfe8' },
      { src: '/photos/甜點C.jpg', label: '甜點 C', bg: '#a5f3fc' },
    ],
  },
  {
    id: 2,
    text: '我們的第一場演唱會？',
    answerIdx: 2,
    options: [
      { src: '/photos/演唱會A.jpg', label: '演唱會 A', bg: '#c4b5fd' },
      { src: '/photos/演唱會B.jpg', label: '演唱會 B', bg: '#bbf7d0' },
      { src: '/photos/演唱會C.jpg', label: '演唱會 C', bg: '#fca5a5' },
    ],
  },
  {
    id: 3,
    text: '我們第一次去的國家？',
    answerIdx: 2,
    options: [
      { src: '/photos/國家A.jpg', label: '國家 A', bg: '#fed7aa' },
      { src: '/photos/國家B.jpg', label: '國家 B', bg: '#a5f3fc' },
      { src: '/photos/國家C.jpg', label: '國家 C', bg: '#d9f99d' },
    ],
  },
]

const maplePanel = {
  background: 'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)',
  borderTop: '3px solid #B8925A',
  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.9)',
}

// ── 單張照片卡 ──
function PhotoCard({ opt, idx, answered, feedbackIdx, feedbackType, correctIdx, onSelect }) {
  const isCorrect = feedbackIdx !== null && idx === correctIdx
  const isWrong   = feedbackIdx !== null && feedbackType === 'wrong' && idx === feedbackIdx

  return (
    <motion.button
      onClick={() => onSelect(idx)}
      disabled={answered}
      whileTap={answered ? {} : { scale: 0.91 }}
      animate={isWrong ? { x: [0, -7, 7, -5, 5, -3, 3, 0] } : {}}
      transition={isWrong ? { duration: 0.45 } : {}}
      className="relative rounded-xl overflow-hidden w-full"
      style={{
        aspectRatio: '9 / 16',
        border: isCorrect ? '3px solid #22c55e'
               : isWrong   ? '3px solid #ef4444'
               :              '2.5px solid #B8925A',
        boxShadow: isCorrect ? '0 0 0 3px #22c55e33'
                 : isWrong   ? '0 0 0 3px #ef444433'
                 :              '2px 2px 0 rgba(0,0,0,0.12)',
        cursor: answered ? 'default' : 'pointer',
      }}
    >
      {opt.src ? (
        <img src={opt.src} alt={opt.label} decoding="async" className="w-full h-full object-cover"
          style={{ ...(opt.imgStyle ?? {}), imageRendering: '-webkit-optimize-contrast' }} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1"
          style={{ background: opt.bg }}>
          <span style={{ fontSize: 22 }}>📷</span>
          <span className="text-xs text-center px-1 leading-tight"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#3A1F00', opacity: 0.55 }}>
            {opt.label}
          </span>
        </div>
      )}

      {/* 答對覆蓋層 */}
      {isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.22)' }}>
          <span style={{ fontSize: 30 }}>✅</span>
        </motion.div>
      )}

      {/* 答錯覆蓋層 */}
      {isWrong && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.18)' }}>
          <span style={{ fontSize: 30 }}>❌</span>
        </motion.div>
      )}
    </motion.button>
  )
}

// ── 主元件 ──
export default function Level3Photo({ onComplete }) {
  const [phase, setPhase]       = useState('quiz') // quiz | result
  const [qIdx, setQIdx]         = useState(0)
  const [score, setScore]       = useState(0)
  const [npcState, setNpcState] = useState('idle')
  const [answered, setAnswered] = useState(false)
  const [feedbackIdx, setFeedbackIdx]   = useState(null)
  const [feedbackType, setFeedbackType] = useState(null)

  // 預載並預先解碼所有照片
  useEffect(() => {
    QUESTIONS.forEach(q => q.options.forEach(opt => {
      if (opt.src) {
        const img = new Image()
        img.src = opt.src
        img.decode().catch(() => {})
      }
    }))
  }, [])

  const handleSelect = useCallback((optIdx) => {
    if (answered) return
    setAnswered(true)
    const correct = optIdx === QUESTIONS[qIdx].answerIdx

    setFeedbackIdx(optIdx)
    setFeedbackType(correct ? 'correct' : 'wrong')

    if (correct) {
      setScore(s => s + 1)
      setNpcState('jump')
    } else {
      setNpcState('shake')
    }

    setTimeout(() => {
      setNpcState('idle')
      setFeedbackIdx(null)
      setFeedbackType(null)
      setAnswered(false)
      if (qIdx < QUESTIONS.length - 1) {
        setQIdx(i => i + 1)
      } else {
        setPhase('result')
      }
    }, correct ? 1500 : 1000)
  }, [answered, qIdx])

  const sceneEl = <Scene><NPC state={npcState} /></Scene>

  let dialogEl

  if (phase === 'quiz') {
    const q = QUESTIONS[qIdx]
    dialogEl = (
      <div className="flex flex-col h-full" style={maplePanel}>
        {/* 標題列 */}
        <div className="flex justify-between items-center px-4 pt-2 pb-1">
          <span className="text-xs font-bold"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#7A4E1A' }}>
            STAGE 3 — 照片選擇
          </span>
          <span className="text-xs"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#8B6010' }}>
            Q {qIdx + 1}/{QUESTIONS.length}
          </span>
        </div>

        {/* 題目框 */}
        <div className="mx-3 px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(255,248,230,0.95)',
            border: '2px solid #9A7540',
            boxShadow: '2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)',
          }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={q.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-base leading-relaxed font-bold text-center"
              style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#3A1F00' }}
            >
              {q.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 答對／答錯提示 */}
        <div style={{ minHeight: 28 }} className="flex items-center justify-center mt-1">
          <AnimatePresence>
            {feedbackType && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-sm"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: feedbackType === 'correct' ? '#B07000' : '#CC2020',
                }}
              >
                {feedbackType === 'correct' ? '✨ 答對了！' : '💦 答錯了！'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 照片 3 宮格（切題時 slide-fade 動畫） */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-3 gap-2 px-3 pb-3 flex-1 min-h-0 content-center"
            style={{ willChange: 'opacity' }}
          >
            {q.options.map((opt, i) => (
              <PhotoCard
                key={i}
                idx={i}
                opt={opt}
                answered={answered}
                feedbackIdx={feedbackIdx}
                feedbackType={feedbackType}
                correctIdx={q.answerIdx}
                onSelect={handleSelect}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  } else {
    const perfect = score === QUESTIONS.length
    dialogEl = (
      <div className="flex flex-col h-full items-center justify-center" style={maplePanel}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="px-6 py-4 w-full text-center"
        >
          <p className="text-4xl mb-2">{perfect ? '🎉' : '💝'}</p>
          <p className="text-xl font-bold mb-1"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#B07000' }}>
            {perfect ? '完美通關！' : `答對 ${score} / ${QUESTIONS.length}`}
          </p>
          <p className="text-sm mb-5"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#8B6010' }}>
            {perfect ? '你把我們的回憶都記得呢 ❤️' : '沒關係，這些畫面都是我們的 💕'}
          </p>
          <motion.button
            className="pixel-btn px-8 py-3 rounded-lg font-bold text-base"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              background: 'rgba(255,248,230,0.95)',
              color: '#3A1F00',
              border: '2px solid #9A7540',
              boxShadow: '2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            前往第 4 關 →
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return <GameLayout scene={sceneEl} dialog={dialogEl} />
}
