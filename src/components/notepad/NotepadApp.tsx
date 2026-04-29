const NotepadApp = () => {
  return (
    <div>
        <div className="toolbar"></div>
        <div className="xp-notepad-wrapper">
            <textarea className="xp-notepad" spellCheck="false">
            </textarea>
        </div>
        <div className="notepad-statusbar"></div>
    </div>
  )
}

export default NotepadApp
