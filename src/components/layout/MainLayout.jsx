import { Outlet } from 'react-router-dom'
import TopNavbar from './TopNavbar'

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3EBF4', display: 'flex', flexDirection: 'column' }}>
      <TopNavbar />
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '28px 24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
