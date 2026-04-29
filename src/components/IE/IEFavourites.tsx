import FolderIcon from '../../img/FolderClosed.webp'
import { favourites } from '../../data/IEData'
import './IEFavourites.css'

interface IEFavouritesProps {
  onNavigate: (url: string) => void
  onClose: () => void
}

const IEFavourites = ({ onNavigate, onClose }: IEFavouritesProps) => {
  return (
    <div className="ie-favourites">
      <div className="ie-favourites-header">
        <span>Favourites</span>
        <button onClick={onClose} className="ie-favourites-close">✕</button>
      </div>
      <div className="ie-favourites-list">
        {favourites.map((group) => (
          <div key={group.folder} className="ie-favourites-group">
            <div className="ie-favourites-folder">
              <img src={FolderIcon} alt="" className="ie-favourites-icon" />
              <span>{group.folder}</span>
            </div>
            <div className="ie-favourites-items">
              {group.items.map((item) => (
                <button
                  key={item.url}
                  className="ie-favourites-item"
                  onClick={() => onNavigate(item.url)}
                >
                  <img src={item.icon} alt="" className="ie-favourites-icon" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IEFavourites