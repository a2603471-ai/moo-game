# Anniversary Game — 專案狀態記憶

> 最後更新：2026-04-29
> 專案路徑：`/Users/yen/Downloads/Claude 專案/anniversary-game`

---

## 專案概述

給另一半（暱稱：肉呆，豬豬角色）玩的週年紀念互動遊戲。
楓之谷風格背景，手機直式全螢幕，上半遊戲場景 / 下半問答對話。

---

## 技術棧

- React + Vite
- Framer Motion（動畫）
- Tailwind CSS v4（@tailwindcss/vite plugin）
- 100dvh 佈局（相容 iPhone Safari）

---

## 目前完成進度

### ✅ 第 1 關：回憶問答（Level1Quiz.jsx）
- 3 道回憶問題（告白咖啡廳、第一次正餐、第一次國內旅遊）
- intro 對話 → 作答 → 結果頁流程
- 答對：NPC jump 動畫停留 3 秒；答錯：shake 動畫停留 0.9 秒
- 完成後進入第 2 關

### ✅ 第 2 關：一番賞抽獎（Level2Kuji.jsx）
- 卡牌堆 → 抽牌 → 拖拉撕開獎券
- 4 種獎品 A/B/C/D（加權隨機）
- 完成後進入第 3 關

### 🔲 第 3 關：記憶翻牌（尚未開發）
- App.jsx 中目前是 placeholder
- 規劃：6 對 emoji 牌（☕🏙️🍗🎟️🧚🎂）
- intro 對話 → 翻牌遊戲 → 結局畫面

---

## 關鍵元件與現況

### GameLayout.jsx
- 上下比例：**50% / 50%**
- `height: '100dvh'`，下半有 `env(safe-area-inset-bottom)` 防遮擋

### Scene.jsx
- 背景：`bg.jpeg`，`backgroundPosition: 'center 70%'`
- NPC 位置：`bottom: '0%', left: '47%', transform: 'translateX(-50%)'`
  - 站在草皮上，木桶左側

### NPC.jsx（三種狀態）

| 狀態 | 素材 | 寬度 |
|------|------|------|
| `idle` | `/char_t.png`（靜態 + framer 浮動） | 160px |
| `shake` | `/shake_ya.apng`（LINE 貼圖，RGBA 透明） | 160px |
| `jump` | `/jump_ya.apng`（LINE 貼圖，RGBA 透明） | 180px |

- 容器寬度：180px
- idle 浮動動畫：y [0, -8, 0]，1.8s 無限循環

### vite.config.js
- `server: { host: true }` — 已開啟區域網路，iPhone 可連

---

## Public 資源清單

| 檔案 | 用途 |
|------|------|
| `bg.jpeg` | 楓之谷背景圖 |
| `char_t.png` | 肉呆待機靜態圖（白底去背用 multiply，目前未套用） |
| `jump_ya.apng` | 答對動畫（LINE sticker ID: 796835440，RGBA 透明）|
| `shake_ya.apng` | 答錯動畫（LINE sticker ID: 796835429，RGBA 透明）|
| `jump_t.webm` | 舊版答對影片（已棄用，可刪除）|

---

## 下一步：第 3 關設計規劃

### 規格
- 6 對 emoji 牌，共 12 張，隨機排列
- 每次翻 2 張，配對成功消失（或留著），配對失敗翻回
- 全部配對完畢 → 結局畫面

### 建議卡牌主題（紀念意義）
```
☕ 咖啡  🏙️ 城市  🍗 炸雞  🎟️ 電影  🧚 小精靈  🎂 生日
```

### 結局畫面
- 顯示紀念日訊息、照片或特別文字
- 可加入煙火特效（framer motion particles）

---

## 常用指令

```bash
cd "/Users/yen/Downloads/Claude 專案/anniversary-game"
npm run dev        # 啟動開發伺服器（iPhone 連 Network URL）
```
