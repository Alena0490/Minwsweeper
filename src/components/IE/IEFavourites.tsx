import FolderIcon from '../../img/FolderClosed.webp'
import WebIcon from '../../img/URL.webp'
import Seznam from '../../img/Favicons/faviconSeznam.ico'
import ICQ from '../../img/Favicons/faviconICQ.ico'
import XChat from '../../img/Favicons/faviconXChat.ico'
import Lide from '../../img/Favicons/faviconLide.ico'
import Spoluuzaci from '../../img/Favicons/faviconSpoluzaci.ico'
import LibimSeTi from '../../img/Favicons/faviconLibimseti.ico'
import LinkedIn from '../../img/Favicons/faviconLinkedIn.ico'
import Zpovednice from '../../img/Favicons/faviconZpovednice.ico'
import Superhry from '../../img/Favicons/faviconSuperhry.ico'
import CeskeHry from '../../img/Favicons/faviconCaskeHry.ico'
import HappyTreeFriends from '../../img/Favicons/faviconHTP.ico'
import Miniclip from '../../img/Favicons/faviconMiniclip.ico'
import Nova from '../../img/Favicons/faviconNova.png'
import Kinobox from '../../img/Favicons/faviconKinobox.ico'
import Lamar from '../../img/Favicons/faviconLamar.ico'
import Microsoft from '../../img/Favicons/faviconMS06.ico'

import './IEFavourites.css'

const favourites = [
  {
    folder: 'Search & Mail',
    items: [
      { label: 'Seznam.cz', url: 'https://web.archive.org/web/20031018001301if_/http://seznam.cz/', icon: Seznam },
      { label: 'Seznam Email', url: 'https://web.archive.org/web/20031001074906if_/http://email.seznam.cz/index.py/login', icon: Seznam },
      { label: 'ICQ', url: 'https://web.archive.org/web/20031020075942if_/http://icq.com/', icon: ICQ },
      { label: 'xChat', url: 'https://web.archive.org/web/20031024124249if_/http://xchat.centrum.cz/', icon: XChat },
    ]
  },
  {
    folder: 'Social',
    items: [
      { label: 'Lide.cz', url: 'https://web.archive.org/web/20031027083658if_/http://www.lide.cz/', icon: Lide },
      { label: 'Spolužáci', url: 'https://web.archive.org/web/20020813101805if_/http://spoluzaci.atlas.cz/index2.php?lang=&vahaj=1.01', icon: Spoluuzaci },
      { label: 'Libimseti.cz', url: 'https://web.archive.org/web/20031010022438if_/http://www.libimseti.cz/', icon: LibimSeTi },
      { label: 'LinkedIn', url: 'https://web.archive.org/web/20051015052818/https://www.linkedin.com/', icon: LinkedIn },
      { label: 'Zpovědnice', url: 'https://web.archive.org/web/20031020224816if_/http://zpovednice.cz/', icon: Zpovednice },
    ]
  },
  {
    folder: 'Games',
    items: [
      { label: 'Superhry.cz', url: 'https://web.archive.org/web/20040414061334if_/http://www.superhry.cz/', icon: Superhry },
      { label: 'Českéhry.cz', url: 'https://web.archive.org/web/20031025155050if_/http://www.ceskehry.net/', icon: CeskeHry},
      { label: 'Happy Tree Friends', url: 'https://web.archive.org/web/20031020081938if_/http://happytreefriends.com/', icon: HappyTreeFriends },
      { label: 'Miniclip', url: 'https://web.archive.org/web/20031026163410if_/http://www.miniclip.com/', icon: Miniclip },
    ]
  },
  {
    folder: 'Entertainment',
    items: [
      { label: 'Nova.cz', url: 'https://web.archive.org/web/20031018002806if_/http://www.nova.cz/', icon: Nova },
      { label: 'Kinobox.cz', url: 'https://web.archive.org/web/20031016005103if_/http://www.kinobox.cz/', icon: Kinobox },
      { label: 'Lamer.cz', url: 'https://web.archive.org/web/20031012093609if_/http://www.lamer.cz/', icon: Lamar },
    ]
  },
  {
    folder: 'Tech',
    items: [
      { label: 'Microsoft.com', url: 'https://web.archive.org/web/20031030193256if_/http://www.microsoft.com/', icon: Microsoft },
      { label: 'Mobilmania', url: 'https://web.archive.org/web/20031020113114if_/http://mobilmania.cz/', icon: WebIcon },
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