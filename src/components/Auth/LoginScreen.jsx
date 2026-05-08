import { useState } from 'react'
import { B } from '../../theme.js'
import { simpleHash, getInitials } from './auth.js'
export const MODULES = [
  {id:'dashboard',label:'Dashboard',icon:'⬡',grp:'OVERVIEW'},
  {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
  {id:'workflow',label:'Công việc',icon:'⚡',grp:'OVERVIEW'},
  {id:'projects',label:'Dự án',icon:'◉',grp:'OPERATIONS'},
  {id:'pricing',label:'Pricing Engine',icon:'◎',grp:'OPERATIONS'},
  {id:'invoices',label:'Hóa đơn',icon:'▤',grp:'OPERATIONS'},
  {id:'approval',label:'Approvals',icon:'✦',grp:'OPERATIONS'},
  {id:'contracts',label:'Hợp đồng',icon:'📋',grp:'LEGAL'},
  {id:'bbnt',label:'Biên bản NT',icon:'✅',grp:'LEGAL'},
  {id:'clients',label:'Clients',icon:'◑',grp:'DATA'},
  {id:'kols',label:'KOL / KOC',icon:'◐',grp:'DATA'},
  {id:'vendors',label:'Vendors',icon:'◫',grp:'DATA'},
  {id:'team',label:'Team',icon:'◒',grp:'DATA'},
  {id:'reports',label:'Analytics',icon:'▨',grp:'INSIGHTS'},
  {id:'quotations',label:'Báo giá',icon:'💰',grp:'INSIGHTS'},
]
export const AVATAR_COLORS = ['#4F8EF7','#059669','#DC2626','#D97706','#7C3AED','#0891B2','#DB2777','#16A34A','#EA580C','#6366F1']

// ── LOGIN SCREEN ─────────────────────────────────────────
function LoginScreen({supabase, onLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check master account (CEO)
    if(email === 'admin@knk.com' && password === 'KnK@2026!') {
      const session = {
        id: 'master',
        name: 'Tô Nguyễn Đăng Khoa',
        email: 'admin@knk.com',
        role: 'CEO / Founder',
        isMaster: true,
        avatar_color: '#1A56DB',
        avatar_initials: 'KK',
        permissions: MODULES.reduce((acc,m)=>({...acc,[m.id]:{can_view:true,can_create:true,can_edit:true,can_delete:true}}),{})
      }
      localStorage.setItem('kk_session', JSON.stringify(session))
      onLogin(session)
      return
    }

    // Check team accounts
    const hash = simpleHash(password)
    const {data:accounts} = await supabase.from('team_accounts')
      .select('*, team(*)')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)

    if(!accounts?.length || accounts[0].password_hash !== hash) {
      setError('Email hoặc mật khẩu không đúng')
      setLoading(false)
      return
    }

    const acc = accounts[0]
    // Load permissions
    const {data:perms} = await supabase.from('permissions')
      .select('*').eq('team_account_id', acc.id)

    const permMap = {}
    perms?.forEach(p => { permMap[p.module] = p })

    const session = {
      id: acc.id,
      team_id: acc.team_id,
      name: acc.team?.name || email.split('@')[0],
      email: acc.email,
      role: acc.team?.role || 'Staff',
      isMaster: false,
      avatar_color: acc.avatar_color || '#1A56DB',
      avatar_initials: acc.avatar_initials || getInitials(acc.team?.name||email),
      avatar_url: acc.avatar_url,
      permissions: permMap
    }

    // Update last login
    await supabase.from('team_accounts').update({last_login: new Date().toISOString()}).eq('id', acc.id)
    localStorage.setItem('kk_session', JSON.stringify(session))
    onLogin(session)
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 30% 20%, rgba(26,86,219,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 50%), #F0F4FF',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {/* Background mesh */}
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'10%',left:'5%',width:400,height:400,borderRadius:'50%',background:'rgba(26,86,219,0.04)',filter:'blur(60px)'}}/>
        <div style={{position:'absolute',bottom:'10%',right:'5%',width:500,height:500,borderRadius:'50%',background:'rgba(6,182,212,0.05)',filter:'blur(80px)'}}/>
      </div>

      <div style={{width:420,position:'relative'}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#1A56DB,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 8px 32px rgba(26,86,219,0.3)'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:28,letterSpacing:'-0.05em'}}>K</span>
          </div>
          <div style={{fontSize:22,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em'}}>K&K Advertising</div>
          <div style={{fontSize:13,color:'#94A3B8',marginTop:4,fontWeight:500}}>Agency OS — Đăng nhập</div>
        </div>

        {/* Card */}
        <div style={{background:'rgba(255,255,255,0.92)',backdropFilter:'blur(20px)',borderRadius:20,padding:'32px 36px',border:'1px solid rgba(26,86,219,0.12)',boxShadow:'0 20px 60px rgba(26,86,219,0.1)'}}>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email</label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                placeholder="your@email.com"
                style={{width:'100%',padding:'11px 14px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:10,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'rgba(255,255,255,0.8)',color:'#0F172A',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#1A56DB'}
                onBlur={e=>e.target.style.borderColor='rgba(26,86,219,0.15)'}
              />
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Mật khẩu</label>
              <input
                type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{width:'100%',padding:'11px 14px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:10,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'rgba(255,255,255,0.8)',color:'#0F172A',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#1A56DB'}
                onBlur={e=>e.target.style.borderColor='rgba(26,86,219,0.15)'}
              />
            </div>
            {error&&<div style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#DC2626',marginBottom:18,fontWeight:500}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 4px 16px rgba(26,86,219,0.3)',opacity:loading?0.7:1}}>
              {loading?'Đang đăng nhập...':'Đăng nhập →'}
            </button>
          </form>
          <div style={{marginTop:20,padding:'12px 14px',background:'rgba(26,86,219,0.04)',borderRadius:8,fontSize:11,color:'#94A3B8',textAlign:'center'}}>
            Tài khoản CEO: <strong style={{color:'#1A56DB'}}>admin@knk.com</strong> / <strong style={{color:'#1A56DB'}}>KnK@2026!</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export { LoginScreen }
