import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// K&K Advertising — Futuristic Light Theme
const B = {
  // Core brand
  primary: '#1A56DB',
  primaryGlow: 'rgba(26,86,219,0.15)',
  accent: '#06B6D4',
  accentGlow: 'rgba(6,182,212,0.15)',
  navy: '#0F172A',
  // Gradients
  gradPrimary: 'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',
  gradSoft: 'linear-gradient(135deg, rgba(26,86,219,0.08) 0%, rgba(6,182,212,0.08) 100%)',
  gradCard: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
  // Neutrals
  bg: '#F0F4FF',
  bgMesh: 'radial-gradient(ellipse at 20% 20%, rgba(26,86,219,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #F0F4FF',
  white: '#FFFFFF',
  surface: 'rgba(255,255,255,0.8)',
  border: 'rgba(26,86,219,0.1)',
  borderStrong: 'rgba(26,86,219,0.2)',
  // Text
  text: '#0F172A',
  textSec: '#475569',
  textTer: '#94A3B8',
  // Status
  success: '#059669',
  successBg: 'rgba(5,150,105,0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.08)',
  danger: '#DC2626',
  dangerBg: 'rgba(220,38,38,0.08)',
  info: '#1A56DB',
  infoBg: 'rgba(26,86,219,0.08)',
}

const STATUS = {
  Active: B.success, Completed: B.primary, 'On Hold': B.warning,
  Cancelled: B.danger, Pitching: B.textTer, Lead: B.textTer,
  Negotiation: B.info, Won: B.success, Lost: B.danger,
  Paid: B.success, Unpaid: B.warning, Partial: B.info,
  Overdue: B.danger, Pending: B.warning, Approved: B.success,
  Rejected: B.danger, Active2: B.success, Booked: B.warning,
  Accepted: B.success
}

const PALETTE = ['#1A56DB','#059669','#DC2626','#D97706','#7C3AED','#0891B2']

function Badge({text}){
  const c = STATUS[text] || B.textTer
  return <span style={{background:c+'15',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:'0.03em',whiteSpace:'nowrap',border:`1px solid ${c}25`}}>{text}</span>
}

function fmt(n){return Number(n||0).toLocaleString('vi-VN')}
function fmtS(n){n=Number(n||0);if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(0)+'K';return n.toString()}

const INP = {style:{width:'100%',padding:'9px 12px',border:`1.5px solid ${B.border}`,borderRadius:10,fontSize:12.5,fontFamily:"'Plus Jakarta Sans', sans-serif",background:'rgba(255,255,255,0.8)',color:B.text,outline:'none',boxSizing:'border-box',backdropFilter:'blur(8px)',transition:'border-color 0.2s, box-shadow 0.2s'}}

function Card({title,children,action,glow}){
  return <div style={{background:B.gradCard,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 22px',marginBottom:16,boxShadow:glow?`0 4px 24px ${B.primaryGlow}, 0 1px 4px rgba(0,0,0,0.04)`:'0 1px 4px rgba(0,0,0,0.04)',position:'relative',overflow:'hidden'}}>
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
    <div style={{background:'rgba(255,255,255,0.97)',backdropFilter:'blur(20px)',borderRadius:20,padding:'24px 28px',width:560,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15), 0 8px 32px rgba(0,0,0,0.1)',border:`1px solid ${B.border}`}}>
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
  return <div style={{background:B.gradCard,backdropFilter:'blur(20px)',border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
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
  async function add(t,r){const{error}=await supabase.from(t).insert([r]);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}

  const NAV=[
    {id:'dashboard',label:'Dashboard',icon:'⬡',grp:'OVERVIEW'},
    {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
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

  const P={data,add,upd,del,log}
  const supabase_client = supabase
  return(
    <div style={{display:'flex',height:'100vh',fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",background:B.bgMesh,overflow:'hidden'}}>
      {/* SIDEBAR */}
      <div style={{width:sidebarCollapsed?64:220,background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRight:`1px solid ${B.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,transition:'width 0.25s ease',boxShadow:'4px 0 24px rgba(26,86,219,0.06)'}}>
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
              {NAV.filter(n=>n.grp===grp).map(n=>(
                <div key={n.id} onClick={()=>setPage(n.id)}
                  title={sidebarCollapsed?n.label:''}
                  style={{padding:sidebarCollapsed?'10px':'8px 12px',cursor:'pointer',fontSize:12.5,color:page===n.id?B.primary:B.textSec,background:page===n.id?B.gradSoft:'transparent',borderRadius:10,fontWeight:page===n.id?700:500,display:'flex',alignItems:'center',justifyContent:sidebarCollapsed?'center':'space-between',transition:'all 0.15s',marginBottom:2,gap:10,border:page===n.id?`1px solid ${B.borderStrong}`:'1px solid transparent'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:14,lineHeight:1}}>{n.icon}</span>
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
        <div style={{height:56,background:'rgba(255,255,255,0.8)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${B.border}`,display:'flex',alignItems:'center',padding:'0 24px',gap:16,boxShadow:'0 1px 0 rgba(26,86,219,0.06)'}}>
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
          {page==='dashboard'&&<Dashboard {...P} setPage={setPage}/>}
          {page==='pipeline'&&<Pipeline {...P}/>}
          {page==='projects'&&<Projects {...P}/>}
          {page==='pricing'&&<Pricing {...P}/>}
          {page==='invoices'&&<Invoices {...P}/>}
          {page==='approval'&&<Approval {...P}/>}
          {page==='clients'&&<Clients {...P}/>}
          {page==='kols'&&<Kols {...P}/>}
          {page==='vendors'&&<Vendors {...P}/>}
          {page==='team'&&<TeamPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='reports'&&<Reports {...P}/>}
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

function Dashboard({data,setPage,currentUser}){
  const rev=data.projects.reduce((a,p)=>a+Number(p.revenue||0),0)
  const cost=data.projects.reduce((a,p)=>a+Number(p.actual_cost||0),0)
  const profit=rev-cost
  const margin=rev?Math.round(profit/rev*100):0
  const active=data.projects.filter(p=>p.status==='Active').length
  const overdue=data.invoices.filter(i=>i.status==='Overdue')
  const pending=data.approvals.filter(a=>a.status==='Pending')
  const won=data.deals.filter(d=>d.stage==='Won').length
  const wr=data.deals.length?Math.round(won/data.deals.length*100):0
  const svcs=['KOL/KOC','Performance','Creative','Event','PR','Consulting']
  const now=new Date()
  const hour=now.getHours()
  const greeting=hour<12?'Chào buổi sáng':hour<18?'Chào buổi chiều':'Chào buổi tối'
  const name=currentUser?.name?.split(' ').slice(-1)[0]||'K'

  // Monthly revenue chart data
  const byM=Array(12).fill(0)
  data.projects.forEach(p=>{if(p.start_date){const m=new Date(p.start_date).getMonth();byM[m]+=Number(p.revenue||0)}})
  const maxM=Math.max(...byM,1)

  return(
    <div>
      {/* Hero greeting banner */}
      <div style={{background:'linear-gradient(135deg,#0F172A 0%,#1A56DB 60%,#06B6D4 100%)',borderRadius:20,padding:'28px 32px',marginBottom:20,position:'relative',overflow:'hidden',boxShadow:'0 8px 40px rgba(26,86,219,0.3)'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
        <div style={{position:'absolute',bottom:-60,right:80,width:300,height:300,borderRadius:'50%',background:'rgba(6,182,212,0.08)'}}/>
        <div style={{position:'absolute',top:20,right:200,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.03)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',fontWeight:500,marginBottom:6}}>{greeting},</div>
          <div style={{fontSize:26,fontWeight:900,color:'#fff',letterSpacing:'-0.03em',marginBottom:4}}>{name} 👋</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',fontWeight:500}}>
            {now.toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            {pending.length>0&&<span style={{marginLeft:12,background:'rgba(220,38,38,0.3)',color:'#fca5a5',padding:'2px 10px',borderRadius:99,fontSize:11,fontWeight:600}}>⚡ {pending.length} approval đang chờ</span>}
            {overdue.length>0&&<span style={{marginLeft:8,background:'rgba(217,119,6,0.3)',color:'#fcd34d',padding:'2px 10px',borderRadius:99,fontSize:11,fontWeight:600}}>⚠️ {overdue.length} công nợ quá hạn</span>}
          </div>
        </div>
        {/* Quick stats inline */}
        <div style={{display:'flex',gap:24,marginTop:20,position:'relative',zIndex:1}}>
          {[['Revenue YTD',fmtS(rev)+' VND'],['Profit',fmtS(profit)+' VND'],['Margin',margin+'%'],['Win Rate',wr+'%'],['Active Projects',active+'']].map(([l,v])=>(
            <div key={l}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</div>
              <div style={{fontSize:18,fontWeight:900,color:'#fff',marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Grid — 6 cards full width */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:20}}>
        {[
          ['TOTAL REVENUE',fmtS(rev),'VND',B.primary,'linear-gradient(135deg,rgba(26,86,219,0.1),rgba(6,182,212,0.1))'],
          ['TOTAL PROFIT',fmtS(profit),margin+'% margin',B.success,'rgba(5,150,105,0.08)'],
          ['ACTIVE PROJECTS',active,data.projects.length+' tổng','#7C3AED','rgba(124,58,237,0.08)'],
          ['KOL DATABASE',data.kols.length,'contacts',B.accent,'rgba(6,182,212,0.08)'],
          ['CLIENTS',data.clients.length,'đang hợp tác',B.primary,'rgba(26,86,219,0.06)'],
          ['CÔNG NỢ QH',overdue.length,overdue.length?'Cần xử lý':'Ổn ✓',overdue.length?B.danger:B.success,overdue.length?'rgba(220,38,38,0.06)':'rgba(5,150,105,0.06)'],
        ].map(([l,v,s,c,bg])=>(
          <div key={l} style={{background:bg,borderRadius:14,padding:'16px 18px',border:`1px solid ${c}20`,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-10,right:-10,width:60,height:60,borderRadius:'50%',background:c+'08'}}/>
            <div style={{fontSize:9,fontWeight:800,color:c,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{l}</div>
            <div style={{fontSize:24,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em',lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,color:'#94A3B8',marginTop:5,fontWeight:500}}>{s}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1.2fr 1fr',gap:14,marginBottom:14}}>
        {/* Revenue chart */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Revenue theo tháng — 2026</div>
            <div style={{fontSize:11,color:'#94A3B8',fontWeight:500}}>VND</div>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:120}}>
            {['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'].map((m,i)=>{
              const h=byM[i]?Math.max(8,Math.round(byM[i]/maxM*100)):4
              const isNow=i===now.getMonth()
              return <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{width:'100%',height:h+'%',background:isNow?'linear-gradient(180deg,#1A56DB,#06B6D4)':byM[i]?'rgba(26,86,219,0.25)':'rgba(26,86,219,0.08)',borderRadius:'4px 4px 0 0',minHeight:4,transition:'height 0.3s',border:isNow?'none':'none'}}/>
                <div style={{fontSize:9,color:isNow?'#1A56DB':'#94A3B8',fontWeight:isNow?800:500}}>{m}</div>
              </div>
            })}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:12,padding:'10px 0',borderTop:'1px solid rgba(26,86,219,0.06)'}}>
            {[['Tổng',fmtS(rev)],['Tháng này',fmtS(byM[now.getMonth()])],['Avg/tháng',fmtS(Math.round(rev/12))]].map(([l,v])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'#94A3B8',fontWeight:600,textTransform:'uppercase'}}>{l}</div>
                <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Service breakdown */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:16}}>Revenue theo Service</div>
          {svcs.map((s,i)=>{
            const r=data.projects.filter(p=>p.service===s).reduce((a,p)=>a+Number(p.revenue||0),0)
            const pct=rev?Math.round(r/rev*100):0
            return <div key={s} style={{marginBottom:11}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,marginBottom:4}}>
                <span style={{fontWeight:600,color:'#0F172A'}}>{s}</span>
                <span style={{color:PALETTE[i],fontWeight:700}}>{pct}%</span>
              </div>
              <div style={{height:6,background:'rgba(26,86,219,0.07)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:pct+'%',background:PALETTE[i],borderRadius:99,transition:'width 0.5s ease'}}/>
              </div>
            </div>
          })}
        </div>

        {/* Activity feed */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:16}}>Hoạt động gần đây</div>
          {data.projects.slice(0,6).map(p=>(
            <div key={p.id} style={{display:'flex',gap:10,marginBottom:12,alignItems:'flex-start'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:p.status==='Active'?B.success:p.status==='Completed'?B.primary:B.warning,marginTop:5,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11.5,fontWeight:600,color:'#0F172A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.campaign||'—'}</div>
                <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{p.client||'—'} · {fmtS(p.revenue)}</div>
              </div>
            </div>
          ))}
          {!data.projects.length&&<div style={{textAlign:'center',padding:'20px 0',color:'#94A3B8',fontSize:12}}>Chưa có dự án</div>}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
        {/* Recent projects */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Dự án gần đây</div>
            <button onClick={()=>setPage('projects')} style={{fontSize:11,color:B.primary,background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xem tất →</button>
          </div>
          {data.projects.slice(0,4).map(p=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
              <div style={{flex:1,minWidth:0,marginRight:8}}>
                <div style={{fontWeight:700,fontSize:12,color:'#0F172A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.campaign||'—'}</div>
                <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{p.client||'—'}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:800,color:B.primary}}>{fmtS(p.revenue)}</div>
                <div style={{marginTop:2}}>{StatusBadge(p.status)}</div>
              </div>
            </div>
          ))}
          {!data.projects.length&&<div style={{textAlign:'center',padding:'16px 0',color:'#94A3B8',fontSize:12}}>Chưa có dự án</div>}
        </div>

        {/* Overdue invoices */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Công nợ quá hạn</div>
            <button onClick={()=>setPage('invoices')} style={{fontSize:11,color:B.primary,background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Chi tiết →</button>
          </div>
          {overdue.slice(0,4).map(i=>(
            <div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
              <span style={{fontSize:12,fontWeight:600,color:'#0F172A'}}>{i.client}</span>
              <span style={{fontSize:12,fontWeight:800,color:B.danger}}>{fmtS(Number(i.amount)-Number(i.paid))}</span>
            </div>
          ))}
          {!overdue.length&&<div style={{textAlign:'center',padding:'20px 0',color:B.success,fontSize:12,fontWeight:600}}>Không có công nợ quá hạn 🎉</div>}
        </div>

        {/* Approvals + Pipeline */}
        <div style={{background:'rgba(255,255,255,0.92)',borderRadius:16,padding:'20px 22px',border:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Approvals & Pipeline</div>
            <button onClick={()=>setPage('approval')} style={{fontSize:11,color:B.primary,background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xử lý →</button>
          </div>
          {pending.slice(0,3).map(a=>(
            <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
              <div style={{flex:1,minWidth:0,marginRight:8}}>
                <div style={{fontSize:11.5,fontWeight:600,color:'#0F172A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</div>
                <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{a.type}</div>
              </div>
              {StatusBadge('Pending')}
            </div>
          ))}
          {!pending.length&&<div style={{fontSize:12,color:B.success,fontWeight:600,padding:'6px 0'}}>Queue trống ✓</div>}
          <div style={{marginTop:12,padding:'10px 0',borderTop:'1px solid rgba(26,86,219,0.06)'}}>
            <div style={{fontSize:10,color:'#94A3B8',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>Deal Funnel</div>
            <div style={{display:'flex',gap:6}}>
              {['Lead','Pitching','Negotiation','Won'].map(stage=>{
                const cnt=data.deals.filter(d=>d.stage===stage).length
                const stageC={Lead:'#94A3B8',Pitching:B.primary,Negotiation:B.warning,Won:B.success}
                return <div key={stage} style={{flex:1,textAlign:'center',padding:'6px 4px',background:stageC[stage]+'12',borderRadius:8,border:`1px solid ${stageC[stage]}20`}}>
                  <div style={{fontSize:16,fontWeight:900,color:stageC[stage]}}>{cnt}</div>
                  <div style={{fontSize:9,color:'#94A3B8',marginTop:1,fontWeight:600}}>{stage}</div>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pipeline({data,add,upd,del,log}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(null)
  const stages=['Lead','Pitching','Negotiation','Won','Lost']
  const stageColor={Lead:B.textTer,Pitching:B.primary,Negotiation:B.warning,Won:B.success,Lost:B.danger}
  async function save(e){
    e.preventDefault();const fd=new FormData(e.target)
    const r={client:fd.get('client'),service:fd.get('service'),value:Number(fd.get('value')||0),stage:fd.get('stage'),pm:fd.get('pm'),notes:fd.get('notes'),deal_date:new Date().toLocaleDateString('vi-VN')}
    edit?await upd('deals',edit.id,r):await add('deals',r)
    setEdit(null);setShowAdd(null)
  }
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Deal Pipeline</h2><Btn primary onClick={()=>setShowAdd('Lead')}>+ New Deal</Btn></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
        {stages.map(stage=>{
          const deals=data.deals.filter(d=>d.stage===stage),tot=deals.reduce((a,d)=>a+Number(d.value||0),0)
          return <div key={stage} style={{background:'rgba(255,255,255,0.6)',backdropFilter:'blur(12px)',borderRadius:14,padding:12,border:`1px solid ${B.border}`,borderTop:`3px solid ${stageColor[stage]}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
              <span style={{fontSize:11,fontWeight:800,color:stageColor[stage],textTransform:'uppercase',letterSpacing:'0.04em'}}>{stage}</span>
              <span style={{fontSize:10,color:B.textTer,background:B.border,padding:'2px 7px',borderRadius:99,fontWeight:600}}>{deals.length}</span>
            </div>
            <div style={{fontSize:12,fontWeight:800,color:B.primary,marginBottom:10}}>{fmtS(tot)}</div>
            {deals.map(d=><div key={d.id} onClick={()=>setEdit(d)} style={{background:'rgba(255,255,255,0.9)',border:`1px solid ${B.border}`,borderRadius:10,padding:'10px 12px',marginBottom:7,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',transition:'transform 0.15s, box-shadow 0.15s'}}>
              <div style={{fontWeight:700,fontSize:11.5,marginBottom:3,color:B.text}}>{d.client||'—'}</div>
              <div style={{fontSize:10,color:B.textTer,marginBottom:6}}>{d.service||'—'}</div>
              <div style={{fontWeight:800,fontSize:12,color:B.primary}}>{fmtS(d.value)}</div>
            </div>)}
            <button onClick={()=>setShowAdd(stage)} style={{width:'100%',padding:'7px',border:`1.5px dashed ${B.borderStrong}`,borderRadius:9,background:'none',cursor:'pointer',fontSize:11,color:B.textTer,fontFamily:"'Plus Jakarta Sans', sans-serif",fontWeight:600}}>+ Add</button>
          </div>
        })}
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Update Deal':'New Deal'} onClose={()=>{setShowAdd(null);setEdit(null)}}><form onSubmit={save}>
        <FG label="Client"><input name="client" defaultValue={edit?.client||''} required {...inp()}/></FG>
        <Row2><FG label="Service"><select name="service" defaultValue={edit?.service||'KOL/KOC'} {...inp()}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Package</option></select></FG><FG label="Value (VND)"><input name="value" type="number" defaultValue={edit?.value||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Stage"><select name="stage" defaultValue={edit?.stage||showAdd||'Lead'} {...inp()}><option>Lead</option><option>Pitching</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></FG><FG label="PM"><select name="pm" defaultValue={edit?.pm||''} {...inp()}><option value="">—</option>{data.team.map(t=><option key={t.id}>{t.name}</option>)}</select></FG></Row2>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setShowAdd(null);setEdit(null)}} onDelete={edit?()=>{del('deals',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
    </div>
  )
}

function Projects({data,add,upd,del,log}){
  const [search,setSearch]=useState('')
  const [stF,setStF]=useState('')
  const [svF,setSvF]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const filtered=data.projects.filter(p=>(!search||(p.client+''+p.campaign).toLowerCase().includes(search.toLowerCase()))&&(!stF||p.status===stF)&&(!svF||p.service===svF))
  async function save(e){
    e.preventDefault();const fd=new FormData(e.target)
    const r={project_code:fd.get('code'),client:fd.get('client'),campaign:fd.get('campaign'),service:fd.get('service'),pm:fd.get('pm'),budget_plan:Number(fd.get('budget_plan')||0),actual_cost:Number(fd.get('actual_cost')||0),revenue:Number(fd.get('revenue')||0),start_date:fd.get('start_date')||null,end_date:fd.get('end_date')||null,status:fd.get('status'),kols:fd.get('kols').split(',').map(s=>s.trim()).filter(Boolean),vendors:fd.get('vendors').split(',').map(s=>s.trim()).filter(Boolean),notes:fd.get('notes')}
    edit?await upd('projects',edit.id,r):await add('projects',r)
    log((edit?'Cập nhật':'Thêm')+': '+r.campaign);setEdit(null);setShowAdd(false)
  }
  const totRev=filtered.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totProfit=filtered.reduce((a,p)=>a+Number(p.revenue||0)-Number(p.actual_cost||0),0)
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Quản lý dự án</h2><Btn primary onClick={()=>setShowAdd(true)}>+ Dự án mới</Btn></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        {[['Dự án',filtered.length,'',B.primary],['Revenue',fmtS(totRev),'VND',B.accent],['Profit',fmtS(totProfit),'',B.success],['Avg Margin',totRev?Math.round(totProfit/totRev*100)+'%':'—','','#7C3AED']].map(([l,v,s,c])=>(
          <StatCard key={l} label={l} value={v} sub={s} color={c}/>
        ))}
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16}}>
        <input placeholder="🔍  Search projects..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:240}})}/>
        <select value={stF} onChange={e=>setStF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Status</option><option>Active</option><option>Completed</option><option>On Hold</option><option>Cancelled</option></select>
        <select value={svF} onChange={e=>setSvF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Services</option><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select>
      </div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:950}}>
          <thead><tr>{['ID','Client','Campaign','Service','PM','Budget','Actual','Revenue','Margin','Status','Deadline',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>{
              const m=Number(p.revenue)?Math.round((Number(p.revenue)-Number(p.actual_cost))/Number(p.revenue)*100):0
              const bv=Number(p.budget_plan)?Math.round((Number(p.actual_cost)-Number(p.budget_plan))/Number(p.budget_plan)*100):0
              return <tr key={p.id} style={{transition:'background 0.1s'}}>
                <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:600}}>{p.project_code||'—'}</td>
                <td style={{...TD,fontWeight:800,color:B.text,fontSize:12.5}}>{p.client||'—'}</td>
                <td style={{...TD,fontSize:12}}>{p.campaign||'—'}</td>
                <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{p.service||'—'}</span></td>
                <td style={{...TD,fontSize:11,color:B.textSec}}>{p.pm||'—'}</td>
                <td style={{...TD,fontSize:11}}>{fmtS(p.budget_plan)}</td>
                <td style={{...TD,fontSize:11,fontWeight:600,color:bv>10?B.danger:bv>0?B.warning:B.success}}>{fmtS(p.actual_cost)}{p.budget_plan?<span style={{fontSize:9,marginLeft:3}}>({bv}%)</span>:''}</td>
                <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{fmtS(p.revenue)}</td>
                <td style={{...TD,fontWeight:800,color:m>=30?B.success:m>=15?B.warning:B.danger}}>{Number(p.revenue)?m+'%':'—'}</td>
                <td style={TD}><Badge text={p.status}/></td>
                <td style={{...TD,fontSize:10,color:B.textTer}}>{p.end_date||'—'}</td>
                <td style={TD}><Btn sm onClick={()=>setEdit(p)}>Edit</Btn></td>
              </tr>
            })}
            {!filtered.length&&<tr><td colSpan={12} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No projects found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Project':'New Project'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <Row2><FG label="Project Code"><input name="code" defaultValue={edit?.project_code||'KK-'+String(data.projects.length+1).padStart(3,'0')} {...inp()}/></FG><FG label="Client"><input name="client" defaultValue={edit?.client||''} list="cl-list" required {...inp()}/><datalist id="cl-list">{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</datalist></FG></Row2>
        <FG label="Campaign Name"><input name="campaign" defaultValue={edit?.campaign||''} required {...inp()}/></FG>
        <Row2><FG label="Service"><select name="service" defaultValue={edit?.service||'KOL/KOC'} {...inp()}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG><FG label="PM"><select name="pm" defaultValue={edit?.pm||''} {...inp()}><option value="">—</option>{data.team.map(t=><option key={t.id}>{t.name}</option>)}</select></FG></Row2>
        <Row2><FG label="Budget Plan (VND)"><input name="budget_plan" type="number" defaultValue={edit?.budget_plan||0} {...inp()}/></FG><FG label="Actual Cost (VND)"><input name="actual_cost" type="number" defaultValue={edit?.actual_cost||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Revenue (VND)"><input name="revenue" type="number" defaultValue={edit?.revenue||0} {...inp()}/></FG><FG label="Status"><select name="status" defaultValue={edit?.status||'Active'} {...inp()}><option>Active</option><option>Pitching</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select></FG></Row2>
        <Row2><FG label="Start Date"><input name="start_date" type="date" defaultValue={edit?.start_date||''} {...inp()}/></FG><FG label="Deadline"><input name="end_date" type="date" defaultValue={edit?.end_date||''} {...inp()}/></FG></Row2>
        <FG label="KOLs (comma separated)"><input name="kols" defaultValue={(edit?.kols||[]).join(', ')} {...inp()}/></FG>
        <FG label="Vendors"><input name="vendors" defaultValue={(edit?.vendors||[]).join(', ')} {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('projects',edit.id);setEdit(null);setShowAdd(false)}:null}/>
      </form></Modal>}
    </div>
  )
}

function Pricing({data,add,log}){
  const [I,setI]=useState({budget:0,margin:30,service:'KOL/KOC',client:''})
  const [sc,setSc]=useState([{tier:'Macro',platform:'TikTok',num:2,cost:8000000},{tier:'Micro',platform:'Instagram',num:5,cost:3000000}])
  const s=(k,v)=>setI(p=>({...p,[k]:v}))
  const kt=sc.reduce((a,s)=>a+Number(s.num||0)*Number(s.cost||0),0)
  const tc=kt+Number(I.prod||0)+Number(I.ads||0)+Number(I.ops||0)+Number(I.other||0)
  const mg=Number(I.margin||0)/100
  const rp=mg<1?Math.round(tc/(1-mg)):0
  const pr=rp-tc,am=rp?Math.round(pr/rp*100):0,gap=Number(I.budget||0)-rp,ok=rp>0&&rp<=Number(I.budget||0)
  async function saveH(){if(!rp){alert('Nhập dữ liệu trước');return}if(!I.client){alert('Nhập tên client');return}await add('deal_history',{client:I.client,service:I.service,price:rp,margin:am,decision:ok?'Accepted':'Rejected',deal_date:new Date().toLocaleDateString('vi-VN')});log('Deal: '+I.client);alert('Đã lưu!')}
  async function saveA(){if(!rp){alert('Nhập dữ liệu trước');return}if(!I.client){alert('Nhập tên client');return}await add('approvals',{type:'Quote',title:'Quote: '+I.client+' — '+fmtS(rp)+' VND',submitted_by:'User',status:'Pending',price:rp,approval_date:new Date().toLocaleDateString('vi-VN'),notes:''});log('Gửi duyệt: '+I.client);alert('Gửi thành công!')}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Pricing Engine</h2><div style={{display:'flex',gap:8}}><Btn sm onClick={saveA}>Gửi duyệt</Btn><Btn sm primary onClick={saveH}>Lưu Deal</Btn></div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div>
          <Card title="Input Parameters" glow>
            <Row2><FG label="Client Budget (VND)"><input type="number" value={I.budget} onChange={e=>s('budget',e.target.value)} {...inp()}/></FG><FG label="Target Margin (%)"><input type="number" value={I.margin} onChange={e=>s('margin',e.target.value)} {...inp()}/></FG></Row2>
            <FG label="Service Type"><select value={I.service} onChange={e=>s('service',e.target.value)} {...inp()}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG>
            <FG label="Client Name"><input type="text" value={I.client} onChange={e=>s('client',e.target.value)} placeholder="Tên client..." {...inp()}/></FG>
            <div style={{height:1,background:B.border,margin:'10px 0'}}/>
            <Row2><FG label="Số KOL/KOC"><input type="number" value={I.kolNum||0} onChange={e=>s('kolNum',e.target.value)} {...inp()}/></FG><FG label="Avg Cost/KOL"><input type="number" value={I.kolCost||0} onChange={e=>s('kolCost',e.target.value)} {...inp()}/></FG></Row2>
            <Row2><FG label="Production"><input type="number" value={I.prod||0} onChange={e=>s('prod',e.target.value)} {...inp()}/></FG><FG label="Ads/Seeding"><input type="number" value={I.ads||0} onChange={e=>s('ads',e.target.value)} {...inp()}/></FG></Row2>
            <Row2><FG label="Agency Ops"><input type="number" value={I.ops||0} onChange={e=>s('ops',e.target.value)} {...inp()}/></FG><FG label="Other"><input type="number" value={I.other||0} onChange={e=>s('other',e.target.value)} {...inp()}/></FG></Row2>
          </Card>
          <Card title="KOL Scenario Planner" action={<Btn sm onClick={()=>setSc(p=>[...p,{tier:'Micro',platform:'TikTok',num:0,cost:0}])}>+ Tier</Btn>}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['Tier','Platform','Qty','Cost/KOL','Total',''].map(h=><th key={h} style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
              <tbody>
                {sc.map((s,i)=>(
                  <tr key={i}>
                    <td style={{padding:'5px 6px'}}><input value={s.tier} onChange={e=>{const n=[...sc];n[i]={...n[i],tier:e.target.value};setSc(n)}} style={{width:70,...INP.style,padding:'5px 8px'}}/></td>
                    <td style={{padding:'5px 6px'}}><select value={s.platform} onChange={e=>{const n=[...sc];n[i]={...n[i],platform:e.target.value};setSc(n)}} style={{width:100,...INP.style,padding:'5px 8px'}}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></td>
                    <td style={{padding:'5px 6px'}}><input type="number" value={s.num} onChange={e=>{const n=[...sc];n[i]={...n[i],num:e.target.value};setSc(n)}} style={{width:55,...INP.style,padding:'5px 8px'}}/></td>
                    <td style={{padding:'5px 6px'}}><input type="number" value={s.cost} onChange={e=>{const n=[...sc];n[i]={...n[i],cost:e.target.value};setSc(n)}} style={{width:95,...INP.style,padding:'5px 8px'}}/></td>
                    <td style={{padding:'5px 6px',fontWeight:800,fontSize:11,color:B.primary}}>{fmtS(Number(s.num||0)*Number(s.cost||0))}</td>
                    <td><button onClick={()=>setSc(p=>p.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:B.danger,fontSize:18,lineHeight:1}}>×</button></td>
                  </tr>
                ))}
                <tr style={{background:B.gradSoft}}><td colSpan={4} style={{padding:'8px',fontWeight:800,fontSize:11,color:B.textSec}}>Total KOL Cost</td><td style={{padding:'8px',fontWeight:900,color:B.primary,fontSize:13}}>{fmtS(kt)}</td><td/></tr>
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <Card title="Pricing Output" glow>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>KOL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{fmtS(kt)}</div></div>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>TOTAL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{fmtS(tc)}</div></div>
            </div>
            <div style={{background:B.gradPrimary,borderRadius:16,padding:'20px 24px',textAlign:'center',marginBottom:16,boxShadow:`0 8px 32px ${B.primaryGlow}`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-15,right:-15,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
              <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>RECOMMENDED PRICE</div>
              <div style={{fontSize:34,fontWeight:900,color:'#fff',letterSpacing:'-0.04em'}}>{fmt(rp)}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:4,fontWeight:600}}>VND</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.successBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.success}25`}}><div style={{fontSize:9,fontWeight:800,color:B.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>PROFIT</div><div style={{fontSize:18,fontWeight:900,color:B.success}}>{fmtS(pr)}</div></div>
              <div style={{background:B.successBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.success}25`}}><div style={{fontSize:9,fontWeight:800,color:B.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>MARGIN</div><div style={{fontSize:18,fontWeight:900,color:B.success}}>{am}%</div></div>
            </div>
            <div style={{background:ok?B.successBg:B.dangerBg,border:`1.5px solid ${ok?B.success:B.danger}30`,borderRadius:12,padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:15,fontWeight:900,color:ok?B.success:B.danger,letterSpacing:'-0.01em'}}>{!rp?'Enter data to calculate →':ok?'✓  ACCEPT DEAL':'✗  RENEGOTIATE'}</div>
              {rp>0&&<div style={{fontSize:11,color:ok?B.success:B.danger,marginTop:4,fontWeight:600}}>Budget gap: {fmt(gap)} VND</div>}
            </div>
          </Card>
          <Card title="Deal History">
            <div style={{maxHeight:240,overflowY:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Date','Client','Price','Margin','Decision'].map(h=><th key={h} style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
                <tbody>
                  {data.dealHistory.map(d=><tr key={d.id} style={{borderBottom:`1px solid ${B.border}`}}><td style={{padding:'7px 8px',fontSize:10,color:B.textTer}}>{d.deal_date}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:700}}>{d.client}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:800,color:B.primary}}>{fmtS(d.price)}</td><td style={{padding:'7px 8px',fontSize:11}}>{d.margin}%</td><td style={{padding:'7px 8px'}}><Badge text={d.decision}/></td></tr>)}
                  {!data.dealHistory.length&&<tr><td colSpan={5} style={{textAlign:'center',padding:20,color:B.textTer,fontSize:12}}>No deals yet</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Invoices({data,add,upd,log}){
  const [filter,setFilter]=useState('')
  const [showAdd,setShowAdd]=useState(false)
  const invs=data.invoices.filter(i=>!filter||i.status===filter)
  const tA=data.invoices.reduce((a,i)=>a+Number(i.amount||0),0)
  const tP=data.invoices.reduce((a,i)=>a+Number(i.paid||0),0)
  const ov=data.invoices.filter(i=>i.status==='Overdue').reduce((a,i)=>a+Number(i.amount||0)-Number(i.paid||0),0)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const a=Number(fd.get('amount')||0),p=Number(fd.get('paid')||0),d=fd.get('due_date');const od=d&&new Date(d)<new Date()&&p<a;await add('invoices',{invoice_code:'KK-'+String(data.invoices.length+1).padStart(3,'0'),client:fd.get('client'),project:fd.get('project'),amount:a,paid:p,due_date:d||null,status:p>=a?'Paid':od?'Overdue':p>0?'Partial':'Unpaid',notes:fd.get('notes')});log('HĐ: '+fd.get('client'));setShowAdd(false)}
  async function markPaid(inv){const a=Number(prompt('Thu từ '+inv.client+'\nCòn: '+fmt(Number(inv.amount)-Number(inv.paid))+' VND\nSố tiền:',Number(inv.amount)-Number(inv.paid))||0);if(!a)return;const np=Math.min(Number(inv.paid)+a,Number(inv.amount));await upd('invoices',inv.id,{paid:np,status:np>=Number(inv.amount)?'Paid':np>0?'Partial':'Unpaid'});log('Thu: '+fmt(a))}
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Hóa đơn & Công nợ</h2><Btn primary onClick={()=>setShowAdd(true)}>+ Tạo hóa đơn</Btn></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <StatCard label="Tổng HĐ" value={fmtS(tA)} color={B.primary}/>
        <StatCard label="Đã thu" value={fmtS(tP)} color={B.success}/>
        <StatCard label="Còn phải thu" value={fmtS(tA-tP)} color={B.warning}/>
        <StatCard label="Quá hạn" value={fmtS(ov)} color={B.danger}/>
      </div>
      <div style={{marginBottom:14}}><select value={filter} onChange={e=>setFilter(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Status</option><option value="Unpaid">Unpaid</option><option value="Partial">Partial</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option></select></div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>{['Invoice','Client','Project','Amount','Paid','Remaining','Due','Status',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {invs.map(i=><tr key={i.id}>
              <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:700}}>{i.invoice_code}</td>
              <td style={{...TD,fontWeight:800,color:B.text}}>{i.client}</td>
              <td style={{...TD,fontSize:11,color:B.textSec}}>{i.project||'—'}</td>
              <td style={{...TD,fontSize:12,fontWeight:800}}>{fmtS(i.amount)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:B.success}}>{fmtS(i.paid)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:Number(i.amount)-Number(i.paid)>0?B.warning:B.success}}>{fmtS(Number(i.amount)-Number(i.paid))}</td>
              <td style={{...TD,fontSize:10,color:B.textTer}}>{i.due_date||'—'}</td>
              <td style={TD}><Badge text={i.status}/></td>
              <td style={TD}><Btn sm onClick={()=>markPaid(i)}>Thu tiền</Btn></td>
            </tr>)}
            {!invs.length&&<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No invoices</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd&&<Modal title="New Invoice" onClose={()=>setShowAdd(false)}><form onSubmit={save}>
        <FG label="Client"><select name="client" {...inp()}><option value="">— Select —</option>{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</select></FG>
        <FG label="Project"><input name="project" {...inp()}/></FG>
        <Row2><FG label="Amount (VND)"><input name="amount" type="number" required {...inp()}/></FG><FG label="Deposit Paid"><input name="paid" type="number" defaultValue={0} {...inp()}/></FG></Row2>
        <FG label="Due Date"><input name="due_date" type="date" {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" {...inp({style:{...INP.style,minHeight:60}})}/></FG>
        <MFoot onClose={()=>setShowAdd(false)}/>
      </form></Modal>}
    </div>
  )
}

function Approval({data,upd,log}){
  async function resolve(a,ok){const note=document.getElementById('n-'+a.id)?.value||'';await upd('approvals',a.id,{status:ok?'Approved':'Rejected',notes:note,resolved_by:'CEO'});log((ok?'Approved':'Rejected')+': '+a.title)}
  return(
    <div>
      <h2 style={{margin:'0 0 20px',fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Approval Queue</h2>
      {data.approvals.length?data.approvals.map(a=>(
        <div key={a.id} style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 22px',marginBottom:12,boxShadow:'0 2px 12px rgba(26,86,219,0.04)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div><div style={{fontWeight:800,fontSize:14,color:B.navy,letterSpacing:'-0.01em'}}>{a.title}</div><div style={{fontSize:11,color:B.textTer,marginTop:3,fontWeight:500}}>{a.type} · {a.submitted_by} · {a.approval_date}</div></div>
            <Badge text={a.status}/>
          </div>
          {a.notes&&<div style={{fontSize:11,color:B.textSec,marginBottom:12,padding:'10px 12px',background:B.gradSoft,borderRadius:10,border:`1px solid ${B.border}`}}>{a.notes}</div>}
          {a.status==='Pending'&&<div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>resolve(a,true)} style={{padding:'7px 18px',background:B.successBg,color:B.success,border:`1.5px solid ${B.success}30`,borderRadius:9,cursor:'pointer',fontWeight:800,fontSize:12,fontFamily:"'Plus Jakarta Sans', sans-serif"}}>✓ Approve</button>
            <button onClick={()=>resolve(a,false)} style={{padding:'7px 18px',background:B.dangerBg,color:B.danger,border:`1.5px solid ${B.danger}30`,borderRadius:9,cursor:'pointer',fontWeight:800,fontSize:12,fontFamily:"'Plus Jakarta Sans', sans-serif"}}>✗ Reject</button>
            <input id={'n-'+a.id} placeholder="Add note..." {...inp({style:{...INP.style,flex:1}})}/>
          </div>}
          {a.status!=='Pending'&&<div style={{fontSize:11,color:B.textTer,fontWeight:600}}>Resolved by {a.resolved_by||'—'}</div>}
        </div>
      )):<div style={{textAlign:'center',padding:80,color:B.textTer,fontSize:13,fontWeight:600}}>Queue is empty — all clear ✓</div>}
    </div>
  )
}

function Clients({data,add,upd,del,log}){
  const [search,setSearch]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),industry:fd.get('industry'),size:fd.get('size'),contact:fd.get('contact'),email:fd.get('email'),phone:fd.get('phone'),notes:fd.get('notes'),since:new Date().toLocaleDateString('vi-VN')};edit?await upd('clients',edit.id,r):await add('clients',r);log('Client: '+r.name);setEdit(null);setShowAdd(false)}
  const list=data.clients.filter(c=>!search||(c.name||'').toLowerCase().includes(search.toLowerCase()))
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Clients</h2><Btn primary onClick={()=>setShowAdd(true)}>+ New Client</Btn></div>
      <input placeholder="🔍  Search clients..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,marginBottom:18,width:300}})}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:14}}>
        {list.map((c,i)=>{
          const rev=data.projects.filter(p=>p.client===c.name).reduce((a,p)=>a+Number(p.revenue||0),0)
          const pc=data.projects.filter(p=>p.client===c.name).length
          const col=PALETTE[i%PALETTE.length],init=(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
          return <div key={c.id} onClick={()=>setEdit(c)} style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 20px',cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,0.04)',transition:'transform 0.15s, box-shadow 0.15s',overflow:'hidden',position:'relative'}}>
            <div style={{position:'absolute',top:0,right:0,width:80,height:80,borderRadius:'0 16px 0 80px',background:`${col}08`}}/>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${col},${col}BB)`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 14px ${col}40`}}>{init}</div>
              <div><div style={{fontWeight:800,fontSize:14,color:B.navy,letterSpacing:'-0.01em'}}>{c.name}</div><div style={{fontSize:11,color:B.textTer,marginTop:2,fontWeight:500}}>{c.industry||'—'}</div></div>
            </div>
            <div style={{height:1,background:B.border,margin:'12px 0'}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div><div style={{fontSize:9,color:B.textTer,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>PROJECTS</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{pc}</div></div>
              <div><div style={{fontSize:9,color:B.textTer,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>REVENUE</div><div style={{fontSize:18,fontWeight:900,color:col}}>{fmtS(rev)}</div></div>
            </div>
            {c.contact&&<div style={{fontSize:11,color:B.textTer,marginTop:10,fontWeight:500}}>{c.contact}</div>}
          </div>
        })}
        {!list.length&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:B.textTer,fontSize:12,fontWeight:600}}>No clients yet</div>}
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Client':'New Client'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <FG label="Company / Brand"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Industry"><input name="industry" defaultValue={edit?.industry||''} placeholder="FMCG, F&B, Tech..." {...inp()}/></FG><FG label="Size"><select name="size" defaultValue={edit?.size||'SME'} {...inp()}><option>Enterprise</option><option>SME</option><option>Startup</option></select></FG></Row2>
        <FG label="Contact Person"><input name="contact" defaultValue={edit?.contact||''} placeholder="Name — Title" {...inp()}/></FG>
        <Row2><FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''} {...inp()}/></FG><FG label="Phone"><input name="phone" defaultValue={edit?.phone||''} {...inp()}/></FG></Row2>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('clients',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
    </div>
  )
}

function Kols({data,add,upd,del,log}){
  const [search,setSearch]=useState('')
  const [platF,setPlatF]=useState('')
  const [tierF,setTierF]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [hist,setHist]=useState(null)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),platform:fd.get('platform'),tier:fd.get('tier'),niche:fd.get('niche'),followers:Number(fd.get('followers')||0),engagement:Number(fd.get('engagement')||0),rate:Number(fd.get('rate')||0),avg_views:Number(fd.get('avg_views')||0),reliability:Number(fd.get('reliability')||5),available:fd.get('available')==='true',contact:fd.get('contact'),notes:fd.get('notes')};edit?await upd('kols',edit.id,r):await add('kols',r);log('KOL: '+r.name);setEdit(null);setShowAdd(false)}
  const list=data.kols.filter(k=>(!search||(k.name||'').toLowerCase().includes(search.toLowerCase()))&&(!platF||k.platform===platF)&&(!tierF||k.tier===tierF))
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>KOL / KOC Database</h2><Btn primary onClick={()=>setShowAdd(true)}>+ Add KOL</Btn></div>
      <div style={{display:'flex',gap:10,marginBottom:16}}>
        <input placeholder="🔍  Search..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:220}})}/>
        <select value={platF} onChange={e=>setPlatF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Platforms</option><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select>
        <select value={tierF} onChange={e=>setTierF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Tiers</option><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select>
      </div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:950}}>
          <thead><tr>{['ID','Name','Platform','Tier','Followers','Eng%','Rate/post','Campaigns','Stars','Status',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {list.map((k,i)=>{const used=data.projects.filter(p=>(p.kols||[]).includes(k.name)).length;const stars='★'.repeat(Math.min(5,Number(k.reliability||0)))+'☆'.repeat(Math.max(0,5-Number(k.reliability||0)));return <tr key={k.id}>
              <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:600}}>KOL-{String(i+1).padStart(3,'0')}</td>
              <td style={{...TD,fontWeight:800,color:B.text,fontSize:12.5}}>{k.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{k.platform}</span></td>
              <td style={TD}><Badge text={k.tier}/></td>
              <td style={{...TD,fontSize:11,fontWeight:600}}>{fmtS(k.followers)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:Number(k.engagement)>=5?B.success:B.textSec}}>{Number(k.engagement||0).toFixed(1)}%</td>
              <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{fmtS(k.rate)}</td>
              <td style={{...TD,textAlign:'center',fontSize:12,fontWeight:800,color:B.accent}}>{used}</td>
              <td style={{...TD,fontSize:13,color:'#F59E0B',letterSpacing:'-1px'}}>{stars}</td>
              <td style={TD}><Badge text={k.available?'Active':'Booked'}/></td>
              <td style={{...TD,display:'flex',gap:6}}><Btn sm onClick={()=>setEdit(k)}>Edit</Btn><Btn sm onClick={()=>setHist(k)}>History</Btn></td>
            </tr>})}
            {!list.length&&<tr><td colSpan={11} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No KOLs found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit KOL':'Add KOL / KOC'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <Row2><FG label="Name"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG><FG label="Platform"><select name="platform" defaultValue={edit?.platform||'TikTok'} {...inp()}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></FG></Row2>
        <Row2><FG label="Tier"><select name="tier" defaultValue={edit?.tier||'Micro'} {...inp()}><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select></FG><FG label="Niche"><input name="niche" defaultValue={edit?.niche||''} placeholder="Beauty, Lifestyle..." {...inp()}/></FG></Row2>
        <Row2><FG label="Followers"><input name="followers" type="number" defaultValue={edit?.followers||0} {...inp()}/></FG><FG label="Engagement (%)"><input name="engagement" type="number" step="0.1" defaultValue={edit?.engagement||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Rate (VND/post)"><input name="rate" type="number" defaultValue={edit?.rate||0} {...inp()}/></FG><FG label="Avg Views"><input name="avg_views" type="number" defaultValue={edit?.avg_views||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Reliability (1-5)"><select name="reliability" defaultValue={edit?.reliability||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG><FG label="Status"><select name="available" defaultValue={edit?.available!==false?'true':'false'} {...inp()}><option value="true">Available</option><option value="false">Booked</option></select></FG></Row2>
        <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''} {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('kols',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
      {hist&&<Modal title={'History: '+hist.name} onClose={()=>setHist(null)}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
          {[['Campaigns',data.projects.filter(p=>(p.kols||[]).includes(hist.name)).length],['Rate',fmtS(hist.rate)+' VND'],['Stars',hist.reliability+'/5']].map(([l,v])=>(
            <div key={l} style={{background:B.gradSoft,borderRadius:12,padding:'12px 14px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',marginBottom:5}}>{l}</div><div style={{fontSize:17,fontWeight:900,color:B.navy}}>{v}</div></div>
          ))}
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Campaign','Client','Service','Status','Date'].map(h=><th key={h} style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.projects.filter(p=>(p.kols||[]).includes(hist.name)).map(p=><tr key={p.id} style={{borderBottom:`1px solid ${B.border}`}}><td style={{padding:'7px 8px',fontSize:11,fontWeight:700}}>{p.campaign}</td><td style={{padding:'7px 8px',fontSize:11}}>{p.client}</td><td style={{padding:'7px 8px',fontSize:11}}>{p.service}</td><td style={{padding:'7px 8px'}}><Badge text={p.status}/></td><td style={{padding:'7px 8px',fontSize:10,color:B.textTer}}>{p.start_date||'—'}</td></tr>)}
            {!data.projects.filter(p=>(p.kols||[]).includes(hist.name)).length&&<tr><td colSpan={5} style={{textAlign:'center',padding:20,color:B.textTer,fontSize:12}}>No campaigns yet</td></tr>}
          </tbody>
        </table>
        {hist.notes&&<div style={{marginTop:14,padding:12,background:B.gradSoft,borderRadius:10,fontSize:11,color:B.textSec,border:`1px solid ${B.border}`}}>{hist.notes}</div>}
        <div style={{textAlign:'right',marginTop:16}}><Btn onClick={()=>setHist(null)}>Close</Btn></div>
      </Modal>}
    </div>
  )
}

function Vendors({data,add,upd,del,log}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),type:fd.get('type'),rating:Number(fd.get('rating')||5),contact:fd.get('contact'),total_spent:Number(fd.get('total_spent')||0),notes:fd.get('notes')};edit?await upd('vendors',edit.id,r):await add('vendors',r);log('Vendor: '+r.name);setEdit(null);setShowAdd(false)}
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Vendors & Suppliers</h2><Btn primary onClick={()=>setShowAdd(true)}>+ Add Vendor</Btn></div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Name','Type','Contact','Rating','Total Spent','Notes',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {data.vendors.map(v=><tr key={v.id}>
              <td style={{...TD,fontWeight:800,color:B.text}}>{v.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{v.type||'—'}</span></td>
              <td style={{...TD,fontSize:11,color:B.textSec}}>{v.contact||'—'}</td>
              <td style={{...TD,fontSize:14,color:'#F59E0B',letterSpacing:'-1px'}}>{'★'.repeat(Number(v.rating||0))+'☆'.repeat(Math.max(0,5-Number(v.rating||0)))}</td>
              <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{fmtS(v.total_spent)}</td>
              <td style={{...TD,fontSize:11,color:B.textTer}}>{v.notes||'—'}</td>
              <td style={TD}><Btn sm onClick={()=>setEdit(v)}>Edit</Btn></td>
            </tr>)}
            {!data.vendors.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No vendors yet</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Vendor':'Add Vendor'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <FG label="Company Name"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Service Type"><select name="type" defaultValue={edit?.type||'Production'} {...inp()}><option>Production</option><option>Photography</option><option>Video</option><option>Media Buy</option><option>Event</option><option>Design</option><option>PR</option><option>Other</option></select></FG><FG label="Rating (1-5)"><select name="rating" defaultValue={edit?.rating||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG></Row2>
        <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''} {...inp()}/></FG>
        <FG label="Total Spent (VND)"><input name="total_spent" type="number" defaultValue={edit?.total_spent||0} {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('vendors',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
    </div>
  )
}

function Team({data,add,upd,del,log}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),role:fd.get('role'),max_projects:Number(fd.get('max_projects')||5),email:fd.get('email')};edit?await upd('team',edit.id,r):await add('team',r);log('Team: '+r.name);setEdit(null);setShowAdd(false)}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Team & Capacity</h2><Btn primary onClick={()=>setShowAdd(true)}>+ Add Member</Btn></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14,marginBottom:20}}>
        {data.team.map((m,i)=>{
          const active=data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length
          const util=m.max_projects?Math.round(active/m.max_projects*100):0
          const col=PALETTE[i%PALETTE.length],init=(m.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
          return <div key={m.id} onClick={()=>setEdit(m)} style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,padding:'18px 20px',cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,0.04)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${col},${col}55)`}}/>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:`linear-gradient(135deg,${col},${col}BB)`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 14px ${col}40`}}>{init}</div>
              <div><div style={{fontWeight:800,fontSize:14,color:B.navy,letterSpacing:'-0.01em'}}>{m.name}</div><div style={{fontSize:11,color:B.textTer,marginTop:2,fontWeight:500}}>{m.role}</div></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:11}}>
              <span style={{color:B.textSec,fontWeight:500}}>Projects: <strong style={{color:B.navy}}>{active}/{m.max_projects||5}</strong></span>
              <span style={{fontWeight:800,color:util>=80?B.danger:util>=60?B.warning:B.success}}>{util}%</span>
            </div>
            <div style={{height:6,background:B.border,borderRadius:99,overflow:'hidden'}}>
              <div style={{height:'100%',width:util+'%',background:util>=80?B.danger:util>=60?B.warning:B.success,borderRadius:99,transition:'width 0.4s ease'}}/>
            </div>
            <div style={{marginTop:7,fontSize:10,fontWeight:700,color:util>=80?B.danger:util>=60?B.warning:B.success,textTransform:'uppercase',letterSpacing:'0.04em'}}>{util>=80?'AT CAPACITY':util>=60?'HIGH LOAD':'AVAILABLE'}</div>
          </div>
        })}
        {!data.team.length&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:B.textTer,fontSize:12,fontWeight:600}}>No team members yet</div>}
      </div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Name','Role','Max','Active','Utilization','Status'].map(h=><th key={h} style={{padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.team.map(m=>{const a=data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length,u=m.max_projects?Math.round(a/m.max_projects*100):0;return <tr key={m.id}>
              <td style={{padding:'11px 14px',fontWeight:800,color:B.navy,borderBottom:`1px solid ${B.border}`}}>{m.name}</td>
              <td style={{padding:'11px 14px',color:B.textSec,borderBottom:`1px solid ${B.border}`}}>{m.role}</td>
              <td style={{padding:'11px 14px',textAlign:'center',color:B.textSec,borderBottom:`1px solid ${B.border}`}}>{m.max_projects||5}</td>
              <td style={{padding:'11px 14px',textAlign:'center',fontWeight:800,color:B.navy,borderBottom:`1px solid ${B.border}`}}>{a}</td>
              <td style={{padding:'11px 14px',borderBottom:`1px solid ${B.border}`}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1,height:6,background:B.border,borderRadius:99}}><div style={{height:'100%',width:u+'%',background:u>=80?B.danger:B.gradPrimary,borderRadius:99}}/></div><span style={{fontSize:11,fontWeight:800,minWidth:35,color:u>=80?B.danger:B.textSec}}>{u}%</span></div></td>
              <td style={{padding:'11px 14px',fontSize:11,fontWeight:700,borderBottom:`1px solid ${B.border}`,color:u>=80?B.danger:u>=60?B.warning:B.success}}>{u>=80?'FULL':u>=60?'HIGH':'OK'}</td>
            </tr>})}
            {!data.team.length&&<tr><td colSpan={6} style={{textAlign:'center',padding:24,color:B.textTer,fontSize:12}}>No team members</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Member':'Add Team Member'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <FG label="Full Name"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Role"><select name="role" defaultValue={edit?.role||'Account Manager'} {...inp()}><option>Account Manager</option><option>Project Manager</option><option>Creative</option><option>KOL Executive</option><option>Performance</option><option>Finance</option><option>Director</option></select></FG><FG label="Max Projects"><input name="max_projects" type="number" defaultValue={edit?.max_projects||5} {...inp()}/></FG></Row2>
        <FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''} {...inp()}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('team',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
    </div>
  )
}

function Reports({data}){
  const P=data.projects
  const tR=P.reduce((a,p)=>a+Number(p.revenue||0),0)
  const tPr=P.reduce((a,p)=>a+Number(p.revenue||0)-Number(p.actual_cost||0),0)
  const mg=tR?Math.round(tPr/tR*100):0
  const won=data.deals.filter(d=>d.stage==='Won').length
  const wr=data.deals.length?Math.round(won/data.deals.length*100):0
  const byM=Array(12).fill(0)
  P.forEach(p=>{if(p.start_date){const m=new Date(p.start_date).getMonth();byM[m]+=Number(p.revenue||0)}})
  const svcs=['KOL/KOC','Performance','Creative','Event','PR','Consulting']
  const clR={};P.forEach(p=>{if(p.client)clR[p.client]=(clR[p.client]||0)+Number(p.revenue||0)})
  const top5=Object.entries(clR).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const sm={};data.deals.forEach(d=>sm[d.stage]=(sm[d.stage]||0)+1)
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return(
    <div>
      <h2 style={{margin:'0 0 20px',fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Analytics & Reports</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        <StatCard label="Total Revenue" value={fmtS(tR)} sub="VND" color={B.primary}/>
        <StatCard label="Total Profit" value={fmtS(tPr)} color={B.success}/>
        <StatCard label="Avg Margin" value={mg+'%'} color="#7C3AED"/>
        <StatCard label="Win Rate" value={wr+'%'} sub="of deals" color={B.warning}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:16,marginBottom:16}}>
        <Card title="Revenue by Month — 2026" glow>
          {months.map((m,i)=>(
            <div key={m} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize:10,color:B.textTer,width:28,fontWeight:700}}>{m}</span>
              <div style={{flex:1,height:18,background:B.border,borderRadius:6,overflow:'hidden'}}>
                <div style={{height:'100%',width:(byM[i]/(Math.max(...byM)||1)*100)+'%',background:B.gradPrimary,borderRadius:6}}/>
              </div>
              <span style={{fontSize:10,color:B.textSec,minWidth:48,textAlign:'right',fontWeight:700}}>{fmtS(byM[i])}</span>
            </div>
          ))}
        </Card>
        <div>
          <Card title="Margin by Service">
            {svcs.map((s,i)=>{const ps=P.filter(p=>p.service===s),r=ps.reduce((a,p)=>a+Number(p.revenue||0),0),c=ps.reduce((a,p)=>a+Number(p.actual_cost||0),0);const m=r?Math.round((r-c)/r*100):0;return <div key={s} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><span style={{fontSize:11,width:95,flexShrink:0,color:B.textSec,fontWeight:600}}>{s}</span><div style={{flex:1,height:8,background:B.border,borderRadius:99}}><div style={{height:'100%',width:m+'%',background:PALETTE[i],borderRadius:99}}/></div><span style={{fontSize:11,color:B.textSec,minWidth:38,textAlign:'right',fontWeight:800}}>{m}%</span></div>})}
          </Card>
          <Card title="Deal Funnel">
            {Object.entries(sm).map(([st,cnt])=>(
              <div key={st} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${B.border}`,alignItems:'center'}}>
                <span style={{fontSize:12,fontWeight:600,color:B.textSec}}>{st}</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}><Badge text={st}/><strong style={{fontSize:13,color:B.navy}}>{cnt}</strong></div>
              </div>
            ))}
            {!data.deals.length&&<Empty>No deals yet</Empty>}
          </Card>
        </div>
      </div>
      <Card title="Top 5 Clients by Revenue">
        {top5.map(([nm,rv],i)=>(
          <div key={nm} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 0',borderBottom:`1px solid ${B.border}`}}>
            <div style={{width:28,height:28,borderRadius:8,background:`${PALETTE[i]}15`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:PALETTE[i]}}>{i+1}</div>
            <span style={{flex:1,fontSize:13,fontWeight:700,color:B.navy}}>{nm}</span>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:14,fontWeight:900,color:B.primary}}>{fmtS(rv)}</div>
              <div style={{fontSize:10,color:B.textTer,marginTop:1}}>VND</div>
            </div>
            <div style={{width:120,height:6,background:B.border,borderRadius:99}}><div style={{height:'100%',width:tR?Math.round(rv/tR*100)+'%':'0%',background:PALETTE[i],borderRadius:99}}/></div>
          </div>
        ))}
        {!top5.length&&<Empty>No client data yet</Empty>}
      </Card>
    </div>
  )
}




// ════════════════════════════════════════════════════════════
// K&K CONTRACTS + BBNT MODULE — Clean rewrite
// ════════════════════════════════════════════════════════════

const KNK = {
  name: 'CÔNG TY TNHH QUẢNG CÁO K&K',
  address: '737/7 Kha Vạn Cân, Phường Linh Xuân, TP. Hồ Chí Minh',
  taxCode: '0317776715',
  rep: 'TÔ NGUYỄN ĐĂNG KHOA',
  repTitle: 'Giám Đốc',
  bankAccount: '116002937563',
  bankName: 'VIETINBANK',
  bankBranch: 'HCM',
  phone: '0938 223 668',
  email: 'contact@weareknk.com',
}

// ── Helpers (C-prefixed to avoid conflicts) ──────────────
const CB = {
  primary:'#1A56DB', accent:'#06B6D4', navy:'#0F172A',
  grad:'linear-gradient(135deg,#1A56DB,#06B6D4)',
  soft:'linear-gradient(135deg,rgba(26,86,219,0.08),rgba(6,182,212,0.08))',
  white:'#FFFFFF', border:'rgba(26,86,219,0.1)',
  text:'#0F172A', textSec:'#475569', textTer:'#94A3B8',
  success:'#059669', warning:'#D97706', danger:'#DC2626',
}

const CINP_S = {width:'100%',padding:'8px 11px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:8,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}

function cfmt(n){return Number(n||0).toLocaleString('vi-VN')}
function cfmtS(n){n=Number(n||0);if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(0)+'K';return n.toString()}

function toWords(n) {
  n = Math.round(Number(n||0))
  if(!n) return 'Không đồng'
  const units=['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
  const teens=['mười','mười một','mười hai','mười ba','mười bốn','mười lăm','mười sáu','mười bảy','mười tám','mười chín']
  const tens=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi']
  function num(x) {
    if(!x) return ''
    if(x>=1e9){const b=Math.floor(x/1e9);return units[b]+' tỷ '+(x%1e9?num(x%1e9):'')}
    if(x>=1e6){const m=Math.floor(x/1e6);const mw=m>=20?tens[Math.floor(m/10)]+(m%10?' '+units[m%10]:''):(m>=10?teens[m-10]:units[m]);return mw+' triệu '+(x%1e6?num(x%1e6):'')}
    if(x>=1e3){const k=Math.floor(x/1e3);return num(k)+' nghìn '+(x%1e3?num(x%1e3):'')}
    if(x>=100){return units[Math.floor(x/100)]+' trăm '+(x%100?num(x%100):'') }
    if(x>=20) return tens[Math.floor(x/10)]+(x%10?' '+units[x%10]:'')
    if(x>=10) return teens[x-10]
    return units[x]
  }
  const w = num(n).trim()
  return w.charAt(0).toUpperCase()+w.slice(1)+' đồng./.'
}

function fmtDate(s) {
  if(!s) return '___/___/______'
  const d=new Date(s)
  return `ngày ${d.getDate()} tháng ${d.getMonth()+1} năm ${d.getFullYear()}`
}

function genCode(prefix) {
  const d=new Date()
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getFullYear()).slice(2)}-${prefix}-KnK-`
}

// ── UI Components ─────────────────────────────────────────
function CModal({title,children,onClose,wide}) {
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}}
      style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:wide?880:600,maxWidth:'96vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15)',border:'1px solid rgba(26,86,219,0.1)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:CB.navy}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:CB.textTer,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CBadge({text}) {
  const colors={Draft:'#94A3B8',Sent:'#1A56DB',Signed:'#059669',Completed:'#059669',Cancelled:'#DC2626',Pending:'#D97706'}
  const c=colors[text]||'#94A3B8'
  return <span style={{background:c+'18',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>
}

function CBtn({children,onClick,primary,sm,danger,type,style:s}) {
  const base={display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,cursor:'pointer',fontSize:sm?10.5:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",...s}
  if(primary) return <button type={type||'button'} onClick={onClick} style={{...base,border:'none',background:CB.grad,color:'#fff'}}>{children}</button>
  if(danger) return <button type={type||'button'} onClick={onClick} style={{...base,border:'1.5px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626'}}>{children}</button>
  return <button type={type||'button'} onClick={onClick} style={{...base,border:'1.5px solid rgba(26,86,219,0.1)',background:'rgba(255,255,255,0.8)',color:CB.textSec}}>{children}</button>
}

function CFG({label,children,required}) {
  return (
    <div style={{marginBottom:13}}>
      <label style={{fontSize:11,fontWeight:700,color:CB.textSec,marginBottom:5,display:'block',letterSpacing:'0.04em',textTransform:'uppercase'}}>
        {label}{required&&<span style={{color:CB.danger,marginLeft:3}}>*</span>}
      </label>
      {children}
    </div>
  )
}

function CRow2({children}) {return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>}
function CRow3({children}) {return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>{children}</div>}
function CSec({title,children}) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontSize:11.5,fontWeight:800,color:CB.navy,marginBottom:10,paddingBottom:6,borderBottom:`2px solid ${CB.border}`,textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</div>
      {children}
    </div>
  )
}
function CMFoot({onClose,onDelete,label}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',marginTop:18,paddingTop:14,borderTop:`1px solid ${CB.border}`}}>
      <div>{onDelete&&<CBtn danger onClick={onDelete}>Xóa</CBtn>}</div>
      <div style={{display:'flex',gap:8}}>
        <CBtn onClick={onClose}>Huỷ</CBtn>
        <button type="submit" style={{padding:'7px 20px',borderRadius:9,border:'none',background:CB.grad,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label||'Lưu'}</button>
      </div>
    </div>
  )
}

// ── Clauses HĐ Dịch vụ ───────────────────────────────────
function clausesHDDV(partyA, partyB, form, kolList, fee, vat, total) {
  return `
<h3>ĐIỀU 1. ĐỊNH NGHĨA</h3>
<p>Nếu không có những sự kiện vượt ra ngoài giới hạn kiểm soát hợp lý, những Điều, Khoản và từ ngữ bên dưới, bất cứ khi nào được sử dụng trong Hợp Đồng, Phụ lục Hợp Đồng (nếu có) nếu không thay đổi, được định nghĩa như sau:</p>
<ol>
<li><em>"Bên"</em> có nghĩa là Bên A hay Bên B;</li>
<li><em>"Các Bên"</em> có nghĩa là cả hai Bên, Bên A và Bên B;</li>
<li><em>"Bên Thứ ba"</em> có nghĩa là không phải là Các Bên;</li>
<li><em>"Sự kiện bất khả kháng"</em> có nghĩa là sự kiện xảy ra một cách khách quan không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết và trong khả năng cho phép, chẳng hạn như: chiến tranh, bạo loạn, đình công, hỏa hoạn, thiên tai, lũ lụt, dịch bệnh, cách ly do kiểm dịch;</li>
<li><em>"Phạm vi công việc"</em> có nghĩa là những công việc mà Bên có nghĩa vụ phải thực hiện cho đến khi Hợp Đồng này chấm dứt;</li>
<li><em>"Thông tin"</em> có nghĩa là tất cả các thông tin, tài liệu có thể đọc được, nghe được, thấy được, thể hiện hoặc lưu trữ dưới các hình thức: văn bản, tệp (file), thư điện tử (email), hình ảnh,... hoặc bằng các hình thức khác mà Các Bên có được trong quá trình thực hiện Hợp Đồng.</li>
</ol>

<h3>ĐIỀU 2. ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
<p>1. Bên A đồng ý giao và Bên B đồng ý nhận thực hiện dịch vụ theo yêu cầu của Bên A với nội dung cụ thể như sau:</p>
<p>a) Bên B cung cấp người nổi tiếng/ người có tầm ảnh hưởng – KOLs/Influencers (sau đây gọi chung là "Nhân sự") thực hiện quay và sản xuất nội dung (sau đây gọi chung là "Sản phẩm") theo chủ đề và yêu cầu của Bên A và đăng tải lên tài khoản TikTok của Nhân sự.</p>
<p>2. Thời gian thực hiện công việc: Bắt đầu từ ${form.start_date||'ngày ký'} đến khi thực hiện nghiệm thu.</p>
<p>3. Báo giá chỉ có hiệu lực trong thời hạn từ 15 đến 30 ngày kể từ ngày ký kết Hợp Đồng.</p>
<p>4. Phạm vi công việc cụ thể: Nhân sự của Bên B thực hiện quay và hoàn thiện Sản phẩm theo nội dung đã thỏa thuận. Số lần chỉnh sửa tối đa là hai (02) lần/Sản phẩm.</p>

<h3>ĐIỀU 3. GIÁ TRỊ HỢP ĐỒNG VÀ TIẾN ĐỘ THANH TOÁN</h3>
<p><strong>1. Giá trị Hợp Đồng:</strong></p>
<p>&nbsp;&nbsp;&nbsp;a) Phí dịch vụ: ${cfmt(fee)} VNĐ</p>
<p>&nbsp;&nbsp;&nbsp;b) Thuế GTGT (${form.vat_rate||8}%): ${cfmt(Number(fee)*Number(form.vat_rate||8)/100)} VNĐ</p>
<p>&nbsp;&nbsp;&nbsp;c) Tổng giá trị Hợp Đồng: <strong>${cfmt(total)} VNĐ</strong></p>
<p>&nbsp;&nbsp;&nbsp;<em>Bằng chữ: ${toWords(total)}</em></p>
<p><strong>2. Tiến độ thanh toán:</strong> ${form.payment_terms||'Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày làm việc sau khi Bên B hoàn tất toàn bộ công việc và Bên A đã nhận đầy đủ chứng từ hợp lệ bao gồm: Hợp đồng, Biên bản nghiệm thu và Hoá đơn GTGT hợp lệ.'}</p>
<p><em>(Lưu ý: trong vòng 02 ngày làm việc tính từ khi Bên B gửi Biên Bản Nghiệm Thu nhưng chưa nhận được sự phản hồi từ Bên A, thì mặc định Biên Bản Nghiệm Thu này được thanh lý.)</em></p>

<h3>ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ BÊN B</h3>
<p><strong>1. Quyền của Bên B:</strong> Được nhận thanh toán đầy đủ và đúng hạn; Từ chối thực hiện khi Bên A chậm giao tài liệu hoặc không thanh toán đúng hạn; Được quyền xóa hoặc ẩn bài đăng nếu phát hiện vi phạm pháp luật sau khi thông báo bằng văn bản.</p>
<p><strong>2. Nghĩa vụ của Bên B:</strong> Đảm bảo thực hiện đúng và đầy đủ nội dung Điều 2; Tuyệt đối bảo mật thông tin trong vòng 02 năm kể từ ngày ký; Đảm bảo lưu trữ Sản phẩm đã đăng tải ở chế độ công khai tối thiểu 06 tháng.</p>

<h3>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ BÊN A</h3>
<p><strong>1. Quyền của Bên A:</strong> Yêu cầu Bên B thực hiện đúng nội dung và thời gian; Yêu cầu chỉnh sửa Sản phẩm theo quy định; Đơn phương chấm dứt Hợp Đồng nếu Bên B vi phạm sau khi đã gửi thông báo ít nhất 02 lần.</p>
<p><strong>2. Nghĩa vụ của Bên A:</strong> Thanh toán đầy đủ và đúng hạn (lãi chậm thanh toán 0.05%/ngày); Cam kết tính hợp pháp của thông tin cung cấp; Không tự ý làm việc trực tiếp với KOL/KOC do Bên B cung cấp trong thời hạn hợp đồng; Cung cấp feedback trong vòng 24-48 giờ.</p>

<h3>ĐIỀU 6. QUYỀN SỞ HỮU TRÍ TUỆ</h3>
<p>Bên B đảm bảo tính nguyên gốc, tính sáng tạo và tính hợp pháp của các tài sản sở hữu trí tuệ sử dụng trong Sản phẩm. Các Bên cam kết tôn trọng và thực hiện đầy đủ các nghĩa vụ về quyền sở hữu trí tuệ.</p>

<h3>ĐIỀU 7. BỒI THƯỜNG THIỆT HẠI VÀ PHẠT VI PHẠM</h3>
<p>1. Bên vi phạm phải bồi thường tất cả tổn thất phát sinh từ hành vi vi phạm.</p>
<p>2. Mọi trường hợp vi phạm đều phải chịu mức phạt 8% trên phần giá trị Hợp Đồng bị vi phạm.</p>
<p>3. Trong trường hợp Bên A muốn chạy quảng cáo trên các video của nhân sự do Bên B quản lý thì bắt buộc phải thông qua Bên B; nếu vi phạm thì Bên A sẽ bồi thường 200% giá trị hợp đồng.</p>

<h3>ĐIỀU 8. CHỐNG HỐI LỘ</h3>
<p>Bên A không được trao cho nhân viên của Bên B các lợi ích bằng tiền hoặc hiện vật dưới bất kỳ hình thức nào mà không được sự đồng ý của Bên B. Vi phạm chịu phạt 8% giá trị Hợp đồng hoặc 200% giá trị hối lộ và bồi thường 20% giá trị Hợp đồng.</p>

<h3>ĐIỀU 9. CHẤM DỨT HỢP ĐỒNG</h3>
<p>Hợp Đồng chấm dứt khi: Các Bên hoàn thành đầy đủ nghĩa vụ; Một trong Các Bên bị phá sản; Các Bên thỏa thuận chấm dứt trước thời hạn (thông báo trước 15 ngày); Một Bên đơn phương chấm dứt do bên kia vi phạm không khắc phục trong 10 ngày; Sự kiện bất khả kháng kéo dài quá 30 ngày.</p>

<h3>ĐIỀU 10. GIẢI QUYẾT TRANH CHẤP</h3>
<p>Trong quá trình thực hiện Hợp Đồng, nếu có phát sinh tranh chấp thì Các Bên sẽ giải quyết bằng thương lượng, hòa giải. Trường hợp không giải quyết được trong vòng 30 ngày, một trong Các Bên có quyền yêu cầu Tòa án có thẩm quyền giải quyết. Bên thua kiện chịu mọi chi phí phát sinh.</p>

<h3>ĐIỀU 11. ĐIỀU KHOẢN CHUNG</h3>
<p>1. Hợp Đồng có hiệu lực kể từ ngày ký và tự động thanh lý sau khi Các Bên hoàn thành đầy đủ nghĩa vụ.</p>
<p>2. Mọi sửa đổi, bổ sung Hợp Đồng phải thực hiện bằng Phụ lục Hợp Đồng.</p>
<p>3. Hợp Đồng được lập thành 02 bản có giá trị giống như nhau, Bên A giữ 01 bản và Bên B giữ 01 bản.</p>
`
}

// ── Clauses HĐ CTV ───────────────────────────────────────
function clausesHDCTV(form, fee, tax, netFee) {
  return `
<h3>ĐIỀU 1. ĐỊNH NGHĨA</h3>
<p>Các từ ngữ trong Hợp Đồng được định nghĩa như sau: <em>"Bên"</em> là Bên A hay Bên B; <em>"Các Bên"</em> là cả hai Bên; <em>"Bên Thứ ba"</em> là không phải Các Bên; <em>"Sự kiện bất khả kháng"</em> là những sự kiện khách quan không thể lường trước và không thể khắc phục; <em>"Phạm vi công việc"</em> là những công việc Bên B phải thực hiện; <em>"Biên tập"</em> là việc điều chỉnh, thêm, bớt nội dung video; <em>"Ngày làm việc"</em> là các ngày từ Thứ 2 đến Thứ 6.</p>

<h3>ĐIỀU 2. ĐỐI TƯỢNG HỢP ĐỒNG</h3>
<p>a) Bên A giao và Bên B đồng ý thực hiện: <strong>${form.scope_of_work||'1 video TikTok review sản phẩm theo định hướng của khách hàng'}</strong></p>
<p>b) Thời gian thực hiện: từ ${form.start_date||'ngày ký'} đến khi thực hiện nghiệm thu.</p>
<p>c) Kênh đăng tải: <strong>${form.channels||'Theo thỏa thuận'}</strong></p>
<p>d) Thời hạn Hợp Đồng: kể từ ngày ký cho đến khi các Bên hoàn thành toàn bộ nghĩa vụ.</p>

<h3>ĐIỀU 3. THÙ LAO VÀ THANH TOÁN</h3>
<p>1. Thù lao gốc: <strong>${cfmt(fee)} VNĐ</strong></p>
<p>2. Khấu trừ thuế TNCN (${form.vat_rate||10}%): ${cfmt(Number(fee)*Number(form.vat_rate||10)/100)} VNĐ</p>
<p>3. <strong>Thù lao thực nhận (đã khấu trừ thuế TNCN): ${cfmt(netFee)} VNĐ</strong></p>
<p>&nbsp;&nbsp;&nbsp;<em>Bằng chữ: ${toWords(netFee)}</em></p>
<p>4. Phương thức: Chuyển khoản.</p>
<p>5. Tiến độ: ${form.payment_terms||'100% trong vòng 15 ngày làm việc kể từ ngày hoàn thành công việc và ký Biên bản nghiệm thu.'}</p>

<h3>ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</h3>
<p><strong>1. Quyền của Bên A:</strong> Điều chỉnh phạm vi và thời gian thực hiện; Yêu cầu điều chỉnh thể hiện của Bên B; Chấm dứt và miễn nghĩa vụ thanh toán nếu Bên B không thực hiện đúng; Sử dụng video, hình ảnh của Bên B để quảng bá; Là chủ sở hữu hợp pháp đối với tất cả sản phẩm Bên B tạo ra.</p>
<p><strong>2. Nghĩa vụ của Bên A:</strong> Thông báo lịch làm việc; Phối hợp từ giai đoạn chuẩn bị đến hoàn thành; Thanh toán đúng hạn và đầy đủ.</p>

<h3>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</h3>
<p><strong>1. Quyền của Bên B:</strong> Nhận đầy đủ thù lao; Được thông báo khi có thay đổi thời gian.</p>
<p><strong>2. Nghĩa vụ của Bên B:</strong> Thực hiện đầy đủ công việc; Đảm bảo chất lượng kỹ thuật; Không tạo dư luận xấu ảnh hưởng đến nhãn hàng; Cam kết giữ bài đăng công khai vĩnh viễn (vi phạm đền bù 200% giá trị tương ứng); Bảo mật toàn bộ thông tin Hợp Đồng.</p>

<h3>ĐIỀU 6. BỒI THƯỜNG THIỆT HẠI VÀ PHẠT VI PHẠM</h3>
<p>1. Mọi vi phạm phải bồi thường tổn thất và chịu phạt 8% giá trị phần nghĩa vụ bị vi phạm.</p>
<p>2. Nếu Bên B không hoàn thành đúng thời hạn hoặc không đúng chất lượng, ngoài việc thực hiện phần còn lại, Bên B phải chịu phạt 200% giá trị phần Hợp Đồng bị vi phạm.</p>

<h3>ĐIỀU 7. CHẤM DỨT HỢP ĐỒNG</h3>
<p>Hợp Đồng chấm dứt khi: Các Bên hoàn thành nghĩa vụ; Các Bên thỏa thuận chấm dứt trước thời hạn (thông báo trước 30 ngày làm việc); Một Bên đơn phương chấm dứt do vi phạm (thông báo trước 15 ngày).</p>

<h3>ĐIỀU 8. ĐIỀU KHOẢN CHUNG</h3>
<p>1. Hợp Đồng có hiệu lực kể từ ngày ký và được thanh lý sau khi hoàn thành toàn bộ nghĩa vụ.</p>
<p>2. Mọi sửa đổi, bổ sung phải được hai Bên thống nhất bằng văn bản.</p>
<p>3. Tranh chấp giải quyết bằng thương lượng; nếu không được, một Bên có quyền yêu cầu Tòa án tại TP. Hồ Chí Minh giải quyết.</p>
<p>4. Hợp Đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi Bên giữ 01 bản.</p>
`
}

// ══════════════════════════════════════════════════════════
// CONTRACTS PAGE
// ══════════════════════════════════════════════════════════
function Contracts({data, supabase, reload, log}) {
  const [tab, setTab] = useState('client')
  const [contracts, setContracts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadContracts() }, [tab])

  async function loadContracts() {
    setLoading(true)
    const {data:rows,error} = await supabase.from('contracts').select('*').eq('contract_type',tab).order('created_at',{ascending:false})
    if(error) console.error(error)
    setContracts(rows||[])
    setLoading(false)
  }

  const filtered = contracts.filter(c =>
    !filter ||
    (c.contract_code||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_a_name||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_b_name||'').toLowerCase().includes(filter.toLowerCase())
  )

  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:CB.navy}}>Hợp đồng</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo hợp đồng</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:'1px solid rgba(26,86,219,0.1)'}}>
        {[['client','🏢  HĐ Dịch vụ (Client)'],['kol','👤  HĐ Cộng tác viên (KOL)']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':CB.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          ['Tổng HĐ', contracts.length],
          ['Draft', contracts.filter(c=>c.status==='Draft').length],
          ['Đã ký', contracts.filter(c=>c.status==='Signed').length],
          ['Tổng giá trị', cfmtS(contracts.reduce((a,c)=>a+Number(c.total_with_vat||0),0))+' VND']
        ].map(([l,v])=>(
          <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'12px 16px',border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{fontSize:10,fontWeight:700,color:CB.textTer,textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:20,fontWeight:900,color:CB.primary,marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:14}}>
        <input placeholder="🔍  Tìm theo số HĐ, tên client, KOL..." value={filter} onChange={e=>setFilter(e.target.value)} style={{...CINP_S,maxWidth:380}}/>
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead>
            <tr>
              {['Số HĐ','Bên đối tác','Dự án','Giá trị (VND)','Ngày ký','Trạng thái',''].map(h=>(
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading && filtered.map(c=>(
              <tr key={c.id}>
                <td style={{...TD,fontWeight:800,color:CB.primary,fontSize:12}}>{c.contract_code}</td>
                <td style={{...TD,fontWeight:600}}>{tab==='client'?c.party_a_name:c.party_b_name}</td>
                <td style={{...TD,fontSize:11,color:CB.textSec}}>{data.projects.find(p=>p.id===c.project_id)?.campaign||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{cfmt(c.total_with_vat)}</td>
                <td style={{...TD,fontSize:11,color:CB.textTer}}>{c.sign_date||'—'}</td>
                <td style={TD}><CBadge text={c.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem({contract:c,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(c);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            ))}
            {!loading && !filtered.length && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:CB.textTer,fontSize:12}}>Chưa có hợp đồng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && tab==='client' && (
        <ContractClientForm
          data={data} supabase={supabase} edit={editItem}
          onClose={()=>{setShowForm(false);setEditItem(null)}}
          onSaved={()=>{loadContracts();reload();log('Lưu HĐ client')}}
        />
      )}
      {showForm && tab==='kol' && (
        <ContractKOLForm
          data={data} supabase={supabase} edit={editItem}
          onClose={()=>{setShowForm(false);setEditItem(null)}}
          onSaved={()=>{loadContracts();reload();log('Lưu HĐ KOL')}}
        />
      )}
      {viewItem && (
        <ContractPreview
          contract={viewItem.contract} type={viewItem.type}
          onClose={()=>setViewItem(null)}
        />
      )}
    </div>
  )
}

// ── HĐ Client Form ────────────────────────────────────────
function ContractClientForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || genCode('HDDV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    sign_location: edit?.sign_location || 'Văn phòng Công Ty TNHH Quảng cáo K&K',
    project_id: edit?.project_id || '',
    party_a_name: edit?.party_a_name || '',
    party_a_tax: edit?.party_a_tax || '',
    party_a_address: edit?.party_a_address || '',
    party_a_rep: edit?.party_a_rep || '',
    party_a_title: edit?.party_a_title || 'Giám Đốc',
    party_a_bank_account: edit?.party_a_bank_account || '',
    party_a_bank_name: edit?.party_a_bank_name || '',
    service_type: edit?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || '',
    kol_list: edit?.kol_list || [],
    total_fee: edit?.total_fee || 0,
    vat_rate: edit?.vat_rate || 8,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || 'Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày làm việc sau khi Bên B hoàn tất toàn bộ công việc và Bên A đã nhận đầy đủ chứng từ hợp lệ bao gồm: Hợp đồng, Biên bản nghiệm thu và Hoá đơn GTGT hợp lệ.',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    const vat = Number(form.total_fee||0) * Number(form.vat_rate||8) / 100
    set('total_with_vat', Number(form.total_fee||0) + vat)
  }, [form.total_fee, form.vat_rate])

  useEffect(()=>{
    const total = form.kol_list.reduce((a,k)=>a+Number(k.fee||0),0)
    if(total > 0) set('total_fee', total)
  }, [form.kol_list])

  function fillClient(name) {
    const c = data.clients.find(cl => cl.name?.toLowerCase()===name?.toLowerCase())
    if(c) {
      setForm(p=>({...p,
        party_a_name: c.name||p.party_a_name,
        party_a_tax: c.tax_code||p.party_a_tax,
        party_a_address: c.address||p.party_a_address,
        party_a_rep: c.legal_rep||p.party_a_rep,
        party_a_title: c.legal_rep_title||p.party_a_title,
        party_a_bank_account: c.bank_account||p.party_a_bank_account,
        party_a_bank_name: c.bank_name||p.party_a_bank_name,
      }))
    }
  }

  const addKol = () => set('kol_list',[...form.kol_list,{name:'',tiktok:'',work:'Sản xuất 1 video theo yêu cầu của nhãn hàng',fee:0}])
  const updKol = (i,k,v) => { const a=[...form.kol_list]; a[i]={...a[i],[k]:v}; set('kol_list',a) }
  const delKol = (i) => set('kol_list', form.kol_list.filter((_,j)=>j!==i))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      contract_code: form.contract_code, contract_type: 'client',
      project_id: form.project_id||null,
      party_a_name: form.party_a_name, party_a_tax: form.party_a_tax,
      party_a_address: form.party_a_address, party_a_rep: form.party_a_rep,
      party_a_title: form.party_a_title, party_a_bank_account: form.party_a_bank_account,
      party_a_bank_name: form.party_a_bank_name,
      party_b_name: KNK.name, party_b_tax: KNK.taxCode,
      party_b_address: KNK.address, party_b_rep: KNK.rep,
      party_b_title: KNK.repTitle, party_b_bank_account: KNK.bankAccount,
      party_b_bank_name: KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch,
      service_type: form.service_type, scope_of_work: form.scope_of_work,
      kol_list: form.kol_list, total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||8), total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms, start_date: form.start_date||null,
      sign_date: form.sign_date||null, sign_location: form.sign_location,
      status: form.status, notes: form.notes, created_by: 'User'
    }
    let error
    if(edit) { ({error} = await supabase.from('contracts').update(payload).eq('id',edit.id)) }
    else { ({error} = await supabase.from('contracts').insert([payload])) }
    if(error) { alert('Lỗi: '+error.message); setSaving(false); return }
    // Auto-save client
    if(!edit && form.party_a_name) {
      const exists = data.clients.find(c=>c.tax_code===form.party_a_tax||c.name===form.party_a_name)
      if(!exists) {
        await supabase.from('clients').insert([{
          name:form.party_a_name, tax_code:form.party_a_tax,
          address:form.party_a_address, legal_rep:form.party_a_rep,
          legal_rep_title:form.party_a_title, bank_account:form.party_a_bank_account,
          bank_name:form.party_a_bank_name, since:new Date().toLocaleDateString('vi-VN')
        }])
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Dịch vụ':'Tạo HĐ Dịch vụ — Bên A: Client | Bên B: K&K'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Thông tin hợp đồng">
          <CRow3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Dự án liên quan"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={CINP_S}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign}</option>)}</select></CFG>
            <CFG label="Loại dịch vụ"><select value={form.service_type} onChange={e=>set('service_type',e.target.value)} style={CINP_S}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option></select></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên A — Khách hàng">
          <div style={{marginBottom:10,background:'rgba(26,86,219,0.06)',borderRadius:8,padding:'8px 12px',fontSize:11,color:CB.primary,fontWeight:500}}>💡 Nhập tên client để auto-fill từ database</div>
          <CFG label="Tên công ty / Brand" required>
            <input value={form.party_a_name} onChange={e=>{set('party_a_name',e.target.value);fillClient(e.target.value)}} list="cl-hddv" style={CINP_S} required/>
            <datalist id="cl-hddv">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
          </CFG>
          <CRow3>
            <CFG label="Mã số thuế"><input value={form.party_a_tax} onChange={e=>set('party_a_tax',e.target.value)} style={CINP_S} placeholder="VD: 0317761797"/></CFG>
            <CFG label="Người đại diện"><input value={form.party_a_rep} onChange={e=>set('party_a_rep',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Chức vụ"><input value={form.party_a_title} onChange={e=>set('party_a_title',e.target.value)} style={CINP_S}/></CFG>
          </CRow3>
          <CFG label="Địa chỉ"><input value={form.party_a_address} onChange={e=>set('party_a_address',e.target.value)} style={CINP_S}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_a_bank_account} onChange={e=>set('party_a_bank_account',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_a_bank_name} onChange={e=>set('party_a_bank_name',e.target.value)} style={CINP_S}/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên B — K&K Advertising (cố định)">
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',fontSize:12,color:CB.textSec,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep} — {KNK.repTitle}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName} CN/PGD: {KNK.bankBranch}</div>
              <div style={{gridColumn:'span 2'}}><strong>Địa chỉ:</strong> {KNK.address}</div>
            </div>
          </div>
        </CSec>

        <CSec title="Danh sách KOL/KOC thực hiện">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead>
              <tr>
                {['STT','Họ và tên','Link TikTok','Nội dung công việc','Chi phí (VND)',''].map(h=>(
                  <th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.kol_list.map((k,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 6px',fontSize:11,color:CB.textTer,textAlign:'center'}}>{i+1}</td>
                  <td style={{padding:'5px 4px'}}><input value={k.name} onChange={e=>updKol(i,'name',e.target.value)} list="kol-hddv" style={{...CINP_S,padding:'5px 8px',fontSize:12}}/><datalist id="kol-hddv">{data.kols.map(k=><option key={k.id} value={k.name}/>)}</datalist></td>
                  <td style={{padding:'5px 4px'}}><input value={k.tiktok} onChange={e=>updKol(i,'tiktok',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="@username"/></td>
                  <td style={{padding:'5px 4px'}}><input value={k.work} onChange={e=>updKol(i,'work',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}}/></td>
                  <td style={{padding:'5px 4px'}}><input type="number" value={k.fee} onChange={e=>updKol(i,'fee',Number(e.target.value))} style={{...CINP_S,padding:'5px 8px',fontSize:12,width:110}}/></td>
                  <td style={{padding:'5px 4px'}}><button type="button" onClick={()=>delKol(i)} style={{background:'none',border:'none',cursor:'pointer',color:CB.danger,fontSize:18,lineHeight:1}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addKol}>+ Thêm KOL</CBtn>
        </CSec>

        <CSec title="Giá trị hợp đồng">
          <CRow3>
            <CFG label="Phí dịch vụ (VND)">
              <input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} style={CINP_S}/>
            </CFG>
            <CFG label="Thuế GTGT (%)">
              <input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/>
            </CFG>
            <CFG label="Tổng giá trị (VND)">
              <div style={{padding:'9px 12px',background:'rgba(26,86,219,0.06)',borderRadius:8,fontSize:15,fontWeight:800,color:CB.primary,border:'1px solid rgba(26,86,219,0.15)'}}>{cfmt(form.total_with_vat)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </CRow3>
          <CFG label="Điều khoản thanh toán">
            <textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP_S,minHeight:70}}/>
          </CFG>
        </CSec>

        <CFG label="Ngày bắt đầu thực hiện">
          <input type="date" value={form.start_date} onChange={e=>set('start_date',e.target.value)} style={{...CINP_S,maxWidth:200}}/>
        </CFG>

        <CMFoot onClose={onClose} label={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── HĐ KOL Form ───────────────────────────────────────────
function ContractKOLForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || genCode('HDCTV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    project_id: edit?.project_id || '',
    party_b_name: edit?.party_b_name || '',
    party_b_tax: edit?.party_b_tax || '',
    party_b_address: edit?.party_b_address || '',
    party_b_bank_account: edit?.party_b_bank_account || '',
    party_b_bank_name: edit?.party_b_bank_name || '',
    party_b_cccd: edit?.party_b_cccd || '',
    service_type: edit?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || '1 video TikTok review sản phẩm theo định hướng của khách hàng',
    channels: edit?.channels || '',
    total_fee: edit?.total_fee || 0,
    vat_rate: edit?.vat_rate || 10,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || 'Bên A sẽ thanh toán 100% cho Bên B trong vòng 15 ngày làm việc kể từ ngày Bên B hoàn thành toàn bộ công việc và Bên A nhận được Biên bản nghiệm thu hai Bên ký kết.',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    const afterTax = Number(form.total_fee||0) * (1 - Number(form.vat_rate||10)/100)
    set('total_with_vat', Math.round(afterTax))
  }, [form.total_fee, form.vat_rate])

  function fillKOL(name) {
    const k = data.kols.find(kl => kl.name?.toLowerCase()===name?.toLowerCase() || kl.real_name?.toLowerCase()===name?.toLowerCase())
    if(k) {
      setForm(p=>({...p,
        party_b_name: k.real_name||k.name||p.party_b_name,
        party_b_tax: k.personal_tax_code||p.party_b_tax,
        party_b_address: k.address||p.party_b_address,
        party_b_bank_account: k.bank_account||p.party_b_bank_account,
        party_b_bank_name: k.bank_name||p.party_b_bank_name,
        party_b_cccd: k.cccd||p.party_b_cccd,
        channels: k.platform||p.channels,
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      contract_code: form.contract_code, contract_type: 'kol',
      project_id: form.project_id||null,
      party_a_name: KNK.name, party_a_tax: KNK.taxCode,
      party_a_address: KNK.address, party_a_rep: KNK.rep,
      party_a_title: KNK.repTitle, party_a_bank_account: KNK.bankAccount,
      party_a_bank_name: KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch,
      party_b_name: form.party_b_name, party_b_tax: form.party_b_tax,
      party_b_address: form.party_b_address, party_b_rep: form.party_b_name,
      party_b_bank_account: form.party_b_bank_account,
      party_b_bank_name: form.party_b_bank_name,
      party_b_cccd: form.party_b_cccd,
      service_type: form.service_type, scope_of_work: form.scope_of_work,
      kol_list: [], total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||10), total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms, start_date: form.start_date||null,
      sign_date: form.sign_date||null,
      sign_location: 'Văn phòng Công Ty TNHH Quảng cáo K&K',
      status: form.status, notes: form.notes, created_by: 'User'
    }
    let error
    if(edit) { ({error} = await supabase.from('contracts').update(payload).eq('id',edit.id)) }
    else { ({error} = await supabase.from('contracts').insert([payload])) }
    if(error) { alert('Lỗi: '+error.message); setSaving(false); return }
    if(!edit && form.party_b_name) {
      const exists = data.kols.find(k=>k.cccd===form.party_b_cccd||k.name===form.party_b_name)
      if(!exists) {
        await supabase.from('kols').insert([{
          name:form.party_b_name, real_name:form.party_b_name,
          cccd:form.party_b_cccd, personal_tax_code:form.party_b_tax,
          address:form.party_b_address, bank_account:form.party_b_bank_account,
          bank_name:form.party_b_bank_name, platform:form.channels, available:true
        }])
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Cộng tác viên':'Tạo HĐ Cộng tác viên — Bên A: K&K | Bên B: KOL'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Bên A — K&K Advertising (cố định)">
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',fontSize:12,color:CB.textSec,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep} — {KNK.repTitle}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName} CN: {KNK.bankBranch}</div>
            </div>
          </div>
        </CSec>

        <CSec title="Thông tin hợp đồng">
          <CRow3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Dự án"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={CINP_S}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign}</option>)}</select></CFG>
            <CFG label="Kênh đăng tải"><input value={form.channels} onChange={e=>set('channels',e.target.value)} style={CINP_S} placeholder="@tiktok_username"/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên B — KOL / Cộng tác viên">
          <div style={{marginBottom:10,background:'rgba(26,86,219,0.06)',borderRadius:8,padding:'8px 12px',fontSize:11,color:CB.primary,fontWeight:500}}>💡 Nhập tên KOL để auto-fill từ database</div>
          <CRow2>
            <CFG label="Họ và tên thật" required>
              <input value={form.party_b_name} onChange={e=>{set('party_b_name',e.target.value);fillKOL(e.target.value)}} list="kol-ctv" style={CINP_S} required/>
              <datalist id="kol-ctv">{data.kols.map(k=><option key={k.id} value={k.real_name||k.name}/>)}</datalist>
            </CFG>
            <CFG label="CCCD"><input value={form.party_b_cccd} onChange={e=>set('party_b_cccd',e.target.value)} style={CINP_S} placeholder="Số CCCD"/></CFG>
          </CRow2>
          <CFG label="Địa chỉ thường trú"><input value={form.party_b_address} onChange={e=>set('party_b_address',e.target.value)} style={CINP_S}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_b_bank_account} onChange={e=>set('party_b_bank_account',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_b_bank_name} onChange={e=>set('party_b_bank_name',e.target.value)} style={CINP_S}/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Phạm vi công việc">
          <CFG label="Nội dung công việc"><textarea value={form.scope_of_work} onChange={e=>set('scope_of_work',e.target.value)} style={{...CINP_S,minHeight:80}}/></CFG>
        </CSec>

        <CSec title="Thù lao">
          <CRow3>
            <CFG label="Thù lao gốc (VND)"><input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Thuế TNCN (%)"><input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Thù lao thực nhận">
              <div style={{padding:'9px 12px',background:'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:'#059669',border:'1px solid rgba(5,150,105,0.2)'}}>{cfmt(form.total_with_vat)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </CRow3>
          <CFG label="Điều khoản thanh toán"><textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP_S,minHeight:60}}/></CFG>
        </CSec>

        <CMFoot onClose={onClose} label={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── Contract Preview + Print ──────────────────────────────
function ContractPreview({contract:c, type, onClose}) {
  const isClient = type==='client'
  const pA = isClient
    ? {name:c.party_a_name,tax:c.party_a_tax,address:c.party_a_address,rep:c.party_a_rep,title:c.party_a_title,bank:c.party_a_bank_account,bankName:c.party_a_bank_name}
    : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch}
  const pB = isClient
    ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch}
    : {name:c.party_b_name,cccd:c.party_b_cccd,tax:c.party_b_tax,address:c.party_b_address,bank:c.party_b_bank_account,bankName:c.party_b_bank_name}

  const kolList = c.kol_list||[]
  const fee = Number(c.total_fee||0)
  const vat = isClient ? fee*Number(c.vat_rate||8)/100 : 0
  const total = Number(c.total_with_vat||0)

  function printDoc() {
    const w = window.open('','_blank')
    const kolTable = isClient && kolList.length ? `
      <table><thead><tr><th>STT</th><th>Họ và tên</th><th>Link TikTok</th><th>Nội dung công việc</th><th>Chi phí</th></tr></thead>
      <tbody>
        ${kolList.map((k,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${k.name}</td><td>${k.tiktok}</td><td>${k.work}</td><td style="text-align:right">${cfmt(k.fee)}</td></tr>`).join('')}
        <tr><td colspan="4" style="text-align:right;font-weight:700">TOTAL</td><td style="text-align:right;font-weight:700">${cfmt(fee)}</td></tr>
        <tr><td colspan="4" style="text-align:right">VAT (${c.vat_rate}%)</td><td style="text-align:right">${cfmt(vat)}</td></tr>
        <tr style="background:#f0f0f0"><td colspan="4" style="text-align:right;font-weight:700">TOTAL + VAT</td><td style="text-align:right;font-weight:700">${cfmt(total)}</td></tr>
      </tbody></table>` : ''

    const clauses = isClient
      ? clausesHDDV(pA, pB, c, kolList, fee, vat, total)
      : clausesHDCTV(c, fee, fee*Number(c.vat_rate||10)/100, total)

    w.document.write(`<html><head><title>${c.contract_code}</title>
    <style>
      body{font-family:'Times New Roman',serif;font-size:13px;margin:40px 50px;color:#000;line-height:1.7}
      h1{text-align:center;font-size:17px;text-transform:uppercase;margin:10px 0 4px;font-weight:bold}
      h2{text-align:center;font-size:13px;margin:0 0 16px;font-weight:normal}
      h3{font-size:13px;font-weight:bold;margin:16px 0 6px;text-transform:uppercase}
      p{margin:5px 0;text-align:justify}
      ol,ul{margin:4px 0;padding-left:24px}
      li{margin:3px 0}
      table{width:100%;border-collapse:collapse;margin:10px 0}
      th,td{border:1px solid #000;padding:5px 8px;font-size:12px}
      th{background:#f0f0f0;font-weight:bold;text-align:center}
      .logo{font-size:20px;font-weight:900;color:#1A56DB;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px}
      .parties{margin:12px 0}
      .party-name{font-weight:bold;text-transform:uppercase;margin:10px 0 4px}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}
      .footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}
      @media print{body{margin:20px 25px}}
    </style></head><body>
    <div class="logo">K&K advertising</div>
    <h1>${isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN'}</h1>
    <h2>Số: ${c.contract_code}</h2>
    <p>Hôm nay, <strong>${fmtDate(c.sign_date)}</strong>, tại ${c.sign_location||'Văn phòng Công Ty TNHH Quảng cáo K&K'},<br>Chúng tôi gồm:</p>
    <div class="parties">
      <div class="party-name">BÊN A: ${pA.name}</div>
      ${pA.tax?`<p>Mã số thuế: ${pA.tax}</p>`:''}
      <p>Đại diện: <strong>${pA.rep}</strong> &nbsp; Chức danh: ${pA.title}</p>
      <p>Địa chỉ: ${pA.address}</p>
      ${pA.bank?`<p>Số tài khoản: ${pA.bank} &nbsp; Ngân hàng: ${pA.bankName}</p>`:''}
      <p><em>(Sau đây gọi là "Bên A")</em></p>
      <p>Và</p>
      <div class="party-name">BÊN B: ${pB.name}</div>
      ${pB.cccd?`<p>CCCD: ${pB.cccd}</p>`:''}
      ${pB.tax?`<p>Mã số thuế: ${pB.tax}</p>`:''}
      <p>Địa chỉ: ${pB.address}</p>
      ${isClient?`<p>Đại diện: <strong>${pB.rep}</strong> &nbsp; Chức danh: ${pB.title}</p>`:''}
      ${pB.bank?`<p>Số tài khoản: ${pB.bank} &nbsp; Ngân hàng: ${pB.bankName}</p>`:''}
      <p><em>(Sau đây gọi là "Bên B")</em></p>
    </div>
    ${kolTable}
    ${clauses}
    <div class="sig">
      <div><p><strong>Đại diện Bên A</strong></p><p>${pA.title}</p><br><br><br><p><strong>${pA.rep}</strong></p></div>
      <div><p><strong>${isClient?'Đại diện Bên B':'Bên B'}</strong></p><p>${isClient?pB.title:'(Ký và ghi rõ họ tên)'}</p><br><br><br><p><strong>${isClient?pB.rep:pB.name}</strong></p></div>
    </div>
    <div class="footer">A: ${KNK.address} &nbsp;|&nbsp; P: ${KNK.phone} &nbsp;|&nbsp; E: ${KNK.email}</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(), 600)
  }

  return (
    <CModal title={`Preview: ${c.contract_code}`} onClose={onClose} wide>
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'center'}}>
        <CBtn primary onClick={printDoc}>🖨️ In / Export PDF</CBtn>
        <CBadge text={c.status}/>
        <span style={{fontSize:11,color:CB.textTer}}>Tạo lúc {new Date(c.created_at).toLocaleDateString('vi-VN')}</span>
      </div>
      <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.15)',borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman,serif',fontSize:13,lineHeight:1.7,color:'#000',maxHeight:'60vh',overflowY:'auto'}}>
        <div style={{fontSize:20,fontWeight:900,color:CB.primary,borderBottom:'2px solid #000',paddingBottom:8,marginBottom:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>K&K <span style={{color:CB.accent}}>advertising</span></div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,textTransform:'uppercase'}}>{isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN'}</div>
          <div style={{fontSize:13,color:'#666'}}>Số: {c.contract_code}</div>
        </div>
        <p>Hôm nay, <strong>{fmtDate(c.sign_date)}</strong>, tại {c.sign_location||'Văn phòng Công Ty TNHH Quảng cáo K&K'}</p>
        <p style={{marginBottom:8}}>Chúng tôi gồm:</p>
        <div style={{marginBottom:10}}>
          <div style={{fontWeight:700,textTransform:'uppercase',marginBottom:4}}>BÊN A: {pA.name}</div>
          {pA.tax&&<div>Mã số thuế: {pA.tax}</div>}
          <div>Đại diện: <strong>{pA.rep}</strong> — {pA.title}</div>
          <div>Địa chỉ: {pA.address}</div>
          {pA.bank&&<div>STK: {pA.bank} — {pA.bankName}</div>}
          <div style={{fontSize:12,color:'#666',marginTop:2}}>(Sau đây gọi là "Bên A")</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:700,textTransform:'uppercase',marginBottom:4}}>BÊN B: {pB.name}</div>
          {pB.cccd&&<div>CCCD: {pB.cccd}</div>}
          {pB.tax&&<div>Mã số thuế: {pB.tax}</div>}
          <div>Địa chỉ: {pB.address}</div>
          {isClient&&<div>Đại diện: <strong>{pB.rep}</strong> — {pB.title}</div>}
          {pB.bank&&<div>STK: {pB.bank} — {pB.bankName}</div>}
          <div style={{fontSize:12,color:'#666',marginTop:2}}>(Sau đây gọi là "Bên B")</div>
        </div>
        {isClient&&kolList.length>0&&(
          <div style={{margin:'12px 0'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên KOL','Link TikTok','Nội dung','Chi phí'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>
                {kolList.map((k,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.tiktok}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.work}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>{cfmt(k.fee)}</td></tr>)}
                <tr style={{background:'#f0f0f0'}}><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>TOTAL + VAT ({c.vat_rate}%)</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>{cfmt(total)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{marginTop:12,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,fontSize:12}}>
          <div><strong>Giá trị HĐ:</strong> {cfmt(total)} VNĐ</div>
          <div style={{fontStyle:'italic',marginTop:2}}>Bằng chữ: {toWords(total)}</div>
          <div style={{marginTop:6}}><strong>Thanh toán:</strong> {c.payment_terms}</div>
        </div>
        <div style={{background:'rgba(26,86,219,0.04)',borderRadius:8,padding:'10px 12px',marginTop:12,fontSize:11.5,color:CB.textSec}}>
          <em>Hợp đồng bao gồm đầy đủ Điều 1–{isClient?'11':'8'} với điều khoản pháp lý chuẩn K&K. Nhấn "In / Export PDF" để xem toàn bộ nội dung.</em>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:28,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>Đại diện Bên A</div><div style={{fontSize:12,color:'#666'}}>{pA.title}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{pA.rep}</div></div>
          <div><div style={{fontWeight:700}}>{isClient?'Đại diện Bên B':'Bên B'}</div><div style={{fontSize:12,color:'#666'}}>{isClient?pB.title:'(Ký và ghi rõ họ tên)'}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{isClient?pB.rep:pB.name}</div></div>
        </div>
      </div>
      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}

// ══════════════════════════════════════════════════════════
// BBNT PAGE
// ══════════════════════════════════════════════════════════
function AcceptanceReports({data, supabase, reload, log}) {
  const [reports, setReports] = useState([])
  const [contracts, setContracts] = useState([])
  const [tab, setTab] = useState('client')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ loadData() },[tab])

  async function loadData() {
    setLoading(true)
    const [{data:rpts},{data:cnts}] = await Promise.all([
      supabase.from('acceptance_reports').select('*').order('created_at',{ascending:false}),
      supabase.from('contracts').select('*').eq('contract_type',tab)
    ])
    setReports(rpts||[])
    setContracts(cnts||[])
    setLoading(false)
  }

  const filtered = reports.filter(r => contracts.some(c=>c.id===r.contract_id))
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:CB.navy}}>Biên bản nghiệm thu</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo BBNT</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:'1px solid rgba(26,86,219,0.1)'}}>
        {[['client','🏢  BBNT Client'],['kol','👤  BBNT KOL/CTV']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':CB.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
          <thead><tr>{['Số BBNT','HĐ tham chiếu','Giá trị NT','Còn lại','Ngày ký','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading&&filtered.map(r=>{
              const ct=contracts.find(c=>c.id===r.contract_id)
              return <tr key={r.id}>
                <td style={{...TD,fontWeight:800,color:CB.primary}}>{r.report_code}</td>
                <td style={{...TD,fontWeight:600}}>{ct?.contract_code||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{cfmt(r.accepted_value)}</td>
                <td style={{...TD,fontWeight:700,color:Number(r.remaining_amount)>0?CB.warning:CB.success}}>{cfmt(r.remaining_amount)}</td>
                <td style={{...TD,fontSize:11,color:CB.textTer}}>{r.sign_date||'—'}</td>
                <td style={TD}><CBadge text={r.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem({report:r,contract:ct,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(r);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            })}
            {!loading&&!filtered.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:CB.textTer,fontSize:12}}>Chưa có biên bản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm&&<BBNTForm contracts={contracts} data={data} supabase={supabase} edit={editItem} type={tab} onClose={()=>{setShowForm(false);setEditItem(null)}} onSaved={()=>{loadData();reload();log('Lưu BBNT')}}/>}
      {viewItem&&<BBNTPreview report={viewItem.report} contract={viewItem.contract} type={viewItem.type} onClose={()=>setViewItem(null)}/>}
    </div>
  )
}

function BBNTForm({contracts, data, supabase, edit, type, onClose, onSaved}) {
  const [form, setForm] = useState({
    report_code: edit?.report_code || genCode('BBNT'),
    contract_id: edit?.contract_id || '',
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    actual_start_date: edit?.actual_start_date || '',
    actual_end_date: edit?.actual_end_date || new Date().toISOString().slice(0,10),
    deliverables: edit?.deliverables || [],
    contract_value: edit?.contract_value || 0,
    accepted_value: edit?.accepted_value || 0,
    paid_amount: edit?.paid_amount || 0,
    remaining_amount: edit?.remaining_amount || 0,
    payment_deadline: edit?.payment_deadline || (type==='kol'?15:30),
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const selectedContract = contracts.find(c=>c.id===form.contract_id)

  useEffect(()=>{
    if(selectedContract) {
      const kols = selectedContract.kol_list||[]
      set('contract_value', selectedContract.total_with_vat||0)
      set('accepted_value', selectedContract.total_with_vat||0)
      set('actual_start_date', selectedContract.start_date||'')
      set('deliverables', kols.length>0
        ? kols.map((k,i)=>({stt:i+1,name:k.name,link:'',result:'Hoàn thành 100%'}))
        : [{stt:1,name:selectedContract.party_b_name||'',link:'',result:'Hoàn thành 100%'}]
      )
    }
  },[form.contract_id])

  useEffect(()=>{
    set('remaining_amount', Math.max(0, Number(form.accepted_value||0)-Number(form.paid_amount||0)))
  },[form.accepted_value, form.paid_amount])

  const updD=(i,k,v)=>{const a=[...form.deliverables];a[i]={...a[i],[k]:v};set('deliverables',a)}
  const addD=()=>set('deliverables',[...form.deliverables,{stt:form.deliverables.length+1,name:'',link:'',result:'Hoàn thành 100%'}])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload={
      report_code:form.report_code, contract_id:form.contract_id||null,
      project_id:selectedContract?.project_id||null,
      sign_date:form.sign_date||null, actual_start_date:form.actual_start_date||null,
      actual_end_date:form.actual_end_date||null, deliverables:form.deliverables,
      contract_value:Number(form.contract_value||0), accepted_value:Number(form.accepted_value||0),
      paid_amount:Number(form.paid_amount||0), remaining_amount:Number(form.remaining_amount||0),
      payment_deadline:Number(form.payment_deadline||30), status:form.status, notes:form.notes
    }
    let error
    if(edit){({error}=await supabase.from('acceptance_reports').update(payload).eq('id',edit.id))}
    else{({error}=await supabase.from('acceptance_reports').insert([payload]))}
    if(error){alert('Lỗi: '+error.message);return}
    onSaved();onClose()
  }

  return (
    <CModal title={edit?'Sửa BBNT':'Tạo biên bản nghiệm thu'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Thông tin biên bản">
          <CRow3>
            <CFG label="Số BBNT" required><input value={form.report_code} onChange={e=>set('report_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="HĐ tham chiếu" required>
              <select value={form.contract_id} onChange={e=>set('contract_id',e.target.value)} style={CINP_S} required>
                <option value="">— Chọn hợp đồng —</option>
                {contracts.map(c=><option key={c.id} value={c.id}>{c.contract_code} — {type==='client'?c.party_a_name:c.party_b_name}</option>)}
              </select>
            </CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Ngày ký BBNT"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Thời gian thực hiện">
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="date" value={form.actual_start_date} onChange={e=>set('actual_start_date',e.target.value)} style={{...CINP_S,flex:1}}/>
                <span style={{color:CB.textTer,fontSize:12,flexShrink:0}}>→</span>
                <input type="date" value={form.actual_end_date} onChange={e=>set('actual_end_date',e.target.value)} style={{...CINP_S,flex:1}}/>
              </div>
            </CFG>
          </CRow2>
        </CSec>

        {selectedContract&&(
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid rgba(26,86,219,0.1)',fontSize:12}}>
            <strong>{selectedContract.contract_code}</strong> — {type==='client'?selectedContract.party_a_name:selectedContract.party_b_name} — <span style={{color:CB.primary,fontWeight:700}}>{cfmt(selectedContract.total_with_vat)} VND</span>
          </div>
        )}

        <CSec title="Kết quả nghiệm thu">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead><tr>{['STT','Tên / Kênh','Link video/air','Kết quả',''].map(h=><th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {form.deliverables.map((d,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 4px',fontSize:11,textAlign:'center',color:CB.textTer}}>{i+1}</td>
                  <td style={{padding:'5px 4px'}}><input value={d.name} onChange={e=>updD(i,'name',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="Tên KOL / kênh"/></td>
                  <td style={{padding:'5px 4px'}}><input value={d.link} onChange={e=>updD(i,'link',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="https://tiktok.com/@..."/></td>
                  <td style={{padding:'5px 4px'}}><input value={d.result} onChange={e=>updD(i,'result',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}}/></td>
                  <td><button type="button" onClick={()=>set('deliverables',form.deliverables.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:CB.danger,fontSize:18,lineHeight:1}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addD}>+ Thêm dòng</CBtn>
        </CSec>

        <CSec title="Điều khoản thanh toán">
          <CRow2>
            <CFG label="Giá trị theo HĐ (VND)"><input type="number" value={form.contract_value} onChange={e=>set('contract_value',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Giá trị nghiệm thu (VND)"><input type="number" value={form.accepted_value} onChange={e=>set('accepted_value',Number(e.target.value))} style={CINP_S}/></CFG>
          </CRow2>
          <CRow3>
            <CFG label="Đã thanh toán (VND)"><input type="number" value={form.paid_amount} onChange={e=>set('paid_amount',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Còn phải thanh toán">
              <div style={{padding:'9px 12px',background:Number(form.remaining_amount)>0?'rgba(217,119,6,0.08)':'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:Number(form.remaining_amount)>0?CB.warning:CB.success,border:`1px solid ${Number(form.remaining_amount)>0?CB.warning:CB.success}30`}}>{cfmt(form.remaining_amount)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.remaining_amount)}</div>
            </CFG>
            <CFG label="TT trong (ngày làm việc)"><input type="number" value={form.payment_deadline} onChange={e=>set('payment_deadline',Number(e.target.value))} style={CINP_S}/></CFG>
          </CRow3>
        </CSec>

        <CFG label="Ghi chú"><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...CINP_S,minHeight:60}}/></CFG>

        <CMFoot onClose={onClose} label="Lưu BBNT" onDelete={edit?async()=>{await supabase.from('acceptance_reports').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

function BBNTPreview({report:r, contract:c, type, onClose}) {
  const isClient = type==='client'
  const pA = isClient
    ? {name:c?.party_a_name,tax:c?.party_a_tax,address:c?.party_a_address,rep:c?.party_a_rep,title:c?.party_a_title,bank:c?.party_a_bank_account,bankName:c?.party_a_bank_name}
    : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName}
  const pB = isClient
    ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName}
    : {name:c?.party_b_name,cccd:c?.party_b_cccd,address:c?.party_b_address,bank:c?.party_b_bank_account,bankName:c?.party_b_bank_name}
  const dels = r.deliverables||[]

  function printBBNT() {
    const w=window.open('','_blank')
    const delTable = dels.length ? `
      <table><thead><tr><th>STT</th><th>Tên / Kênh</th><th>Link Air</th><th>Kết quả</th></tr></thead>
      <tbody>${dels.map((d,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${d.name}</td><td>${d.link}</td><td>${d.result}</td></tr>`).join('')}
      </tbody></table>` : ''

    w.document.write(`<html><head><title>${r.report_code}</title>
    <style>body{font-family:'Times New Roman',serif;font-size:13px;margin:40px 50px;color:#000;line-height:1.7}h1{text-align:center;font-size:17px;font-weight:bold;text-transform:uppercase;margin:10px 0 4px}h2{text-align:center;font-size:13px;margin:0 0 12px;font-style:italic}h3{font-size:13px;font-weight:bold;margin:14px 0 6px;text-transform:uppercase}p{margin:5px 0;text-align:justify}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #000;padding:5px 8px;font-size:12px}th{background:#f0f0f0;font-weight:bold;text-align:center}.logo{font-size:20px;font-weight:900;color:#1A56DB;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px}.sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}.footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}@media print{body{margin:20px 25px}}</style>
    </head><body>
    <div class="logo">K&K advertising</div>
    <h1>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</h1>
    <h2>Hợp Đồng số: ${c?.contract_code||'—'}</h2>
    <p><em>Căn cứ Hợp đồng số: ${c?.contract_code||'—'} ngày ${fmtDate(c?.sign_date)} giữa ${pA.name} và ${pB.name};</em></p>
    <p><em>Căn cứ vào kết quả thực hiện Hợp Đồng,</em></p>
    <p>Hôm nay, <strong>${fmtDate(r.sign_date)}</strong>, chúng tôi gồm:</p>
    <p><strong>BÊN A: ${pA.name}</strong></p>
    ${pA.tax?`<p>Mã số thuế: ${pA.tax}</p>`:''}
    <p>Đại diện: <strong>${pA.rep}</strong> — Chức danh: ${pA.title}</p>
    <p>Địa chỉ: ${pA.address}</p>
    ${pA.bank?`<p>STK: ${pA.bank} — Ngân hàng: ${pA.bankName}</p>`:''}
    <p><em>(Sau đây gọi là "Bên A")</em></p>
    <p><strong>BÊN B: ${pB.name}</strong></p>
    ${pB.cccd?`<p>CCCD: ${pB.cccd}</p>`:''}
    ${pB.tax?`<p>Mã số thuế: ${pB.tax}</p>`:''}
    <p>Địa chỉ: ${pB.address}</p>
    ${isClient?`<p>Đại diện: <strong>${pB.rep}</strong> — Chức danh: ${pB.title}</p>`:''}
    ${pB.bank?`<p>STK: ${pB.bank} — Ngân hàng: ${pB.bankName}</p>`:''}
    <p><em>(Sau đây gọi là "Bên B")</em></p>
    <h3>ĐIỀU 1. ĐIỀU KHOẢN NGHIỆM THU</h3>
    <p>Bên ${isClient?'B':'A'} đã hoàn thành dịch vụ theo thỏa thuận tại Hợp Đồng và yêu cầu của Bên ${isClient?'A':'B'}.</p>
    <p>Thời gian thực hiện thực tế: ${fmtDate(r.actual_start_date)} đến ${fmtDate(r.actual_end_date)}</p>
    ${delTable}
    <h3>ĐIỀU 2. ĐIỀU KHOẢN THANH TOÁN</h3>
    <p>- Phí dịch vụ theo Hợp đồng đã ký: <strong>${cfmt(r.contract_value)} đồng</strong></p>
    <p>- Giá trị nghiệm thu: <strong>${cfmt(r.accepted_value)} đồng</strong></p>
    <p>- Giá trị thực tế Bên A đã thanh toán: <strong>${cfmt(r.paid_amount)} đồng</strong></p>
    <p>- Giá trị Bên A còn phải thanh toán: <strong>${cfmt(r.remaining_amount)} đồng</strong></p>
    <p><em>Bằng chữ: ${toWords(r.remaining_amount)}</em></p>
    <p>Tiến độ thanh toán: 100% trong vòng ${r.payment_deadline} ngày làm việc sau khi ký BBNT.</p>
    ${r.notes?`<p><em>Lưu ý: ${r.notes}</em></p>`:''}
    <p><em>(Lưu ý: trong vòng 02 ngày làm việc tính từ khi Bên B gửi Biên Bản Nghiệm Thu nhưng chưa nhận được sự phản hồi từ Bên A, thì mặc định Biên Bản Nghiệm Thu này được thanh lý.)</em></p>
    <h3>ĐIỀU 3. ĐIỀU KHOẢN CHUNG</h3>
    <p>1. Biên Bản có hiệu lực kể từ ngày ký, hai Bên thống nhất nghiệm thu và không có bất cứ tranh chấp, khiếu nại nào.</p>
    <p>2. Hợp Đồng tự động thanh lý ngay sau Bên A hoàn tất việc thanh toán cho Bên B.</p>
    <p>3. Biên bản được lập thành 02 bản có giá trị pháp lý như nhau, mỗi Bên giữ 01 bản.</p>
    <div class="sig">
      <div><p><strong>ĐẠI DIỆN BÊN A</strong></p><p>${pA.title}</p><br><br><br><p><strong>${pA.rep}</strong></p></div>
      <div><p><strong>${isClient?'ĐẠI DIỆN BÊN B':'BÊN B'}</strong></p><p>${isClient?pB.title:'(Ký ghi rõ họ, tên)'}</p><br><br><br><p><strong>${isClient?pB.rep:pB.name}</strong></p></div>
    </div>
    <div class="footer">A: ${KNK.address} | P: ${KNK.phone} | E: ${KNK.email}</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(),600)
  }

  return (
    <CModal title={`Preview BBNT: ${r.report_code}`} onClose={onClose} wide>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <CBtn primary onClick={printBBNT}>🖨️ In / Export PDF</CBtn>
        <CBadge text={r.status}/>
      </div>
      <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.15)',borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman,serif',fontSize:13,lineHeight:1.7,color:'#000',maxHeight:'60vh',overflowY:'auto'}}>
        <div style={{fontSize:20,fontWeight:900,color:CB.primary,borderBottom:'2px solid #000',paddingBottom:8,marginBottom:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>K&K <span style={{color:CB.accent}}>advertising</span></div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,textTransform:'uppercase'}}>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</div>
          <div style={{fontSize:13,fontStyle:'italic',color:'#666'}}>Hợp Đồng số: {c?.contract_code||'—'}</div>
        </div>
        <p><em>Căn cứ HĐ số: {c?.contract_code} ngày {fmtDate(c?.sign_date)}</em></p>
        <p>Hôm nay, <strong>{fmtDate(r.sign_date)}</strong>, chúng tôi gồm:</p>
        <div style={{marginBottom:8}}><strong>BÊN A:</strong> {pA.name} — ĐD: {pA.rep}</div>
        <div style={{marginBottom:12}}><strong>BÊN B:</strong> {pB.name}{pB.cccd?` — CCCD: ${pB.cccd}`:''}</div>
        {dels.length>0&&(
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,margin:'10px 0'}}>
            <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên/Kênh','Link Air','Kết quả'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
            <tbody>{dels.map((d,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',fontSize:11}}>{d.link}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.result}</td></tr>)}</tbody>
          </table>
        )}
        <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:12}}>
          <div>Giá trị HĐ: <strong>{cfmt(r.contract_value)} VND</strong></div>
          <div>Giá trị NT: <strong>{cfmt(r.accepted_value)} VND</strong></div>
          <div>Đã thanh toán: <strong>{cfmt(r.paid_amount)} VND</strong></div>
          <div>Còn lại: <strong style={{color:Number(r.remaining_amount)>0?CB.warning:CB.success}}>{cfmt(r.remaining_amount)} VND</strong></div>
          <div style={{fontStyle:'italic',marginTop:4}}>Bằng chữ: {toWords(r.remaining_amount)}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:28,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>ĐẠI DIỆN BÊN A</div><div style={{fontSize:12,color:'#666'}}>{pA.title}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{pA.rep}</div></div>
          <div><div style={{fontWeight:700}}>{isClient?'ĐẠI DIỆN BÊN B':'BÊN B'}</div><div style={{fontSize:12,color:'#666'}}>{isClient?pB.title:'(Ký ghi rõ họ tên)'}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{isClient?pB.rep:pB.name}</div></div>
        </div>
      </div>
      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}



// ════════════════════════════════════════════════════════════
// AUTH + PERMISSIONS MODULE — K&K Agency OS
// ════════════════════════════════════════════════════════════

const MODULES = [
  {id:'dashboard',label:'Dashboard',icon:'⬡',grp:'OVERVIEW'},
  {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
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
]

const AVATAR_COLORS = [
  '#1A56DB','#059669','#DC2626','#D97706','#7C3AED',
  '#0891B2','#DB2777','#16A34A','#EA580C','#6366F1'
]

// Simple hash for password (client-side only — not for production security)
function simpleHash(str) {
  let hash = 0
  for(let i=0;i<str.length;i++){hash=((hash<<5)-hash)+str.charCodeAt(i);hash|=0}
  return Math.abs(hash).toString(36)
}

function getInitials(name) {
  return (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
}

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

// ── PERMISSION MANAGER (CEO only) ────────────────────────
function PermissionManager({account, supabase, onClose}) {
  const [perms, setPerms] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(()=>{loadPerms()},[])

  async function loadPerms() {
    const {data} = await supabase.from('permissions').select('*').eq('team_account_id', account.id)
    const map = {}
    MODULES.forEach(m => {
      const p = data?.find(d=>d.module===m.id)
      map[m.id] = {
        can_view: p?.can_view||false,
        can_create: p?.can_create||false,
        can_edit: p?.can_edit||false,
        can_delete: p?.can_delete||false,
      }
    })
    setPerms(map)
  }

  function toggle(module, perm) {
    setPerms(prev=>({...prev,[module]:{...prev[module],[perm]:!prev[module]?.[perm]}}))
  }

  function setAll(module, val) {
    setPerms(prev=>({...prev,[module]:{can_view:val,can_create:val,can_edit:val,can_delete:val}}))
  }

  function setViewOnly(module) {
    setPerms(prev=>({...prev,[module]:{can_view:true,can_create:false,can_edit:false,can_delete:false}}))
  }

  async function save() {
    setSaving(true)
    for(const [module, p] of Object.entries(perms)) {
      await supabase.from('permissions').upsert({
        team_account_id: account.id,
        module, ...p
      }, {onConflict: 'team_account_id,module'})
    }
    setSaving(false); setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  const grps = [...new Set(MODULES.map(m=>m.grp))]
  const permCols = ['can_view','can_create','can_edit','can_delete']
  const permLabels = {can_view:'Xem',can_create:'Tạo',can_edit:'Sửa',can_delete:'Xóa'}

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:700,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Phân quyền — {account.name}</div>
            <div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{account.email} · {account.role}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>

        {grps.map(grp=>(
          <div key={grp} style={{marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:800,color:'#94A3B8',letterSpacing:'0.1em',marginBottom:8,textTransform:'uppercase'}}>{grp}</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'left',padding:'5px 8px',borderBottom:'1px solid rgba(26,86,219,0.1)'}}>Module</th>
                  {permCols.map(p=><th key={p} style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'center',padding:'5px 8px',width:70,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>{permLabels[p]}</th>)}
                  <th style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'center',padding:'5px 8px',width:120,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>Nhanh</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.filter(m=>m.grp===grp).map(m=>(
                  <tr key={m.id} style={{borderBottom:'1px solid rgba(26,86,219,0.04)'}}>
                    <td style={{padding:'8px 8px',fontSize:12.5,fontWeight:500,color:'#0F172A'}}>
                      <span style={{marginRight:8,opacity:0.6}}>{m.icon}</span>{m.label}
                    </td>
                    {permCols.map(p=>(
                      <td key={p} style={{textAlign:'center',padding:'8px'}}>
                        <input type="checkbox" checked={perms[m.id]?.[p]||false}
                          onChange={()=>toggle(m.id,p)}
                          style={{width:16,height:16,cursor:'pointer',accentColor:'#1A56DB'}}
                        />
                      </td>
                    ))}
                    <td style={{textAlign:'center',padding:'8px'}}>
                      <div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <button onClick={()=>setAll(m.id,true)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(5,150,105,0.3)',background:'rgba(5,150,105,0.08)',color:'#059669',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Tất cả</button>
                        <button onClick={()=>setViewOnly(m.id)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(26,86,219,0.3)',background:'rgba(26,86,219,0.08)',color:'#1A56DB',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Chỉ xem</button>
                        <button onClick={()=>setAll(m.id,false)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
          <button onClick={onClose} style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Đóng</button>
          <button onClick={save} disabled={saving} style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>
            {saving?'Đang lưu...':(saved?'✓ Đã lưu!':'Lưu phân quyền')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── TEAM PAGE (nâng cấp với accounts + permissions) ──────
function TeamPage({data, supabase, reload, log, currentUser}) {
  const [accounts, setAccounts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editPerms, setEditPerms] = useState(null)
  const [editAcc, setEditAcc] = useState(null)

  useEffect(()=>{ loadAccounts() },[])

  async function loadAccounts() {
    const {data:accs} = await supabase.from('team_accounts')
      .select('*, team(*), permissions(*)').order('created_at',{ascending:false})
    setAccounts(accs||[])
  }

  async function deactivate(id) {
    if(!confirm('Khoá tài khoản này?')) return
    await supabase.from('team_accounts').update({is_active:false}).eq('id',id)
    loadAccounts()
  }

  async function activate(id) {
    await supabase.from('team_accounts').update({is_active:true}).eq('id',id)
    loadAccounts()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Team & Accounts</h2>
        {currentUser?.isMaster && <button onClick={()=>setShowAdd(true)} style={{padding:'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>+ Thêm thành viên</button>}
      </div>

      {/* Capacity cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14,marginBottom:20}}>
        {data.team.map((m,i)=>{
          const active = data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length
          const util = m.max_projects?Math.round(active/m.max_projects*100):0
          const col = AVATAR_COLORS[i%AVATAR_COLORS.length]
          const init = getInitials(m.name)
          const acc = accounts.find(a=>a.team_id===m.id)
          return (
            <div key={m.id} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${col},${col}88)`}}/>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:m.avatar_color||col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 12px ${col}40`}}>
                  {m.avatar_initials||init}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:13.5,color:'#0F172A'}}>{m.name}</div>
                  <div style={{fontSize:11,color:'#94A3B8',marginTop:1}}>{m.role}</div>
                  {acc&&<div style={{fontSize:10,color:acc.is_active?'#059669':'#DC2626',fontWeight:600,marginTop:2}}>{acc.is_active?'● Online account':'● Bị khoá'}</div>}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:11}}>
                <span style={{color:'#475569'}}>Projects: <strong style={{color:'#0F172A'}}>{active}/{m.max_projects||5}</strong></span>
                <span style={{fontWeight:800,color:util>=80?'#DC2626':util>=60?'#D97706':'#059669'}}>{util}%</span>
              </div>
              <div style={{height:6,background:'rgba(26,86,219,0.08)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:util+'%',background:util>=80?'#DC2626':'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99}}/>
              </div>
              {currentUser?.isMaster && (
                <div style={{display:'flex',gap:6,marginTop:12}}>
                  {acc ? (
                    <>
                      <button onClick={()=>setEditPerms(acc)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Phân quyền</button>
                      {acc.is_active
                        ? <button onClick={()=>deactivate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                        : <button onClick={()=>activate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(5,150,105,0.2)',background:'rgba(5,150,105,0.06)',color:'#059669',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Mở</button>
                      }
                    </>
                  ) : (
                    <button onClick={()=>setShowAdd(m)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1.5px dashed rgba(26,86,219,0.3)',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Tạo tài khoản</button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Accounts table */}
      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              {['Thành viên','Email','SĐT','Role','Lần cuối đăng nhập','Trạng thái','Quyền truy cập',''].map(h=>(
                <th key={h} style={{padding:'10px 14px',fontSize:10,fontWeight:800,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map(a=>{
              const modCount = a.permissions?.filter(p=>p.can_view).length||0
              return (
                <tr key={a.id}>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:a.avatar_color||'#1A56DB',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0}}>
                        {a.avatar_initials||getInitials(a.team?.name||a.email)}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:12.5,color:'#0F172A'}}>{a.team?.name||'—'}</div>
                        <div style={{fontSize:10.5,color:'#94A3B8'}}>{a.team?.role||'Staff'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#475569'}}>{a.email}</td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#475569'}}>{a.phone||'—'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}><span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:600}}>{a.team?.role||'Staff'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>{a.last_login?new Date(a.last_login).toLocaleDateString('vi-VN'):'Chưa đăng nhập'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}><span style={{background:a.is_active?'rgba(5,150,105,0.1)':'rgba(220,38,38,0.1)',color:a.is_active?'#059669':'#DC2626',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:700}}>{a.is_active?'Active':'Khoá'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#1A56DB',fontWeight:600}}>{modCount}/{MODULES.length} modules</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
                    {currentUser?.isMaster && (
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>setEditPerms(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Quyền</button>
                        <button onClick={()=>setEditAcc(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Edit</button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {!accounts.length&&<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có tài khoản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd && <AddAccountForm supabase={supabase} teamMembers={data.team} preselected={typeof showAdd==='object'?showAdd:null} onClose={()=>setShowAdd(false)} onSaved={()=>{loadAccounts();reload();log('Thêm account')}}/>}
      {editPerms && <PermissionManager account={{...editPerms,name:editPerms.team?.name||editPerms.email,role:editPerms.team?.role}} supabase={supabase} onClose={()=>setEditPerms(null)}/>}
      {editAcc && <EditAccountForm account={editAcc} supabase={supabase} onClose={()=>setEditAcc(null)} onSaved={()=>{loadAccounts();log('Cập nhật account')}}/>}
    </div>
  )
}

// ── ADD ACCOUNT FORM ─────────────────────────────────────
function AddAccountForm({supabase, teamMembers, preselected, onClose, onSaved}) {
  const [form, setForm] = useState({
    team_id: preselected?.id||'',
    name: preselected?.name||'',
    role: preselected?.role||'Account Manager',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    avatar_color: AVATAR_COLORS[Math.floor(Math.random()*AVATAR_COLORS.length)],
    max_projects: 5,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))

  async function handleSubmit(e) {
    e.preventDefault()
    if(form.password !== form.confirm_password) { setError('Mật khẩu không khớp!'); return }
    if(form.password.length < 6) { setError('Mật khẩu ít nhất 6 ký tự!'); return }
    setSaving(true); setError('')

    // Create or get team member
    let teamId = form.team_id
    if(!teamId && form.name) {
      const {data:newMember,error:teamErr} = await supabase.from('team').insert([{
        name:form.name, role:form.role, email:form.email, phone:form.phone,
        max_projects:Number(form.max_projects||5),
        avatar_color:form.avatar_color,
        avatar_initials:getInitials(form.name)
      }]).select().single()
      if(teamErr){setError('Lỗi tạo thành viên: '+teamErr.message);setSaving(false);return}
      teamId = newMember.id
    }

    const {error:accErr} = await supabase.from('team_accounts').insert([{
      team_id: teamId,
      email: form.email.toLowerCase(),
      phone: form.phone,
      password_hash: simpleHash(form.password),
      avatar_color: form.avatar_color,
      avatar_initials: getInitials(form.name),
      is_active: true
    }])
    if(accErr){setError('Lỗi tạo tài khoản: '+accErr.message);setSaving(false);return}
    setSaving(false); onSaved(); onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:520,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Thêm thành viên & tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Avatar preview */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(26,86,219,0.04)',borderRadius:12,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:form.avatar_color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${form.avatar_color}50`,flexShrink:0}}>
              {getInitials(form.name||'?')}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#475569',marginBottom:8}}>Màu Avatar</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>set('avatar_color',c)} style={{width:22,height:22,borderRadius:'50%',background:c,cursor:'pointer',border:form.avatar_color===c?'3px solid #0F172A':'3px solid transparent',transition:'border 0.1s'}}/>
                ))}
              </div>
            </div>
          </div>

          {!preselected && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#475569',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>Thành viên hiện có</div>
              <select value={form.team_id} onChange={e=>{const m=teamMembers.find(t=>t.id===e.target.value);set('team_id',e.target.value);if(m){set('name',m.name);set('role',m.role)}}} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none'}}>
                <option value="">— Tạo thành viên mới —</option>
                {teamMembers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}

          {!form.team_id && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:4}}>
              {[['Họ và tên *','name','text',''],['Role','role','text','']].map(([l,k,t,ph])=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}} required={k==='name'}/>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[['Email *','email','email'],['Số điện thoại','phone','tel'],['Mật khẩu *','password','password'],['Xác nhận mật khẩu *','confirm_password','password']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}} required={['email','password','confirm_password'].includes(k)}/>
              </div>
            ))}
          </div>

          {error&&<div style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#DC2626',marginBottom:16,fontWeight:500}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {saving?'Đang tạo...':'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── EDIT ACCOUNT FORM ────────────────────────────────────
function EditAccountForm({account, supabase, onClose, onSaved}) {
  const [color, setColor] = useState(account.avatar_color||'#1A56DB')
  const [phone, setPhone] = useState(account.phone||'')
  const [newPwd, setNewPwd] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const upd = {avatar_color:color, phone, avatar_initials:getInitials(account.team?.name||account.email)}
    if(newPwd.length>=6) upd.password_hash = simpleHash(newPwd)
    await supabase.from('team_accounts').update(upd).eq('id',account.id)
    if(account.team_id) {
      await supabase.from('team').update({avatar_color:color,avatar_initials:getInitials(account.team?.name||''),phone}).eq('id',account.team_id)
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:420,maxWidth:'95vw',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Chỉnh sửa tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={save}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(26,86,219,0.04)',borderRadius:12}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${color}50`,flexShrink:0}}>
              {account.avatar_initials||getInitials(account.team?.name||account.email)}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:'#0F172A'}}>{account.team?.name||account.email}</div>
              <div style={{fontSize:11,color:'#94A3B8',marginBottom:8}}>{account.email}</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>setColor(c)} style={{width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border:color===c?'3px solid #0F172A':'3px solid transparent'}}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Số điện thoại</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Đổi mật khẩu mới (để trống nếu không đổi)</label>
            <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} type="password" placeholder="Mật khẩu mới (≥6 ký tự)" style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {saving?'Đang lưu...':'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
