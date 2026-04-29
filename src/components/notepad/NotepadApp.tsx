const NotepadApp = () => {
  return (
    <div className="notepad-app">
        <div className="toolbar"></div>
        <div className="xp-notepad-wrapper">
            <textarea 
                id="textfield"
                className="xp-notepad" 
                spellCheck="false"
                rows={20}
            >
            </textarea>
        </div>
        <div className="notepad-statusbar">
            <div className="status">Ln 1 Col 45</div>
            <div className="status">57 characters</div>
            <div className="status">100 %</div>
            <div className="status">Windows (CRLF)</div>
            <div className="status">UTF-8</div>
        </div>
    </div>
  )
}

export default NotepadApp
