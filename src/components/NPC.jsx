// NPC.jsx — 使用真實肉呆圖片 + YA~ APNG 動態貼圖（RGBA 透明背景）

import { motion } from 'framer-motion'

const TITLE_KEYFRAMES = `
  @keyframes titleBannerIn {
    0%   { transform: scaleX(0); opacity: 0; }
    65%  { transform: scaleX(1.04); opacity: 1; }
    100% { transform: scaleX(1); opacity: 1; }
  }
`

const idleAnim = {
  y: [0, -8, 0],
  transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
}

export default function NPC({ state = 'idle', animated = true, labelStyle = {}, showTitle = false, titleText = '' }) {
  return (
    // 稱號出現時整體往上移，讓橫幅不被底部裁切
    <div style={{ position: 'relative', zIndex: 20 }}>
      {showTitle && <style>{TITLE_KEYFRAMES}</style>}
      <div className="flex flex-col items-center" style={{ width: 180, transform: 'scale(1.1)', transformOrigin: 'bottom center' }}>

        {/* 待機圖（idle 時顯示） */}
        {state === 'idle' && (
          <motion.img
            src="/char_new.png"
            alt="肉呆"
            style={{ width: 160 }}
            animate={animated ? idleAnim : {}}
            draggable={false}
          />
        )}

        {/* 旋轉 APNG（結局畫面專用） */}
        {state === 'spin' && (
          <img
            src="/spin_idle.apng"
            alt="肉呆旋轉"
            style={{ width: 160 }}
            draggable={false}
          />
        )}

        {/* 答錯 APNG 動態貼圖（shake 時掛載） */}
        {state === 'shake' && (
          <img
            src="/shake_ya.apng"
            alt="答錯"
            style={{ width: 160 }}
            draggable={false}
          />
        )}

        {/* 答對 APNG 動態貼圖（jump 時掛載，自動播放，RGBA 透明） */}
        {state === 'jump' && (
          <img
            src="/jump_ya.apng"
            alt="YA~"
            style={{ width: 180 }}
            draggable={false}
          />
        )}

        {/* 未全對結果頁動態貼圖 */}
        {state === 'lose' && (
          <img
            src="/npc_lose.apng"
            alt="未全對"
            style={{ width: 170 }}
            draggable={false}
          />
        )}

        {/* 全對結果頁動態貼圖 */}
        {state === 'win' && (
          <img
            src="/npc_win.apng"
            alt="全對！"
            style={{ width: 180 }}
            draggable={false}
          />
        )}

        {/* 名稱標籤 */}
        <div
          className="mt-1 px-3 py-0.5 rounded-full text-xs font-bold"
          style={{ position: 'relative', top: '-2vh',
            background: 'rgba(255,255,255,0.85)',
            color: '#e8607e',
            border: '1.5px solid #ffb6c8',
            fontFamily: "'Noto Sans TC', sans-serif",
            boxShadow: '0 1px 4px rgba(232,96,126,0.2)',
            whiteSpace: 'nowrap',
            ...labelStyle,
          }}
        >
          寶寶 💕
        </div>

        {/* 稱號橫幅（名稱下方，揭曉後出現） */}
        {showTitle && titleText && (
          <div style={{
            position: 'relative',
            top: '-2vh',
            marginTop: 2,
            zIndex: 30,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 999,
            padding: 2,
            background: 'linear-gradient(180deg, #D4A853, #9A7540)',
            boxShadow: '0 2px 6px rgba(100,60,0,0.3)',
            animation: 'titleBannerIn 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 12px',
              borderRadius: 999,
              background: 'rgba(255,248,235,0.45)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: 11, fontWeight: 'bold', color: '#7A3A00', fontFamily: "'Noto Sans TC', sans-serif" }}>
                {titleText}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
