import type { ReactNode } from 'react'
import FolderClosed from '../img/FolderClosed.webp'
import IEFile from '../img/URL.webp'
import Seznam from '../img/Favicons/faviconSeznam.ico'
import ICQ from '../img/Favicons/faviconICQ.ico'
import XChat from '../img/Favicons/faviconXChat.ico'
import Lide from '../img/Favicons/faviconLide.ico'
import Spoluzaci from '../img/Favicons/faviconSpoluzaci.ico'
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
import Portfolio from '../img/Favicons/faviconPortfolio.ico'
import Google from '../img/Favicons/faviconGoogle.ico'

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
    action?: string //  'back', 'forward', 'home', 'close', 'fullscreen', 'favourites'
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
        { 
            label: 'Google', 
            url: 'https://web.archive.org/web/20031024040025if_/http://www.google.com/', 
            icon: Google, 
            title: 'Google' 
        },
        { 
            label: 'Seznam.cz', 
            url: 'https://web.archive.org/web/20031018001301if_/http://seznam.cz/', 
            icon: Seznam,
            title: 'Seznam'
        },
        { 
            label: 'Seznam E-mail', 
            url: 'https://web.archive.org/web/20031001074906if_/http://email.seznam.cz/index.py/login', 
            icon: Seznam ,
            title: 'Seznam E-mail'
        },
        { 
            label: 'ICQ', 
            url: 'https://web.archive.org/web/20031020075942if_/http://icq.com/', 
            icon: ICQ,
            title: 'ICQ.com - Get ICQ instant messenger, chat, people search and messaging...'
        },
        { 
            label: 'xChat', 
            url: 'https://web.archive.org/web/20031024124249if_/http://xchat.centrum.cz/', 
            icon: XChat,
            title: 'Xchat.cz' 
        },
    ]
  },
  {
    folder: 'Social',
    items: [
        { 
            label: 'Lide.cz', 
            url: 'https://web.archive.org/web/20031027083658if_/http://www.lide.cz/', 
            icon: Lide,
            title: 'Lidé.cz - nejen chat'              
        },
        { 
            label: 'Spolužáci', 
            url: 'https://web.archive.org/web/20020813101805if_/http://spoluzaci.atlas.cz/index2.php?lang=&vahaj=1.01', 
            icon: Spoluzaci,
            title: 'Spolužáci - místo všech spolužáků a spolužaček' 
        },
        { 
            label: 'Libimseti.cz', 
            url: 'https://web.archive.org/web/20031010022438if_/http://www.libimseti.cz/', 
            icon: LibimSeTi,
            title: 'WWW.LIBIMSETI.CZ -- hodnoťte fotografie ostatních a nechte posoudit...'  
        },
        { 
            label: 'LinkedIn', 
            url: 'https://web.archive.org/web/20051015052818/https://www.linkedin.com/', 
            icon: LinkedIn,
            title: 'Welcome to LinkedIn'  
        },
        { 
            label: 'Zpovědnice', 
            url: 'https://web.archive.org/web/20031020224816if_/http://zpovednice.cz/', 
            icon: Zpovednice,
            title: '...:::::::www.zpovědnice.cz:::::::...' 
        },
    ]
  },
  {
    folder: 'Games',
    items: [
        { 
            label: 'Superhry.cz', 
            url: 'https://web.archive.org/web/20040414061334if_/http://www.superhry.cz/', 
            icon: Superhry,
            title: 'superhry.cz - počítačové hry zdarma' 
        },
        { 
            label: 'Českéhry.cz', 
            url: 'https://web.archive.org/web/20031025155050if_/http://www.ceskehry.net/', 
            icon: CeskeHry,
            title: 'Pokladnice českých her' 
        },
        { 
            label: 'Happy Tree Friends', 
            url: 'https://web.archive.org/web/20031020081938if_/http://happytreefriends.com/', 
            icon: HappyTreeFriends,
            title: 'Happy Tree Friends'  
        },
        { 
            label: 'Miniclip', 
            url: 'https://web.archive.org/web/20031026163410if_/http://www.miniclip.com/', 
            icon: Miniclip,
            title: 'Miniclip.com - Free Games and Shows' 
        },
    ]
  },
  {
    folder: 'Entertainment',
    items: [
        { 
            label: 'Alena Pumprová', 
            url: 'https://alena-pumprova.cz/', 
            icon: Portfolio, 
            title: 'Alena Pumprová' 
        },
        { 
            label: 'Nova.cz', 
            url: 'https://web.archive.org/web/20031018002806if_/http://www.nova.cz/', 
            icon: Nova,
            title: 'n@va vás baví'  
        },
        { 
            label: 'Kinobox.cz', 
            url: 'https://web.archive.org/web/20031016005103if_/http://www.kinobox.cz/', 
            icon: Kinobox,
            title: '..::www.kinobox.cz::..' 
        },
        { 
            label: 'Lamer.cz', 
            url: 'https://web.archive.org/web/20031012093609if_/http://www.lamer.cz/', 
            icon: Lamar,
            title: 'lamer.cz' 
        },
    ]
  },
  {
    folder: 'Tech',
    items: [
        { 
            label: 'Microsoft.com', 
            url: 'https://web.archive.org/web/20031030193256if_/http://www.microsoft.com/', 
            icon: Microsoft,
            title: 'Microsoft Corporation' 
        },
        { 
            label: 'Mobilmania', 
            url: 'https://web.archive.org/web/20031020113114if_/http://mobilmania.cz/', 
            icon: IEFile,
            title: 'MobilMania.cz - internetový časopis o mobilech' 
        },
    ]
  },
]

const menuData: Menu[] = [
    {
        id: 'file',
        label: <><span className="mnemonic">F</span>ile</>,
        items: [
            { label: <><span className="mnemonic">N</span>ew</>, disabled: true  },
            { label: <><span className="mnemonic">O</span>pen...</>, shortcut: 'Ctrl+O', disabled: true  },
            { label: <>E<span className="mnemonic">d</span>it with Windows Notepad</>, disabled: true  },
            { separator: true },
            { label: <><span className="mnemonic">S</span>ave</>, shortcut: 'Ctrl+S', disabled: true },
            { label: <>Save <span className="mnemonic">A</span>s...</>, disabled: true },
            { separator: true },
            { label: <>Page Se<span className="mnemonic">t</span>up...</>, disabled: true  },
            { label: <><span className="mnemonic">P</span>rint...</>, shortcut: 'Ctrl+P', action: 'print' },
            { label: <>Print Pre<span className="mnemonic">v</span>iew...</>, disabled: true  },
            { separator: true },
            { label: <>S<span className="mnemonic">e</span>nd</>, arrow: true, disabled: true  },
            { label: <>Import and <span className="mnemonic">E</span>xport...</>, disabled: true  },
            { separator: true },
            { label: <>P<span className="mnemonic">r</span>operties</>, disabled: true  },
            { label: <><span className="mnemonic">W</span>ork Offline</>, disabled: true  },
            { label: <><span className="mnemonic">C</span>lose</>, action: 'close' },
        ]
    },
    {
        id: 'edit',
        label: <><span className="mnemonic">E</span>dit</>,
        items: [
            { label: <>Cu<span className="mnemonic">t</span></>, shortcut: 'Ctrl+X', disabled: true },
            { label: <><span className="mnemonic">C</span>opy</>, shortcut: 'Ctrl+C', action: 'copy' },
            { label: <><span className="mnemonic">P</span>aste</>, shortcut: 'Ctrl+V', action: 'paste' },
            { separator: true },
            { label: <>Select <span className="mnemonic">A</span>ll</>, shortcut: 'Ctrl+A', disabled: true  },
            { label: <><span className="mnemonic">F</span>ind (on This Page)...</>, shortcut: 'Ctrl+F', disabled: true  },
        ]
    },
    {
        id: 'view',
        label: <><span className="mnemonic">V</span>iew</>,
        items: [
            { label: <><span className="mnemonic">T</span>oolbars</>, arrow: true, disabled: true  },
            { label: <>Status <span className="mnemonic">B</span>ar</>, checked: true, disabled: true  },
            { label: <><span className="mnemonic">E</span>xplorer Bar</>, arrow: true, disabled: true  },
            { separator: true },
            { 
                label: <>G<span className="mnemonic">o</span> To</>, 
                arrow: true,
                children: [
                    { label: 'Back', action: 'back' },
                    { label: 'Forward', action: 'forward' },
                    { label: 'Home Page', action: 'home' },
                ]
            },
            { label: <>Sto<span className="mnemonic">p</span></>, shortcut: 'Esc', action: 'stop' },
            { label: <><span className="mnemonic">R</span>efresh</>, shortcut: 'F5', action: 'refresh' },
            { separator: true },
            { label: <>Te<span className="mnemonic">x</span>t Size</>, arrow: true, disabled: true  },
            { label: <>Enco<span className="mnemonic">d</span>ing</>, arrow: true, disabled: true  },
            { separator: true },
            { label: <>Sour<span className="mnemonic">c</span>e</>, disabled: true  },
            { label: <>Pri<span className="mnemonic">v</span>acy Report...</>, disabled: true  },
            { label: <><span className="mnemonic">F</span>ull Screen</>, shortcut: 'F11', action: 'fullscreen' },
        ]
    },
    {
        id: 'favourites',
        label: <>F<span className="mnemonic">a</span>vourites</>,
        items: [
            { label: <><span className="mnemonic">A</span>dd to Favorites...</>, action: 'favourites' },
            { label: <><span className="mnemonic">O</span>rganize Favorites...</>, disabled: true  },
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
            { label: <><span className="mnemonic">M</span>ail and News</>, arrow: true, disabled: true  },
            { label: <><span className="mnemonic">P</span>op-up Blocker</>, arrow: true, disabled: true  },
            { separator: true },
            { label: <>Mana<span className="mnemonic">g</span>e Add-ons...</>, disabled: true  },
            { separator: true },
            { label: <>Windows <span className="mnemonic">U</span>pdate</>, disabled: true  },
            { separator: true },
            { label: <>Internet <span className="mnemonic">O</span>ptions...</>, disabled: true  },
        ]
    },
    {
        id: 'help',
        label: <><span className="mnemonic">H</span>elp</>,
        items: [
            { label: <><span className="mnemonic">C</span>ontents and Index</>, disabled: true  },
            { label: <>Tip of the <span className="mnemonic">D</span>ay</>, disabled: true  },
            { label: <>For <span className="mnemonic">N</span>etscape Users</>, disabled: true  },
            { label: <>Online <span className="mnemonic">S</span>upport</>, disabled: true  },
            { label: <>Send Feedbac<span className="mnemonic">k</span></>, disabled: true  },
            { separator: true },
            { label: <><span className="mnemonic">A</span>bout Internet Explorer</>, action: 'about' },
        ]
    },
]

export default menuData;