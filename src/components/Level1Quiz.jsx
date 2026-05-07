// Level1Quiz.jsx
// 第 1 關：3 道回憶問答，使用者答對/答錯觸發 NPC 動畫

import { useState, useCallback } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from './GameLayout'
import Scene from './Scene'
import NPC from './NPC'

// ── 題庫：修改這裡即可換題目 ──
const QUESTIONS = [
  {
    id: 1,
    text: '和你告白的咖啡廳是哪一間？',
    options: ['水哥咖啡', '二會咖啡廳', '抹More'],
    answer: '二會咖啡廳',
  },
  {
    id: 2,
    text: '我們第一次正餐吃了什麼？',
    options: ['義大利麵', '火鍋', '炸雞'],
    answer: '炸雞',
  },
  {
    id: 3,
    text: '第一次國內旅遊去哪個城市？',
    options: ['台南', '嘉義', '花蓮'],
    answer: '嘉義',
  },
]

export default function Level1Quiz({ onComplete }) {
  const [phase, setPhase] = useState('quiz')     // quiz | result
  const [qIdx, setQIdx] = useState(0)            // 目前第幾題
  const [score, setScore] = useState(0)          // 答對幾題
  const [npcState, setNpcState] = useState('idle')
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [answered, setAnswered] = useState(false) // 防止重複點選

  // 使用者選擇答案
  const handleAnswer = useCallback((option) => {
    if (answered) return
    setAnswered(true)
    const correct = option === QUESTIONS[qIdx].answer

    if (correct) {
      setScore(s => s + 1)
      setNpcState('jump')
      setFeedback('correct')
    } else {
      setNpcState('shake')
      setFeedback('wrong')
    }

    // 答對 jump 停留 3 秒；答錯 shake 停留 0.9 秒
    setTimeout(() => {
      setFeedback(null)
      setAnswered(false)
      if (qIdx < QUESTIONS.length - 1) {
        setNpcState('idle')
        setQIdx(i => i + 1)
      } else {
        const finalScore = correct ? score + 1 : score
        setNpcState(finalScore === QUESTIONS.length ? 'win' : 'lose')
        setPhase('result')
      }
    }, correct ? 1500 : 900)
  }, [answered, qIdx])

  // ── 場景（上半部）──
  const sceneEl = (
    <Scene>
      <NPC state={npcState} />
    </Scene>
  )

  // ── 楓之谷面板共用樣式 ──
  const maplePanel = {
    background: 'linear-gradient(180deg, #FAF6EE 0%, #EDE3D0 100%)',
    borderTop: '3px solid #B8925A',
    boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.9)',
  }

  // ── 對話區（下半部）──
  let dialogEl

  if (phase === 'quiz') {
    const q = QUESTIONS[qIdx]
    dialogEl = (
      <div className="flex flex-col h-full" style={maplePanel}>
        {/* 進度列 */}
        <div className="flex justify-between items-center px-4 pt-2 pb-1">
          <span className="text-xs font-bold" style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#7A4E1A' }}>
            Q {qIdx + 1}/{QUESTIONS.length}
          </span>
          <span className="text-xs" style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#8B6010' }}>⭐ {score} 答對</span>
        </div>

        {/* 題目（白色內框，低調區隔） */}
        <div className="mx-3 px-3 py-5 rounded-lg"
          style={{ background: 'rgba(255,248,230,0.95)', border: '2px solid #9A7540', boxShadow: '2px 2px 0 #9A7540, inset 0 1px 0 rgba(255,255,255,0.85)' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={q.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-base leading-relaxed font-bold"
              style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#3A1F00' }}
            >
              {q.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 答對/答錯提示 */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center font-bold text-base mt-1"
              style={{ fontFamily: "'Noto Sans TC', sans-serif", color: feedback === 'correct' ? '#B07000' : '#CC2020' }}
            >
              {feedback === 'correct' ? '✨ 答對了！' : '💦 答錯了！'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 選項清單（楓之谷純藍文字風格） */}
        <div className="flex flex-col flex-1 justify-center px-3 gap-2">
          {q.options.map((opt) => (
            <motion.button
              key={opt}
              className="w-full text-left text-sm"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: answered ? 'rgba(58,31,0,0.35)' : '#3A1F00',
                background: answered
                  ? 'rgba(255,248,230,0.5)'
                  : 'rgba(255,248,230,0.95)',
                border: '2px solid #B8925A',
                borderRadius: 10,
                outline: 'none',
                cursor: answered ? 'default' : 'pointer',
                padding: '10px 14px',
                fontWeight: 'normal',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
              whileTap={answered ? {} : { scale: 0.97, y: 1 }}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
            >
              ▶ {opt}
            </motion.button>
          ))}
        </div>
      </div>
    )
  } else {
    // 結果頁
    const perfect = score === QUESTIONS.length
    dialogEl = (
      <div className="flex flex-col h-full items-center justify-center" style={maplePanel}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="px-6 py-4 w-full text-center"
        >
          <p className="text-4xl mb-2">{perfect ? '🫨' : '🙂'}</p>
          <p className="text-xl font-bold mb-1"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#B07000' }}>
            {perfect ? '哇全對？！' : `好喔～`}
          </p>
          <p className="text-sm mb-5"
            style={{ fontFamily: "'Noto Sans TC', sans-serif", color: '#8B6010' }}>
            {perfect ? '這時候記憶特別好呢 🤣' : <>果然還得是你😂<br />沒關係我替你記著</>}
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
            前往第 2 關 →
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return <GameLayout scene={sceneEl} dialog={dialogEl} />
}
