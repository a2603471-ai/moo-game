// App.jsx
// 主遊戲路由：控制目前在哪一關

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Level1Quiz from './components/Level1Quiz'
import Level2Kuji from './components/Level2Kuji'
import Level3Photo from './components/Level3Photo'
import Level4Gacha from './components/Level4Gacha'
import StartScreen from './components/StartScreen'

// 關卡轉場動畫
const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -60 },
}

export default function App() {
  const [level, setLevel] = useState(0)

  return (
    <div className="w-full h-full bg-[#1a1a2e]">
      <AnimatePresence mode="wait">
        {level === 0 && (
          <motion.div key="start" className="w-full h-full"
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.4 }}>
            <StartScreen onStart={() => setLevel(1)} />
          </motion.div>
        )}

        {level === 1 && (
          <motion.div key="level1" className="w-full h-full"
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.4 }}>
            <Level1Quiz onComplete={() => setLevel(2)} />
          </motion.div>
        )}

        {level === 2 && (
          <motion.div key="level2" className="w-full h-full"
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.4 }}>
            <Level2Kuji onComplete={() => setLevel(3)} />
          </motion.div>
        )}

        {level === 3 && (
          <motion.div key="level3" className="w-full h-full"
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.4 }}>
            <Level3Photo onComplete={() => setLevel(4)} />
          </motion.div>
        )}

        {level === 4 && (
          <motion.div key="level4" className="w-full h-full"
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.4 }}>
            <Level4Gacha onComplete={() => {}} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
