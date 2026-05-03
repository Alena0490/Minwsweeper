import {useState, useEffect, useRef } from 'react'
import useSound from '../hooks/useSound'
import Logo from '../img/logo.webp'
import './XPLoading.css'

const XPLoading = ({ onFinish }: { onFinish: () => void }) => {
  const { playStartXP } = useSound()
  const onFinishRef = useRef(onFinish)
  const playRef = useRef(playStartXP)
  const hasRun = useRef(false)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    setTimeout(() => {
      playRef.current()
    }, 3000)

    setTimeout(() => {
      setFadingOut(true)
    }, 3500)
  }, [])

  return (
    <div
      className={`xp-loading ${fadingOut ? 'fade-out' : ''}`}
      onAnimationEnd={() => {
        if (fadingOut) onFinishRef.current()
      }}
    >
      <div className="window">
        <div className="load-logo">
          <img src={Logo} className="xp-logo-load" alt="Logo Windows" aria-hidden="true" />
          <span className="load-tm">™</span>
          <p className="load-top">Microsoft</p>
          <p className="load-mid">Windows<sup className="load-reg-mark">®</sup><span>xp</span></p>
          <p className="load-bottom">Professional</p>
        </div>
        <div className="container">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>
      </div>
    </div>
  )
}

export default XPLoading