// StartScreen.jsx

import { motion } from 'framer-motion'
import NPC from './NPC'

const woodBg = `
  repeating-linear-gradient(
    180deg,
    rgba(255,255,255,0.06) 0px,
    rgba(255,255,255,0.06) 1px,
    transparent 1px,
    transparent 6px,
    rgba(0,0,0,0.04) 6px,
    rgba(0,0,0,0.04) 7px,
    transparent 7px,
    transparent 14px
  ),
  repeating-linear-gradient(
    180deg,
    transparent 0px,
    rgba(160,85,20,0.35) 2px,
    transparent 4px,
    transparent 22px,
    rgba(210,130,50,0.2) 24px,
    transparent 26px,
    transparent 40px
  ),
  rgb(190, 109, 41)
`

export default function StartScreen({ onStart }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}bg-select-clean.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: '65% center',
      }}
    >
      {/* 開始遊戲按鈕：疊在「選擇角色」木牌上 */}
      <motion.button
        onClick={onStart}
        whileTap={{ scale: 0.93 }}
        transformTemplate={({ scale }) => `translate(-50%, -50%) scale(${scale ?? 1})`}
        className="absolute"
        style={{
          top: '35%',
          left: '73%',
          transform: 'translate(-50%, -50%)',
          width: '34%',
          padding: '9px 0',
          background: woodBg,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Noto Sans TC', sans-serif",
          fontSize: '0.97rem',
          fontWeight: 'bold',
          color: '#FFF8E8',
          textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          letterSpacing: '0.1em',
        }}
      >
        ▶ 開始遊戲
      </motion.button>

      {/* NPC：蓋住背景圖的原始角色（靜止不動） */}
      <div
        className="absolute"
        style={{
          bottom: '19%',
          left: '22%',
          transform: 'translateX(-50%) scale(1.4)',
          transformOrigin: 'bottom center',
        }}
      >
        <NPC state="idle" animated={false} labelStyle={{ top: '-2vh' }} />
      </div>
    </div>
  )
}
