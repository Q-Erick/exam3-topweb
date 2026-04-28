import { Sidebar } from '@/shared/components/layout/Sidebar'
import { TopBar } from '@/shared/components/layout/TopBar'

export default function DashboardLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TopBar />
            <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {children}
            </main>
        </div>
        </div>
    )
}