import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { B, STATUS, PALETTE } from './theme.js'
import { fmt, fmtS, Badge, Btn, Card, FG, Row2, Modal, MFoot, inp, Logo, StatCard, StatusBadge, Empty } from './lib/helpers.jsx'
import { LoginScreen, MODULES, AVATAR_COLORS } from './components/Auth/LoginScreen.jsx'
import { simpleHash, getInitials } from './components/Auth/auth.js'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Pipeline from './components/Pipeline/Pipeline.jsx'
import Projects from './components/Projects/Projects.jsx'
import Pricing from './components/Pricing/Pricing.jsx'
import Invoices from './components/Invoices/Invoices.jsx'
import Approval from './components/Approval/Approval.jsx'
import Clients from './components/Clients/Clients.jsx'
import Kols from './components/KOLs/Kols.jsx'
import Vendors from './components/Vendors/Vendors.jsx'
import Team from './components/Team/Team.jsx'
import Reports from './components/Reports/Reports.jsx'
import Contracts from './components/Contracts/Contracts.jsx'
import AcceptanceReports from './components/Contracts/BBNT.jsx'
import TeamPage from './components/Team/TeamPage.jsx'
import { ImportBtn } from './components/Import/Import.jsx'
import Quotations from './components/Quotations/Quotations.jsx'
import WorkflowPage from './components/Workflow/WorkflowPage.jsx'

const NAV = [
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

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [data, setData] = useState({projects:[],clients:[],kols:[],team:[],invoices:[],deals:[],dealHistory:[],vendors:[],approvals:[]})
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('kk_session')
    if (stored) { try { setCurrentUser(JSON.parse(stored)) } catch(e) {} }
    setAuthReady(true)
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const tables = ['projects','clients','kols','team','invoices','deals','deal_history','vendors','approvals']
    const res = await Promise.all(tables.map(t => supabase.from(t).select('*').order('created_at',{ascending:false})))
    setData({projects:res[0].data||[],clients:res[1].data||[],kols:res[2].data||[],team:res[3].data||[],invoices:res[4].data||[],deals:res[5].data||[],dealHistory:res[6].data||[],vendors:res[7].data||[],approvals:res[8].data||[]})
    setLoading(false)
  }

  async function add(t,r){const{error}=await supabase.from(t).insert([r]);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function upd(t,id,r){const{error}=await supabase.from(t).update(r).eq('id',id);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function del(t,id){if(!confirm('Xác nhận xóa?'))return;await supabase.from(t).delete().eq('id',id);await loadAll()}
  const log = async(msg) => { await supabase.from('audit_log').insert([{message:msg,role:'User'}]) }

  function canAccess(module) {
    if (!currentUser) return false
    if (currentUser.isMaster) return true
    return currentUser.permissions?.[module]?.can_view || false
  }

  if (!authReady) return null
  if (!currentUser) return <LoginScreen supabase={supabase} onLogin={s => { setCurrentUser(s); localStorage.setItem('kk_session', JSON.stringify(s)) }}/>

  const visibleNAV = currentUser.isMaster ? NAV : NAV.filter(n => canAccess(n.id))
  const groups = [...new Set(visibleNAV.map(n => n.grp))]
  const pending = data.approvals.filter(a => a.status==='Pending').length
  const P = { data, add, upd, del, log, reload:loadAll, supabase }

  if (loading) return (
    <div className="flex items-center justify-center h-screen flex-col gap-6" style={{background:'#0D0F1A'}}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center glow-blue" style={{background:'linear-gradient(135deg,#4F8EF7,#00D4FF)'}}>
        <span className="text-white font-black text-2xl">K</span>
      </div>
      <div className="text-center">
        <div className="text-slate-100 font-black text-lg">K&K Advertising</div>
        <div className="text-slate-500 text-sm mt-1">Loading Agency OS...</div>
      </div>
      <div className="w-40 h-0.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
        <div className="h-full rounded-full" style={{width:'60%',background:'linear-gradient(90deg,#4F8EF7,#00D4FF)',animation:'loading-bar 1.5s ease-in-out infinite'}}/>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#0D0F1A'}}>
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(50)].map((_,i) => (
          <div key={i} className="absolute rounded-full animate-twinkle" style={{
            width: i%7===0 ? 2 : 1, height: i%7===0 ? 2 : 1,
            background: i%5===0 ? 'rgba(79,142,247,0.8)' : i%3===0 ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.3)',
            left: (i*37+13)%100+'%', top: (i*23+7)%100+'%',
            boxShadow: i%7===0 ? '0 0 4px rgba(79,142,247,0.8)' : 'none',
            animationDelay: (i%3*0.7)+'s', animationDuration: (2.5+i%3)+'s'
          }}/>
        ))}
        <div className="absolute" style={{top:'15%',left:'10%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,142,247,0.07),transparent 70%)'}}/>
        <div className="absolute" style={{bottom:'10%',right:'5%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,255,0.05),transparent 70%)'}}/>
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-10 flex flex-col border-r transition-all duration-300" style={{
        width: collapsed ? 70 : 240,
        background:'rgba(13,15,26,0.98)',borderColor:'rgba(255,255,255,0.06)',
        backdropFilter:'blur(20px)',flexShrink:0
      }}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b" style={{borderColor:'rgba(255,255,255,0.06)',justifyContent:collapsed?'center':'flex-start'}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 glow-blue" style={{background:'linear-gradient(135deg,#4F8EF7,#00D4FF)'}}>
            <span className="text-white font-black text-lg">K</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-black text-sm text-slate-100 truncate">K&K Advertising</div>
              <div className="text-xs font-semibold mt-0.5 tracking-wider" style={{color:'#00D4FF',fontSize:'0.6rem'}}>AGENCY OS v2.0</div>
            </div>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <span className="text-slate-500 text-sm">🔍</span>
              <span className="text-slate-500 text-xs">Search...</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-1">
          {!collapsed && <div className="px-2 py-2 text-xs font-black text-slate-600 tracking-widest">MENU: {visibleNAV.length}</div>}
          {groups.map(grp => (
            <div key={grp}>
              {!collapsed && <div className="px-2 py-2 text-slate-700 font-black tracking-widest" style={{fontSize:'0.6rem'}}>{grp}</div>}
              {visibleNAV.filter(n => n.grp===grp).map(n => {
                const isActive = page === n.id
                return (
                  <button key={n.id} onClick={() => setPage(n.id)} title={collapsed ? n.label : ''}
                    className="w-full flex items-center gap-2.5 rounded-xl mb-0.5 transition-all relative group"
                    style={{
                      padding: collapsed ? '10px 0' : '7px 8px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: isActive ? 'rgba(79,142,247,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif"
                    }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}>
                    {/* Active indicator */}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r glow-cyan" style={{background:'linear-gradient(180deg,#4F8EF7,#00D4FF)'}}/>}
                    {/* Icon box */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm transition-all" style={{
                      background: isActive ? 'linear-gradient(135deg,rgba(79,142,247,0.25),rgba(0,212,255,0.15))' : 'transparent',
                      boxShadow: isActive ? '0 0 12px rgba(79,142,247,0.25)' : 'none',
                      border: isActive ? '1px solid rgba(79,142,247,0.3)' : '1px solid transparent',
                    }}>
                      {n.icon}
                    </div>
                    {!collapsed && (
                      <span className="text-xs font-medium transition-colors" style={{color: isActive ? '#F1F5F9' : '#475569', fontWeight: isActive ? 700 : 500}}>
                        {n.label}
                      </span>
                    )}
                    {!collapsed && n.id==='approval' && pending>0 && (
                      <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{background:'linear-gradient(135deg,#EF4444,#F97316)',fontSize:'0.6rem',boxShadow:'0 0 8px rgba(239,68,68,0.5)'}}>{pending}</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto font-black text-white text-xs" style={{background:`linear-gradient(135deg,${currentUser?.avatar_color||'#4F8EF7'},#00D4FF)`,boxShadow:'0 0 12px rgba(79,142,247,0.3)'}}>
              {currentUser?.avatar_initials||'K'}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl transition-all" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',cursor:'pointer'}}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}>
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0" style={{background:`linear-gradient(135deg,${currentUser?.avatar_color||'#4F8EF7'},#00D4FF)`}}>
                {currentUser?.avatar_initials||'K'}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2" style={{borderColor:'#0D0F1A'}}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 font-bold text-xs truncate">{currentUser?.name?.split(' ').slice(-1)[0]||'Khoa'}</div>
                <div className="font-semibold mt-0.5" style={{color:'#00D4FF',fontSize:'0.55rem'}}>
                  {currentUser?.isMaster ? '● Premium member' : '● Staff'}
                </div>
              </div>
              <button onClick={() => { localStorage.removeItem('kk_session'); setCurrentUser(null) }}
                className="text-slate-600 hover:text-slate-400 transition-colors text-base p-1 rounded-lg hover:bg-white/5"
                style={{background:'none',border:'none',cursor:'pointer'}} title="Đăng xuất">⏏</button>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all z-20"
          style={{background:'#1A1F35',border:'1px solid rgba(255,255,255,0.1)',boxShadow:'0 2px 8px rgba(0,0,0,0.4)',fontSize:11,cursor:'pointer'}}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-1">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b" style={{background:'rgba(13,15,26,0.8)',borderColor:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)'}}>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-xs cursor-pointer hover:text-slate-400 transition-colors" onClick={() => setPage('dashboard')}>🏠 Home</span>
            <span className="text-slate-700 text-xs">›</span>
            <span className="text-xs font-bold" style={{color:'#4F8EF7'}}>{visibleNAV.find(n=>n.id===page)?.label||NAV.find(n=>n.id===page)?.label||'Dashboard'}</span>
            <span className="text-slate-700 text-xs">›</span>
            <span className="text-slate-500 text-xs">📅 {new Date().toLocaleDateString('vi-VN',{day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setPage('approval')}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all hover:bg-white/5"
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer'}}>
              🔔
              {pending > 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" style={{boxShadow:'0 0 6px rgba(239,68,68,0.8)'}}/>}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs" style={{background:`linear-gradient(135deg,${currentUser?.avatar_color||'#4F8EF7'},#00D4FF)`}}>
                {currentUser?.avatar_initials||'K'}
              </div>
              <div>
                <div className="text-slate-200 font-bold leading-none" style={{fontSize:'0.7rem'}}>{currentUser?.name?.split(' ').slice(-1)[0]||'Khoa'}</div>
                <div className="text-slate-500 mt-0.5" style={{fontSize:'0.55rem'}}>{currentUser?.isMaster?'CEO':'Staff'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {page==='dashboard'  && <Dashboard data={data} setPage={setPage} currentUser={currentUser}/>}
          {page==='pipeline'   && <Pipeline {...P}/>}
          {page==='workflow'   && <WorkflowPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='projects'   && <Projects {...P}/>}
          {page==='pricing'    && <Pricing {...P}/>}
          {page==='invoices'   && <Invoices {...P}/>}
          {page==='approval'   && <Approval {...P} currentUser={currentUser}/>}
          {page==='contracts'  && <Contracts data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='bbnt'       && <AcceptanceReports data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='clients'    && <Clients {...P}/>}
          {page==='kols'       && <Kols {...P}/>}
          {page==='vendors'    && <Vendors {...P}/>}
          {page==='team'       && <TeamPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='reports'    && <Reports {...P}/>}
          {page==='quotations' && <Quotations data={data} supabase={supabase} reload={loadAll} log={log}/>}
        </div>
      </main>
    </div>
  )
}
