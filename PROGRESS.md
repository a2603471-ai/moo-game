# 🎮 Anniversary Game — 開發進度存檔
**最後更新：2026-04-30（本次 session 微調）**

---

## 專案路徑
```
/Users/yen/Downloads/Claude 專案/anniversary-game/
```

## 技術架構
- React + Vite
- Framer Motion（動畫）
- Tailwind CSS v4
- 字型：Noto Sans TC（主要）、Press Start 2P（少數裝飾）

---

## 關卡流程
```
level 0：StartScreen（開始畫面）
  ↓ 點「開始遊戲」
level 1：Level1Quiz（回憶問答，3 題）
  ↓ 答完
level 2：Level2Kuji（一番賞抽獎）
  ↓ 抽完
level 3：記憶翻牌（⚠️ 尚未開發，目前顯示 placeholder）
```

---

## 已完成功能

### Level 0 — StartScreen（開始畫面）✅
- **背景圖**：`/public/bg-select-clean.jpeg`（楓之谷角色選擇畫面，已清除原版 UI）
- `backgroundPosition: '65% center'`（三片木牌完整顯示）
- **NPC（寶寶）**：`/public/char_new.png`（LINE 貼圖，無愛心版）
  - 位置：`bottom: 23%`、`left: 22%`、`scale(1.4)`
  - 靜止不動（`animated={false}`）
  - 名稱標籤：「寶寶 💕」，往上微移 `-1vh`
- **開始遊戲按鈕**：疊在「選擇角色」木牌上
  - 位置：`top: 35%`、`left: 73%`
  - 尺寸：`width: 34%`、`padding: 9px 0`、`fontSize: 0.97rem`
  - 背景：木紋漸層（橫條紋）+ 底色 `rgb(190, 109, 41)`（與木牌同色，測色計實測值）
  - `transformTemplate` 修正：防止 whileTap 動畫覆蓋 translate 導致按鈕跑位
  - 點選後進入 Level 1

### Level 1 — 回憶問答 ✅
- 3 題問答，答對 NPC 跳舞、答錯 NPC 搖頭
- 暖色系楓之谷面板（米黃 + 棕金邊框）
- 題目：圓角方框、棕金邊、粗體
- 選項：圓角方框、答題後變半透明
- 全程 Noto Sans TC 字型

**題目內容：**
1. 和你告白的咖啡廳是哪一間？→ 二會咖啡廳
2. 我們第一次正餐吃了什麼？→ 炸雞
3. 第一次國內旅遊去哪個城市？→ 嘉義

### Level 2 — 一番賞抽獎 ✅
- 卡通漫畫風卡堆，可搖一搖 + 抽獎
- 拖曳撕開票券揭露獎項
- 4 種獎項（A/B/C/D 賞）

**獎項內容：**
- A 賞：恭喜！你抽到了全世界最可愛的另一半 🏆
- B 賞：購物車清單，我幫你買單！🛒
- C 賞：你選餐廳，我請客！🍽️
- D 賞：兌換一次 15 分鐘肩頸按摩 💆

---

## 待開發

### Level 3 — 記憶翻牌 ⚠️
- 目前僅顯示「第 3 關即將登場！」placeholder
- 尚未設計

---

## 關鍵檔案清單

| 檔案 | 說明 |
|------|------|
| `src/App.jsx` | 主路由，level 0-3 切換 |
| `src/components/StartScreen.jsx` | 開始畫面 |
| `src/components/Level1Quiz.jsx` | 第 1 關：回憶問答 |
| `src/components/Level2Kuji.jsx` | 第 2 關：一番賞 |
| `src/components/NPC.jsx` | NPC 元件（idle/jump/shake，支援 animated/labelStyle props）|
| `src/components/Scene.jsx` | 遊戲場景（bg.jpeg 背景）|
| `src/components/GameLayout.jsx` | 上下分割版面 |
| `src/index.css` | 全域樣式 |

## Public 資源

| 檔案 | 說明 |
|------|------|
| `/public/bg-select-clean.jpeg` | 開始畫面背景（已清除版） |
| `/public/bg.jpeg` | 遊戲關卡背景 |
| `/public/char_new.png` | NPC idle 圖（LINE 貼圖，無愛心） |
| `/public/jump_ya.apng` | NPC 答對動畫 |
| `/public/shake_ya.apng` | NPC 答錯動畫 |

---

## NPC 元件 Props

```jsx
<NPC
  state="idle"        // idle | jump | shake
  animated={true}     // false = 靜止（用於 StartScreen）
  labelStyle={{}}     // 覆寫名稱標籤樣式
/>
```

---

## 下一步建議
1. **開發 Level 3 記憶翻牌**：卡片配對遊戲，建議 6-8 對，主題為兩人回憶照片或 emoji
2. **結尾畫面**：Level 3 完成後顯示週年紀念祝賀頁
