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
  useEffect(()=>{loadAll()},[])

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
  async function log(msg){await supabase.from('audit_log').insert([{message:msg,role:'User'}])}

  const NAV=[
    {id:'dashboard',label:'Dashboard',icon:'⬡',grp:'OVERVIEW'},
    {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
    {id:'projects',label:'Dự án',icon:'◉',grp:'OPERATIONS'},
    {id:'pricing',label:'Pricing Engine',icon:'◎',grp:'OPERATIONS'},
    {id:'invoices',label:'Hóa đơn',icon:'▤',grp:'OPERATIONS'},
    {id:'approval',label:'Approvals',icon:'✦',grp:'OPERATIONS'},
    {id:'clients',label:'Clients',icon:'◑',grp:'DATA'},
    {id:'kols',label:'KOL / KOC',icon:'◐',grp:'DATA'},
    {id:'vendors',label:'Vendors',icon:'◫',grp:'DATA'},
    {id:'team',label:'Team',icon:'◒',grp:'DATA'},
    {id:'reports',label:'Analytics',icon:'▨',grp:'INSIGHTS'},
  ]
  const groups=[...new Set(NAV.map(n=>n.grp))]
  const pending=data.approvals.filter(a=>a.status==='Pending').length
  const overdue=data.invoices.filter(i=>i.status==='Overdue').length

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
  return(
    <div style={{display:'flex',height:'100vh',fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",background:B.bgMesh,overflow:'hidden'}}>
      {/* SIDEBAR */}
      <div style={{width:sidebarCollapsed?64:232,background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRight:`1px solid ${B.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,transition:'width 0.25s ease',boxShadow:'4px 0 24px rgba(26,86,219,0.06)'}}>
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
          <span style={{flex:1,fontWeight:900,fontSize:16,color:B.navy,letterSpacing:'-0.02em'}}>{NAV.find(n=>n.id===page)?.label}</span>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:11,color:B.textTer,background:B.gradSoft,padding:'5px 12px',borderRadius:99,border:`1px solid ${B.border}`,fontWeight:600}}>
              {new Date().toLocaleDateString('vi-VN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
            </div>
            <div style={{width:34,height:34,borderRadius:'50%',background:B.gradPrimary,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:900,boxShadow:`0 3px 10px ${B.primaryGlow}`,cursor:'pointer'}}>K</div>
          </div>
        </div>
        {/* Content */}
        <div style={{flex:1,overflow:'auto',padding:24}}>
          {page==='dashboard'&&<Dashboard {...P} setPage={setPage}/>}
          {page==='pipeline'&&<Pipeline {...P}/>}
          {page==='projects'&&<Projects {...P}/>}
          {page==='pricing'&&<Pricing {...P}/>}
          {page==='invoices'&&<Invoices {...P}/>}
          {page==='approval'&&<Approval {...P}/>}
          {page==='clients'&&<Clients {...P}/>}
          {page==='kols'&&<Kols {...P}/>}
          {page==='vendors'&&<Vendors {...P}/>}
          {page==='team'&&<Team {...P}/>}
          {page==='reports'&&<Reports {...P}/>}
        </div>
      </div>
    </div>
  )
}

function Dashboard({data,setPage}){
  const rev=data.projects.reduce((a,p)=>a+Number(p.revenue||0),0)
  const cost=data.projects.reduce((a,p)=>a+Number(p.actual_cost||0),0)
  const profit=rev-cost
  const margin=rev?Math.round(profit/rev*100):0
  const active=data.projects.filter(p=>p.status==='Active').length
  const overdue=data.invoices.filter(i=>i.status==='Overdue')
  const pending=data.approvals.filter(a=>a.status==='Pending')
  const svcs=['KOL/KOC','Performance','Creative','Event','PR','Consulting']
  return(
    <div>
      {/* KPI Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <div style={{gridColumn:'span 1',background:B.gradPrimary,borderRadius:20,padding:'22px 24px',position:'relative',overflow:'hidden',boxShadow:`0 8px 32px ${B.primaryGlow}`}}>
          <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
          <div style={{position:'absolute',bottom:-30,right:20,width:70,height:70,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
          <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>TOTAL REVENUE</div>
          <div style={{fontSize:32,fontWeight:900,color:'#fff',letterSpacing:'-0.04em',lineHeight:1}}>{fmtS(rev)}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:6,fontWeight:600}}>VND · {data.projects.length} dự án</div>
        </div>
        <StatCard label="Tổng Profit" value={fmtS(profit)} sub={margin+'% margin'} color={B.success}/>
        <StatCard label="Active Projects" value={active} sub={data.projects.length+' tổng cộng'} color={B.accent}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <StatCard label="KOL Database" value={data.kols.length} sub="contacts" color="#7C3AED"/>
        <StatCard label="Clients" value={data.clients.length} sub="đang hợp tác" color={B.primary}/>
        <StatCard label="Công nợ quá hạn" value={overdue.length} sub={overdue.length?'Cần xử lý ngay':'Tất cả ổn ✓'} color={overdue.length?B.danger:B.success}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:16,marginBottom:16}}>
        <Card title="Doanh thu theo Service" glow>
          {svcs.map((s,i)=>{
            const r=data.projects.filter(p=>p.service===s).reduce((a,p)=>a+Number(p.revenue||0),0)
            const pct=rev?Math.round(r/rev*100):0
            return <div key={s} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,marginBottom:5}}>
                <span style={{fontWeight:600,color:B.text}}>{s}</span>
                <span style={{color:B.textTer,fontWeight:500}}>{fmtS(r)} <span style={{color:PALETTE[i],fontWeight:700}}>({pct}%)</span></span>
              </div>
              <div style={{height:7,background:B.border,borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:pct+'%',background:`linear-gradient(90deg,${PALETTE[i]},${PALETTE[i]}BB)`,borderRadius:99,transition:'width 0.5s ease'}}/>
              </div>
            </div>
          })}
        </Card>
        <div>
          <Card title="Dự án gần đây" action={<Btn sm onClick={()=>setPage('projects')}>Xem tất →</Btn>}>
            {data.projects.slice(0,4).map(p=>(
              <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${B.border}`}}>
                <div><div style={{fontWeight:700,fontSize:12,color:B.text}}>{p.campaign||'—'}</div><div style={{fontSize:10,color:B.textTer,marginTop:2}}>{p.client||'—'}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:11,fontWeight:800,color:B.primary}}>{fmtS(p.revenue)}</div><div style={{marginTop:3}}><Badge text={p.status}/></div></div>
              </div>
            ))}
            {!data.projects.length&&<Empty>Chưa có dự án nào</Empty>}
          </Card>
          <Card title="Công nợ & Approvals">
            {overdue.slice(0,2).map(i=>(
              <div key={i.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${B.border}`}}>
                <span style={{fontSize:11.5,fontWeight:600,color:B.text}}>{i.client}</span>
                <div style={{textAlign:'right'}}><span style={{fontSize:11,fontWeight:800,color:B.danger}}>{fmtS(Number(i.amount)-Number(i.paid))}</span><div style={{marginTop:2}}><Badge text={i.status}/></div></div>
              </div>
            ))}
            {pending.slice(0,2).map(a=>(
              <div key={a.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${B.border}`}}>
                <div style={{flex:1,minWidth:0,marginRight:8}}><div style={{fontSize:11.5,fontWeight:600,color:B.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</div></div>
                <Badge text={a.status}/>
              </div>
            ))}
            {!overdue.length&&!pending.length&&<Empty>Không có vấn đề gì ✓</Empty>}
          </Card>
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
