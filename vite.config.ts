import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/Windows-XP/',
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    minesweeper: ['./src/components/minesweeper/Game.tsx'],
                    ie: ['./src/components/IE/IEWindow.tsx'],
                    paint: ['./src/components/Paint/Paint.tsx'],
                    calculator: ['./src/components/Calculator/Calculator.tsx'],
                    terminal: ['./src/components/terminal/Terminal.tsx'],
                    loading: ['./src/components/XPLoading.tsx'],
                    footer: ['./src/components/Footer.tsx'],
                    startmenu: ['./src/components/MenuModal.tsx'],
                    errorbubble: ['./src/components/ErrorBubble.tsx'],
                    criticalerror: ['./src/components/CriticalError.tsx'],
                    notepad: ['./src/components/Notepad/Notepad.tsx'],
                }
            }
        }
    }
})
