// Scene.jsx — 使用楓之谷背景圖.jpeg 作為真實背景

export default function Scene({ children }) {
  return (
    <div
      className="relative w-full h-full"
      style={{
        overflow: 'visible',
        backgroundImage: `url('${import.meta.env.BASE_URL}bg.jpeg?v=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 70%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* NPC 站在木桶左側草皮上 */}
      <div
        className="absolute"
        style={{ bottom: '0%', left: '47%', transform: 'translateX(-50%)' }}
      >
        {children}
      </div>
    </div>
  )
}
