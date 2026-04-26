import { Construction } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ComingSoon({ title = 'Page' }) {
  const navigate = useNavigate()
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px' }}>
      <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(37,99,235,0.25)' }}>
        <Construction size={28} color="#fff" />
      </div>
      <h2 style={{ fontSize:'22px', fontWeight:'700', color:'#1e293b', margin:0 }}>{title}</h2>
      <p style={{ fontSize:'14px', color:'#64748b', margin:0 }}>This page is under construction. Backend integration coming soon.</p>
      <button onClick={() => navigate(-1)} style={{ marginTop:'8px', padding:'9px 20px', fontSize:'13px', fontWeight:'600', border:'1px solid #e2e8f0', borderRadius:'10px', background:'#fff', color:'#475569', cursor:'pointer' }}>
        ← Go Back
      </button>
    </div>
  )
}
