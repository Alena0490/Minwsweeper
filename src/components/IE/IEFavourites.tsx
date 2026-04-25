import FolderIcon from '../../img/FolderClosed.webp'
import InternetIcon from '../../img/InternetShortcut.webp'
import './IEFavourites.css'

const favourites = [
  {
    folder: 'Search & Mail',
    items: [
      { label: 'Seznam.cz', url: 'https://web.archive.org/web/20031018001301if_/http://seznam.cz/' },
      { label: 'Seznam Email', url: 'https://web.archive.org/web/20031001074906if_/http://email.seznam.cz/index.py/login' },
      { label: 'ICQ', url: 'https://web.archive.org/web/20031020075942if_/http://icq.com/' },
    ]
  },
  {
    folder: 'Social',
    items: [
      { label: 'Lide.cz', url: 'https://web.archive.org/web/20031027083658if_/http://www.lide.cz/' },
      { label: 'Spolužáci', url: 'https://web.archive.org/web/20020813101805if_/http://spoluzaci.atlas.cz/index2.php?lang=&vahaj=1.01' },
      { label: 'Libimseti.cz', url: 'https://web.archive.org/web/20031010022438if_/http://www.libimseti.cz/' },
      { label: 'Zpovědnice', url: 'https://web.archive.org/web/20031020224816if_/http://zpovednice.cz/' },
    ]
  },
  {
    folder: 'Games',
    items: [
      { label: 'Superhry.cz', url: 'https://web.archive.org/web/20040414061334if_/http://www.superhry.cz/' },
      { label: 'Českéhry.cz', url: 'https://web.archive.org/web/20031025155050if_/http://www.ceskehry.cz/' },
    ]
  },
  {
    folder: 'Entertainment',
    items: [
      { label: 'Nova.cz', url: 'https://web.archive.org/web/20031018002806if_/http://www.nova.cz/' },
    ]
  },
]

interface IEFavouritesProps {
  onNavigate: (url: string) => void
  onClose: () => void
}

const IEFavourites = ({ onNavigate, onClose }: IEFavouritesProps) => {
  return (
    <div className="ie-favourites">
      <div className="ie-favourites-header">
        <span>Favorites</span>
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
                  <img src={InternetIcon} alt="" className="ie-favourites-icon" />
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