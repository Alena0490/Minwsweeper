import type { ReactNode } from 'react'
import FolderClosed from '../img/FolderClosed.webp'
import IEFile from '../img/URL.webp'
import Seznam from '../img/Favicons/faviconSeznam.ico'
import ICQ from '../img/Favicons/faviconICQ.ico'
import XChat from '../img/Favicons/faviconXChat.ico'
import Lide from '../img/Favicons/faviconLide.ico'
import Spoluuzaci from '../img/Favicons/faviconSpoluzaci.ico'
import LibimSeTi from '../img/Favicons/faviconLibimseti.ico'
import LinkedIn from '../img/Favicons/faviconLinkedIn.ico'
import Zpovednice from '../img/Favicons/faviconZpovednice.ico'
import Superhry from '../img/Favicons/faviconSuperhry.ico'
import CeskeHry from '../img/Favicons/faviconCaskeHry.ico'
import HappyTreeFriends from '../img/Favicons/faviconHTP.ico'
import Miniclip from '../img/Favicons/faviconMiniclip.ico'
import Nova from '../img/Favicons/faviconNova.png'
import Kinobox from '../img/Favicons/faviconKinobox.ico'
import Lamar from '../img/Favicons/faviconLamar.ico'
import Microsoft from '../img/Favicons/faviconMS06.ico'

interface MenuItem {
    label?: ReactNode;
    shortcut?: string;
    separator?: boolean;
    disabled?: boolean;
    arrow?: boolean;
    checked?: boolean;
    icon?: string;
    url?: string;
    children?: MenuItem[];
}

interface Menu {
    id: string;
    label: ReactNode;
    items: MenuItem[];
}

export const favourites = [
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
      { label: 'Českéhry.cz', url: 'https://web.archive.org/web/20031025155050if_/http://www.ceskehry.net/', icon: CeskeHry },
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
      { label: 'Mobilmania', url: 'https://web.archive.org/web/20031020113114if_/http://mobilmania.cz/', icon: IEFile },
    ]
  },
]

const menuData: Menu[] = [
    {
        id: 'file',
        label: <><span className="mnemonic">F</span>ile</>,
        items: [
            { label: <><span className="mnemonic">N</span>ew</> },
            { label: <><span className="mnemonic">O</span>pen...</>, shortcut: 'Ctrl+O' },
            { label: <>E<span className="mnemonic">d</span>it with Windows Notepad</> },
            { separator: true },
            { label: <><span className="mnemonic">S</span>ave</>, shortcut: 'Ctrl+S', disabled: true },
            { label: <>Save <span className="mnemonic">A</span>s...</>, disabled: true },
            { separator: true },
            { label: <>Page Se<span className="mnemonic">t</span>up...</> },
            { label: <><span className="mnemonic">P</span>rint...</>, shortcut: 'Ctrl+P' },
            { label: <>Print Pre<span className="mnemonic">v</span>iew...</> },
            { separator: true },
            { label: <>S<span className="mnemonic">e</span>nd</>, arrow: true },
            { label: <>Import and <span className="mnemonic">E</span>xport...</> },
            { separator: true },
            { label: <>P<span className="mnemonic">r</span>operties</> },
            { label: <><span className="mnemonic">W</span>ork Offline</> },
            { label: <><span className="mnemonic">C</span>lose</> },
        ]
    },
    {
        id: 'edit',
        label: <><span className="mnemonic">E</span>dit</>,
        items: [
            { label: <>Cu<span className="mnemonic">t</span></>, shortcut: 'Ctrl+X', disabled: true },
            { label: <><span className="mnemonic">C</span>opy</>, shortcut: 'Ctrl+C', disabled: true },
            { label: <><span className="mnemonic">P</span>aste</>, shortcut: 'Ctrl+V', disabled: true },
            { separator: true },
            { label: <>Select <span className="mnemonic">A</span>ll</>, shortcut: 'Ctrl+A' },
            { label: <><span className="mnemonic">F</span>ind (on This Page)...</>, shortcut: 'Ctrl+F' },
        ]
    },
    {
        id: 'view',
        label: <><span className="mnemonic">V</span>iew</>,
        items: [
            { label: <><span className="mnemonic">T</span>oolbars</>, arrow: true },
            { label: <>Status <span className="mnemonic">B</span>ar</>, checked: true },
            { label: <><span className="mnemonic">E</span>xplorer Bar</>, arrow: true },
            { separator: true },
            { label: <>G<span className="mnemonic">o</span> To</>, arrow: true },
            { label: <>Sto<span className="mnemonic">p</span></>, shortcut: 'Esc' },
            { label: <><span className="mnemonic">R</span>efresh</>, shortcut: 'F5' },
            { separator: true },
            { label: <>Te<span className="mnemonic">x</span>t Size</>, arrow: true },
            { label: <>Enco<span className="mnemonic">d</span>ing</>, arrow: true },
            { separator: true },
            { label: <>Sour<span className="mnemonic">c</span>e</> },
            { label: <>Pri<span className="mnemonic">v</span>acy Report...</> },
            { label: <><span className="mnemonic">F</span>ull Screen</>, shortcut: 'F11' },
        ]
    },
    {
        id: 'favourites',
        label: <>F<span className="mnemonic">a</span>vourites</>,
        items: [
            { label: <><span className="mnemonic">A</span>dd to Favorites...</> },
            { label: <><span className="mnemonic">O</span>rganize Favorites...</> },
            { separator: true },
            ...favourites.flatMap(group => [
                { 
                    label: group.folder, 
                    icon: FolderClosed, 
                    arrow: true,
                    children: group.items.map(item => ({ 
                        label: item.label, 
                        icon: item.icon, 
                        url: item.url 
                    }))
                },
            ])
        ]
    },
    {
        id: 'tools',
        label: <><span className="mnemonic">T</span>ools</>,
        items: [
            { label: <><span className="mnemonic">M</span>ail and News</>, arrow: true },
            { label: <><span className="mnemonic">P</span>op-up Blocker</>, arrow: true },
            { separator: true },
            { label: <>Mana<span className="mnemonic">g</span>e Add-ons...</> },
            { separator: true },
            { label: <>Windows <span className="mnemonic">U</span>pdate</> },
            { separator: true },
            { label: <>Internet <span className="mnemonic">O</span>ptions...</> },
        ]
    },
    {
        id: 'help',
        label: <><span className="mnemonic">H</span>elp</>,
        items: [
            { label: <><span className="mnemonic">C</span>ontents and Index</> },
            { label: <>Tip of the <span className="mnemonic">D</span>ay</> },
            { label: <>For <span className="mnemonic">N</span>etscape Users</> },
            { label: <>Online <span className="mnemonic">S</span>upport</> },
            { label: <>Send Feedbac<span className="mnemonic">k</span></> },
            { separator: true },
            { label: <><span className="mnemonic">A</span>bout Internet Explorer</> },
        ]
    },
]

export default menuData;