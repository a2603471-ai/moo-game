// GameLayout.jsx
// 手機全螢幕 Layout：上半遊戲場景 / 下半對話框
// 使用 100dvh 解決 iPhone Safari 網址列遮擋問題

export default function GameLayout({ scene, dialog, sceneHeight = '50%' }) {
  return (
    <div
      className="flex flex-col w-full"
      style={{ height: '100dvh' }}  // dvh = dynamic viewport height，自動排除 Safari 工具列
    >
      {/* ── 上半：遊戲場景區 ── */}
      <div className="relative flex-none" style={{ height: sceneHeight, overflow: 'visible', zIndex: 10 }}>
        {scene}
      </div>

      {/* ── 下半：對話 / 選項區 60% ── */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}  // 避免 iPhone 底部手勢條遮擋
      >
        {dialog}
      </div>
    </div>
  )
}
