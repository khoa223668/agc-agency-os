import { useState } from 'react'
import { B, STATUS } from '../theme.js'


function Badge({text}){
  const c = STATUS[text] || B.textTer
  return <span style={{background:c+'15',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:'0.03em',whiteSpace:'nowrap',border:`1px solid ${c}25`}}>{text}</span>
}

function fmt(n){return Number(n||0).toLocaleString('vi-VN')}
function fmtS(n){n=Number(n||0);if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(0)+'K';return n.toString()}

const INP = {style:{width:'100%',padding:'9px 12px',border:`1.5px solid ${B.border}`,borderRadius:10,fontSize:12.5,fontFamily:"'Plus Jakarta Sans', sans-serif",background:'rgba(255,255,255,0.8)',color:B.text,outline:'none',boxSizing:'border-box',backdropFilter:'blur(8px)',transition:'border-color 0.2s, box-shadow 0.2s'}}

function Card({title,children,action,glow}){
  return <div className="glass-card" style={{border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 22px',marginBottom:16,boxShadow:glow?`0 4px 24px ${B.primaryGlow}, 0 1px 4px rgba(0,0,0,0.04)`:'0 1px 4px rgba(0,0,0,0.04)',position:'relative',overflow:'hidden'}}>
    {glow && <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:B.gradPrimary,borderRadius:'16px 16px 0 0'}}/>}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
      <span style={{fontSize:12.5,fontWeight:700,color:B.text,letterSpacing:'-0.01em'}}>{title}</span>{action}
    </div>
    {children}
  </div>
}

function Btn({children,onClick,primary,sm,danger,ghost,type,style:s}){
  if(primary) return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:'none',background:B.gradPrimary,color:'#fff',cursor:'pointer',fontSize:sm?10.5:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans', sans-serif",boxShadow:`0 3px 12px ${B.primaryGlow}`,letterSpacing:'0.01em',...s}}>{children}</button>
  if(danger) return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:`1.5px solid ${B.danger}30`,background:B.dangerBg,color:B.danger,cursor:'pointer',fontSize:sm?10.5:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans', sans-serif",...s}}>{children}</button>
  return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:`1.5px solid ${B.border}`,background:'rgba(255,255,255,0.7)',color:B.textSec,cursor:'pointer',fontSize:sm?10.5:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans', sans-serif",backdropFilter:'blur(8px)',...s}}>{children}</button>
}

function FG({label,children}){return <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:700,color:B.textSec,marginBottom:5,display:'block',letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}</label>{children}</div>}
function Row2({children}){return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>}
function Empty({children}){return <div style={{textAlign:'center',padding:'28px 0',color:B.textTer,fontSize:12,fontWeight:500}}>{children}</div>}

function Modal({title,children,onClose}){
  return <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="glass-card" style={{borderRadius:20,padding:'24px 28px',width:560,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15), 0 8px 32px rgba(0,0,0,0.1)',border:`1px solid ${B.border}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${B.border}`}}>
        <span style={{fontSize:16,fontWeight:800,color:B.navy,letterSpacing:'-0.02em'}}>{title}</span>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:B.textTer,fontSize:22,lineHeight:1,padding:'2px 6px',borderRadius:6}}>×</button>
      </div>
      {children}
    </div>
  </div>
}

function MFoot({onClose,onDelete}){
  return <div style={{display:'flex',justifyContent:'space-between',marginTop:18,paddingTop:16,borderTop:`1px solid ${B.border}`}}>
    <div>{onDelete&&<Btn danger onClick={onDelete}>Xóa</Btn>}</div>
    <div style={{display:'flex',gap:8}}><Btn onClick={onClose}>Huỷ</Btn><button type="submit" style={{padding:'8px 22px',borderRadius:9,border:'none',background:B.gradPrimary,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans', sans-serif",boxShadow:`0 3px 12px ${B.primaryGlow}`}}>Lưu</button></div>
  </div>
}

function inp(ex={}){return {...INP,...ex,style:{...INP.style,...(ex.style||{})}}}

// KK Logo
function Logo({size=36}){
  return <div style={{width:size,height:size,borderRadius:Math.round(size*0.28),background:B.gradPrimary,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px ${B.primaryGlow}`,flexShrink:0}}>
    <span style={{color:'#fff',fontWeight:900,fontSize:Math.round(size*0.38),fontFamily:"'Plus Jakarta Sans', sans-serif",letterSpacing:'-0.05em'}}>K</span>
  </div>
}

// Stat card with gradient accent
function StatCard({label,value,sub,color,icon}){
  return <div className="glass-card" style={{border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
    <div style={{position:'absolute',top:0,left:0,width:4,height:'100%',background:color||B.gradPrimary,borderRadius:'16px 0 0 16px'}}/>
    <div style={{paddingLeft:8}}>
      <div style={{fontSize:10,fontWeight:700,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{label}</div>
      <div style={{fontSize:24,fontWeight:900,color:B.text,letterSpacing:'-0.03em',lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:B.textTer,marginTop:5,fontWeight:500}}>{sub}</div>}
    </div>
  </div>
}

export default function App(){
  const [page,setPage]=useState('dashboard')
  const [data,setData]=useState({projects:[],clients:[],kols:[],team:[],invoices:[],deals:[],dealHistory:[],vendors:[],approvals:[]})
  const [loading,setLoading]=useState(true)
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const [currentUser,setCurrentUser]=useState(null)
  const [authReady,setAuthReady]=useState(false)

  useEffect(()=>{
    const stored = localStorage.getItem('kk_session')
    if(stored){try{setCurrentUser(JSON.parse(stored))}catch(e){}}
    setAuthReady(true)
    loadAll()
  },[])

  function handleLogin(session){setCurrentUser(session)}
  function handleLogout(){localStorage.removeItem('kk_session');setCurrentUser(null)}

  function canAccess(module){
    if(!currentUser) return false
    if(currentUser.isMaster) return true
    const p = currentUser.permissions?.[module]
    return p?.can_view||false
  }

  async function loadAll(){
    setLoading(true)
    const tables=['projects','clients','kols','team','invoices','deals','deal_history','vendors','approvals']
    const res=await Promise.all(tables.map(t=>supabase.from(t).select('*').order('created_at',{ascending:false})))
    setData({projects:res[0].data||[],clients:res[1].data||[],kols:res[2].data||[],team:res[3].data||[],invoices:res[4].data||[],deals:res[5].data||[],dealHistory:res[6].data||[],vendors:res[7].data||[],approvals:res[8].data||[]})
    setLoading(false)
  }
  async function add(t,r){const{error}=await supabase.from(t).insert([r]);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function upd(t,id,r){const{error}=await supabase.from(t).update(r).eq('id',id);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function del(t,id){if(!confirm('Xác nhận xóa?'))return;await supabase.from(t).delete().eq('id',id);await loadAll()}
  const log = async (msg) => { await supabase.from('audit_log').insert([{message:msg,role:'User'}]) }

  const NAV=[
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
  const visibleNAV = currentUser?.isMaster ? NAV : NAV.filter(n=>canAccess(n.id))
  const groups=[...new Set(visibleNAV.map(n=>n.grp))]
  const pending=data.approvals.filter(a=>a.status==='Pending').length
  const overdue=data.invoices.filter(i=>i.status==='Overdue').length

  if(!authReady) return null
  if(!currentUser) return <LoginScreen supabase={supabase} onLogin={handleLogin}/>

  if(loading)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:20,background:B.bgMesh,fontFamily:"'Plus Jakarta Sans', sans-serif"}}>
      <Logo size={64}/>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:18,fontWeight:800,color:B.navy,letterSpacing:'-0.03em'}}>K&K Advertising</div>
        <div style={{fontSize:12,color:B.textTer,marginTop:4,fontWeight:500}}>Loading Agency OS...</div>
      </div>
      <div style={{width:140,height:3,background:B.border,borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',width:'70%',background:B.gradPrimary,borderRadius:99}}/>
      </div>
    </div>
  )

  const P={data,add,upd,del,log,reload:loadAll,supabase}
  const supabase_client = supabase
  return(
    <div className="bg-animated-gradient" style={{display:'flex',height:'100vh',fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",overflow:'hidden'}}>
      {/* SIDEBAR */}
      <div className="glass-sidebar" style={{width:sidebarCollapsed?64:220,borderRight:`1px solid ${B.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,transition:'width 0.25s ease'}}>
        {/* Logo row */}
        <div style={{padding:'18px 16px 16px',borderBottom:`1px solid ${B.border}`,display:'flex',alignItems:'center',gap:12,justifyContent:sidebarCollapsed?'center':'flex-start'}}>
          <Logo size={36}/>
          {!sidebarCollapsed&&<div style={{minWidth:0}}>
            <div style={{fontWeight:900,fontSize:13.5,color:B.navy,letterSpacing:'-0.02em',whiteSpace:'nowrap'}}>K&K Advertising</div>
            <div style={{fontSize:10,fontWeight:600,color:B.accent,marginTop:1}}>Agency OS v2.0</div>
          </div>}
        </div>
        {/* Nav */}
        <div style={{flex:1,overflowY:'auto',padding:'8px 8px'}}>
          {groups.map(grp=>(
            <div key={grp}>
              {!sidebarCollapsed&&<div style={{padding:'12px 10px 4px',fontSize:9,fontWeight:800,color:B.textTer,letterSpacing:'0.1em'}}>{grp}</div>}
              {visibleNAV.filter(n=>n.grp===grp).map(n=>(
                <div key={n.id}
                  onClick={()=>setPage(n.id)}
                  title={sidebarCollapsed?n.label:''}
                  className={page===n.id?'active-indicator':''}
                  style={{padding:sidebarCollapsed?'10px':'8px 12px',cursor:'pointer',fontSize:12.5,color:page===n.id?B.primary:B.textSec,background:page===n.id?B.gradSoft:'transparent',borderRadius:10,fontWeight:page===n.id?700:500,display:'flex',alignItems:'center',justifyContent:sidebarCollapsed?'center':'space-between',transition:'all 0.15s',marginBottom:2,gap:10,border:page===n.id?`1px solid ${B.borderStrong}`:'1px solid transparent'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center'}} className={page===n.id?'icon-box-active':''}>
                      <span style={{fontSize:14,lineHeight:1,color:page===n.id?'#fff':B.textSec}}>{n.icon}</span>
                    </div>
                    {!sidebarCollapsed&&<span>{n.label}</span>}
                  </div>
                  {!sidebarCollapsed&&n.id==='approval'&&pending>0&&<span style={{background:B.danger,color:'#fff',fontSize:9,padding:'1px 6px',borderRadius:99,fontWeight:800}}>{pending}</span>}
                  {!sidebarCollapsed&&n.id==='invoices'&&overdue>0&&<span style={{background:B.warning,color:'#fff',fontSize:9,padding:'1px 6px',borderRadius:99,fontWeight:800}}>!</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Collapse btn */}
        <div style={{padding:'12px 8px',borderTop:`1px solid ${B.border}`}}>
          <button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)} style={{width:'100%',padding:'8px',borderRadius:9,border:`1px solid ${B.border}`,background:'transparent',cursor:'pointer',color:B.textTer,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans', sans-serif"}}>
            {sidebarCollapsed?'→':'←'}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Topbar */}
        <div className="glass-header" style={{height:56,borderBottom:`1px solid ${B.border}`,display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
          <span style={{flex:1,fontWeight:900,fontSize:16,color:B.navy,letterSpacing:'-0.02em'}}>{visibleNAV.find(n=>n.id===page)?.label||NAV.find(n=>n.id===page)?.label}</span>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:11,color:B.textTer,background:B.gradSoft,padding:'5px 12px',borderRadius:99,border:`1px solid ${B.border}`,fontWeight:600}}>
              {new Date().toLocaleDateString('vi-VN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:99,background:B.gradSoft,border:`1px solid ${B.border}`,cursor:'pointer'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:currentUser?.avatar_color||B.gradPrimary,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:10,fontWeight:900,boxShadow:`0 2px 8px rgba(26,86,219,0.25)`}}>
                {currentUser?.avatar_initials||'K'}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:B.navy,lineHeight:1}}>{currentUser?.name?.split(' ').slice(-1)[0]||'User'}</div>
                <div style={{fontSize:9,color:B.textTer,marginTop:1}}>{currentUser?.isMaster?'CEO':'Staff'}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{padding:'5px 12px',borderRadius:99,border:`1.5px solid ${B.border}`,background:'transparent',color:B.textTer,cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Đăng xuất</button>
          </div>
        </div>
        {/* Content */}
        <div style={{flex:1,overflow:'auto',padding:'20px 28px'}}>
          {page==='dashboard'&&<Dashboard {...P} setPage={setPage} currentUser={currentUser}/>}
          {page==='pipeline'&&<Pipeline {...P}/>}
          {page==='workflow'&&<WorkflowPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser} goTo={(p)=>setPage(p)}/>}
          {page==='projects'&&<Projects {...P}/>}
          {page==='pricing'&&<Pricing {...P}/>}
          {page==='invoices'&&<Invoices {...P}/>}
          {page==='approval'&&<Approval {...P}/>}
          {page==='clients'&&<Clients {...P}/>}
          {page==='kols'&&<Kols {...P}/>}
          {page==='vendors'&&<Vendors {...P}/>}
          {page==='team'&&<TeamPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='reports'&&<Reports {...P}/>}
          {page==='quotations'&&<Quotations data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='contracts'&&<Contracts data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='bbnt'&&<AcceptanceReports data={data} supabase={supabase} reload={loadAll} log={log}/>}
        </div>
      </div>
    </div>
  )
}

function StatusBadge(text){
  const SC={Active:'#059669',Completed:'#1A56DB','On Hold':'#D97706',Cancelled:'#DC2626',Pending:'#D97706',Pitching:'#94A3B8'}
  const c=SC[text]||'#94A3B8'
  return <span style={{background:c+'18',color:c,padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>
}

export { Badge, fmt, fmtS, Card, Btn, FG, Row2, Empty, Modal, MFoot, inp, Logo, StatCard, StatusBadge }
