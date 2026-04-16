import type { ReactNode } from 'react'

interface MenuItem {
    label?: ReactNode;
    shortcut?: string;
    separator?: boolean;
    disabled?: boolean;
    arrow?: boolean;
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
            { label: 'New' },
            { label: 'Open...', shortcut: 'Ctrl+O' },
            { separator: true },
            { label: 'Save', shortcut: 'Ctrl+S' },
            { label: 'Save As...' },
            { separator: true },
            { label: 'Print...', shortcut: 'Ctrl+P' },
            { separator: true },
            { label: 'Close' },
        ]
    },
    {
        id: 'edit',
        label: <><span className="mnemonic">E</span>dit</>,
        items: [
            { label: 'Cut', shortcut: 'Ctrl+X', disabled: true },
            { label: 'Copy', shortcut: 'Ctrl+C', disabled: true },
            { label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
            { separator: true },
            { label: 'Select All', shortcut: 'Ctrl+A' },
            { label: 'Find (on This Page)...', shortcut: 'Ctrl+F' },
        ]
    },
    
     {
        id: 'view',
        label: <><span className="mnemonic">V</span>iew</>,
        items: [
            { label: 'Toolbars', arrow: true },
            { label: 'Status Bar' },
            { label: 'Explorer Bar', arrow: true },
            { separator: true },
            { label: 'Go To', arrow: true },
            { label: 'Stop', shortcut: 'Esc' },
            { label: 'Refresh', shortcut: 'F5' },
            { separator: true },
            { label: 'Text Size', arrow: true },
            { label: 'Encoding', arrow: true },
            { separator: true },
            { label: 'Source' },
            { label: 'Privacy Report...' },
            { label: 'Full Screen', shortcut: 'F11' },
        ]
    },
    {
        id: 'favourites',
        label: <>F<span className="mnemonic">a</span>vourites</>,
        items: [
            { label: 'Add to Favorites...' },
            { label: 'Organize Favorites...' },
            { separator: true },
            { label: 'Channels', arrow: true },
            { label: 'Links', arrow: true },
            { label: 'MSN.com' },
            { label: 'MSN' },
            { label: 'Radio Station Guide' },
            { label: 'Web Events' },
        ]
    },
    {
        id: 'tools',
        label: <><span className="mnemonic">T</span>ools</>,
        items: [
            { label: 'Mail and News', arrow: true },
            { label: 'Pop-up Blocker', arrow: true },
            { separator: true },
            { label: 'Manage Add-ons...' },
            { separator: true },
            { label: 'Windows Update' },
            { separator: true },
            { label: 'Internet Options...' },
        ]
    },
    {
        id: 'help',
        label: <><span className="mnemonic">H</span>elp</>,
        items: [
            { label: 'Contents and Index' },
            { label: 'Tip of the Day' },
            { label: 'For Netscape Users' },
            { label: 'Online Support' },
            { label: 'Send Feedback' },
            { separator: true },
            { label: 'About Internet Explorer' },
        ]
    },
];

export default menuData;