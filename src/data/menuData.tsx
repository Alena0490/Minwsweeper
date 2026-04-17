import type { ReactNode } from 'react'
import FolderClosed from '../img/FolderClosed.webp'
import IEFile from '../img/URL.webp'

interface MenuItem {
    label?: ReactNode;
    shortcut?: string;
    separator?: boolean;
    disabled?: boolean;
    arrow?: boolean;
    checked?: boolean;
    icon?: string; // ← přidat
}

interface Menu {
    id: string;
    label: ReactNode;
    items: MenuItem[];
}

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
            { label: 'Channels', arrow: true, icon: FolderClosed },
            { label: 'Links', arrow: true, icon: FolderClosed },

            { label: 'MSN.com', icon: IEFile },
            { label: 'MSN', icon: IEFile },
            { label: 'Radio Station Guide', icon: IEFile },
            { label: 'Web Events', icon: IEFile },
        ]
    },
    {
        id: 'tools',
        label: <><span className="mnemonic">T</span>ools</>,
        items: [
            { label: <><span className="mnemonic">M</span>ail and News</>, arrow: true },
            { label: <> <span className="mnemonic">P</span>op-up Blocker</>, arrow: true },
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
            { label: <> <span className="mnemonic">A</span>bout Internet Explorer</> },
        ]
    },
];

export default menuData;