import Logo from '../img/logo.webp'
import './XPLoading.css'

const XPLoading = () => {
  return (
    <div className="xp-loading">
      <div className="window">
        <div className="logo">
          <img src={Logo} className="xp-logo" alt="" aria-hidden="true" />

          <p className="top">Microsoft</p>
          <p className="mid">Windows<span>XP</span></p>
          <p className="bottom">Professional</p>
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