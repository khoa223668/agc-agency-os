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
const [data,setData]=useState({
  projects:[],
  clients:[],
  kols:[],
  team:[],
  invoices:[],
  deals:[],
  dealHistory:[],
  vendors:[],
  approvals:[],

  campaigns:[],
  clientContracts:[],
  kolContracts:[],
  deliverables:[],
  acceptanceReports:[]
})
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  useEffect(()=>{loadAll()},[])

async function loadAll(){
  try{
    setLoading(true)

    const tables=[
      'projects',
      'clients',
      'kols',
      'team',
      'invoices',
      'deals',
      'deal_history',
      'vendors',
      'approvals',

      // LEGAL MODULE
      'campaigns',
      'client_contracts',
      'kol_contracts',
      'deliverables',
      'acceptance_reports'
    ]

    const res = await Promise.all(
      tables.map(async (t)=>{
        const r = await supabase
          .from(t)
          .select('*')
          .order('created_at',{ascending:false})

        return r
      })
    )

    setData({
      projects:res[0]?.data || [],
      clients:res[1]?.data || [],
      kols:res[2]?.data || [],
      team:res[3]?.data || [],
      invoices:res[4]?.data || [],
      deals:res[5]?.data || [],
      dealHistory:res[6]?.data || [],
      vendors:res[7]?.data || [],
      approvals:res[8]?.data || [],

      campaigns:res[9]?.data || [],
      clientContracts:res[10]?.data || [],
      kolContracts:res[11]?.data || [],
      deliverables:res[12]?.data || [],
      acceptanceReports:res[13]?.data || []
    })

  }catch(err){
    console.error(err)
    alert('Load dữ liệu thất bại: '+err.message)
  }finally{
    setLoading(false)
  }
}
  async function add(t,r){const{error}=await supabase.from(t).insert([r]);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function upd(t,id,r){const{error}=await supabase.from(t).update(r).eq('id',id);if(error){alert('Lỗi: '+error.message);return false}await loadAll();return true}
  async function del(t,id){if(!confirm('Xác nhận xóa?'))return;await supabase.from(t).delete().eq('id',id);await loadAll()}
  const log = async (msg) => { await supabase.from('audit_log').insert([{message:msg,role:'User'}]) }

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
  const supabase_client = supabase
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
          {page==='contracts'&&<Contracts data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='bbnt'&&<AcceptanceReports data={data} supabase={supabase} reload={loadAll} log={log}/>}
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


// ═══════════════════════════════════════════════════════════
// CONTRACTS + BBNT MODULE — K&K Advertising Agency OS
// ═══════════════════════════════════════════════════════════

// ── KNK INFO (cố định) ──────────────────────────────────
const KNK = {
  name: 'CÔNG TY TNHH QUẢNG CÁO K&K',
  shortName: 'K&K Advertising',
  address: '737/7 Kha Vạn Cân, Phường Linh Xuân, TP. Hồ Chí Minh',
  taxCode: '0317776715',
  rep: 'TÔ NGUYỄN ĐĂNG KHOA',
  repTitle: 'Giám Đốc',
  bankAccount: '116002937563',
  bankName: 'VIETINBANK',
  bankBranch: 'HCM',
  phone: '0938 223 668',
  email: 'contact@weareknk.com',
  website: 'weareknk.com',
}

// ── CONTRACT UI HELPERS (extended versions) ─────────────
function Row3({children}){return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>{children}</div>}
function Sec({title,children}){return <div style={{marginBottom:20}}><div style={{fontSize:12,fontWeight:800,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'2px solid rgba(26,86,219,0.1)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</div>{children}</div>}
function CModal({title,children,onClose,wide}){return <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div style={{background:'rgba(255,255,255,0.98)',borderRadius:20,padding:'24px 28px',width:wide?860:580,maxWidth:'96vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15)',border:'1px solid rgba(26,86,219,0.1)'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}><span style={{fontSize:16,fontWeight:800,color:'#0F172A',letterSpacing:'-0.02em'}}>{title}</span><button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button></div>{children}</div></div>}
function CMFoot({onClose,onDelete,submitLabel}){return <div style={{display:'flex',justifyContent:'space-between',marginTop:18,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}><div>{onDelete&&<button type="button" onClick={onDelete} style={{padding:'5px 12px',borderRadius:9,border:'1.5px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xóa</button>}</div><div style={{display:'flex',gap:8}}><button type="button" onClick={onClose} style={{padding:'6px 14px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'rgba(255,255,255,0.7)',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button><button type="submit" style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{submitLabel||'Lưu'}</button></div></div>}
function CFG({label,children,required}){return <div style={{marginBottom:13}}><label style={{fontSize:11,fontWeight:700,color:'#475569',marginBottom:5,display:'block',letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}{required&&<span style={{color:'#DC2626',marginLeft:3}}>*</span>}</label>{children}</div>}
function CRow2({children}){return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>}
function CBadge({text}){const SC={Draft:'#94A3B8',Sent:'#1A56DB',Signed:'#059669',Completed:'#059669',Cancelled:'#DC2626',Pending:'#D97706'};const c=SC[text]||'#94A3B8';return <span style={{background:c+'18',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>}
function CCard({title,children,action,glow}){return <div style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(20px)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,padding:'18px 22px',marginBottom:16,boxShadow:glow?'0 4px 24px rgba(26,86,219,0.15)':'0 1px 4px rgba(0,0,0,0.04)',position:'relative',overflow:'hidden'}}>{glow&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',borderRadius:'16px 16px 0 0'}}/>}<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:13}}><span style={{fontSize:12.5,fontWeight:700,color:'#0F172A'}}>{title}</span>{action}</div>{children}</div>}
function CBtn({children,onClick,primary,sm,danger,type,style:s}){
  if(primary)return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',color:'#fff',cursor:'pointer',fontSize:sm?10.5:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",...s}}>{children}</button>
  if(danger)return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:'1.5px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626',cursor:'pointer',fontSize:sm?10.5:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",...s}}>{children}</button>
  return <button type={type||'button'} onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'rgba(255,255,255,0.7)',color:'#475569',cursor:'pointer',fontSize:sm?10.5:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",...s}}>{children}</button>
}
const CINP={style:{width:'100%',padding:'8px 11px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:8,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#FFFFFF',color:'#0F172A',outline:'none',boxSizing:'border-box'}}

// ── BRAND COLORS (reuse từ App) ──────────────────────────

const STATUS_COLOR = {
  Draft:'#94A3B8', Sent:'#1A56DB', Signed:'#059669',
  Completed:'#059669', Cancelled:'#DC2626', Pending:'#D97706'
}

function numToWords(n){
  const units=['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
  const teens=['mười','mười một','mười hai','mười ba','mười bốn','mười lăm','mười sáu','mười bảy','mười tám','mười chín']
  const tens=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi']
  if(!n||n===0)return'không đồng'
  if(n>=1e9){const b=Math.floor(n/1e9);return units[b]+' tỷ '+(n%1e9?numToWords(n%1e9):'')}
  if(n>=1e6){const m=Math.floor(n/1e6);const mw=m>=20?tens[Math.floor(m/10)]+(m%10?' '+units[m%10]:''):teens[m-10]||tens[Math.floor(m/10)]+' '+units[m%10];return mw+' triệu '+(n%1e6?numToWords(n%1e6):'')}
  if(n>=1e3){const k=Math.floor(n/1e3);return numToWords(k)+' nghìn '+(n%1e3?numToWords(n%1e3):'')}
  if(n>=100){const h=Math.floor(n/100);return units[h]+' trăm '+(n%100?numToWords(n%100):'')}
  if(n>=20)return tens[Math.floor(n/10)]+(n%10?' '+units[n%10]:'')
  if(n>=10)return teens[n-10]
  return units[n]
}
function toWords(n){const w=numToWords(Math.round(n));return w.trim().charAt(0).toUpperCase()+w.trim().slice(1)+' đồng./.'  }


// ══════════════════════════════════════════════════════════
// CONTRACTS PAGE
// ══════════════════════════════════════════════════════════

function Contracts({data, supabase, reload, log}) {
  const [tab, setTab] = useState('client') // 'client' | 'kol'
  const [contracts, setContracts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ loadContracts() }, [tab])

  async function loadContracts() {
    setLoading(true)
    const {data:rows} = await supabase.from('contracts').select('*').eq('contract_type',tab).order('created_at',{ascending:false})
    setContracts(rows||[])
    setLoading(false)
  }

  const filtered = contracts.filter(c =>
    !filter || (c.contract_code||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_a_name||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_b_name||'').toLowerCase().includes(filter.toLowerCase())
  )

  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Hợp đồng</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo hợp đồng</CBtn>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:`1px solid ${B.border}`}}>
        {[['client','🏢  HĐ Dịch vụ (Client)'],['kol','👤  HĐ Cộng tác viên (KOL)']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?B.gradPrimary:'transparent',color:tab===key?'#fff':B.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:'all 0.15s'}}>{label}</button>
        ))}
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[['Tổng HĐ',contracts.length],['Draft',contracts.filter(c=>c.status==='Draft').length],['Đã ký',contracts.filter(c=>c.status==='Signed').length],['Tổng giá trị',fmtS(contracts.reduce((a,c)=>a+Number(c.total_with_vat||0),0))+' VND']].map(([l,v])=>(
          <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'12px 16px',border:`1px solid ${B.border}`}}>
            <div style={{fontSize:10,fontWeight:700,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:20,fontWeight:900,color:B.primary,marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{marginBottom:14}}>
        <input placeholder="🔍  Tìm theo số HĐ, tên client, KOL..." value={filter} onChange={e=>setFilter(e.target.value)} style={{...CINP.style,maxWidth:360}}/>
      </div>

      {/* Table */}
      <div style={{background:'rgba(255,255,255,0.9)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>{['Số HĐ','Bên đối tác','Dự án','Giá trị (VND)','Ngày ký','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{textAlign:'center',padding:32,color:B.textTer}}>Đang tải...</td></tr>}
            {!loading&&filtered.map(c=>(
              <tr key={c.id}>
                <td style={{...TD,fontWeight:800,color:B.primary,fontSize:12}}>{c.contract_code}</td>
                <td style={{...TD,fontWeight:600}}>{tab==='client'?c.party_a_name:c.party_b_name}</td>
                <td style={{...TD,fontSize:11,color:B.textSec}}>{data.projects.find(p=>p.id===c.project_id)?.campaign||'—'}</td>
                <td style={{...TD,fontWeight:700,color:B.navy}}>{fmt(c.total_with_vat)}</td>
                <td style={{...TD,fontSize:11,color:B.textTer}}>{c.sign_date||'—'}</td>
                <td style={TD}><CBadge text={c.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem(c)}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(c);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            ))}
            {!loading&&!filtered.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>Chưa có hợp đồng nào</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        tab==='client'
          ? <ContractClientForm data={data} supabase={supabase} edit={editItem} onClose={()=>setShowForm(false)} onSaved={()=>{loadContracts();reload();log('Lưu HĐ client')}} />
          : <ContractKOLForm data={data} supabase={supabase} edit={editItem} onClose={()=>setShowForm(false)} onSaved={()=>{loadContracts();reload();log('Lưu HĐ KOL')}} />
      )}

      {/* View/Preview */}
      {viewItem && (
        <ContractPreview contract={viewItem} type={tab} onClose={()=>setViewItem(null)} />
      )}
    </div>
  )
}

// ── FORM HĐ CLIENT ───────────────────────────────────────
function ContractClientForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || generateCode('HDDV'),
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
    payment_terms: edit?.payment_terms || '30 ngày làm việc sau khi bên B hoàn tất toàn bộ công việc',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [dupWarnings, setDupWarnings] = useState([])
  const [saving, setSaving] = useState(false)

  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  // Auto-calc total
  useEffect(()=>{
    const vat = Number(form.total_fee||0) * Number(form.vat_rate||0) / 100
    set('total_with_vat', Number(form.total_fee||0) + vat)
  }, [form.total_fee, form.vat_rate])

  // Auto-fill từ client DB
  function fillFromClient(clientName) {
    const c = data.clients.find(cl => cl.name?.toLowerCase() === clientName?.toLowerCase())
    if (c) {
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

  // KOL list management
  const addKolRow = () => set('kol_list', [...form.kol_list, {stt:form.kol_list.length+1,name:'',tiktok:'',work:'Sản xuất 1 video theo yêu cầu của nhãn hàng',fee:0}])
  const updateKol = (i,k,v) => { const arr=[...form.kol_list]; arr[i]={...arr[i],[k]:v}; set('kol_list',arr); recalcTotal(arr) }
  const removeKol = (i) => { const arr=form.kol_list.filter((_,j)=>j!==i); set('kol_list',arr); recalcTotal(arr) }
  const recalcTotal = (arr) => set('total_fee', arr.reduce((a,k)=>a+Number(k.fee||0),0))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    // Check duplicate contract code
    if (!edit) {
      const {data:existing} = await supabase.from('contracts').select('id').eq('contract_code', form.contract_code)
      if (existing?.length > 0) {
        alert(`Số hợp đồng ${form.contract_code} đã tồn tại!`)
        setSaving(false); return
      }
    }

    // Check duplicate client
    if (!edit && form.party_a_tax) {
      const dups = await checkDuplicate(supabase, 'clients', [{field:'tax_code',value:form.party_a_tax,label:'Mã số thuế'}])
      if (dups.length > 0) {
        setDupWarnings(dups); setSaving(false); return
      }
    }

    await saveContract()
    setSaving(false)
  }

  async function saveContract() {
    const payload = {
      contract_code: form.contract_code,
      contract_type: 'client',
      project_id: form.project_id || null,
      party_a_name: form.party_a_name,
      party_a_tax: form.party_a_tax,
      party_a_address: form.party_a_address,
      party_a_rep: form.party_a_rep,
      party_a_title: form.party_a_title,
      party_a_bank_account: form.party_a_bank_account,
      party_a_bank_name: form.party_a_bank_name,
      party_b_name: 'CÔNG TY TNHH QUẢNG CÁO K&K',
      party_b_tax: '0317776715',
      party_b_address: '737/7 Kha Vạn Cân, Phường Linh Xuân, TP. Hồ Chí Minh',
      party_b_rep: 'TÔ NGUYỄN ĐĂNG KHOA',
      party_b_title: 'Giám Đốc',
      party_b_bank_account: '116002937563',
      party_b_bank_name: 'VIETINBANK Chi nhánh/PGD: HCM',
      service_type: form.service_type,
      scope_of_work: form.scope_of_work,
      kol_list: form.kol_list,
      total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||8),
      total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms,
      start_date: form.start_date || null,
      sign_date: form.sign_date || null,
      sign_location: form.sign_location,
      status: form.status,
      notes: form.notes,
      created_by: 'User'
    }
    if (edit) {
      const {error} = await supabase.from('contracts').update(payload).eq('id', edit.id)
      if(error){alert('Lỗi cập nhật: '+error.message);return}
    } else {
      const {error} = await supabase.from('contracts').insert([payload])
      if(error){alert('Lỗi lưu HĐ: '+error.message);return}
      // Auto-save client nếu chưa có
      const existing = data.clients.find(c=>c.tax_code===form.party_a_tax||c.name===form.party_a_name)
      if (!existing && form.party_a_name) {
        await supabase.from('clients').insert([{
          name: form.party_a_name, tax_code: form.party_a_tax,
          address: form.party_a_address, legal_rep: form.party_a_rep,
          legal_rep_title: form.party_a_title, bank_account: form.party_a_bank_account,
          bank_name: form.party_a_bank_name, since: new Date().toLocaleDateString('vi-VN')
        }])
      }
    }
    onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa hợp đồng dịch vụ':'Tạo hợp đồng dịch vụ (Bên A = Client)'} onClose={onClose} wide>
      {dupWarnings.length > 0 && (
        <DupWarning warnings={dupWarnings}
          onUseExisting={(rec)=>{fillFromClient(rec.name);setDupWarnings([])}}
          onContinue={()=>{setDupWarnings([]);saveContract()}}
          onCancel={()=>setDupWarnings([])}/>
      )}
      <form onSubmit={handleSubmit}>
        <Sec title="Thông tin hợp đồng">
          <Row3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} {...CINP} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} {...CINP}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} {...CINP}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </Row3>
          <CRow2>
            <CFG label="Dự án liên quan"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} {...CINP}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign} ({p.client})</option>)}</select></CFG>
            <CFG label="Loại dịch vụ"><select value={form.service_type} onChange={e=>set('service_type',e.target.value)} {...CINP}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option></select></CFG>
          </CRow2>
        </Sec>

        <Sec title="Bên A — Khách hàng">
          <div style={{marginBottom:10,background:B.infoBg,borderRadius:8,padding:'8px 12px',fontSize:11,color:B.primary,fontWeight:500}}>
            💡 Nhập tên client để auto-fill từ database
          </div>
          <CFG label="Tên công ty / Brand" required>
            <input value={form.party_a_name} onChange={e=>{set('party_a_name',e.target.value);fillFromClient(e.target.value)}} list="cl-list-hd" {...CINP} required/>
            <datalist id="cl-list-hd">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
          </CFG>
          <Row3>
            <CFG label="Mã số thuế"><input value={form.party_a_tax} onChange={e=>set('party_a_tax',e.target.value)} {...CINP} placeholder="VD: 0317761797"/></CFG>
            <CFG label="Người đại diện"><input value={form.party_a_rep} onChange={e=>set('party_a_rep',e.target.value)} {...CINP}/></CFG>
            <CFG label="Chức vụ"><input value={form.party_a_title} onChange={e=>set('party_a_title',e.target.value)} {...CINP}/></CFG>
          </Row3>
          <CFG label="Địa chỉ"><input value={form.party_a_address} onChange={e=>set('party_a_address',e.target.value)} {...CINP}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_a_bank_account} onChange={e=>set('party_a_bank_account',e.target.value)} {...CINP}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_a_bank_name} onChange={e=>set('party_a_bank_name',e.target.value)} {...CINP}/></CFG>
          </CRow2>
        </Sec>

        <Sec title="Bên B — K&K Advertising (cố định)">
          <div style={{background:B.gradSoft,borderRadius:10,padding:'12px 16px',fontSize:12,color:B.textSec,border:`1px solid ${B.border}`}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep}</div>
              <div><strong>Chức vụ:</strong> {KNK.repTitle}</div>
              <div><strong>Địa chỉ:</strong> {KNK.address}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName}</div>
            </div>
          </div>
        </Sec>

        <Sec title="Danh sách KOL/KOC thực hiện">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead><tr>{['STT','Họ và tên','Link TikTok','Nội dung công việc','Chi phí (VND)',''].map(h=><th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {form.kol_list.map((k,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 6px',fontSize:11,color:B.textTer,textAlign:'center'}}>{i+1}</td>
                  <td style={{padding:'5px 6px'}}><input value={k.name} onChange={e=>updateKol(i,'name',e.target.value)} list="kol-list-hd" style={{...CINP.style,padding:'5px 8px',fontSize:12}} placeholder="Tên KOL"/><datalist id="kol-list-hd">{data.kols.map(k=><option key={k.id} value={k.name}/>)}</datalist></td>
                  <td style={{padding:'5px 6px'}}><input value={k.tiktok} onChange={e=>updateKol(i,'tiktok',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12}} placeholder="@username"/></td>
                  <td style={{padding:'5px 6px'}}><input value={k.work} onChange={e=>updateKol(i,'work',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12}}/></td>
                  <td style={{padding:'5px 6px'}}><input type="number" value={k.fee} onChange={e=>updateKol(i,'fee',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12,width:120}}/></td>
                  <td style={{padding:'5px 6px'}}><button type="button" onClick={()=>removeKol(i)} style={{background:'none',border:'none',cursor:'pointer',color:B.danger,fontSize:16}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addKolRow}>+ Thêm KOL</CBtn>
        </Sec>

        <Sec title="Giá trị hợp đồng">
          <Row3>
            <CFG label="Phí dịch vụ (VND)">
              <input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} {...CINP}/>
              <div style={{fontSize:10,color:B.textTer,marginTop:3}}>= Tổng KOL list nếu có</div>
            </CFG>
            <CFG label="Thuế GTGT (%)">
              <input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} {...CINP}/>
            </CFG>
            <CFG label="Tổng giá trị (có VAT)">
              <div style={{padding:'9px 12px',background:B.gradSoft,borderRadius:8,fontSize:14,fontWeight:800,color:B.primary,border:`1px solid ${B.border}`}}>{fmt(form.total_with_vat)} VND</div>
              <div style={{fontSize:10,color:B.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </Row3>
          <CFG label="Điều khoản thanh toán">
            <textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP.style,minHeight:70}}/>
          </CFG>
        </Sec>

        <Sec title="Thời gian thực hiện">
          <CRow2>
            <CFG label="Ngày bắt đầu"><input type="date" value={form.start_date} onChange={e=>set('start_date',e.target.value)} {...CINP}/></CFG>
            <CFG label="Ghi chú"><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...CINP.style,minHeight:50}}/></CFG>
          </CRow2>
        </Sec>

        <CMFoot onClose={onClose} submitLabel={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── FORM HĐ KOL ─────────────────────────────────────────
function ContractKOLForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || generateCode('HDCTV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    project_id: edit?.project_id || '',
    party_b_name: edit?.party_b_name || '',
    party_b_tax: edit?.party_b_tax || '',
    party_b_address: edit?.party_b_address || '',
    party_b_rep: edit?.party_b_rep || '',
    party_b_bank_account: edit?.party_b_bank_account || '',
    party_b_bank_name: edit?.party_b_bank_name || '',
    party_b_cccd: edit?.party_b_cccd || '',
    service_type: edit?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || '1 video TikTok review sản phẩm theo định hướng của khách hàng',
    channels: edit?.channels || '',
    total_fee: edit?.total_fee || 0,
    vat_rate: edit?.vat_rate || 10,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || '15 ngày làm việc kể từ ngày hoàn thành công việc và ký BBNT',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [dupWarnings, setDupWarnings] = useState([])
  const [saving, setSaving] = useState(false)
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))

  // HĐ CTV: VAT là thuế TNCN 10%, trừ vào thù lao
  // total_with_vat = total_fee (sau khấu trừ)
  useEffect(()=>{
    const afterTax = Number(form.total_fee||0) * (1 - Number(form.vat_rate||10)/100)
    set('total_with_vat', Math.round(afterTax))
  }, [form.total_fee, form.vat_rate])

  function fillFromKOL(kolName) {
    const k = data.kols.find(kl => kl.name?.toLowerCase() === kolName?.toLowerCase() || kl.real_name?.toLowerCase() === kolName?.toLowerCase())
    if (k) {
      setForm(p=>({...p,
        party_b_name: k.real_name||k.name||p.party_b_name,
        party_b_tax: k.personal_tax_code||k.cccd||p.party_b_tax,
        party_b_address: k.address||p.party_b_address,
        party_b_bank_account: k.bank_account||p.party_b_bank_account,
        party_b_bank_name: k.bank_name||p.party_b_bank_name,
        party_b_cccd: k.cccd||p.party_b_cccd,
        channels: k.platform||p.channels,
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true)
    if (!edit && form.party_b_cccd) {
      const {data:existing} = await supabase.from('kols').select('id,name').eq('cccd', form.party_b_cccd)
      if (existing?.length > 0) {
        setDupWarnings([{field:'cccd',value:form.party_b_cccd,label:'CCCD',existing:existing[0]}])
        setSaving(false); return
      }
    }
    await saveKOLContract()
    setSaving(false)
  }

  async function saveKOLContract() {
    const payload = {
      contract_code: form.contract_code,
      contract_type: 'kol',
      project_id: form.project_id || null,
      party_a_name: KNK.name,
      party_a_tax: KNK.taxCode,
      party_a_address: KNK.address,
      party_a_rep: KNK.rep,
      party_a_title: KNK.repTitle,
      party_a_bank_account: KNK.bankAccount,
      party_a_bank_name: KNK.bankName + ' Chi nhánh/PGD: ' + KNK.bankBranch,
      party_b_name: form.party_b_name,
      party_b_tax: form.party_b_tax,
      party_b_address: form.party_b_address,
      party_b_rep: form.party_b_name,
      party_b_bank_account: form.party_b_bank_account,
      party_b_bank_name: form.party_b_bank_name,
      party_b_cccd: form.party_b_cccd,
      service_type: form.service_type,
      scope_of_work: form.scope_of_work,
      kol_list: [],
      total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||10),
      total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms,
      start_date: form.start_date || null,
      sign_date: form.sign_date || null,
      sign_location: 'Văn phòng Công Ty TNHH Quảng cáo K&K',
      status: form.status,
      notes: form.notes,
      created_by: 'User'
    }
    if (edit) {
      const {error} = await supabase.from('contracts').update(payload).eq('id',edit.id)
      if(error){alert('Lỗi: '+error.message);return}
    } else {
      const {error} = await supabase.from('contracts').insert([payload])
      if(error){alert('Lỗi lưu HĐ KOL: '+error.message);return}
      const existing = data.kols.find(k=>k.cccd===form.party_b_cccd||k.name===form.party_b_name)
      if (!existing && form.party_b_name) {
        await supabase.from('kols').insert([{
          name: form.party_b_name, real_name: form.party_b_name,
          cccd: form.party_b_cccd, personal_tax_code: form.party_b_tax,
          address: form.party_b_address, bank_account: form.party_b_bank_account,
          bank_name: form.party_b_bank_name, platform: form.channels,
          available: true
        }])
      }
    }
    onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ cộng tác viên':'Tạo HĐ cộng tác viên (Bên B = KOL/CTV)'} onClose={onClose} wide>
      {dupWarnings.length>0&&<DupWarning warnings={dupWarnings} onUseExisting={(rec)=>{fillFromKOL(rec.name);setDupWarnings([])}} onContinue={()=>{setDupWarnings([]);saveKOLContract()}} onCancel={()=>setDupWarnings([])}/>}
      <form onSubmit={handleSubmit}>
        <Sec title="Bên A — K&K Advertising (cố định)">
          <div style={{background:B.gradSoft,borderRadius:10,padding:'12px 16px',fontSize:12,color:B.textSec,border:`1px solid ${B.border}`}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep} — {KNK.repTitle}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName}</div>
            </div>
          </div>
        </Sec>

        <Sec title="Thông tin hợp đồng">
          <Row3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} {...CINP} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} {...CINP}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} {...CINP}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </Row3>
          <CRow2>
            <CFG label="Dự án liên quan"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} {...CINP}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign}</option>)}</select></CFG>
            <CFG label="Kênh đăng tải"><input value={form.channels} onChange={e=>set('channels',e.target.value)} {...CINP} placeholder="@tiktok_username"/></CFG>
          </CRow2>
        </Sec>

        <Sec title="Bên B — KOL / Cộng tác viên">
          <div style={{marginBottom:10,background:B.infoBg,borderRadius:8,padding:'8px 12px',fontSize:11,color:B.primary,fontWeight:500}}>
            💡 Nhập tên KOL để auto-fill từ database
          </div>
          <CRow2>
            <CFG label="Họ và tên thật" required>
              <input value={form.party_b_name} onChange={e=>{set('party_b_name',e.target.value);fillFromKOL(e.target.value)}} list="kol-list-ctv" {...CINP} required/>
              <datalist id="kol-list-ctv">{data.kols.map(k=><option key={k.id} value={k.real_name||k.name}/>)}</datalist>
            </CFG>
            <CFG label="CCCD / MST cá nhân"><input value={form.party_b_cccd} onChange={e=>set('party_b_cccd',e.target.value)} {...CINP} placeholder="Số CCCD"/></CFG>
          </CRow2>
          <CFG label="Địa chỉ thường trú"><input value={form.party_b_address} onChange={e=>set('party_b_address',e.target.value)} {...CINP}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_b_bank_account} onChange={e=>set('party_b_bank_account',e.target.value)} {...CINP}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_b_bank_name} onChange={e=>set('party_b_bank_name',e.target.value)} {...CINP}/></CFG>
          </CRow2>
        </Sec>

        <Sec title="Phạm vi công việc">
          <CFG label="Nội dung công việc"><textarea value={form.scope_of_work} onChange={e=>set('scope_of_work',e.target.value)} style={{...CINP.style,minHeight:80}}/></CFG>
        </Sec>

        <Sec title="Thù lao">
          <Row3>
            <CFG label="Thù lao gốc (VND)"><input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} {...CINP}/></CFG>
            <CFG label="Thuế TNCN (%)"><input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} {...CINP}/></CFG>
            <CFG label="Thù lao thực nhận">
              <div style={{padding:'9px 12px',background:B.gradSoft,borderRadius:8,fontSize:14,fontWeight:800,color:B.primary,border:`1px solid ${B.border}`}}>{fmt(form.total_with_vat)} VND</div>
              <div style={{fontSize:10,color:B.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </Row3>
          <CFG label="Thời hạn thanh toán"><textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP.style,minHeight:60}}/></CFG>
        </Sec>

        <CMFoot onClose={onClose} submitLabel={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── CONTRACT PREVIEW ─────────────────────────────────────
function ContractPreview({contract:c, type, onClose}) {
  const isClient = type === 'client'
  const partyA = isClient ? {name:c.party_a_name,tax:c.party_a_tax,address:c.party_a_address,rep:c.party_a_rep,title:c.party_a_title,bank:c.party_a_bank_account,bankName:c.party_a_bank_name} : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' CN/PGD: '+KNK.bankBranch}
  const partyB = isClient ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' CN/PGD: '+KNK.bankBranch} : {name:c.party_b_name,cccd:c.party_b_cccd,address:c.party_b_address,bank:c.party_b_bank_account,bankName:c.party_b_bank_name}
  const kolList = c.kol_list || []
  const fee = Number(c.total_fee||0), vat = isClient?fee*Number(c.vat_rate||8)/100:0, total = Number(c.total_with_vat||0)

  function printContract() {
    const w = window.open('','_blank')
    w.document.write('<html><head><title>'+c.contract_code+'</title><style>body{font-family:Times New Roman,serif;font-size:13px;margin:40px;color:#000;line-height:1.6}h1{text-align:center;font-size:18px;text-transform:uppercase;margin-bottom:5px}h2{text-align:center;font-size:13px;margin-top:0}h3{font-size:13px;font-weight:bold;margin:16px 0 8px;text-transform:uppercase}p{margin:6px 0;text-align:justify}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #000;padding:6px 8px;font-size:12px}th{background:#f0f0f0;font-weight:bold;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}.logo-header{display:flex;align-items:center;margin-bottom:20px;border-bottom:2px solid #000;padding-bottom:10px}.logo-text{font-size:20px;font-weight:bold;color:#1A56DB}.footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}@media print{body{margin:20px}}</style></head><body>')
    w.document.write('<div class="logo-header"><div class="logo-text">K&K advertising</div></div>')
    w.document.write('<h1>'+(isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN')+'</h1>')
    w.document.write('<h2>Số: '+c.contract_code+'</h2>')
    w.document.write('<p>Hôm nay, ngày <strong>'+formatDate(c.sign_date)+'</strong>, tại '+c.sign_location+',<br>Chúng tôi gồm:</p>')
    w.document.write('<h3>Bên A: '+partyA.name+'</h3>')
    w.document.write('<p>Đại diện: <strong>'+partyA.rep+'</strong></p>')
    w.document.write('<p>Chức vụ: '+partyA.title+'</p>')
    w.document.write('<p>Địa chỉ: '+partyA.address+'</p>')
    if(partyA.tax)w.document.write('<p>Mã số thuế: '+partyA.tax+'</p>')
    if(!isClient&&c.party_b_cccd)w.document.write('<p>CCCD: '+c.party_b_cccd+'</p>')
    if(partyA.bank)w.document.write('<p>Số tài khoản: '+partyA.bank+' — Ngân hàng: '+partyA.bankName+'</p>')
    w.document.write('<p><em>(Sau đây gọi là "Bên A")</em></p>')
    w.document.write('<h3>Bên B: '+partyB.name+'</h3>')
    if(partyB.tax)w.document.write('<p>Mã số thuế: '+partyB.tax+'</p>')
    if(partyB.cccd)w.document.write('<p>CCCD: '+partyB.cccd+'</p>')
    w.document.write('<p>Địa chỉ: '+partyB.address+'</p>')
    if(isClient){w.document.write('<p>Đại diện: <strong>'+partyB.rep+'</strong></p>');w.document.write('<p>Chức vụ: '+partyB.title+'</p>')}
    if(partyB.bank)w.document.write('<p>Số tài khoản: '+partyB.bank+' — Ngân hàng: '+partyB.bankName+'</p>')
    w.document.write('<p><em>(Sau đây gọi là "Bên B")</em></p>')
    if(isClient&&kolList.length>0){
      w.document.write('<h3>Điều 2. Đối tượng hợp đồng</h3>')
      w.document.write('<table><thead><tr><th>STT</th><th>Họ và tên</th><th>Link TikTok</th><th>Nội dung công việc</th><th>Chi phí</th></tr></thead><tbody>')
      kolList.forEach((k,i)=>w.document.write('<tr><td style="text-align:center">'+(i+1)+'</td><td>'+k.name+'</td><td>'+k.tiktok+'</td><td>'+k.work+'</td><td style="text-align:right">'+fmt(k.fee)+'</td></tr>'))
      w.document.write('<tr><td colspan="4" style="text-align:right"><strong>TOTAL</strong></td><td style="text-align:right"><strong>'+fmt(fee)+'</strong></td></tr>')
      w.document.write('<tr><td colspan="4" style="text-align:right">VAT ('+c.vat_rate+'%)</td><td style="text-align:right">'+fmt(vat)+'</td></tr>')
      w.document.write('<tr><td colspan="4" style="text-align:right"><strong>TOTAL + VAT</strong></td><td style="text-align:right"><strong>'+fmt(total)+'</strong></td></tr>')
      w.document.write('</tbody></table>')
    }
    if(!isClient){
      w.document.write('<h3>Điều 2. Đối tượng hợp đồng</h3>')
      w.document.write('<p>'+c.scope_of_work+'</p>')
      w.document.write('<p>Kênh TikTok: '+(c.channels||'')+'</p>')
      w.document.write('<h3>Điều 3. Thù lao và thanh toán</h3>')
      w.document.write('<p>Thù lao (đã khấu trừ '+c.vat_rate+'% Thuế TNCN): <strong>'+fmt(total)+' VNĐ</strong></p>')
      w.document.write('<p>Bằng chữ: <em>'+toWords(total)+'</em></p>')
    }
    w.document.write('<h3>Điều 3. Giá trị và thanh toán</h3>')
    w.document.write('<p>'+c.payment_terms+'</p>')
    w.document.write('<div class="sig"><div><p><strong>Đại diện Bên A</strong></p><p>'+partyA.title+'</p><br><br><p><strong>'+partyA.rep+'</strong></p></div><div><p><strong>Đại diện Bên B</strong></p><p>'+(isClient?partyB.title:'(Ký và ghi rõ họ tên)')+'</p><br><br><p><strong>'+(isClient?partyB.rep:partyB.name)+'</strong></p></div></div>')
    w.document.write('<div class="footer">A: '+KNK.address+' | P: '+KNK.phone+' | E: '+KNK.email+'</div>')
    w.document.write('</body></html>')
    w.document.close()
    setTimeout(()=>w.print(), 500)
  }

  return (
    <CModal title={'Preview: '+c.contract_code} onClose={onClose} wide>
      <div style={{marginBottom:14,display:'flex',gap:8,flexWrap:'wrap'}}>
        <CBtn primary onClick={printContract}>🖨️ In / Export PDF</CBtn>
        <CBadge text={c.status}/>
        <span style={{fontSize:11,color:B.textTer,alignSelf:'center'}}>Tạo lúc {new Date(c.created_at).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Preview card */}
      <div style={{background:B.white,border:`2px solid ${B.border}`,borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman, serif',fontSize:13,lineHeight:1.7,color:'#000'}}>
        <div style={{display:'flex',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:'2px solid #000'}}>
          <div style={{fontSize:22,fontWeight:900,color:B.primary,letterSpacing:'-0.02em',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>K&K <span style={{color:B.accent}}>advertising</span></div>
        </div>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:18,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>{isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN'}</div>
          <div style={{fontSize:13,color:'#555'}}>Số: {c.contract_code}</div>
        </div>
        <p>Hôm nay, ngày <strong>{formatDate(c.sign_date)}</strong>, tại {c.sign_location},</p>
        <p style={{marginBottom:8}}>Chúng tôi gồm:</p>
        <PartyBlock title="BÊN A" party={partyA} isCompany={isClient}/>
        <PartyBlock title="BÊN B" party={partyB} isCompany={isClient} cccd={!isClient?c.party_b_cccd:null}/>
        {isClient && kolList.length > 0 && (
          <div style={{marginTop:14}}>
            <div style={{fontWeight:700,marginBottom:8,textTransform:'uppercase',fontSize:12}}>Danh sách KOL/KOC:</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:'#f0f0f0'}}>{['STT','Họ và tên','Link TikTok','Nội dung công việc','Chi phí'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'5px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>
                {kolList.map((k,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.tiktok}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.work}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>{fmt(k.fee)}</td></tr>)}
                <tr><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>TOTAL</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>{fmt(fee)}</td></tr>
                <tr><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>VAT ({c.vat_rate}%)</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>{fmt(vat)}</td></tr>
                <tr style={{background:'#f0f0f0'}}><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>TOTAL + VAT</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>{fmt(total)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {!isClient && (
          <div style={{marginTop:12,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,border:'1px solid #ddd'}}>
            <div><strong>Phạm vi công việc:</strong> {c.scope_of_work}</div>
            <div style={{marginTop:6}}><strong>Thù lao thực nhận:</strong> {fmt(total)} VNĐ <em>({toWords(total)})</em></div>
          </div>
        )}
        <div style={{marginTop:14,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,border:'1px solid #ddd'}}>
          <strong>Điều khoản thanh toán:</strong> {c.payment_terms}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:32,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>Đại diện Bên A</div><div style={{fontSize:12,color:'#666'}}>{partyA.title}</div><div style={{height:50}}/><div style={{fontWeight:700}}>{partyA.rep}</div></div>
          <div><div style={{fontWeight:700}}>Đại diện Bên B</div><div style={{fontSize:12,color:'#666'}}>{isClient?partyB.title:'(Ký và ghi rõ họ tên)'}</div><div style={{height:50}}/><div style={{fontWeight:700}}>{isClient?partyB.rep:partyB.name}</div></div>
        </div>
      </div>

      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}

function PartyBlock({title, party, isCompany, cccd}) {
  return <div style={{marginBottom:12}}>
    <div style={{fontWeight:700,fontSize:13,textTransform:'uppercase',marginBottom:4}}>{title}: {isCompany?(title==='BÊN A'?party.name:'CÔNG TY TNHH QUẢNG CÁO K&K'):party.name}</div>
    {party.tax&&<div>Mã số thuế: {party.tax}</div>}
    {cccd&&<div>CCCD: {cccd}</div>}
    {party.address&&<div>Địa chỉ: {party.address}</div>}
    {party.rep&&<div>Đại diện: <strong>{party.rep}</strong>{party.title&&' — '+party.title}</div>}
    {party.bank&&<div>Số tài khoản: {party.bank} — Ngân hàng: {party.bankName}</div>}
    <div style={{fontSize:12,color:'#555',marginTop:2}}>(Sau đây gọi là "{title}")</div>
  </div>
}

// ══════════════════════════════════════════════════════════
// BBNT PAGE
// ══════════════════════════════════════════════════════════
function AcceptanceReports({data, supabase, reload, log}) {
  const [reports, setReports] = useState([])
  const [tab, setTab] = useState('client')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [contracts, setContracts] = useState([])
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

  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}

  const filtered = reports.filter(r => {
    const c = contracts.find(ct=>ct.id===r.contract_id)
    return !!c
  })

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Biên bản nghiệm thu</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo BBNT</CBtn>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:`1px solid ${B.border}`}}>
        {[['client','🏢  BBNT Client'],['kol','👤  BBNT KOL/CTV']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?B.gradPrimary:'transparent',color:tab===key?'#fff':B.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>{['Số BBNT','Hợp đồng liên quan','Giá trị NT','Ngày ký','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={6} style={{textAlign:'center',padding:32,color:B.textTer}}>Đang tải...</td></tr>}
            {!loading&&filtered.map(r=>{
              const c=contracts.find(ct=>ct.id===r.contract_id)
              return <tr key={r.id}>
                <td style={{...TD,fontWeight:800,color:B.primary}}>{r.report_code}</td>
                <td style={{...TD,fontWeight:600}}>{c?.contract_code||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{fmt(r.accepted_value)} VND</td>
                <td style={{...TD,fontSize:11,color:B.textTer}}>{r.sign_date||'—'}</td>
                <td style={TD}><CBadge text={r.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem({report:r,contract:c,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(r);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            })}
            {!loading&&!filtered.length&&<tr><td colSpan={6} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>Chưa có biên bản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && <BBNTForm contracts={contracts} data={data} supabase={supabase} edit={editItem} type={tab} onClose={()=>setShowForm(false)} onSaved={()=>{loadData();reload();log('Lưu BBNT')}}/>}
      {viewItem && <BBNTPreview {...viewItem} onClose={()=>setViewItem(null)}/>}
    </div>
  )
}

// ── BBNT FORM ────────────────────────────────────────────
function BBNTForm({contracts, data, supabase, edit, type, onClose, onSaved}) {
  const [form, setForm] = useState({
    report_code: edit?.report_code || generateCode('BBNT'),
    contract_id: edit?.contract_id || '',
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    actual_start_date: edit?.actual_start_date || '',
    actual_end_date: edit?.actual_end_date || new Date().toISOString().slice(0,10),
    deliverables: edit?.deliverables || [],
    total_videos: edit?.total_videos || 0,
    completed_videos: edit?.completed_videos || 0,
    contract_value: edit?.contract_value || 0,
    accepted_value: edit?.accepted_value || 0,
    paid_amount: edit?.paid_amount || 0,
    remaining_amount: edit?.remaining_amount || 0,
    payment_deadline: edit?.payment_deadline || 30,
    evidence_items: edit?.evidence_items || [],
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const selectedContract = contracts.find(c=>c.id===form.contract_id)

  useEffect(()=>{
    if(selectedContract){
      set('contract_value', selectedContract.total_with_vat||0)
      set('accepted_value', selectedContract.total_with_vat||0)
      const arr=selectedContract.kol_list||[]
      set('total_videos', arr.length||1)
      set('completed_videos', arr.length||1)
      set('deliverables', arr.map((k,i)=>({stt:i+1,name:k.name,link:'',result:'Hoàn thành 100%'})))
      set('actual_start_date', selectedContract.start_date||'')
      set('payment_deadline', type==='kol'?15:30)
    }
  },[form.contract_id])

  useEffect(()=>{
    set('remaining_amount', Number(form.accepted_value||0)-Number(form.paid_amount||0))
  },[form.accepted_value,form.paid_amount])

  const updateDeliverable=(i,k,v)=>{const arr=[...form.deliverables];arr[i]={...arr[i],[k]:v};set('deliverables',arr)}
  const addDeliverable=()=>set('deliverables',[...form.deliverables,{stt:form.deliverables.length+1,name:'',link:'',result:'Hoàn thành 100%'}])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload={...form,project_id:selectedContract?.project_id}
    if(edit){await supabase.from('acceptance_reports').update(payload).eq('id',edit.id)}
    else{await supabase.from('acceptance_reports').insert([payload])}
    onSaved();onClose()
  }

  return (
    <CModal title={edit?'Sửa BBNT':'Tạo biên bản nghiệm thu'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <Sec title="Thông tin biên bản">
          <Row3>
            <CFG label="Số BBNT" required><input value={form.report_code} onChange={e=>set('report_code',e.target.value)} {...CINP} required/></CFG>
            <CFG label="Hợp đồng tham chiếu" required>
              <select value={form.contract_id} onChange={e=>set('contract_id',e.target.value)} {...CINP} required>
                <option value="">— Chọn hợp đồng —</option>
                {contracts.map(c=><option key={c.id} value={c.id}>{c.contract_code} — {type==='client'?c.party_a_name:c.party_b_name}</option>)}
              </select>
            </CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} {...CINP}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option></select></CFG>
          </Row3>
          <CRow2>
            <CFG label="Ngày ký BBNT"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} {...CINP}/></CFG>
            <CFG label="Thời gian thực hiện">
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="date" value={form.actual_start_date} onChange={e=>set('actual_start_date',e.target.value)} style={{...CINP.style,flex:1}}/>
                <span style={{color:B.textTer,fontSize:12}}>đến</span>
                <input type="date" value={form.actual_end_date} onChange={e=>set('actual_end_date',e.target.value)} style={{...CINP.style,flex:1}}/>
              </div>
            </CFG>
          </CRow2>
        </Sec>

        {selectedContract && (
          <div style={{background:B.gradSoft,borderRadius:10,padding:'12px 16px',marginBottom:16,border:`1px solid ${B.border}`,fontSize:12}}>
            <div style={{fontWeight:700,color:B.navy,marginBottom:6}}>Thông tin hợp đồng: {selectedContract.contract_code}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,color:B.textSec}}>
              <div>Đối tác: <strong>{type==='client'?selectedContract.party_a_name:selectedContract.party_b_name}</strong></div>
              <div>Giá trị: <strong style={{color:B.primary}}>{fmt(selectedContract.total_with_vat)} VND</strong></div>
              <div>Dịch vụ: <strong>{selectedContract.service_type}</strong></div>
            </div>
          </div>
        )}

        <Sec title="Kết quả nghiệm thu">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead><tr>{['STT','Tên / Kênh','Link video/air','Kết quả',''].map(h=><th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {form.deliverables.map((d,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 6px',fontSize:11,textAlign:'center',color:B.textTer}}>{i+1}</td>
                  <td style={{padding:'5px 6px'}}><input value={d.name} onChange={e=>updateDeliverable(i,'name',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12}} placeholder="Tên KOL / kênh"/></td>
                  <td style={{padding:'5px 6px'}}><input value={d.link} onChange={e=>updateDeliverable(i,'link',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12}} placeholder="https://tiktok.com/@..."/></td>
                  <td style={{padding:'5px 6px'}}><input value={d.result} onChange={e=>updateDeliverable(i,'result',e.target.value)} style={{...CINP.style,padding:'5px 8px',fontSize:12}}/></td>
                  <td><button type="button" onClick={()=>set('deliverables',form.deliverables.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:B.danger,fontSize:16}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addDeliverable}>+ Thêm dòng</CBtn>
        </Sec>

        <Sec title="Điều khoản thanh toán">
          <CRow2>
            <CFG label="Giá trị theo HĐ (VND)"><input type="number" value={form.contract_value} onChange={e=>set('contract_value',Number(e.target.value))} {...CINP}/></CFG>
            <CFG label="Giá trị nghiệm thu (VND)"><input type="number" value={form.accepted_value} onChange={e=>set('accepted_value',Number(e.target.value))} {...CINP}/></CFG>
          </CRow2>
          <Row3>
            <CFG label="Đã thanh toán (VND)"><input type="number" value={form.paid_amount} onChange={e=>set('paid_amount',Number(e.target.value))} {...CINP}/></CFG>
            <CFG label="Còn phải thanh toán">
              <div style={{padding:'9px 12px',background:form.remaining_amount>0?'#FFF7ED':'#F0FDF4',borderRadius:8,fontSize:14,fontWeight:800,color:form.remaining_amount>0?B.warning:B.success,border:`1px solid ${form.remaining_amount>0?B.warning:B.success}30`}}>{fmt(form.remaining_amount)} VND</div>
            </CFG>
            <CFG label="Thời hạn TT (ngày làm việc)"><input type="number" value={form.payment_deadline} onChange={e=>set('payment_deadline',Number(e.target.value))} {...CINP}/></CFG>
          </Row3>
        </Sec>

        <Sec title="Ghi chú">
          <CFG label="Ghi chú thêm"><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...CINP.style,minHeight:70}}/></CFG>
        </Sec>

        <CMFoot onClose={onClose} submitLabel="Lưu BBNT" onDelete={edit?async()=>{await supabase.from('acceptance_reports').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── BBNT PREVIEW ─────────────────────────────────────────
function BBNTPreview({report:r, contract:c, type, onClose}) {
  const isClient = type === 'client'
  const partyA = isClient ? {name:c?.party_a_name,tax:c?.party_a_tax,address:c?.party_a_address,rep:c?.party_a_rep,title:c?.party_a_title,bank:c?.party_a_bank_account,bankName:c?.party_a_bank_name} : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName}
  const partyB = isClient ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName} : {name:c?.party_b_name,cccd:c?.party_b_cccd,address:c?.party_b_address,bank:c?.party_b_bank_account,bankName:c?.party_b_bank_name}
  const deliverables = r.deliverables||[]

  function printBBNT() {
    const w=window.open('','_blank')
    w.document.write('<html><head><title>'+r.report_code+'</title><style>body{font-family:Times New Roman,serif;font-size:13px;margin:40px;color:#000;line-height:1.6}h1{text-align:center;font-size:17px;font-weight:bold;text-transform:uppercase;margin-bottom:4px}h2{text-align:center;font-size:13px;margin-top:0;font-style:italic}h3{font-size:13px;font-weight:bold;margin:14px 0 6px;text-transform:uppercase}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #000;padding:6px 8px;font-size:12px}th{background:#f0f0f0;font-weight:bold;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}.logo{font-size:20px;font-weight:bold;color:#000;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px}.footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}@media print{body{margin:20px}}</style></head><body>')
    w.document.write('<div class="logo">K&K advertising</div>')
    w.document.write('<h1>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</h1>')
    w.document.write('<h2>Hợp Đồng số: '+(c?.contract_code||'')+'</h2>')
    w.document.write('<p><em>Căn cứ Hợp đồng số: '+(c?.contract_code||'')+' ngày '+formatDate(c?.sign_date)+' giữa '+partyA.name+' và '+partyB.name+';</em></p>')
    w.document.write('<p><em>Căn cứ vào kết quả thực hiện Hợp Đồng,</em></p>')
    w.document.write('<p>Hôm nay, ngày <strong>'+formatDate(r.sign_date)+'</strong>, chúng tôi gồm:</p>')
    w.document.write('<h3>Bên A: '+partyA.name+'</h3>')
    if(partyA.tax)w.document.write('<p>Mã số thuế: '+partyA.tax+'</p>')
    w.document.write('<p>Đại diện: <strong>'+partyA.rep+'</strong> — Chức danh: '+partyA.title+'</p>')
    w.document.write('<p>Địa chỉ: '+partyA.address+'</p>')
    if(partyA.bank)w.document.write('<p>Số tài khoản: '+partyA.bank+' — Ngân hàng: '+partyA.bankName+'</p>')
    w.document.write('<p><em>(Sau đây gọi là "Bên A")</em></p>')
    w.document.write('<h3>Bên B: '+partyB.name+'</h3>')
    if(partyB.cccd)w.document.write('<p>CCCD: '+partyB.cccd+'</p>')
    if(partyB.tax)w.document.write('<p>Mã số thuế: '+partyB.tax+'</p>')
    w.document.write('<p>Địa chỉ: '+partyB.address+'</p>')
    if(isClient){w.document.write('<p>Đại diện: <strong>'+partyB.rep+'</strong> — Chức danh: '+partyB.title+'</p>')}
    if(partyB.bank)w.document.write('<p>Số tài khoản: '+partyB.bank+' — Ngân hàng: '+partyB.bankName+'</p>')
    w.document.write('<p><em>(Sau đây gọi là "Bên B")</em></p>')
    w.document.write('<h3>Điều 1. Điều khoản nghiệm thu</h3>')
    w.document.write('<p>Bên '+(isClient?'B':'A')+' đã hoàn thành dịch vụ theo thỏa thuận tại Hợp Đồng và yêu cầu của Bên '+(isClient?'A':'B')+'.</p>')
    w.document.write('<p>Thời gian thực hiện thực tế: '+formatDate(r.actual_start_date)+' đến '+formatDate(r.actual_end_date)+'</p>')
    if(deliverables.length>0){
      w.document.write('<table><thead><tr><th>STT</th><th>Tên / Kênh</th><th>Link Air</th><th>Kết quả</th></tr></thead><tbody>')
      deliverables.forEach((d,i)=>w.document.write('<tr><td style="text-align:center">'+(i+1)+'</td><td>'+d.name+'</td><td>'+d.link+'</td><td>'+d.result+'</td></tr>'))
      w.document.write('</tbody></table>')
    }
    w.document.write('<h3>Điều 2. Điều khoản thanh toán</h3>')
    w.document.write('<p>- Phí dịch vụ theo HĐ đã ký: <strong>'+fmt(r.contract_value)+' đồng</strong></p>')
    w.document.write('<p>- Giá trị nghiệm thu: <strong>'+fmt(r.accepted_value)+' đồng</strong></p>')
    w.document.write('<p>- Giá trị Bên A đã thanh toán: <strong>'+fmt(r.paid_amount)+' đồng</strong></p>')
    w.document.write('<p>- Giá trị còn phải thanh toán: <strong>'+fmt(r.remaining_amount)+' đồng</strong></p>')
    w.document.write('<p><em>Bằng chữ: '+toWords(r.remaining_amount)+'</em></p>')
    w.document.write('<p>Thời hạn thanh toán: '+r.payment_deadline+' ngày làm việc sau khi ký BBNT.</p>')
    if(r.notes)w.document.write('<p><em>Lưu ý: '+r.notes+'</em></p>')
    w.document.write('<h3>Điều 3. Điều khoản chung</h3>')
    w.document.write('<p>Biên Bản có hiệu lực kể từ ngày ký. Biên bản được lập thành 02 bản có giá trị pháp lý như nhau.</p>')
    w.document.write('<div class="sig"><div><p><strong>ĐẠI DIỆN BÊN A</strong></p><p>'+partyA.title+'</p><br><br><p><strong>'+partyA.rep+'</strong></p></div><div><p><strong>'+(isClient?'ĐẠI DIỆN BÊN B':'BÊN B')+'</strong></p><p>'+(isClient?partyB.title:'(Ký ghi rõ họ, tên)')+'</p><br><br><p><strong>'+(isClient?partyB.rep:partyB.name)+'</strong></p></div></div>')
    w.document.write('<div class="footer">A: '+KNK.address+' | P: '+KNK.phone+' | E: '+KNK.email+'</div>')
    w.document.write('</body></html>')
    w.document.close()
    setTimeout(()=>w.print(),500)
  }

  return (
    <CModal title={'Preview BBNT: '+r.report_code} onClose={onClose} wide>
      <div style={{marginBottom:14,display:'flex',gap:8}}>
        <CBtn primary onClick={printBBNT}>🖨️ In / Export PDF</CBtn>
        <CBadge text={r.status}/>
      </div>
      <div style={{background:B.white,border:`2px solid ${B.border}`,borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman,serif',fontSize:13,lineHeight:1.7,color:'#000'}}>
        <div style={{fontSize:22,fontWeight:900,color:B.primary,fontFamily:"'Plus Jakarta Sans',sans-serif",borderBottom:'2px solid #000',paddingBottom:8,marginBottom:16}}>K&K <span style={{color:B.accent}}>advertising</span></div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,textTransform:'uppercase'}}>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</div>
          <div style={{fontSize:13,fontStyle:'italic',color:'#555'}}>Hợp Đồng số: {c?.contract_code||'—'}</div>
        </div>
        <p><em>Căn cứ Hợp đồng số: {c?.contract_code} ngày {formatDate(c?.sign_date)};</em></p>
        <p style={{marginBottom:8}}>Hôm nay, ngày <strong>{formatDate(r.sign_date)}</strong>, chúng tôi gồm:</p>
        <PartyBlock title="BÊN A" party={partyA} isCompany={true}/>
        <PartyBlock title="BÊN B" party={partyB} isCompany={isClient} cccd={!isClient?c?.party_b_cccd:null}/>
        {deliverables.length>0&&(
          <div style={{marginTop:12}}>
            <div style={{fontWeight:700,marginBottom:6,fontSize:12,textTransform:'uppercase'}}>Kết quả nghiệm thu:</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên / Kênh','Link Air','Kết quả'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>{deliverables.map((d,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',fontSize:11}}>{d.link}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.result}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        <div style={{marginTop:12,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,border:'1px solid #ddd',fontSize:12}}>
          <div>Giá trị HĐ: <strong>{fmt(r.contract_value)} VND</strong></div>
          <div>Giá trị nghiệm thu: <strong>{fmt(r.accepted_value)} VND</strong></div>
          <div>Đã thanh toán: <strong>{fmt(r.paid_amount)} VND</strong></div>
          <div>Còn phải thanh toán: <strong style={{color:r.remaining_amount>0?B.warning:B.success}}>{fmt(r.remaining_amount)} VND</strong></div>
          <div style={{fontStyle:'italic',marginTop:4}}>Bằng chữ: {toWords(r.remaining_amount)}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:32,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>ĐẠI DIỆN BÊN A</div><div style={{fontSize:12,color:'#666'}}>{partyA.title}</div><div style={{height:50}}/><div style={{fontWeight:700}}>{partyA.rep}</div></div>
          <div><div style={{fontWeight:700}}>{isClient?'ĐẠI DIỆN BÊN B':'BÊN B'}</div><div style={{fontSize:12,color:'#666'}}>{isClient?partyB.title:'(Ký ghi rõ họ tên)'}</div><div style={{height:50}}/><div style={{fontWeight:700}}>{isClient?partyB.rep:partyB.name}</div></div>
        </div>
      </div>
      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}

// ── HELPERS ──────────────────────────────────────────────
function generateCode(prefix) {
  const now = new Date()
  const d = String(now.getDate()).padStart(2,'0')
  const m = String(now.getMonth()+1).padStart(2,'0')
  const y = String(now.getFullYear()).slice(2)
  return `${d}${m}${y}-${prefix}-KnK-`
}

function formatDate(dateStr) {
  if (!dateStr) return '___/___/______'
  const d = new Date(dateStr)
  return `ngày ${d.getDate()} tháng ${d.getMonth()+1} năm ${d.getFullYear()}`
}
