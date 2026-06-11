import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// K&K Agency OS — Light Professional UI
const B = {
  primary: '#3B82F6',
  primaryGlow: 'rgba(59,130,246,0.2)',
  accent: '#0EA5E9',
  purple: '#8B5CF6',
  navy: '#0F172A',
  bg: '#F8FAFF',
  bgCard: '#FFFFFF',
  glass: '#FFFFFF',
  glassBorder: '#E2E8F0',
  gradPrimary: 'linear-gradient(135deg,#3B82F6,#0EA5E9)',
  gradSoft: 'rgba(59,130,246,0.06)',
  gradCard: '#FFFFFF',
  text: '#0F172A',
  textSec: '#64748B',
  textTer: '#94A3B8',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: 'rgba(59,130,246,0.4)',
  success: '#10B981',
  successBg: 'rgba(16,185,129,0.1)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.1)',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.1)',
  info: '#3B82F6',
  infoBg: 'rgba(59,130,246,0.1)',
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
function vnd(n){return Number(n||0).toLocaleString('vi-VN')+' đ'}
const fmtNum = fmt
const parseNum = (v) => String(v||'').replace(/\./g,'').replace(/[^\d]/g,'')

const INP = {style:{width:'100%',padding:'10px 14px',border:'1px solid #D1D5DB',borderRadius:8,fontSize:13,fontFamily:"'Inter',system-ui,sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box',transition:'border-color 0.15s'}}

function Card({title,children,action,glow}){
  return <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,padding:'18px 22px',marginBottom:16,position:'relative',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
    {glow && <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',borderRadius:'14px 14px 0 0'}}/>}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
      <span style={{fontSize:12.5,fontWeight:700,color:'#0F172A',letterSpacing:'-0.01em'}}>{title}</span>{action}
    </div>
    {children}
  </div>
}

function Btn({children,onClick,primary,sm,danger,ghost,type,style:s}){
  const base={cursor:'pointer',borderRadius:8,fontSize:sm?11:12.5,fontWeight:600,fontFamily:"'Inter',system-ui,sans-serif",display:'inline-flex',alignItems:'center',gap:5,lineHeight:1,transition:'opacity 0.15s',padding:sm?'5px 10px':'7px 14px',...s}
  if(primary)return<button type={type||'button'} onClick={onClick} style={{...base,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',border:'none',boxShadow:'0 1px 3px rgba(59,130,246,0.3)'}}>{children}</button>
  if(danger)return<button type={type||'button'} onClick={onClick} style={{...base,background:'rgba(239,68,68,0.08)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.2)'}}>{children}</button>
  if(ghost)return<button type={type||'button'} onClick={onClick} style={{...base,background:'transparent',color:'#64748B',border:'1px solid #E2E8F0'}}>{children}</button>
  return<button type={type||'button'} onClick={onClick} style={{...base,background:'#F8FAFC',color:'#374151',border:'1px solid #E2E8F0'}}>{children}</button>
}

function FG({label,children}){return<div style={{marginBottom:14}}><label style={{fontSize:10.5,fontWeight:700,color:'#64748B',marginBottom:5,display:'block',letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</label>{children}</div>}
function Row2({children}){return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>}
function Empty({children}){return <div style={{textAlign:'center',padding:'28px 0',color:B.textTer,fontSize:12,fontWeight:500}}>{children}</div>}

function Modal({title,children,onClose,wide,lg}){
  return<div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose?.()}}>
    <div style={{background:'#FFFFFF',borderRadius:16,boxShadow:'0 20px 60px rgba(0,0,0,0.15)',width:'100%',maxWidth:lg?'min(1100px,97vw)':wide?'min(900px,96vw)':'min(600px,95vw)',maxHeight:'calc(100vh - 32px)',display:'flex',flexDirection:'column',overflow:'hidden',border:'1px solid #E2E8F0'}}>
      <div style={{padding:'18px 22px',borderBottom:'1px solid #F1F5F9',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <span style={{fontSize:15,fontWeight:700,color:'#0F172A'}}>{title}</span>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#94A3B8',fontSize:18,lineHeight:1,padding:4,borderRadius:6}}>×</button>
      </div>
      <div style={{padding:'18px 22px',overflowY:'auto',flex:1}}>{children}</div>
    </div>
  </div>
}

function MFoot({onClose,onDelete,children}){
  if(children)return<div style={{padding:'14px 22px',borderTop:'1px solid #F1F5F9',display:'flex',gap:8,justifyContent:'flex-end',background:'#FAFAFA',flexShrink:0}}>{children}</div>
  return<div style={{padding:'14px 22px',borderTop:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',background:'#FAFAFA',flexShrink:0}}>
    <div>{onDelete&&<Btn danger onClick={onDelete}>Xóa</Btn>}</div>
    <div style={{display:'flex',gap:8}}>
      <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:8,border:'1px solid #E2E8F0',background:'#F8FAFC',color:'#374151',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',system-ui,sans-serif"}}>Huỷ</button>
      <button type="submit" style={{padding:'7px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>Lưu</button>
    </div>
  </div>
}

function inp(ex={}){return {...INP,...ex,style:{...INP.style,...(ex.style||{})}}}

// KK Logo
function Logo({size=36}){
  return <div style={{width:size,height:size,borderRadius:Math.round(size*0.28),background:B.gradPrimary,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px ${B.primaryGlow}`,flexShrink:0}}>
    <span style={{color:'#fff',fontWeight:900,fontSize:Math.round(size*0.38),fontFamily:"'Plus Jakarta Sans', sans-serif",letterSpacing:'-0.05em'}}>K</span>
  </div>
}

function NavIco({id,size=15,col='currentColor'}){
  const sym={
    dashboard:'▣',pipeline:'◈',workflow:'◎',projects:'▤',
    pricing:'◊',invoices:'≡',approval:'✓',contracts:'⊟',
    bbnt:'☐',clients:'◉',kols:'◆',vendors:'⬡',
    team:'◑',reports:'▦',quotations:'≈',payment:'₫',
  }
  return<span style={{fontSize:size-1,color:col,lineHeight:1,display:'inline-flex',alignItems:'center',justifyContent:'center',fontStyle:'normal'}}>{sym[id]||'·'}</span>
}

// Stat card with accent bar
function StatCard({label,value,sub,color,icon}){
  return <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
    <div style={{position:'absolute',top:0,left:0,width:4,height:'100%',background:color||B.gradPrimary,borderRadius:'14px 0 0 14px'}}/>
    <div style={{paddingLeft:8}}>
      <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{label}</div>
      <div style={{fontSize:24,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em',lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'#94A3B8',marginTop:5,fontWeight:500}}>{sub}</div>}
    </div>
  </div>
}

// ── Date filter & sort shared utilities ──────────────────────
function applyDateFilter(items, dateField, from, to) {
  if (!from && !to) return items
  const f = from ? new Date(from) : null
  const t = to ? new Date(to + 'T23:59:59') : null
  return items.filter(item => {
    const raw = item[dateField]; if (!raw) return false
    const d = new Date(raw)
    if (f && d < f) return false
    if (t && d > t) return false
    return true
  })
}

function getPresetDates(key) {
  const now = new Date(), today = now.toISOString().slice(0,10)
  if (key==='today') return {from:today,to:today}
  if (key==='7d') {const d=new Date(now);d.setDate(d.getDate()-6);return{from:d.toISOString().slice(0,10),to:today}}
  if (key==='30d') {const d=new Date(now);d.setDate(d.getDate()-29);return{from:d.toISOString().slice(0,10),to:today}}
  if (key==='month') return{from:new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10),to:today}
  if (key==='quarter') {const q=Math.floor(now.getMonth()/3);return{from:new Date(now.getFullYear(),q*3,1).toISOString().slice(0,10),to:today}}
  if (key==='year') return{from:now.getFullYear()+'-01-01',to:today}
  return {from:'',to:''}
}

function applySortDate(items, sort) {
  if (!sort?.field) return items
  return [...items].sort((a,b)=>{
    const av=a[sort.field]||'', bv=b[sort.field]||''
    const cmp=av<bv?-1:av>bv?1:0
    return sort.dir==='asc'?cmp:-cmp
  })
}

function DateFilterBar({from,setFrom,to,setTo,extra}) {
  const [active,setActive]=useState('')
  const presets=[['Hôm nay','today'],['7 ngày','7d'],['30 ngày','30d'],['Tháng này','month'],['Quý này','quarter'],['Năm nay','year']]
  function applyPreset(key){setActive(key);const{from:f,to:t}=getPresetDates(key);setFrom(f);setTo(t)}
  function clear(){setActive('');setFrom('');setTo('')}
  const ds={...INP.style,padding:'5px 10px',fontSize:12,width:130}
  const as={border:`1px solid ${B.primary}`,background:B.primary,color:'#fff'}
  const is={border:`1px solid ${B.border}`,background:'transparent',color:B.textSec}
  return(
    <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
      {extra}
      <input type="date" value={from} onChange={e=>{setFrom(e.target.value);setActive('')}} style={ds}/>
      <span style={{fontSize:10,color:B.textTer,fontWeight:700}}>–</span>
      <input type="date" value={to} onChange={e=>{setTo(e.target.value);setActive('')}} style={ds}/>
      {presets.map(([label,key])=>(
        <button key={key} onClick={()=>applyPreset(key)} style={{padding:'5px 10px',borderRadius:7,cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Inter',sans-serif",transition:'all 0.15s',...(active===key?as:is)}}>{label}</button>
      ))}
      {(from||to)&&<button onClick={clear} style={{padding:'5px 10px',borderRadius:7,border:`1px solid ${B.border}`,background:'rgba(239,68,68,0.06)',color:B.danger,cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>× Tất cả</button>}
    </div>
  )
}

function SortHdr({children,field,sort,setSort,thStyle}){
  const active=sort?.field===field, dir=sort?.dir||'desc'
  return(
    <th onClick={()=>setSort({field,dir:active&&dir==='desc'?'asc':'desc'})} style={{...thStyle,cursor:'pointer',userSelect:'none'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:3}}>{children}<span style={{fontSize:8,color:active?B.primary:B.textTer}}>{active?(dir==='desc'?'↓':'↑'):'↕'}</span></span>
    </th>
  )
}

function Payment({data, supabase, reload, log, currentUser}) {
  const [tab, setTab] = useState('thu')
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [monthF, setMonthF] = useState('')
  const [yearF, setYearF] = useState(new Date().getFullYear().toString())

  useEffect(()=>{ loadPayments() },[tab])

  async function loadPayments() {
    setLoading(true)
    const {data:rows} = await supabase.from('payments').select('*').order('created_at',{ascending:false})
    const today = new Date().toISOString().slice(0,10)
    const updated = (rows||[]).map(p => {
      if(p.due_date < today && p.status !== 'Paid') return {...p, status:'Overdue'}
      return p
    })
    setPayments(updated)
    setLoading(false)
  }

  async function savePayment(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const amtTotal = Number(fd.get('amount_total')||0)
    const amtPaid = Number(fd.get('amount_paid')||0)
    const r = {
      party_type: tab==='thu'?'client':'kol',
      party_name: fd.get('party_name'),
      contract_code: fd.get('contract_code'),
      amount_total: amtTotal,
      amount_paid: amtPaid,
      amount_remaining: amtTotal - amtPaid,
      due_date: fd.get('due_date')||null,
      payment_method: fd.get('payment_method')||'Bank Transfer',
      status: amtPaid >= amtTotal ? 'Paid' : amtPaid > 0 ? 'Partial' : 'Pending',
      notes: fd.get('notes')||'',
    }
    if(editItem) {
      await supabase.from('payments').update(r).eq('id',editItem.id)
    } else {
      await supabase.from('payments').insert([r])
    }
    log('Payment: '+r.party_name)
    loadPayments()
    setShowAdd(false); setEditItem(null)
  }

  const list = payments.filter(p => {
    const matchType = tab==='thu' ? p.party_type==='client' : (p.party_type==='kol'||p.party_type==='vendor')
    const matchSearch = !search || (p.party_name||'').toLowerCase().includes(search.toLowerCase()) || (p.contract_code||'').toLowerCase().includes(search.toLowerCase())
    const matchMonth = !monthF || (p.due_date||'').slice(5,7) === monthF.padStart(2,'0')
    const matchYear = !yearF || (p.due_date||'').slice(0,4) === yearF
    return matchType && matchSearch && matchMonth && matchYear
  })

  const totalAmt = list.reduce((a,p)=>a+Number(p.amount_total||0),0)
  const totalPaid = list.reduce((a,p)=>a+Number(p.amount_paid||0),0)
  const totalRem = list.reduce((a,p)=>a+Number(p.amount_remaining||0),0)
  const totalOvd = list.filter(p=>p.status==='Overdue').reduce((a,p)=>a+Number(p.amount_remaining||0),0)

  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:'#374151',borderBottom:'1px solid #E2E8F0',textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid #F1F5F9',verticalAlign:'middle',color:'#1F2937',fontSize:12}
  const statusColor = {Pending:'#F59E0B',Partial:'#3B82F6',Paid:'#10B981',Overdue:'#EF4444'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Quản lý thanh toán</h2>
        <Btn primary onClick={()=>{setEditItem(null);setShowAdd(true)}}>+ Thêm thanh toán</Btn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'#F1F5F9',padding:4,borderRadius:10,width:'fit-content',border:'1px solid #E2E8F0'}}>
        {[['thu','Thu công nợ (Clients)'],['chi','Chi KOL/NCC']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?'linear-gradient(135deg,#3B82F6,#0EA5E9)':'transparent',color:tab===key?'#fff':'#64748B',cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Inter',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}}>
        {[
          ['Tổng phải '+(tab==='thu'?'thu':'chi'),totalAmt,'#3B82F6'],
          ['Đã '+(tab==='thu'?'thu':'chi'),totalPaid,'#10B981'],
          ['Còn lại',totalRem,'#F59E0B'],
          ['Quá hạn',totalOvd,'#EF4444']
        ].map(([l,v,c])=>(
          <div key={l} style={{background:'#FFFFFF',borderRadius:12,padding:'14px 16px',border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.05)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,width:4,height:'100%',background:c,borderRadius:'12px 0 0 12px'}}/>
            <div style={{paddingLeft:8}}>
              <div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6}}>{l}</div>
              <div style={{fontSize:18,fontWeight:900,color:'#0F172A'}}>{fmtS(v)}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Tìm tên / mã HĐ..." value={search} onChange={e=>setSearch(e.target.value)} style={{...INP.style,maxWidth:240}}/>
        <select value={monthF} onChange={e=>setMonthF(e.target.value)} style={{...INP.style,width:'auto'}}>
          <option value="">Tất cả tháng</option>
          {Array.from({length:12},(_,i)=><option key={i+1} value={String(i+1).padStart(2,'0')}>Tháng {i+1}</option>)}
        </select>
        <select value={yearF} onChange={e=>setYearF(e.target.value)} style={{...INP.style,width:'auto'}}>
          {['2024','2025','2026','2027'].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>

      <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>{['Đối tác','Mã HĐ','Tổng','Đã TT','Còn lại','Hạn TT','Phương thức','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={9} style={{textAlign:'center',padding:32,color:'#94A3B8'}}>Đang tải...</td></tr>}
            {!loading&&list.map(p=>(
              <tr key={p.id}>
                <td style={{...TD,fontWeight:700}}>{p.party_name||'—'}</td>
                <td style={{...TD,fontSize:11,color:'#6366F1',fontWeight:600}}>{p.contract_code||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{vnd(p.amount_total)}</td>
                <td style={{...TD,color:'#10B981',fontWeight:600}}>{vnd(p.amount_paid)}</td>
                <td style={{...TD,color:Number(p.amount_remaining)>0?'#F59E0B':'#10B981',fontWeight:700}}>{vnd(p.amount_remaining)}</td>
                <td style={{...TD,fontSize:11,color:'#64748B'}}>{p.due_date||'—'}</td>
                <td style={{...TD,fontSize:11}}>{p.payment_method||'—'}</td>
                <td style={TD}><span style={{background:(statusColor[p.status]||'#94A3B8')+'18',color:statusColor[p.status]||'#94A3B8',padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${(statusColor[p.status]||'#94A3B8')}25`}}>{p.status}</span></td>
                <td style={TD}><Btn sm onClick={()=>{setEditItem(p);setShowAdd(true)}}>Sửa</Btn></td>
              </tr>
            ))}
            {!loading&&!list.length&&<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có thanh toán nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd&&<Modal title={editItem?'Sửa thanh toán':'Thêm thanh toán'} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
        <form onSubmit={savePayment}>
          <FG label="Tên đối tác"><input name="party_name" defaultValue={editItem?.party_name||''} required style={INP.style}/></FG>
          <Row2>
            <FG label="Mã hợp đồng"><input name="contract_code" defaultValue={editItem?.contract_code||''} style={INP.style}/></FG>
            <FG label="Phương thức TT"><select name="payment_method" defaultValue={editItem?.payment_method||'Bank Transfer'} style={INP.style}><option>Bank Transfer</option><option>Cash</option><option>Check</option></select></FG>
          </Row2>
          <Row2>
            <FG label="Tổng giá trị (VND)"><input name="amount_total" type="number" defaultValue={editItem?.amount_total||0} required style={INP.style}/></FG>
            <FG label="Đã thanh toán (VND)"><input name="amount_paid" type="number" defaultValue={editItem?.amount_paid||0} style={INP.style}/></FG>
          </Row2>
          <FG label="Hạn thanh toán"><input name="due_date" type="date" defaultValue={editItem?.due_date||''} style={INP.style}/></FG>
          <FG label="Ghi chú"><textarea name="notes" defaultValue={editItem?.notes||''} style={{...INP.style,minHeight:70}}/></FG>
          <MFoot onClose={()=>{setShowAdd(false);setEditItem(null)}}/>
        </form>
      </Modal>}
    </div>
  )
}

export default function App(){
  const [page,setPage]=useState('dashboard')
  const [data,setData]=useState({projects:[],clients:[],kols:[],team:[],invoices:[],deals:[],dealHistory:[],vendors:[],approvals:[]})
  const [loading,setLoading]=useState(true)
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const [currentUser,setCurrentUser]=useState(null)
  const [authReady,setAuthReady]=useState(false)
  const [prefill,setPrefill]=useState(null)

  const [notifs, setNotifs] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = notifs.filter(n=>!n.is_read).length

  async function loadNotifs(user) {
    const u = user || currentUser
    if(!u?.email) return
    const {data:rows} = await supabase.from('notifications').select('*').eq('recipient_email',u.email).order('created_at',{ascending:false}).limit(30)
    setNotifs(rows||[])
  }

  async function markAllRead() {
    if(!currentUser?.email) return
    await supabase.from('notifications').update({is_read:true}).eq('recipient_email',currentUser.email).eq('is_read',false)
    setNotifs(prev=>prev.map(n=>({...n,is_read:true})))
  }

  async function initStorage() {
    const buckets = ['kol-documents','contracts','invoices']
    for(const bucket of buckets){
      const {data:bkt, error} = await supabase.storage.getBucket(bucket)
      if(bkt) { console.log('[Storage] Bucket OK:', bucket); continue }
      const msg = error?.message?.toLowerCase()||''
      if(msg.includes('not found')||msg.includes('does not exist')||error?.status===404||error?.statusCode==='404') {
        const {error:ce} = await supabase.storage.createBucket(bucket,{public:true,fileSizeLimit:10485760})
        if(ce) console.warn('[Storage] Create failed:', bucket, ce.message)
        else console.log('[Storage] Created bucket:', bucket)
      } else {
        console.warn('[Storage] getBucket error:', bucket, error?.message)
      }
    }
  }

  useEffect(()=>{
    const stored = localStorage.getItem('kk_session')
    let parsedUser = null
    if(stored){try{parsedUser=JSON.parse(stored);setCurrentUser(parsedUser)}catch(e){}}
    setAuthReady(true)
    initStorage()
    if(parsedUser) loadAll()
    if(parsedUser) loadNotifs(parsedUser)
    function handleNavigate(e){
      if(e.detail?.page){setPage(e.detail.page);setPrefill(e.detail.prefill||null)}
    }
    window.addEventListener('navigate',handleNavigate)
    return ()=>window.removeEventListener('navigate',handleNavigate)
  },[])

  function handleLogin(session){setCurrentUser(session)}
  function handleLogout(){localStorage.removeItem('kk_session');setCurrentUser(null)}

  function canAccess(module){
    if(!currentUser) return false
    if(currentUser.isMaster) return true
    const p = currentUser.permissions?.[module]
    if(!p) return module === 'workflow' || module === 'quotations'
    return p?.can_view||false
  }

  async function loadAll(){
    setLoading(true)
    try {
      const tables=['projects','clients','kols','team','invoices','deals','deal_history','vendors','approvals']
      const results=await Promise.allSettled(tables.map(t=>
        supabase.from(t).select('*').order('created_at',{ascending:false})
      ))
      results.forEach((r,i)=>{
        if(r.status==='rejected') console.error('[loadAll] Network error:',tables[i],r.reason)
        else if(r.value?.error) console.error('[loadAll] Table error:',tables[i],r.value.error.message)
      })
      const get=i=>results[i].status==='fulfilled'?(results[i].value.data||[]):[]
      setData({
        projects:get(0),clients:get(1),kols:get(2),team:get(3),
        invoices:get(4),deals:get(5),dealHistory:get(6),vendors:get(7),approvals:get(8)
      })
    } catch(e){ console.error('[loadAll] Fatal:',e.message) }
    setLoading(false)
  }

  async function fetchProjects(){
    const{data:rows,error}=await supabase.from('projects').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] projects:',error.message)
    else setData(p=>({...p,projects:rows||[]}))
  }
  async function fetchClients(){
    const{data:rows,error}=await supabase.from('clients').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] clients:',error.message)
    else setData(p=>({...p,clients:rows||[]}))
  }
  async function fetchKols(){
    const{data:rows,error}=await supabase.from('kols').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] kols:',error.message)
    else setData(p=>({...p,kols:rows||[]}))
  }
  async function fetchTeam(){
    const{data:rows,error}=await supabase.from('team').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] team:',error.message)
    else setData(p=>({...p,team:rows||[]}))
  }
  async function fetchInvoices(){
    const{data:rows,error}=await supabase.from('invoices').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] invoices:',error.message)
    else setData(p=>({...p,invoices:rows||[]}))
  }
  async function fetchDeals(){
    const[dr,hr]=await Promise.allSettled([
      supabase.from('deals').select('*').order('created_at',{ascending:false}),
      supabase.from('deal_history').select('*').order('created_at',{ascending:false})
    ])
    setData(p=>({
      ...p,
      deals:dr.status==='fulfilled'?(dr.value.data||p.deals):p.deals,
      dealHistory:hr.status==='fulfilled'?(hr.value.data||p.dealHistory):p.dealHistory
    }))
  }
  async function fetchVendors(){
    const{data:rows,error}=await supabase.from('vendors').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] vendors:',error.message)
    else setData(p=>({...p,vendors:rows||[]}))
  }
  async function fetchApprovals(){
    const{data:rows,error}=await supabase.from('approvals').select('*').order('created_at',{ascending:false})
    if(error) console.error('[fetch] approvals:',error.message)
    else setData(p=>({...p,approvals:rows||[]}))
  }

  const TABLE_FETCHERS={
    projects:fetchProjects, clients:fetchClients, kols:fetchKols,
    team:fetchTeam, invoices:fetchInvoices, deals:fetchDeals,
    deal_history:fetchDeals, vendors:fetchVendors, approvals:fetchApprovals
  }

  async function add(t,r){const{error}=await supabase.from(t).insert([r]);if(error){alert('Lỗi: '+error.message);return false}await(TABLE_FETCHERS[t]||loadAll)();return true}
  async function upd(t,id,r){const{error}=await supabase.from(t).update(r).eq('id',id);if(error){alert('Lỗi: '+error.message);return false}await(TABLE_FETCHERS[t]||loadAll)();return true}
  async function del(t,id){if(!confirm('Xác nhận xóa?'))return;await supabase.from(t).delete().eq('id',id);await(TABLE_FETCHERS[t]||loadAll)()}
  const log = async (msg) => { await supabase.from('audit_log').insert([{message:msg,role:'User'}]) }

  const NAV=[
    {id:'dashboard',label:'Dashboard',grp:'BUSINESS DEV'},
    {id:'pipeline',label:'Deal Pipeline',grp:'BUSINESS DEV'},
    {id:'workflow',label:'Công việc',grp:'OPERATIONS'},
    {id:'projects',label:'Dự án',grp:'OPERATIONS'},
    {id:'pricing',label:'Dự toán chi phí',grp:'OPERATIONS'},
    {id:'quotations',label:'Báo giá',grp:'OPERATIONS'},
    {id:'contracts',label:'Hợp đồng',grp:'LEGAL & FINANCE'},
    {id:'bbnt',label:'Biên bản NT',grp:'LEGAL & FINANCE'},
    {id:'invoices',label:'Hóa đơn',grp:'LEGAL & FINANCE'},
    {id:'payment',label:'Thanh toán',grp:'LEGAL & FINANCE'},
    {id:'approval',label:'Approvals',grp:'LEGAL & FINANCE'},
    {id:'clients',label:'Clients',grp:'DATABASE'},
    {id:'kols',label:'KOL / KOC',grp:'DATABASE'},
    {id:'vendors',label:'Vendors',grp:'DATABASE'},
    {id:'team',label:'Team',grp:'TEAM & REPORTS'},
    {id:'reports',label:'Analytics',grp:'TEAM & REPORTS'},
  ]
  const pending=data.approvals.filter(a=>a.status==='Pending').length
  const overdue=data.invoices.filter(i=>i.status==='Overdue').length

  if(!authReady) return null
  if(!currentUser) return <LoginScreen supabase={supabase} onLogin={handleLogin}/>

  const P={data,add,upd,del,log,reload:loadAll,supabase,currentUser,fetchClients}
  const visibleNAV = currentUser?.isMaster ? NAV : NAV.filter(n=>canAccess(n.id))
  const groups=[...new Set(visibleNAV.map(n=>n.grp))]

  if(loading)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:20,background:'#F8FAFF',fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(59,130,246,0.3)'}}>
        <span style={{color:'#fff',fontWeight:900,fontSize:24}}>K</span>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:18,fontWeight:800,color:'#0F172A'}}>K&K Advertising</div>
        <div style={{fontSize:12,color:'#64748B',marginTop:4}}>Agency OS — Loading...</div>
      </div>
      <div style={{width:140,height:2,background:'rgba(59,130,246,0.1)',borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',width:'60%',background:'linear-gradient(90deg,#3B82F6,#0EA5E9)',borderRadius:99,animation:'loading 1.5s ease infinite'}}/>
      </div>
    </div>
  )

  return(
    <div style={{display:'flex',width:'100vw',height:'100vh',overflow:'hidden',background:'#F8FAFF',fontFamily:"'Inter',system-ui,sans-serif",position:'fixed',inset:0}}>

      {/* SIDEBAR */}
      <div style={{width:sidebarCollapsed?68:240,borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,transition:'width 0.25s ease',background:'linear-gradient(180deg,#1E3A5F 0%,#1a2d4a 100%)',position:'relative',zIndex:10}}>
        {/* Logo */}
        <div style={{padding:'18px 14px 14px',borderBottom:'1px solid #F1F5F9',display:'flex',alignItems:'center',gap:10,justifyContent:sidebarCollapsed?'center':'flex-start'}}>
          <div style={{width:36,height:36,borderRadius:11,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 16px rgba(59,130,246,0.3)'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:17}}>K</span>
          </div>
          {!sidebarCollapsed&&<div style={{minWidth:0}}>
            <div style={{fontWeight:800,fontSize:12.5,color:'#F1F5F9',letterSpacing:'-0.01em',whiteSpace:'nowrap'}}>K&K Advertising</div>
            <div style={{fontSize:8.5,fontWeight:700,color:'#38BDF8',marginTop:1,letterSpacing:'0.08em'}}>AGENCY OS</div>
          </div>}
        </div>
        {/* Search */}
        {!sidebarCollapsed&&(
          <div style={{padding:'10px 10px 6px'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 10px',background:'rgba(255,255,255,0.06)',borderRadius:9,border:'1px solid rgba(255,255,255,0.1)'}}>
              <span style={{fontSize:12,color:'#64748B',lineHeight:1}}>⌕</span>
              <span style={{fontSize:11,color:'#64748B'}}>Search...</span>
            </div>
          </div>
        )}
        {/* Nav */}
        <div style={{flex:1,overflowY:'auto',padding:'4px 8px'}}>
          {groups.map(grp=>(
            <div key={grp}>
              {!sidebarCollapsed&&<div style={{padding:'8px 6px 2px',fontSize:9,fontWeight:800,color:'rgba(255,255,255,0.35)',letterSpacing:'0.12em',textTransform:'uppercase'}}>{grp}</div>}
              {visibleNAV.filter(n=>n.grp===grp).map(n=>{
                const active=page===n.id
                return(
                  <div key={n.id} onClick={()=>setPage(n.id)}
                    style={{padding:sidebarCollapsed?'8px 0':'6px 8px',cursor:'pointer',borderRadius:9,display:'flex',alignItems:'center',justifyContent:sidebarCollapsed?'center':'flex-start',gap:9,marginBottom:1,position:'relative',transition:'background 0.15s',
                      background:active?'rgba(59,130,246,0.15)':'transparent'}}
                    onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
                    onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent'}}>
                    {active&&<div style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:18,background:'#3B82F6',borderRadius:'0 3px 3px 0',boxShadow:'0 0 8px rgba(59,130,246,0.4)'}}/>}
                    <div style={{width:30,height:30,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                      background:active?'rgba(59,130,246,0.2)':'transparent',
                      border:active?'1px solid rgba(59,130,246,0.3)':'1px solid transparent'}}>
                      <NavIco id={n.id} size={14} col={active?'#60A5FA':'#64748B'}/>
                    </div>
                    {!sidebarCollapsed&&<span style={{fontSize:11.5,fontWeight:active?700:500,color:active?'#FFFFFF':'rgba(255,255,255,0.55)',whiteSpace:'nowrap'}}>{n.label}</span>}
                    {!sidebarCollapsed&&n.id==='approval'&&pending>0&&(
                      <span style={{marginLeft:'auto',background:'#EF4444',color:'#fff',fontSize:9,padding:'1px 6px',borderRadius:99,fontWeight:700}}>{pending}</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {/* User */}
        <div style={{padding:'10px 10px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          {sidebarCollapsed?(
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${currentUser?.avatar_color||'#3B82F6'},#0EA5E9)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800,margin:'0 auto'}}>
              {currentUser?.avatar_initials||'K'}
            </div>
          ):(
            <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:11,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
              <div style={{width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${currentUser?.avatar_color||'#3B82F6'},#0EA5E9)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800,flexShrink:0,position:'relative'}}>
                {currentUser?.avatar_initials||'K'}
                <div style={{position:'absolute',bottom:-1,right:-1,width:8,height:8,borderRadius:'50%',background:'#10B981',border:'2px solid #1E293B',boxShadow:'0 0 6px rgba(16,185,129,0.6)'}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11.5,fontWeight:700,color:'#F1F5F9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{currentUser?.name?.split(' ').slice(-1)[0]||'Khoa'}</div>
                <div style={{fontSize:9,color:'#38BDF8',fontWeight:600,marginTop:1}}>{currentUser?.isMaster?'● Premium member':'● Staff'}</div>
              </div>
              <button onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',color:'#64748B',padding:4,borderRadius:6,lineHeight:1,display:'flex',alignItems:'center'}}>
                <span style={{fontSize:13,color:'currentColor',lineHeight:1}}>→</span>
              </button>
            </div>
          )}
        </div>
        {/* Collapse */}
        <button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)}
          style={{position:'absolute',right:-11,top:'50%',transform:'translateY(-50%)',width:22,height:22,borderRadius:'50%',background:'#273549',border:'1px solid rgba(255,255,255,0.1)',color:'#64748B',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>
          {sidebarCollapsed?<span style={{fontSize:14,lineHeight:1}}>›</span>:<span style={{fontSize:14,lineHeight:1}}>‹</span>}
        </button>
      </div>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative',zIndex:1}}>
        {/* Topbar */}
        <div style={{height:52,borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',background:'rgba(255,255,255,0.9)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:11,color:'#94A3B8',cursor:'pointer',fontWeight:500}} onClick={()=>setPage('dashboard')}>Home</span>
            <span style={{fontSize:11,color:'#CBD5E1',margin:'0 4px'}}>›</span>
            <span style={{fontSize:11,fontWeight:700,color:'#3B82F6'}}>{visibleNAV.find(n=>n.id===page)?.label||NAV.find(n=>n.id===page)?.label||'Dashboard'}</span>
            <span style={{fontSize:11,color:'#CBD5E1',margin:'0 4px'}}>›</span>
            <span style={{fontSize:11,color:'#94A3B8'}}>{new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{position:'relative',cursor:'pointer',width:34,height:34,borderRadius:9,background:'#F8FAFC',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setPage('approval')}>
              <span style={{fontSize:15,color:'#64748B',lineHeight:1}}>○</span>
              {pending>0&&<div style={{position:'absolute',top:6,right:6,width:6,height:6,borderRadius:'50%',background:'#EF4444'}}/>}
            </div>
            {/* Notification Bell */}
            <div style={{position:'relative'}}>
              <div style={{position:'relative',cursor:'pointer',width:34,height:34,borderRadius:9,background:'#F8FAFC',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center'}}
                onClick={()=>{setShowNotifs(v=>!v);loadNotifs()}}>
                <span style={{fontSize:16,lineHeight:1}}>🔔</span>
                {unreadCount>0&&<div style={{position:'absolute',top:-4,right:-4,minWidth:16,height:16,borderRadius:99,background:'#EF4444',color:'#fff',fontSize:9,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px',border:'2px solid #fff'}}>{unreadCount>9?'9+':unreadCount}</div>}
              </div>
              {showNotifs&&(
                <div style={{position:'absolute',top:42,right:0,width:360,maxHeight:480,overflowY:'auto',background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,0.12)',zIndex:2000}}>
                  <div style={{padding:'12px 16px',borderBottom:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:13,fontWeight:700,color:'#0F172A'}}>Thông báo</span>
                    {unreadCount>0&&<button onClick={markAllRead} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:'#3B82F6',fontWeight:600,padding:0}}>Đánh dấu tất cả đã đọc</button>}
                  </div>
                  {notifs.length===0&&<div style={{padding:'24px 16px',textAlign:'center',color:'#94A3B8',fontSize:12}}>Không có thông báo</div>}
                  {notifs.map(n=>(
                    <div key={n.id} style={{padding:'10px 16px',borderBottom:'1px solid #F8FAFC',background:n.is_read?'#fff':'rgba(59,130,246,0.04)',cursor:'pointer'}}
                      onClick={async()=>{
                        if(!n.is_read){await supabase.from('notifications').update({is_read:true}).eq('id',n.id);setNotifs(prev=>prev.map(x=>x.id===n.id?{...x,is_read:true}:x))}
                        setShowNotifs(false)
                      }}>
                      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                        <span style={{fontSize:18,flexShrink:0}}>{n.type==='TASK_ASSIGNED'?'📋':n.type==='APPROVAL'?'✅':'💬'}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:n.is_read?500:700,color:'#0F172A',marginBottom:2}}>{n.title}</div>
                          <div style={{fontSize:11,color:'#64748B',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.message}</div>
                          <div style={{fontSize:9,color:'#94A3B8',marginTop:3}}>{new Date(n.created_at).toLocaleString('vi-VN')}</div>
                        </div>
                        {!n.is_read&&<div style={{width:7,height:7,borderRadius:'50%',background:'#3B82F6',flexShrink:0,marginTop:4}}/>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:9,background:'#F8FAFC',border:'1px solid #E2E8F0'}}>
              <div style={{width:24,height:24,borderRadius:7,background:`linear-gradient(135deg,${currentUser?.avatar_color||'#3B82F6'},#0EA5E9)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:9,fontWeight:800}}>
                {currentUser?.avatar_initials||'K'}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:'#0F172A',lineHeight:1}}>{currentUser?.name?.split(' ').slice(-1)[0]||'Khoa'}</div>
                <div style={{fontSize:9,color:'#64748B',marginTop:1}}>{currentUser?.isMaster?'CEO':'Staff'}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{flex:1,minWidth:0,overflowY:'auto',overflowX:'hidden',padding:'16px 20px'}}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; }
            body { margin:0; padding:0; font-family:'Inter',system-ui,sans-serif; }
            @keyframes loading { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
            ::-webkit-scrollbar{width:4px;height:4px}
            ::-webkit-scrollbar-track{background:transparent}
            ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:99px}
          `}</style>
          {page==='dashboard'  && <Dashboard data={data} setPage={setPage} currentUser={currentUser}/>}
          {page==='pipeline'   && <Pipeline {...P}/>}
          {page==='workflow'   && <WorkflowPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='projects'   && <Projects {...P}/>}
          {page==='pricing'    && <Pricing {...P}/>}
          {page==='invoices'   && <Invoices {...P}/>}
          {page==='approval'   && <Approval {...P} currentUser={currentUser}/>}
          {page==='contracts'  && <Contracts data={data} supabase={supabase} reload={loadAll} log={log} prefill={prefill} onClearPrefill={()=>setPrefill(null)}/>}
          {page==='bbnt'       && <AcceptanceReports data={data} supabase={supabase} reload={loadAll} log={log} prefill={prefill} onClearPrefill={()=>setPrefill(null)}/>}
          {page==='clients'    && <Clients {...P}/>}
          {page==='kols'       && <Kols {...P}/>}
          {page==='vendors'    && <Vendors {...P}/>}
          {page==='team'       && <TeamPage data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
          {page==='reports'    && <Reports {...P}/>}
          {page==='quotations' && <Quotations data={data} supabase={supabase} reload={loadAll} log={log}/>}
          {page==='payment'    && <Payment data={data} supabase={supabase} reload={loadAll} log={log} currentUser={currentUser}/>}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ data, setPage, currentUser }) {
  const isCEO = currentUser?.isMaster
  const firstName = currentUser?.name?.split(' ').slice(-1)[0] || 'Khoa'
  const now = new Date()
  const hour = now.getHours()
  const [meetings, setMeetings] = useState([])
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [meetingForm, setMeetingForm] = useState({title:'',meeting_date:'',meeting_time:'',location:'',attendees:'',notes:''})

  useEffect(()=>{
    async function loadMeetings(){
      const today = new Date().toISOString().slice(0,10)
      const next7 = new Date(Date.now()+7*86400000).toISOString().slice(0,10)
      const {data:mdata} = await supabase.from('meetings').select('*').gte('meeting_date',today).lte('meeting_date',next7).order('meeting_date',{ascending:true})
      setMeetings(mdata||[])
    }
    if(currentUser?.isMaster) loadMeetings()
  },[currentUser])

  async function saveMeeting(e){
    e.preventDefault()
    await supabase.from('meetings').insert([{...meetingForm, created_by: currentUser?.name||'CEO'}])
    setShowMeetingForm(false)
    setMeetingForm({title:'',meeting_date:'',meeting_time:'',location:'',attendees:'',notes:''})
    const today = new Date().toISOString().slice(0,10)
    const next7 = new Date(Date.now()+7*86400000).toISOString().slice(0,10)
    const {data:mdata} = await supabase.from('meetings').select('*').gte('meeting_date',today).lte('meeting_date',next7).order('meeting_date',{ascending:true})
    setMeetings(mdata||[])
  }

  const rev  = data.projects.reduce((a,p) => a + Number(p.revenue||0), 0)
  const cost = data.projects.reduce((a,p) => a + Number(p.actual_cost||0), 0)
  const profit = rev - cost
  const margin = rev ? Math.round(profit/rev*100) : 0
  const active = data.projects.filter(p => p.status==='Active' || p.current_stage==='EXECUTION').length
  const pendingAppr = data.approvals.filter(a => a.status==='Pending')
  const won = data.deals.filter(d => d.stage==='Won').length
  const wr = data.deals.length ? Math.round(won/data.deals.length*100) : 0
  const outstanding = data.invoices.filter(i=>i.status!=='Paid').reduce((a,i)=>a+Number(i.amount||0)-Number(i.paid||0),0)

  const myProjects = data.projects.filter(p=>p.pm===currentUser?.name&&p.status==='Active')

  const glass = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  }

  const byM = Array(12).fill(0)
  data.projects.forEach(p => { if(p.start_date) byM[new Date(p.start_date).getMonth()] += Number(p.revenue||0) })
  const maxM = Math.max(...byM, 1)
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D']

  const greeting = hour<12?'Chào buổi sáng':hour<17?'Chào buổi chiều':'Chào buổi tối'
  const greetingEN = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'

  if (!isCEO) {
    return (
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:28,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em',lineHeight:1.2}}>
            {greeting}, {firstName}!
          </div>
          <div style={{fontSize:13,color:'#64748B',marginTop:6}}>
            Hôm nay là {now.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          <div style={{...glass,padding:'20px 22px'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0F172A',marginBottom:14}}>Dự án của tôi</div>
            {myProjects.length ? myProjects.map(p=>(
              <div key={p.id} style={{padding:'10px 0',borderBottom:'1px solid #F1F5F9'}}>
                <div style={{fontWeight:700,fontSize:12,color:'#0F172A'}}>{p.campaign||p.client}</div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                  <span style={{fontSize:10,color:'#64748B'}}>{p.client}</span>
                  <Badge text={p.status}/>
                </div>
              </div>
            )) : <Empty>Chưa có dự án nào</Empty>}
          </div>
          <div style={{...glass,padding:'20px 22px'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0F172A',marginBottom:14}}>Phê duyệt đang chờ</div>
            {pendingAppr.length ? pendingAppr.slice(0,5).map(a=>(
              <div key={a.id} style={{padding:'8px 0',borderBottom:'1px solid #F1F5F9'}}>
                <div style={{fontWeight:600,fontSize:12}}>{a.title||a.type}</div>
                <div style={{fontSize:10,color:'#64748B',marginTop:2}}>{a.submitted_by} · {a.approval_date}</div>
              </div>
            )) : <Empty>Không có gì cần phê duyệt</Empty>}
          </div>
        </div>

        <div style={{...glass,padding:'20px 22px'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#0F172A',marginBottom:14}}>Thao tác nhanh</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {[['+ Báo giá','quotations','#3B82F6'],['+ KOL mới','kols','#8B5CF6'],['Xem HĐ','contracts','#059669'],['Tạo BBNT','bbnt','#F59E0B']].map(([l,pg,c])=>(
              <button key={pg} onClick={()=>setPage(pg)} style={{padding:'9px 16px',borderRadius:10,border:`1px solid ${c}25`,background:c+'0D',color:c,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // CEO DASHBOARD
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', system-ui, sans-serif", color: '#0F172A' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginBottom: 3 }}>
            {greetingEN}, {firstName}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Agency Overview
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
            {now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </div>
        </div>
        {pendingAppr.length > 0 && (
          <button onClick={() => setPage('approval')} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: '#EF4444',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }} />
            {pendingAppr.length} phê duyệt đang chờ
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10, marginBottom: 14 }}>
        {[
          ['Revenue', fmtS(rev), 'VND', '#06B6D4'],
          ['Profit', fmtS(profit), margin+'% margin', '#10B981'],
          ['Active', active, data.projects.length+' tổng', '#6366F1'],
          ['Win Rate', wr+'%', won+'/'+data.deals.length+' deals', wr>=50?'#10B981':'#F59E0B'],
          ['Clients', data.clients.length, 'in database', '#8B5CF6'],
          ['Tồn đọng', fmtS(outstanding), 'VND', '#EF4444'],
        ].map(([label, value, sub, accent]) => (
          <div key={label} style={{ background:'#FFFFFF', border:'1px solid #E2E8F0', borderRadius:12, padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: '12px 12px 0 0' }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 250px', gap: 12, marginBottom: 12 }}>
        <div style={{ ...glass, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Revenue · 2026</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
            {months.map((m, i) => {
              const h = byM[i] ? Math.max(6, Math.round(byM[i]/maxM*88)) : 4
              const isNow = i === now.getMonth()
              const isPast = i < now.getMonth()
              return (
                <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: '100%', borderRadius: '2px 2px 1px 1px', minHeight: 4, height: h + '%',
                    background: isNow ? 'linear-gradient(180deg,#0EA5E9,#3B82F6)' : isPast && byM[i] > 0 ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.08)',
                    boxShadow: isNow ? '0 0 14px rgba(14,165,233,0.4)' : 'none',
                  }} />
                  <div style={{ fontSize: 8, color: isNow ? '#0EA5E9' : '#94A3B8', fontWeight: isNow ? 700 : 400 }}>{m}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ ...glass, padding: '20px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Pipeline</div>
          {['Lead','Pitching','Negotiation','Won','Lost'].map(s => {
            const cnt = data.deals.filter(d=>d.stage===s).length
            const colors = {Lead:'#94A3B8',Pitching:'#3B82F6',Negotiation:'#F59E0B',Won:'#10B981',Lost:'#EF4444'}
            return (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #F8FAFF' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>{s}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: Math.max(4,cnt*8), height: 6, background: colors[s], borderRadius: 3 }}/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: colors[s] }}>{cnt}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ ...glass, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Dự án đang hoạt động</div>
            <button onClick={() => setPage('workflow')} style={{ fontSize: 10, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Workflow →</button>
          </div>
          {data.projects.filter(p => p.status==='Active').slice(0, 5).map(p => (
            <div key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{p.campaign || p.client}</span>
                <Badge text={p.status}/>
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{p.client} · PM: {p.pm||'—'}</div>
            </div>
          ))}
          {!data.projects.filter(p => p.status==='Active').length && <Empty>Chưa có dự án</Empty>}
        </div>

        <div style={{ ...glass, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Hóa đơn quá hạn</div>
            <button onClick={() => setPage('invoices')} style={{ fontSize: 10, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>View →</button>
          </div>
          {data.invoices.filter(i=>i.status==='Overdue').slice(0, 5).map(i => (
            <div key={i.id} style={{ padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{i.client}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>{vnd(Number(i.amount)-Number(i.paid||0))}</span>
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Hạn: {i.due_date||'—'}</div>
            </div>
          ))}
          {!data.invoices.filter(i=>i.status==='Overdue').length && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#10B981', fontSize: 12, fontWeight: 600 }}>
              Không có hóa đơn quá hạn ✓
            </div>
          )}
        </div>
      </div>

      {/* Meetings Widget */}
      <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,padding:'18px 22px',marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:800,color:'#0F172A'}}>Cuộc họp tuần này</div>
          <button onClick={()=>setShowMeetingForm(true)} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>+ Thêm</button>
        </div>
        {meetings.length===0&&<div style={{textAlign:'center',padding:'20px 0',color:'#94A3B8',fontSize:12}}>Không có cuộc họp nào trong 7 ngày tới</div>}
        {meetings.map((m,i)=>(
          <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #F1F5F9',alignItems:'flex-start'}}>
            <div style={{background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',borderRadius:10,padding:'8px 10px',textAlign:'center',flexShrink:0,minWidth:48}}>
              <div style={{fontSize:11,fontWeight:600,opacity:0.85}}>{new Date(m.meeting_date).toLocaleDateString('vi-VN',{month:'short'})}</div>
              <div style={{fontSize:20,fontWeight:900,lineHeight:1}}>{new Date(m.meeting_date).getDate()}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:12,color:'#0F172A',marginBottom:2}}>{m.title}</div>
              <div style={{fontSize:11,color:'#64748B'}}>{m.meeting_time&&`${m.meeting_time} · `}{m.location&&m.location}</div>
              {m.attendees&&<div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>{m.attendees}</div>}
            </div>
          </div>
        ))}
        {showMeetingForm&&(
          <div style={{marginTop:14,padding:14,background:'#F8FAFF',borderRadius:10,border:'1px solid #E2E8F0'}}>
            <form onSubmit={saveMeeting}>
              <div style={{marginBottom:10,fontWeight:700,fontSize:12,color:'#0F172A'}}>Thêm cuộc họp mới</div>
              <input value={meetingForm.title} onChange={e=>setMeetingForm(p=>({...p,title:e.target.value}))} placeholder="Tiêu đề cuộc họp *" required style={{width:'100%',padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,marginBottom:8,fontFamily:"'Inter',system-ui,sans-serif",outline:'none',boxSizing:'border-box'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                <input type="date" value={meetingForm.meeting_date} onChange={e=>setMeetingForm(p=>({...p,meeting_date:e.target.value}))} required style={{padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",outline:'none'}}/>
                <input type="time" value={meetingForm.meeting_time} onChange={e=>setMeetingForm(p=>({...p,meeting_time:e.target.value}))} style={{padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",outline:'none'}}/>
              </div>
              <input value={meetingForm.location} onChange={e=>setMeetingForm(p=>({...p,location:e.target.value}))} placeholder="Địa điểm" style={{width:'100%',padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,marginBottom:8,fontFamily:"'Inter',system-ui,sans-serif",outline:'none',boxSizing:'border-box'}}/>
              <input value={meetingForm.attendees} onChange={e=>setMeetingForm(p=>({...p,attendees:e.target.value}))} placeholder="Người tham dự" style={{width:'100%',padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,marginBottom:8,fontFamily:"'Inter',system-ui,sans-serif",outline:'none',boxSizing:'border-box'}}/>
              <textarea value={meetingForm.notes} onChange={e=>setMeetingForm(p=>({...p,notes:e.target.value}))} placeholder="Ghi chú" style={{width:'100%',padding:'8px 10px',border:'1px solid #D1D5DB',borderRadius:7,fontSize:12,marginBottom:10,fontFamily:"'Inter',system-ui,sans-serif",outline:'none',boxSizing:'border-box',minHeight:60,resize:'vertical'}}/>
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                <button type="button" onClick={()=>setShowMeetingForm(false)} style={{padding:'7px 14px',borderRadius:7,border:'1px solid #D1D5DB',background:'#fff',color:'#64748B',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Inter',system-ui,sans-serif"}}>Hủy</button>
                <button type="submit" style={{padding:'7px 16px',borderRadius:7,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>Lưu</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}


function Pipeline({data,add,upd,del,log,reload,supabase}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(null)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const stages=['Lead','Pitching','Negotiation','Won','Lost']
  const stageColor={Lead:B.textTer,Pitching:B.primary,Negotiation:B.warning,Won:B.success,Lost:B.danger}
  async function save(e){
    e.preventDefault();const fd=new FormData(e.target)
    const r={client:fd.get('client'),service:fd.get('service'),value:Number(fd.get('value')||0),stage:fd.get('stage'),pm:fd.get('pm'),notes:fd.get('notes'),deal_date:new Date().toLocaleDateString('vi-VN')}
    edit?await upd('deals',edit.id,r):await add('deals',r)
    setEdit(null);setShowAdd(null)
  }
  const allDeals = applyDateFilter(data.deals,'created_at',dateFrom,dateTo)
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Deal Pipeline</h2><div style={{display:'flex',gap:8}}><ImportBtn module="deals" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd('Lead')}>+ New Deal</Btn></div></div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
        {stages.map(stage=>{
          const deals=allDeals.filter(d=>d.stage===stage),tot=deals.reduce((a,d)=>a+Number(d.value||0),0)
          return <div key={stage} style={{background:'#F8FAFF',borderRadius:14,padding:12,border:`1px solid #E2E8F0`,borderTop:`3px solid ${stageColor[stage]}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
              <span style={{fontSize:11,fontWeight:800,color:stageColor[stage],textTransform:'uppercase',letterSpacing:'0.04em'}}>{stage}</span>
              <span style={{fontSize:10,color:B.textTer,background:'#E2E8F0',padding:'2px 7px',borderRadius:99,fontWeight:600}}>{deals.length}</span>
            </div>
            <div style={{fontSize:12,fontWeight:800,color:B.primary,marginBottom:10}}>{fmtS(tot)}</div>
            {deals.map(d=><div key={d.id} onClick={()=>setEdit(d)} style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:10,padding:'10px 12px',marginBottom:7,cursor:'pointer',transition:'transform 0.15s, border-color 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#3B82F6'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
              <div style={{fontWeight:700,fontSize:11.5,marginBottom:3,color:B.text}}>{d.client||'—'}</div>
              <div style={{fontSize:10,color:B.textTer,marginBottom:6}}>{d.service||'—'}</div>
              <div style={{fontWeight:800,fontSize:12,color:B.primary}}>{vnd(d.value)}</div>
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

// ── File Upload Component ──────────────────────────────────
function FileUpload({supabase, bucket, folder, label, accept, maxMB, value, onChange, multiple}) {
  const [uploading, setUploading] = useState(false)
  const isImg = url => /\.(jpg|jpeg|png|gif|webp)$/i.test((url||'').split('?')[0])
  const urls = multiple ? (Array.isArray(value)?value:[]).filter(Boolean) : (value?[value]:[])

  async function handleFile(e) {
    const files = Array.from(e.target.files); if(!files.length) return
    setUploading(true)
    const result = []
    for(const file of files) {
      if(maxMB && file.size > maxMB*1024*1024) { alert(`File ${file.name} quá lớn (tối đa ${maxMB}MB)`); continue }
      const ext = file.name.split('.').pop().toLowerCase()
      const filePath = `${folder||'uploads'}/${Date.now()}-${Math.random().toString(36).slice(2,7)}.${ext}`
      const {error: uploadError} = await supabase.storage.from(bucket).upload(filePath, file, {upsert:true})
      if(uploadError) { alert(`Upload lỗi (${bucket}/${filePath}): ${uploadError.message}`); continue }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl
      console.log('[FileUpload] bucket:', bucket, '| path:', filePath, '| url:', publicUrl)
      if(!publicUrl) { alert('Không tạo được URL file. Kiểm tra lại bucket: '+bucket); continue }
      result.push(publicUrl)
    }
    if(multiple) onChange([...urls, ...result])
    else if(result.length) onChange(result[0])
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(url) {
    if(!confirm('Xóa file này?')) return
    const marker = '/storage/v1/object/public/'+bucket+'/'
    const idx = url.indexOf(marker)
    if(idx>=0) await supabase.storage.from(bucket).remove([decodeURIComponent(url.slice(idx+marker.length))])
    if(multiple) onChange(urls.filter(u=>u!==url))
    else onChange('')
  }

  return (
    <div>
      {urls.map((url,i) => (
        <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,padding:'7px 10px',background:'#F8FAFF',borderRadius:8,border:'1px solid #E2E8F0'}}>
          {isImg(url)
            ? <img src={url} alt="" onClick={()=>window.open(url,'_blank')} style={{width:44,height:44,objectFit:'cover',borderRadius:6,flexShrink:0,cursor:'pointer'}}/>
            : <span style={{fontSize:20,flexShrink:0}}>📄</span>}
          <span onClick={()=>window.open(url,'_blank')} style={{fontSize:11,color:'#3B82F6',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0,cursor:'pointer',textDecoration:'underline'}}>
            {decodeURIComponent((url.split('/').pop()||url).split('?')[0])}
          </span>
          <button type="button" onClick={()=>handleDelete(url)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',fontSize:16,lineHeight:1,padding:2,flexShrink:0}}>×</button>
        </div>
      ))}
      <label style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:8,border:'1.5px dashed #CBD5E1',cursor:uploading?'not-allowed':'pointer',fontSize:12,color:'#64748B',background:'#FAFAFA',fontWeight:600}}>
        <span>{uploading?'Đang upload...':'⬆ '+(label||'Chọn file')}</span>
        <input type="file" style={{display:'none'}} accept={accept||'*'} multiple={!!multiple} onChange={handleFile} disabled={uploading}/>
      </label>
    </div>
  )
}

// ── Access filter for data security ───────────────────────
function filterByAccess(items, currentUser, type, projects) {
  if(!currentUser || currentUser.isMaster) return {list:items, hidden:0}
  const role = (currentUser.role||'').toLowerCase()
  if((role.includes('finance')||role.includes('kế toán')) && (type==='invoices'||type==='payments')) {
    return {list:items, hidden:0}
  }
  let filtered = items
  if(type === 'projects') {
    filtered = items.filter(p => p.pm === currentUser.name || (Array.isArray(p.team_members)&&p.team_members.includes(currentUser.name)))
  } else if(type === 'invoices') {
    const vis = new Set((projects||[]).filter(p=>p.pm===currentUser.name||(Array.isArray(p.team_members)&&p.team_members.includes(currentUser.name))).map(p=>p.client))
    filtered = items.filter(i => vis.has(i.client))
  } else if(type === 'contracts') {
    const vis = new Set((projects||[]).filter(p=>p.pm===currentUser.name||(Array.isArray(p.team_members)&&p.team_members.includes(currentUser.name))).map(p=>p.id))
    filtered = items.filter(c => !c.project_id || vis.has(c.project_id))
  } else if(type === 'quotations') {
    const vis = new Set((projects||[]).filter(p=>p.pm===currentUser.name||(Array.isArray(p.team_members)&&p.team_members.includes(currentUser.name))).map(p=>p.id))
    filtered = items.filter(q => q.prepared_by===currentUser.name || !q.project_id || vis.has(q.project_id))
  }
  return {list:filtered, hidden:items.length - filtered.length}
}

function Projects({data,add,upd,del,log,reload,supabase,currentUser,fetchClients}){
  const [search,setSearch]=useState('')
  const [stF,setStF]=useState('')
  const [svF,setSvF]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'start_date',dir:'desc'})
  const [projClient, setProjClient] = useState('')
  const [projClientLinked, setProjClientLinked] = useState(false)
  const [projClientObj, setProjClientObj] = useState(null)
  const [newClientFields, setNewClientFields] = useState({tax_code:'',address:'',contact_person:'',phone:'',email:''})
  const [clientDropOpen, setClientDropOpen] = useState(false)

  useEffect(()=>{
    const name = edit?.client||''
    setProjClient(name)
    const found = data.clients.find(c=>c.name?.toLowerCase()===name.toLowerCase())
    setProjClientLinked(!!found)
    setProjClientObj(found||null)
    setNewClientFields({tax_code:'',address:'',contact_person:'',phone:'',email:''})
  },[edit, showAdd])

  function handleClientInput(v) {
    setProjClient(v)
    const found = data.clients.find(c=>c.name?.toLowerCase()===v.toLowerCase())
    setProjClientLinked(!!found)
    setProjClientObj(found||null)
    setClientDropOpen(v.length>0)
  }

  const clientSuggestions = projClient.length>0
    ? data.clients.filter(c=>(c.name||'').toLowerCase().includes(projClient.toLowerCase())||(c.tax_code||'').includes(projClient)).slice(0,8)
    : []

  const {list:accessProjects, hidden:hiddenProjects} = filterByAccess(data.projects, currentUser, 'projects', data.projects)
  const filtered=applySortDate(applyDateFilter(accessProjects.filter(p=>(!search||(p.client+''+p.campaign).toLowerCase().includes(search.toLowerCase()))&&(!stF||p.status===stF)&&(!svF||p.service===svF)),'start_date',dateFrom,dateTo),sort)

  async function save(e){
    e.preventDefault();const fd=new FormData(e.target)
    let clientId = data.clients.find(c=>c.name?.toLowerCase()===projClient.toLowerCase())?.id || null
    const today = new Date().toISOString().slice(0,10)
    if(projClient && !clientId) {
      // Check by name + tax_code to avoid duplicates
      const taxCode = newClientFields.tax_code||null
      const dupCheck = data.clients.find(c=>c.name?.toLowerCase()===projClient.toLowerCase()||(taxCode&&c.tax_code===taxCode))
      if(dupCheck) {
        clientId = dupCheck.id
      } else {
        const {data:newClient} = await supabase.from('clients').insert([{
          name:projClient, since:today, source:'Auto-created from project',
          tax_code:taxCode, address:newClientFields.address||null,
          contact_person:newClientFields.contact_person||null, phone:newClientFields.phone||null, email:newClientFields.email||null
        }]).select().single()
        clientId = newClient?.id || null
      }
      await fetchClients()
    }
    // Sync client stats on every save
    if(clientId) {
      await supabase.from('clients').update({last_project_date:today}).eq('id',clientId)
    }
    const r={project_code:fd.get('code'),client:projClient,client_id:clientId,campaign:fd.get('campaign'),service:fd.get('service'),pm:fd.get('pm'),budget_plan:Number(fd.get('budget_plan')||0),actual_cost:Number(fd.get('actual_cost')||0),revenue:Number(fd.get('revenue')||0),start_date:fd.get('start_date')||null,end_date:fd.get('end_date')||null,status:fd.get('status'),kols:fd.get('kols').split(',').map(s=>s.trim()).filter(Boolean),vendors:fd.get('vendors').split(',').map(s=>s.trim()).filter(Boolean),notes:fd.get('notes')}
    edit?await upd('projects',edit.id,r):await add('projects',r)
    log((edit?'Cập nhật':'Thêm')+': '+r.campaign);setEdit(null);setShowAdd(false)
  }
  const totRev=filtered.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totProfit=filtered.reduce((a,p)=>a+Number(p.revenue||0)-Number(p.actual_cost||0),0)
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'#FFFFFF',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
        <div>
          <h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Quản lý dự án</h2>
          {!currentUser?.isMaster && hiddenProjects>0 && <div style={{fontSize:10,color:B.textTer,marginTop:3,fontWeight:600}}>Đang hiển thị {accessProjects.length}/{data.projects.length} dự án được phân công</div>}
        </div>
        <div style={{display:'flex',gap:8}}><ImportBtn module="projects" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Dự án mới</Btn></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:18}}>
        {[['Dự án',filtered.length,'',B.primary],['Revenue',fmtS(totRev),'VND',B.accent],['Profit',fmtS(totProfit),'',B.success],['Avg Margin',totRev?Math.round(totProfit/totRev*100)+'%':'—','','#7C3AED']].map(([l,v,s,c])=>(
          <StatCard key={l} label={l} value={v} sub={s} color={c}/>
        ))}
      </div>
      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:240}})}/>
        <select value={stF} onChange={e=>setStF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Status</option><option>Active</option><option>Completed</option><option>On Hold</option><option>Cancelled</option></select>
        <select value={svF} onChange={e=>setSvF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Services</option><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select>
        {(search||stF||svF)&&<span style={{fontSize:11,color:B.textSec,fontWeight:600,marginLeft:4}}>{filtered.length} kết quả</span>}
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:950}}>
          <thead><tr>
            {['ID','Client','Campaign','Service','PM','Budget','Actual','Revenue','Margin','Status'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="start_date" sort={sort} setSort={setSort} thStyle={TH}>Start</SortHdr>
            <SortHdr field="end_date" sort={sort} setSort={setSort} thStyle={TH}>Deadline</SortHdr>
            <th style={TH}></th>
          </tr></thead>
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
                <td style={{...TD,fontSize:11}}>{vnd(p.budget_plan)}</td>
                <td style={{...TD,fontSize:11,fontWeight:600,color:bv>10?B.danger:bv>0?B.warning:B.success}}>{vnd(p.actual_cost)}{p.budget_plan?<span style={{fontSize:9,marginLeft:3}}>({bv}%)</span>:''}</td>
                <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{vnd(p.revenue)}</td>
                <td style={{...TD,fontWeight:800,color:m>=30?B.success:m>=15?B.warning:B.danger}}>{Number(p.revenue)?m+'%':'—'}</td>
                <td style={TD}><Badge text={p.status}/></td>
                <td style={{...TD,fontSize:10,color:B.textTer}}>{p.start_date||'—'}</td>
                <td style={{...TD,fontSize:10,color:B.textTer}}>{p.end_date||'—'}</td>
                <td style={TD}><Btn sm onClick={()=>setEdit(p)}>Edit</Btn></td>
              </tr>
            })}
            {!filtered.length&&<tr><td colSpan={13} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No projects found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Project':'New Project'} onClose={()=>{setEdit(null);setShowAdd(false)}} wide><form onSubmit={save}>
        <Row2>
          <FG label="Project Code"><input name="code" defaultValue={edit?.project_code||'KK-'+String(data.projects.length+1).padStart(3,'0')} {...inp()}/></FG>
          <FG label="Client">
            <div style={{position:'relative'}}>
              <input value={projClient} onChange={e=>handleClientInput(e.target.value)} onFocus={()=>setClientDropOpen(projClient.length>0)} onBlur={()=>setTimeout(()=>setClientDropOpen(false),180)} required {...inp()} placeholder="Tìm hoặc nhập tên khách hàng..."/>
              {clientDropOpen && clientSuggestions.length>0 && (
                <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1px solid #E2E8F0',borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:100,maxHeight:220,overflowY:'auto'}}>
                  {clientSuggestions.map(c=>(
                    <div key={c.id} onMouseDown={()=>{setProjClient(c.name);setProjClientLinked(true);setProjClientObj(c);setClientDropOpen(false)}}
                      style={{padding:'8px 12px',cursor:'pointer',borderBottom:'1px solid #F8FAFC',fontSize:12}}
                      onMouseEnter={e=>e.currentTarget.style.background='#F0F9FF'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <div style={{fontWeight:700,color:'#0F172A'}}>{c.name}</div>
                      {c.tax_code&&<div style={{fontSize:10,color:'#64748B',marginTop:1}}>MST: {c.tax_code}{c.address?` · ${c.address.slice(0,40)}`:''}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {projClient&&<div style={{fontSize:10,marginTop:3,fontWeight:600,color:projClientLinked?'#10B981':'#F59E0B'}}>{projClientLinked?'✓ Đã liên kết với khách hàng':'⚡ Khách hàng mới — sẽ được tạo tự động'}</div>}
            {projClientLinked && projClientObj && (
              <div style={{marginTop:6,padding:'8px 10px',background:'rgba(16,185,129,0.06)',borderRadius:8,border:'1px solid rgba(16,185,129,0.2)',fontSize:11}}>
                <div style={{fontWeight:700,color:'#065F46',marginBottom:3}}>{projClientObj.name}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 8px',color:'#064E3B'}}>
                  {projClientObj.tax_code&&<span>MST: {projClientObj.tax_code}</span>}
                  {projClientObj.contact_person&&<span>ĐD: {projClientObj.contact_person}</span>}
                  {projClientObj.phone&&<span>📞 {projClientObj.phone}</span>}
                  {projClientObj.email&&<span>✉ {projClientObj.email}</span>}
                  {projClientObj.address&&<span style={{gridColumn:'span 2',color:'#475569'}}>📍 {projClientObj.address}</span>}
                </div>
              </div>
            )}
          </FG>
        </Row2>
        {projClient && !projClientLinked && (
          <div style={{marginBottom:14,padding:'12px 14px',background:'rgba(245,158,11,0.06)',borderRadius:10,border:'1px solid rgba(245,158,11,0.25)'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#92400E',marginBottom:10}}>Thông tin khách hàng mới (tuỳ chọn)</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <FG label="Mã số thuế"><input value={newClientFields.tax_code} onChange={e=>setNewClientFields(p=>({...p,tax_code:e.target.value}))} placeholder="MST..." {...inp()}/></FG>
              <FG label="Người liên hệ"><input value={newClientFields.contact_person} onChange={e=>setNewClientFields(p=>({...p,contact_person:e.target.value}))} placeholder="Họ tên..." {...inp()}/></FG>
              <FG label="Số điện thoại"><input value={newClientFields.phone} onChange={e=>setNewClientFields(p=>({...p,phone:e.target.value}))} placeholder="0909..." {...inp()}/></FG>
              <FG label="Email"><input value={newClientFields.email} onChange={e=>setNewClientFields(p=>({...p,email:e.target.value}))} placeholder="email@..." type="email" {...inp()}/></FG>
            </div>
            <FG label="Địa chỉ"><input value={newClientFields.address} onChange={e=>setNewClientFields(p=>({...p,address:e.target.value}))} placeholder="Địa chỉ công ty..." {...inp()}/></FG>
          </div>
        )}
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
            <Row2><FG label="Client Budget (VND)"><input type="text" value={fmtNum(I.budget)} onChange={e=>s('budget',parseNum(e.target.value))} {...inp()}/></FG><FG label="Target Margin (%)"><input type="number" value={I.margin} onChange={e=>s('margin',e.target.value)} {...inp()}/></FG></Row2>
            <FG label="Service Type"><select value={I.service} onChange={e=>s('service',e.target.value)} {...inp()}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG>
            <FG label="Client Name"><input type="text" value={I.client} onChange={e=>s('client',e.target.value)} placeholder="Tên client..." {...inp()}/></FG>
            <div style={{height:1,background:B.border,margin:'10px 0'}}/>
            <Row2><FG label="Số KOL/KOC"><input type="number" value={I.kolNum||0} onChange={e=>s('kolNum',e.target.value)} {...inp()}/></FG><FG label="Avg Cost/KOL"><input type="text" value={fmtNum(I.kolCost)} onChange={e=>s('kolCost',parseNum(e.target.value))} {...inp()}/></FG></Row2>
            <Row2><FG label="Production"><input type="text" value={fmtNum(I.prod)} onChange={e=>s('prod',parseNum(e.target.value))} {...inp()}/></FG><FG label="Ads/Seeding"><input type="text" value={fmtNum(I.ads)} onChange={e=>s('ads',parseNum(e.target.value))} {...inp()}/></FG></Row2>
            <Row2><FG label="Agency Ops"><input type="text" value={fmtNum(I.ops)} onChange={e=>s('ops',parseNum(e.target.value))} {...inp()}/></FG><FG label="Other"><input type="text" value={fmtNum(I.other)} onChange={e=>s('other',parseNum(e.target.value))} {...inp()}/></FG></Row2>
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
                    <td style={{padding:'5px 6px'}}><input type="text" value={fmtNum(s.cost)} onChange={e=>{const n=[...sc];n[i]={...n[i],cost:parseNum(e.target.value)};setSc(n)}} style={{width:95,...INP.style,padding:'5px 8px'}}/></td>
                    <td style={{padding:'5px 6px',fontWeight:800,fontSize:11,color:B.primary}}>{vnd(Number(s.num||0)*Number(s.cost||0))}</td>
                    <td><button onClick={()=>setSc(p=>p.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:B.danger,fontSize:18,lineHeight:1}}>×</button></td>
                  </tr>
                ))}
                <tr style={{background:B.gradSoft}}><td colSpan={4} style={{padding:'8px',fontWeight:800,fontSize:11,color:B.textSec}}>Total KOL Cost</td><td style={{padding:'8px',fontWeight:900,color:B.primary,fontSize:13}}>{vnd(kt)}</td><td/></tr>
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <Card title="Pricing Output" glow>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>KOL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{vnd(kt)}</div></div>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>TOTAL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{vnd(tc)}</div></div>
            </div>
            <div style={{background:B.gradPrimary,borderRadius:16,padding:'20px 24px',textAlign:'center',marginBottom:16,boxShadow:`0 8px 32px ${B.primaryGlow}`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-15,right:-15,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
              <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>RECOMMENDED PRICE</div>
              <div style={{fontSize:34,fontWeight:900,color:'#fff',letterSpacing:'-0.04em'}}>{fmt(rp)}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:4,fontWeight:600}}>VND</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.successBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.success}25`}}><div style={{fontSize:9,fontWeight:800,color:B.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>PROFIT</div><div style={{fontSize:18,fontWeight:900,color:B.success}}>{vnd(pr)}</div></div>
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
                  {data.dealHistory.map(d=><tr key={d.id} style={{borderBottom:`1px solid ${B.border}`}}><td style={{padding:'7px 8px',fontSize:10,color:B.textTer}}>{d.deal_date}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:700}}>{d.client}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:800,color:B.primary}}>{vnd(d.price)}</td><td style={{padding:'7px 8px',fontSize:11}}>{d.margin}%</td><td style={{padding:'7px 8px'}}><Badge text={d.decision}/></td></tr>)}
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

function Invoices({data,add,upd,del,log,reload,supabase,currentUser}){
  const [filter,setFilter]=useState('')
  const [showAdd,setShowAdd]=useState(false)
  const [editInv,setEditInv]=useState(null)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'due_date',dir:'asc'})
  const [invFiles, setInvFiles] = useState({invoice_file_url:'', payment_proof_url:''})
  useEffect(()=>{
    if(editInv) setInvFiles({invoice_file_url:editInv.invoice_file_url||'',payment_proof_url:editInv.payment_proof_url||''})
    else setInvFiles({invoice_file_url:'',payment_proof_url:''})
  },[editInv])
  const {list:accessInvoices} = filterByAccess(data.invoices, currentUser, 'invoices', data.projects)
  const invs=applySortDate(applyDateFilter(accessInvoices.filter(i=>!filter||i.status===filter),'due_date',dateFrom,dateTo),sort)
  const tA=data.invoices.reduce((a,i)=>a+Number(i.amount||0),0)
  const tP=data.invoices.reduce((a,i)=>a+Number(i.paid||0),0)
  const ov=data.invoices.filter(i=>i.status==='Overdue').reduce((a,i)=>a+Number(i.amount||0)-Number(i.paid||0),0)
  function closeForm(){setShowAdd(false);setEditInv(null)}
  async function save(e){
    e.preventDefault();const fd=new FormData(e.target)
    const a=Number(fd.get('amount')||0),p=Number(fd.get('paid')||0),d=fd.get('due_date')
    const od=d&&new Date(d)<new Date()&&p<a
    const status=p>=a?'Paid':od?'Overdue':p>0?'Partial':'Unpaid'
    if(editInv){
      await upd('invoices',editInv.id,{client:fd.get('client'),project:fd.get('project'),amount:a,paid:p,due_date:d||null,status,notes:fd.get('notes'),invoice_file_url:invFiles.invoice_file_url,payment_proof_url:invFiles.payment_proof_url})
      log('Cập nhật HĐ: '+fd.get('client'))
    } else {
      await add('invoices',{invoice_code:'KK-'+String(data.invoices.length+1).padStart(3,'0'),client:fd.get('client'),project:fd.get('project'),amount:a,paid:p,due_date:d||null,status,notes:fd.get('notes'),invoice_file_url:invFiles.invoice_file_url,payment_proof_url:invFiles.payment_proof_url})
      log('HĐ: '+fd.get('client'))
    }
    closeForm()
  }
  async function markPaid(inv){const a=Number(prompt('Thu từ '+inv.client+'\nCòn: '+fmt(Number(inv.amount)-Number(inv.paid))+' VND\nSố tiền:',Number(inv.amount)-Number(inv.paid))||0);if(!a)return;const np=Math.min(Number(inv.paid)+a,Number(inv.amount));await upd('invoices',inv.id,{paid:np,status:np>=Number(inv.amount)?'Paid':np>0?'Partial':'Unpaid'});log('Thu: '+fmt(a))}
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:'#374151',borderBottom:`1px solid #E2E8F0`,textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle',color:'#1F2937'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Hóa đơn & Công nợ</h2><div style={{display:'flex',gap:8}}><ImportBtn module="invoices" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Tạo hóa đơn</Btn></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:18}}>
        <StatCard label="Tổng HĐ" value={fmtS(tA)} color={B.primary}/>
        <StatCard label="Đã thu" value={fmtS(tP)} color={B.success}/>
        <StatCard label="Còn phải thu" value={fmtS(tA-tP)} color={B.warning}/>
        <StatCard label="Quá hạn" value={fmtS(ov)} color={B.danger}/>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        <select value={filter} onChange={e=>setFilter(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Status</option><option value="Unpaid">Unpaid</option><option value="Partial">Partial</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option></select>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>
            {['Invoice','Client','Project','Amount','Paid','Remaining'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="due_date" sort={sort} setSort={setSort} thStyle={TH}>Due</SortHdr>
            {['Status',''].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {invs.map(i=><tr key={i.id}>
              <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:700}}>{i.invoice_code}</td>
              <td style={{...TD,fontWeight:800,color:B.text}}>{i.client}</td>
              <td style={{...TD,fontSize:11,color:B.textSec}}>{i.project||'—'}</td>
              <td style={{...TD,fontSize:12,fontWeight:800}}>{vnd(i.amount)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:B.success}}>{vnd(i.paid)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:Number(i.amount)-Number(i.paid)>0?B.warning:B.success}}>{vnd(Number(i.amount)-Number(i.paid))}</td>
              <td style={{...TD,fontSize:10,color:B.textTer}}>{i.due_date||'—'}</td>
              <td style={TD}><Badge text={i.status}/></td>
              <td style={TD}>
                <div style={{display:'flex',gap:4,alignItems:'center',flexWrap:'wrap'}}>
                  {i.invoice_file_url&&<span title="Hóa đơn VAT" onClick={()=>window.open(i.invoice_file_url,'_blank')} style={{cursor:'pointer',fontSize:14}}>📄</span>}
                  {i.payment_proof_url&&<span title="Chứng từ TT" onClick={()=>window.open(i.payment_proof_url,'_blank')} style={{cursor:'pointer',fontSize:14}}>🧾</span>}
                  <Btn sm onClick={()=>markPaid(i)}>Thu tiền</Btn>
                  <Btn sm onClick={()=>setEditInv(i)}>Sửa</Btn>
                </div>
              </td>
            </tr>)}
            {!invs.length&&<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No invoices</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||editInv)&&<Modal title={editInv?'Sửa hóa đơn':'New Invoice'} onClose={closeForm} wide><form onSubmit={save}>
        <Row2>
          <FG label="Client"><select name="client" defaultValue={editInv?.client||''} {...inp()}><option value="">— Select —</option>{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</select></FG>
          <FG label="Project"><input name="project" defaultValue={editInv?.project||''} {...inp()}/></FG>
        </Row2>
        <Row2><FG label="Amount (VND)"><input name="amount" type="number" required defaultValue={editInv?.amount||''} {...inp()}/></FG><FG label="Deposit Paid"><input name="paid" type="number" defaultValue={editInv?.paid||0} {...inp()}/></FG></Row2>
        <FG label="Due Date"><input name="due_date" type="date" defaultValue={editInv?.due_date||''} {...inp()}/></FG>
        <Row2>
          <FG label="Hóa đơn VAT (PDF)"><FileUpload supabase={supabase} bucket="invoices" folder="vat" label="Upload PDF" accept=".pdf,image/*" maxMB={20} value={invFiles.invoice_file_url} onChange={v=>setInvFiles(p=>({...p,invoice_file_url:v}))}/></FG>
          <FG label="Chứng từ thanh toán"><FileUpload supabase={supabase} bucket="invoices" folder="proofs" label="Upload ảnh/PDF" accept=".pdf,image/*" maxMB={10} value={invFiles.payment_proof_url} onChange={v=>setInvFiles(p=>({...p,payment_proof_url:v}))}/></FG>
        </Row2>
        <FG label="Notes"><textarea name="notes" defaultValue={editInv?.notes||''} {...inp({style:{...INP.style,minHeight:60}})}/></FG>
        <MFoot onClose={closeForm} onDelete={editInv?()=>{del('invoices',editInv.id);closeForm()}:null}/>
      </form></Modal>}
    </div>
  )
}

function Approval({data,upd,log}){
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'approval_date',dir:'desc'})
  const list=applySortDate(applyDateFilter(data.approvals,'approval_date',dateFrom,dateTo),sort)
  async function resolve(a,ok){const note=document.getElementById('n-'+a.id)?.value||'';await upd('approvals',a.id,{status:ok?'Approved':'Rejected',notes:note,resolved_by:'CEO'});log((ok?'Approved':'Rejected')+': '+a.title)}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Approval Queue</h2>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={()=>setSort(s=>({field:'approval_date',dir:s.dir==='desc'?'asc':'desc'}))} style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${B.border}`,background:'transparent',color:B.textSec,cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
            Date {sort.dir==='desc'?'↓':'↑'}
          </button>
        </div>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      {list.length?list.map(a=>(
        <div key={a.id} style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,padding:'18px 22px',marginBottom:12}}>
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
      )):<div style={{textAlign:'center',padding:80,color:B.textTer,fontSize:13,fontWeight:600}}>{data.approvals.length?'No approvals in range':'Queue is empty — all clear ✓'}</div>}
    </div>
  )
}

function Clients({data,add,upd,del,log,reload,supabase}){
  const [search,setSearch]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'created_at',dir:'desc'})
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),industry:fd.get('industry'),size:fd.get('size'),contact:fd.get('contact'),email:fd.get('email'),phone:fd.get('phone'),notes:fd.get('notes'),since:new Date().toLocaleDateString('vi-VN')};edit?await upd('clients',edit.id,r):await add('clients',r);log('Client: '+r.name);setEdit(null);setShowAdd(false)}
  const list=applySortDate(applyDateFilter(data.clients.filter(c=>!search||(c.name||'').toLowerCase().includes(search.toLowerCase())),'created_at',dateFrom,dateTo),sort)
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Clients</h2><div style={{display:'flex',gap:8}}><ImportBtn module="clients" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ New Client</Btn></div></div>
      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Search clients..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,width:260}})}/>
        <button onClick={()=>setSort(s=>({field:'created_at',dir:s.dir==='desc'?'asc':'desc'}))} style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${B.border}`,background:'transparent',color:B.textSec,cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Added {sort.dir==='desc'?'↓':'↑'}</button>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:14}}>
        {list.map((c,i)=>{
          const rev=data.projects.filter(p=>p.client===c.name).reduce((a,p)=>a+Number(p.revenue||0),0)
          const pc=data.projects.filter(p=>p.client===c.name).length
          const col=PALETTE[i%PALETTE.length],init=(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
          return <div key={c.id} onClick={()=>setEdit(c)} style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,padding:'18px 20px',cursor:'pointer',transition:'transform 0.15s, border-color 0.15s',overflow:'hidden',position:'relative',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#3B82F6';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{position:'absolute',top:0,right:0,width:80,height:80,borderRadius:'0 16px 0 80px',background:`${col}08`}}/>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${col},${col}BB)`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 14px ${col}40`}}>{init}</div>
              <div><div style={{fontWeight:800,fontSize:14,color:'#0F172A',letterSpacing:'-0.01em'}}>{c.name}</div><div style={{fontSize:11,color:B.textTer,marginTop:2,fontWeight:500}}>{c.industry||'—'}</div></div>
            </div>
            <div style={{height:1,background:'#E2E8F0',margin:'12px 0'}}/>
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

const KOL_PRICING_TYPES = ['Video Post','Image Post','Story','Livestream','Image Usage Rights (1 Month)','Event Attendance','Brand Ambassador','Exclusivity Fee']
const KOL_PLATFORMS = ['TikTok','Instagram','YouTube','Facebook']
const KOL_PRICING_DEFAULT = () => [{platform:'TikTok',type:'Video Post',amount:0}]

function Kols({data,add,upd,del,log,reload,supabase}){
  const [search,setSearch]=useState('')
  const [platF,setPlatF]=useState('')
  const [tierF,setTierF]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [hist,setHist]=useState(null)
  const [kolDetail,setKolDetail]=useState(null)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'created_at',dir:'desc'})
  const [pricing,setPricing]=useState(KOL_PRICING_DEFAULT())
  const [kolFiles, setKolFiles] = useState({avatar_url:'',cccd_front_url:'',cccd_back_url:'',contract_files:[]})

  useEffect(()=>{
    if(showAdd){setPricing(KOL_PRICING_DEFAULT());setKolFiles({avatar_url:'',cccd_front_url:'',cccd_back_url:'',contract_files:[]})}
    if(edit){
      const p=edit.pricing&&edit.pricing.length?edit.pricing:(edit.rate?[{platform:edit.platform||'TikTok',type:'Video Post',amount:Number(edit.rate||0)}]:KOL_PRICING_DEFAULT())
      setPricing(p)
      setKolFiles({avatar_url:edit.avatar_url||'',cccd_front_url:edit.cccd_front_url||'',cccd_back_url:edit.cccd_back_url||'',contract_files:edit.contract_files||[]})
    }
  },[edit,showAdd])

  function addPricingRow(){setPricing(p=>[...p,{platform:'TikTok',type:'Video Post',amount:0}])}
  function updPricingRow(i,field,val){setPricing(p=>p.map((r,j)=>j===i?{...r,[field]:val}:r))}
  function delPricingRow(i){setPricing(p=>p.filter((_,j)=>j!==i))}

  async function save(e){
    e.preventDefault()
    const fd=new FormData(e.target)
    const minRate=pricing.length?Math.min(...pricing.map(p=>Number(p.amount||0))):0
    const r={name:fd.get('name'),platform:fd.get('platform'),tier:fd.get('tier'),niche:fd.get('niche'),followers:Number(fd.get('followers')||0),engagement:Number(fd.get('engagement')||0),rate:minRate,pricing:pricing,avg_views:Number(fd.get('avg_views')||0),reliability:Number(fd.get('reliability')||5),available:fd.get('available')==='true',contact:fd.get('contact'),notes:fd.get('notes'),phone:fd.get('phone'),email:fd.get('email'),cccd:fd.get('cccd'),tax_code:fd.get('tax_code'),address:fd.get('address'),tiktok_url:fd.get('tiktok_url'),instagram_url:fd.get('instagram_url'),youtube_url:fd.get('youtube_url'),facebook_url:fd.get('facebook_url'),audience_age:fd.get('audience_age'),audience_gender:fd.get('audience_gender'),audience_location:fd.get('audience_location'),bank_account:fd.get('bank_account'),bank_name:fd.get('bank_name'),bank_branch:fd.get('bank_branch'),avatar_url:kolFiles.avatar_url,cccd_front_url:kolFiles.cccd_front_url,cccd_back_url:kolFiles.cccd_back_url,contract_files:kolFiles.contract_files}
    edit?await upd('kols',edit.id,r):await add('kols',r)
    log('KOL: '+r.name)
    setEdit(null)
    setShowAdd(false)
  }
  const list=applySortDate(applyDateFilter(data.kols.filter(k=>(!search||(k.name||'').toLowerCase().includes(search.toLowerCase()))&&(!platF||k.platform===platF)&&(!tierF||k.tier===tierF)),'created_at',dateFrom,dateTo),sort)
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:'#374151',borderBottom:`1px solid #E2E8F0`,textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle',color:'#1F2937'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>KOL / KOC Database</h2><div style={{display:'flex',gap:8}}><ImportBtn module="kols" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Add KOL</Btn></div></div>
      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:220}})}/>
        <select value={platF} onChange={e=>setPlatF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Platforms</option><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select>
        <select value={tierF} onChange={e=>setTierF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Tiers</option><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select>
        {(search||platF||tierF)&&<span style={{fontSize:11,color:B.textSec,fontWeight:600,marginLeft:4}}>{list.length} kết quả</span>}
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:950}}>
          <thead><tr>
            {['ID','Name','Platform','Tier','Followers','Eng%','Pricing','Campaigns','Stars','Status'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="created_at" sort={sort} setSort={setSort} thStyle={TH}>Added</SortHdr>
            <th style={TH}></th>
          </tr></thead>
          <tbody>
            {list.map((k,i)=>{const used=data.projects.filter(p=>(p.kols||[]).includes(k.name)).length;const stars='★'.repeat(Math.min(5,Number(k.reliability||0)))+'☆'.repeat(Math.max(0,5-Number(k.reliability||0)));return <tr key={k.id} onClick={()=>setKolDetail(k)} style={{cursor:'pointer'}}>
              <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:600}}>KOL-{String(i+1).padStart(3,'0')}</td>
              <td style={{...TD,fontWeight:800,color:B.text,fontSize:12.5}}>{k.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{k.platform}</span></td>
              <td style={TD}><Badge text={k.tier}/></td>
              <td style={{...TD,fontSize:11,fontWeight:600}}>{fmtS(k.followers)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:Number(k.engagement)>=5?B.success:B.textSec}}>{Number(k.engagement||0).toFixed(1)}%</td>
              <td style={{...TD,fontSize:11,color:B.primary}}>{k.pricing&&k.pricing.length?<span style={{fontWeight:800}}>{vnd(Math.min(...k.pricing.map(p=>Number(p.amount||0))))}</span>:vnd(k.rate)}{k.pricing&&k.pricing.length>1&&<span style={{fontSize:9,color:B.textTer,marginLeft:4}}>+{k.pricing.length-1}</span>}</td>
              <td style={{...TD,textAlign:'center',fontSize:12,fontWeight:800,color:B.accent}}>{used}</td>
              <td style={{...TD,fontSize:13,color:'#F59E0B',letterSpacing:'-1px'}}>{stars}</td>
              <td style={TD}><Badge text={k.available?'Active':'Booked'}/></td>
              <td style={{...TD,fontSize:10,color:B.textTer}}>{k.created_at?.slice(0,10)||'—'}</td>
              <td style={{...TD,display:'flex',gap:6}}><Btn sm onClick={()=>setEdit(k)}>Edit</Btn><Btn sm onClick={()=>setHist(k)}>History</Btn></td>
            </tr>})}
            {!list.length&&<tr><td colSpan={12} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No KOLs found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit KOL':'Add KOL / KOC'} onClose={()=>{setEdit(null);setShowAdd(false)}} lg>
  <form onSubmit={save}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
      <div style={{padding:'0 16px 0 0',borderRight:'1px solid #F1F5F9'}}>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9'}}>Thông tin cơ bản</div>
        <FG label="Tên KOL / KOC *"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Platform chính"><select name="platform" defaultValue={edit?.platform||'TikTok'} {...inp()}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></FG><FG label="Tier"><select name="tier" defaultValue={edit?.tier||'Micro'} {...inp()}><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select></FG></Row2>
        <FG label="Niche / Chuyên mục"><input name="niche" defaultValue={edit?.niche||''} placeholder="Beauty, Lifestyle, Food..." {...inp()}/></FG>
        <Row2><FG label="Followers"><input name="followers" type="number" defaultValue={edit?.followers||0} {...inp()}/></FG><FG label="Engagement (%)"><input name="engagement" type="number" step="0.1" defaultValue={edit?.engagement||0} {...inp()}/></FG></Row2>
        <FG label="Avg Views"><input name="avg_views" type="number" defaultValue={edit?.avg_views||0} {...inp()}/></FG>
        <div style={{marginTop:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em'}}>Bảng giá</div>
            <button type="button" onClick={addPricingRow} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(59,130,246,0.3)',background:'rgba(59,130,246,0.07)',color:'#3B82F6',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>+ Thêm mức giá</button>
          </div>
          <div style={{border:'1px solid #E2E8F0',borderRadius:10,overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'130px 1fr 140px 28px',background:'#F8FAFF',borderBottom:'1px solid #E2E8F0',padding:'6px 10px',gap:6}}>
              {['Platform','Loại dịch vụ','Giá (VND)',''].map(h=><div key={h} style={{fontSize:9,fontWeight:800,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</div>)}
            </div>
            {pricing.map((row,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'130px 1fr 140px 28px',gap:6,padding:'6px 10px',borderBottom:i<pricing.length-1?'1px solid #F1F5F9':'none',alignItems:'center'}}>
                <select value={row.platform} onChange={e=>updPricingRow(i,'platform',e.target.value)}
                  style={{padding:'5px 8px',border:'1px solid #E2E8F0',borderRadius:6,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",background:'#fff',color:'#1F2937',outline:'none',width:'100%'}}>
                  {KOL_PLATFORMS.map(p=><option key={p}>{p}</option>)}
                </select>
                <select value={row.type} onChange={e=>updPricingRow(i,'type',e.target.value)}
                  style={{padding:'5px 8px',border:'1px solid #E2E8F0',borderRadius:6,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",background:'#fff',color:'#1F2937',outline:'none',width:'100%'}}>
                  {KOL_PRICING_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
                <input type="text" value={fmtNum(row.amount)} onChange={e=>updPricingRow(i,'amount',parseNum(e.target.value))}
                  placeholder="0" style={{padding:'5px 8px',border:'1px solid #E2E8F0',borderRadius:6,fontSize:12,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",background:'#fff',color:'#0F172A',outline:'none',width:'100%',textAlign:'right',boxSizing:'border-box'}}/>
                <button type="button" onClick={()=>delPricingRow(i)} disabled={pricing.length<=1}
                  style={{background:'none',border:'none',cursor:pricing.length<=1?'not-allowed':'pointer',color:pricing.length<=1?'#E2E8F0':'#EF4444',fontSize:16,lineHeight:1,padding:'2px',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
              </div>
            ))}
          </div>
          {pricing.length>0&&<div style={{fontSize:10,color:'#64748B',marginTop:5,textAlign:'right'}}>Từ {vnd(Math.min(...pricing.map(p=>Number(p.amount||0))))} / loại thấp nhất</div>}
        </div>
        <Row2><FG label="Độ tin cậy (1-5)"><select name="reliability" defaultValue={edit?.reliability||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG><FG label="Trạng thái"><select name="available" defaultValue={edit?.available!==false?'true':'false'} {...inp()}><option value="true">Available</option><option value="false">Booked</option></select></FG></Row2>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Liên hệ & Mạng xã hội</div>
        <Row2><FG label="Số điện thoại"><input name="phone" defaultValue={edit?.phone||''} {...inp()}/></FG><FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''} {...inp()}/></FG></Row2>
        <FG label="Link TikTok"><input name="tiktok_url" defaultValue={edit?.tiktok_url||''} placeholder="https://tiktok.com/@..." {...inp()}/></FG>
        <FG label="Link Instagram"><input name="instagram_url" defaultValue={edit?.instagram_url||''} placeholder="https://instagram.com/..." {...inp()}/></FG>
        <FG label="Link YouTube"><input name="youtube_url" defaultValue={edit?.youtube_url||''} placeholder="https://youtube.com/..." {...inp()}/></FG>
        <FG label="Contact chung"><input name="contact" defaultValue={edit?.contact||''} placeholder="Zalo, manager name..." {...inp()}/></FG>
      </div>
      <div style={{padding:'0 0 0 16px'}}>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9'}}>Định danh pháp lý</div>
        <Row2><FG label="CCCD / CMND"><input name="cccd" defaultValue={edit?.cccd||''} {...inp()}/></FG><FG label="Mã số thuế"><input name="tax_code" defaultValue={edit?.tax_code||''} {...inp()}/></FG></Row2>
        <FG label="Địa chỉ"><input name="address" defaultValue={edit?.address||''} {...inp()}/></FG>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Thông tin khán giả</div>
        <FG label="Độ tuổi chủ yếu"><input name="audience_age" defaultValue={edit?.audience_age||''} placeholder="18-24, 25-34..." {...inp()}/></FG>
        <Row2><FG label="Giới tính chủ yếu"><select name="audience_gender" defaultValue={edit?.audience_gender||''} {...inp()}><option value="">—</option><option>Nữ chủ yếu</option><option>Nam chủ yếu</option><option>Cân bằng</option></select></FG><FG label="Khu vực"><input name="audience_location" defaultValue={edit?.audience_location||''} placeholder="HCM, HN..." {...inp()}/></FG></Row2>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Thông tin ngân hàng</div>
        <FG label="Số tài khoản"><input name="bank_account" defaultValue={edit?.bank_account||''} {...inp()}/></FG>
        <Row2><FG label="Tên ngân hàng"><input name="bank_name" defaultValue={edit?.bank_name||''} {...inp()}/></FG><FG label="Chi nhánh"><input name="bank_branch" defaultValue={edit?.bank_branch||''} {...inp()}/></FG></Row2>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Ảnh & Tài liệu</div>
        <FG label="Ảnh đại diện">
          <FileUpload supabase={supabase} bucket="kol-documents" folder="avatars" label="Upload ảnh" accept="image/*" maxMB={5} value={kolFiles.avatar_url} onChange={v=>setKolFiles(p=>({...p,avatar_url:v}))}/>
        </FG>
        <Row2>
          <FG label="CCCD mặt trước">
            <FileUpload supabase={supabase} bucket="kol-documents" folder="cccd" label="Upload ảnh" accept="image/*" maxMB={5} value={kolFiles.cccd_front_url} onChange={v=>setKolFiles(p=>({...p,cccd_front_url:v}))}/>
          </FG>
          <FG label="CCCD mặt sau">
            <FileUpload supabase={supabase} bucket="kol-documents" folder="cccd" label="Upload ảnh" accept="image/*" maxMB={5} value={kolFiles.cccd_back_url} onChange={v=>setKolFiles(p=>({...p,cccd_back_url:v}))}/>
          </FG>
        </Row2>
        <FG label="Hợp đồng / Tài liệu">
          <FileUpload supabase={supabase} bucket="kol-documents" folder="contracts" label="Upload PDF/ảnh" accept=".pdf,image/*" maxMB={20} value={kolFiles.contract_files} onChange={v=>setKolFiles(p=>({...p,contract_files:v}))} multiple/>
        </FG>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Ghi chú</div>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:80}})}/></FG>
      </div>
    </div>
    <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('kols',edit.id);setEdit(null)}:null}/>
  </form>
</Modal>}
      {hist&&<Modal title={'History: '+hist.name} onClose={()=>setHist(null)}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:18}}>
          {[['Campaigns',data.projects.filter(p=>(p.kols||[]).includes(hist.name)).length],['Base Rate',vnd(hist.pricing?.length?Math.min(...hist.pricing.map(p=>Number(p.amount||0))):hist.rate)],['Stars',hist.reliability+'/5']].map(([l,v])=>(
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

      {kolDetail&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',zIndex:1999}} onClick={()=>setKolDetail(null)}/>}
      {kolDetail&&(
        <div style={{position:'fixed',top:0,right:0,width:'60vw',height:'100vh',background:'#fff',boxShadow:'-8px 0 40px rgba(0,0,0,0.15)',zIndex:2000,display:'flex',flexDirection:'column'}}>
          <div style={{padding:'20px 24px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              {kolDetail.avatar_url
                ? <img src={kolDetail.avatar_url} alt="" onClick={()=>window.open(kolDetail.avatar_url,'_blank')} style={{width:52,height:52,borderRadius:12,objectFit:'cover',border:'2px solid #E2E8F0',cursor:'pointer',flexShrink:0}}/>
                : <div style={{width:52,height:52,borderRadius:12,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:20,fontWeight:900,flexShrink:0}}>{(kolDetail.name||'K').charAt(0)}</div>
              }
              <div>
                <div style={{fontSize:18,fontWeight:900,color:'#0F172A'}}>{kolDetail.name}</div>
                <div style={{fontSize:12,color:'#64748B',marginTop:2}}>{kolDetail.platform} · {kolDetail.tier}</div>
              </div>
            </div>
            <button onClick={()=>setKolDetail(null)} style={{background:'#F1F5F9',border:'none',cursor:'pointer',width:32,height:32,borderRadius:8,fontSize:18,color:'#64748B',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              {[['Followers',fmtS(kolDetail.followers)],['Engagement',kolDetail.engagement+'%'],['Reliability',(kolDetail.reliability||0)+'/5']].map(([l,v])=>(
                <div key={l} style={{background:'#F8FAFF',borderRadius:10,padding:'12px 14px',border:'1px solid #E2E8F0'}}>
                  <div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:900,color:'#0F172A'}}>{v}</div>
                </div>
              ))}
              {(kolDetail.pricing&&kolDetail.pricing.length?kolDetail.pricing:[{platform:kolDetail.platform||'TikTok',type:'Video Post',amount:kolDetail.rate||0}]).length>0&&(
                <div style={{background:'#F8FAFF',borderRadius:10,padding:'12px 14px',border:'1px solid #E2E8F0',gridColumn:'span 1'}}>
                  <div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6}}>Base Rate</div>
                  <div style={{fontSize:20,fontWeight:900,color:'#0F172A'}}>{vnd(kolDetail.pricing?.length?Math.min(...kolDetail.pricing.map(p=>Number(p.amount||0))):kolDetail.rate)}</div>
                </div>
              )}
            </div>
            {(()=>{const pr=kolDetail.pricing&&kolDetail.pricing.length?kolDetail.pricing:[{platform:kolDetail.platform||'TikTok',type:'Video Post',amount:kolDetail.rate||0}];return(<div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'0.06em'}}>Bảng giá</div>
              <div style={{border:'1px solid #E2E8F0',borderRadius:10,overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'110px 1fr 120px',background:'#F8FAFF',borderBottom:'1px solid #E2E8F0',padding:'6px 12px',gap:8}}>
                  {['Platform','Loại','Giá'].map(h=><div key={h} style={{fontSize:9,fontWeight:800,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</div>)}
                </div>
                {pr.map((row,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'110px 1fr 120px',gap:8,padding:'8px 12px',borderBottom:i<pr.length-1?'1px solid #F1F5F9':'none',alignItems:'center'}}>
                    <span style={{fontSize:10,fontWeight:700,color:'#3B82F6',background:'rgba(59,130,246,0.08)',padding:'2px 8px',borderRadius:4,display:'inline-block'}}>{row.platform}</span>
                    <span style={{fontSize:11,color:'#374151'}}>{row.type}</span>
                    <span style={{fontSize:12,fontWeight:800,color:'#0F172A',textAlign:'right'}}>{vnd(row.amount)}</span>
                  </div>
                ))}
              </div>
            </div>)})()}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'0.06em'}}>Thông tin cơ bản</div>
              {[['Niche/Chuyên mục',kolDetail.niche||'—'],['Contact',kolDetail.contact||'—'],['Platform',kolDetail.platform||'—'],['Avg Views',fmtS(kolDetail.avg_views)]].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #F8FAFF'}}>
                  <span style={{fontSize:11,color:'#64748B'}}>{l}</span>
                  <span style={{fontSize:11,fontWeight:600,color:'#0F172A'}}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'0.06em'}}>Lịch sử dự án</div>
              {data.projects.filter(p=>(p.kols||[]).includes(kolDetail.name)).map(p=>(
                <div key={p.id} style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E2E8F0',marginBottom:6}}>
                  <div style={{fontWeight:600,fontSize:12}}>{p.campaign}</div>
                  <div style={{fontSize:10,color:'#64748B',marginTop:2}}>{p.client} · <Badge text={p.status}/></div>
                </div>
              ))}
              {!data.projects.filter(p=>(p.kols||[]).includes(kolDetail.name)).length&&<Empty>Chưa có dự án nào</Empty>}
            </div>
            {(kolDetail.cccd_front_url||kolDetail.cccd_back_url)&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'0.06em'}}>CCCD / CMND</div>
                <div style={{display:'flex',gap:12}}>
                  {kolDetail.cccd_front_url&&<div style={{textAlign:'center'}}>
                    <img src={kolDetail.cccd_front_url} alt="CCCD mặt trước" onClick={()=>window.open(kolDetail.cccd_front_url,'_blank')} style={{width:160,height:100,objectFit:'cover',borderRadius:8,border:'1px solid #E2E8F0',cursor:'pointer'}}/>
                    <div style={{fontSize:10,color:'#64748B',marginTop:4}}>Mặt trước</div>
                  </div>}
                  {kolDetail.cccd_back_url&&<div style={{textAlign:'center'}}>
                    <img src={kolDetail.cccd_back_url} alt="CCCD mặt sau" onClick={()=>window.open(kolDetail.cccd_back_url,'_blank')} style={{width:160,height:100,objectFit:'cover',borderRadius:8,border:'1px solid #E2E8F0',cursor:'pointer'}}/>
                    <div style={{fontSize:10,color:'#64748B',marginTop:4}}>Mặt sau</div>
                  </div>}
                </div>
              </div>
            )}
            {kolDetail.contract_files?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'0.06em'}}>Tài liệu hợp đồng</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {kolDetail.contract_files.map((url,i)=>{
                    const isImg=/\.(jpg|jpeg|png|gif|webp)$/i.test((url||'').split('?')[0])
                    return <div key={i} onClick={()=>window.open(url,'_blank')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:6,padding:'6px 10px',background:'#F8FAFF',borderRadius:8,border:'1px solid #E2E8F0'}}>
                      <span style={{fontSize:16}}>{isImg?'🖼️':'📄'}</span>
                      <span style={{fontSize:11,color:'#3B82F6',textDecoration:'underline',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {decodeURIComponent((url.split('/').pop()||'').split('?')[0])||`File ${i+1}`}
                      </span>
                    </div>
                  })}
                </div>
              </div>
            )}
            {kolDetail.notes&&<div style={{marginTop:16,padding:'12px 14px',background:'#F8FAFF',borderRadius:10,border:'1px solid #E2E8F0',fontSize:11,color:'#64748B'}}>{kolDetail.notes}</div>}
          </div>
          <div style={{padding:'14px 24px',borderTop:'1px solid #E2E8F0',display:'flex',gap:8,flexShrink:0}}>
            <Btn primary onClick={()=>{setEdit(kolDetail);setKolDetail(null);setShowAdd(true)}}>Sửa thông tin</Btn>
            <Btn onClick={()=>setKolDetail(null)}>Đóng</Btn>
          </div>
        </div>
      )}
    </div>
  )
}

function Vendors({data,add,upd,del,log,reload,supabase}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [search,setSearch]=useState('')
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'created_at',dir:'desc'})
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),type:fd.get('type'),rating:Number(fd.get('rating')||5),contact:fd.get('contact'),total_spent:Number(fd.get('total_spent')||0),notes:fd.get('notes'),phone:fd.get('phone'),email:fd.get('email'),address:fd.get('address'),tax_code:fd.get('tax_code'),legal_rep:fd.get('legal_rep'),services_detail:fd.get('services_detail'),price_range:fd.get('price_range'),lead_time:fd.get('lead_time'),bank_account:fd.get('bank_account'),bank_name:fd.get('bank_name'),bank_branch:fd.get('bank_branch')};edit?await upd('vendors',edit.id,r):await add('vendors',r);log('Vendor: '+r.name);setEdit(null);setShowAdd(false)}
  const vendorList=applySortDate(applyDateFilter(data.vendors.filter(v=>!search||(v.name||'').toLowerCase().includes(search.toLowerCase())),'created_at',dateFrom,dateTo),sort)
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'#FFFFFF',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Vendors & Suppliers</h2><div style={{display:'flex',gap:8}}><ImportBtn module="vendors" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Add Vendor</Btn></div></div>
      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap'}}>
        <input placeholder="Search vendors..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:260}})}/>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>
      <div style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>
            {['Name','Type','Contact','Rating','Total Spent','Notes'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="created_at" sort={sort} setSort={setSort} thStyle={TH}>Added</SortHdr>
            <th style={TH}></th>
          </tr></thead>
          <tbody>
            {vendorList.map(v=><tr key={v.id}>
              <td style={{...TD,fontWeight:800,color:B.text}}>{v.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{v.type||'—'}</span></td>
              <td style={{...TD,fontSize:11,color:B.textSec}}>{v.contact||'—'}</td>
              <td style={{...TD,fontSize:14,color:'#F59E0B',letterSpacing:'-1px'}}>{'★'.repeat(Number(v.rating||0))+'☆'.repeat(Math.max(0,5-Number(v.rating||0)))}</td>
              <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{vnd(v.total_spent)}</td>
              <td style={{...TD,fontSize:11,color:B.textTer}}>{v.notes||'—'}</td>
              <td style={{...TD,fontSize:10,color:B.textTer}}>{v.created_at?.slice(0,10)||'—'}</td>
              <td style={TD}><Btn sm onClick={()=>setEdit(v)}>Edit</Btn></td>
            </tr>)}
            {!vendorList.length&&<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No vendors found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Vendor':'Add Vendor'} onClose={()=>{setEdit(null);setShowAdd(false)}} wide>
  <form onSubmit={save}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
      <div style={{padding:'0 16px 0 0',borderRight:'1px solid #F1F5F9'}}>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9'}}>Thông tin công ty</div>
        <FG label="Tên công ty / Nhà cung cấp *"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Loại dịch vụ"><select name="type" defaultValue={edit?.type||'Production'} {...inp()}><option>Production</option><option>Photography</option><option>Video</option><option>Media Buy</option><option>Event</option><option>Design</option><option>PR</option><option>Other</option></select></FG><FG label="Đánh giá (1-5)"><select name="rating" defaultValue={edit?.rating||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG></Row2>
        <FG label="Địa chỉ"><input name="address" defaultValue={edit?.address||''} {...inp()}/></FG>
        <Row2><FG label="Mã số thuế"><input name="tax_code" defaultValue={edit?.tax_code||''} {...inp()}/></FG><FG label="Người đại diện"><input name="legal_rep" defaultValue={edit?.legal_rep||''} {...inp()}/></FG></Row2>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Liên hệ</div>
        <Row2><FG label="Số điện thoại"><input name="phone" defaultValue={edit?.phone||''} {...inp()}/></FG><FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''} {...inp()}/></FG></Row2>
        <FG label="Contact (Zalo/Telegram)"><input name="contact" defaultValue={edit?.contact||''} {...inp()}/></FG>
      </div>
      <div style={{padding:'0 0 0 16px'}}>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9'}}>Dịch vụ & Báo giá</div>
        <FG label="Mô tả dịch vụ"><textarea name="services_detail" defaultValue={edit?.services_detail||''} placeholder="Mô tả chi tiết các dịch vụ cung cấp..." {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <Row2><FG label="Mức giá tham khảo"><input name="price_range" defaultValue={edit?.price_range||''} placeholder="VD: 5M-50M/project" {...inp()}/></FG><FG label="Lead time"><input name="lead_time" defaultValue={edit?.lead_time||''} placeholder="VD: 3-5 ngày" {...inp()}/></FG></Row2>
        <FG label="Tổng đã chi (VND)"><input name="total_spent" type="number" defaultValue={edit?.total_spent||0} {...inp()}/></FG>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Thông tin ngân hàng</div>
        <FG label="Số tài khoản"><input name="bank_account" defaultValue={edit?.bank_account||''} {...inp()}/></FG>
        <Row2><FG label="Tên ngân hàng"><input name="bank_name" defaultValue={edit?.bank_name||''} {...inp()}/></FG><FG label="Chi nhánh"><input name="bank_branch" defaultValue={edit?.bank_branch||''} {...inp()}/></FG></Row2>
        <div style={{fontSize:10,fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10,paddingBottom:6,borderBottom:'1px solid #F1F5F9',marginTop:14}}>Ghi chú</div>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:60}})}/></FG>
      </div>
    </div>
    <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('vendors',edit.id);setEdit(null)}:null}/>
  </form>
</Modal>}
    </div>
  )
}

function Team({data,add,upd,del,log,reload,supabase}){
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
          return <div key={m.id} onClick={()=>setEdit(m)} style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,padding:'18px 20px',cursor:'pointer',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${col},${col}55)`}}/>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:`linear-gradient(135deg,${col},${col}BB)`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 14px ${col}40`}}>{init}</div>
              <div><div style={{fontWeight:800,fontSize:14,color:'#0F172A',letterSpacing:'-0.01em'}}>{m.name}</div><div style={{fontSize:11,color:B.textTer,marginTop:2,fontWeight:500}}>{m.role}</div></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:11}}>
              <span style={{color:B.textSec,fontWeight:500}}>Projects: <strong style={{color:B.navy}}>{active}/{m.max_projects||5}</strong></span>
              <span style={{fontWeight:800,color:util>=80?B.danger:util>=60?B.warning:B.success}}>{util}%</span>
            </div>
            <div style={{height:6,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
              <div style={{height:'100%',width:util+'%',background:util>=80?B.danger:util>=60?B.warning:B.success,borderRadius:99,transition:'width 0.4s ease'}}/>
            </div>
            <div style={{marginTop:7,fontSize:10,fontWeight:700,color:util>=80?B.danger:util>=60?B.warning:B.success,textTransform:'uppercase',letterSpacing:'0.04em'}}>{util>=80?'AT CAPACITY':util>=60?'HIGH LOAD':'AVAILABLE'}</div>
          </div>
        })}
        {!data.team.length&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:B.textTer,fontSize:12,fontWeight:600}}>No team members yet</div>}
      </div>
      <div style={{background:'#FFFFFF',border:`1px solid #E2E8F0`,borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Name','Role','Max','Active','Utilization','Status'].map(h=><th key={h} style={{padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'#FFFFFF',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
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
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:20}}>
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
function CModal({title,children,onClose,wide,lg}) {
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}}
      style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:'100%',maxWidth:lg?'min(1100px,97vw)':wide?'min(920px,96vw)':'min(640px,95vw)',maxHeight:'92vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15)',border:'1px solid rgba(26,86,219,0.1)'}}>
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
function Contracts({data, supabase, reload, log, prefill, onClearPrefill}) {
  const [tab, setTab] = useState('client')
  const [contracts, setContracts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [localPrefill, setLocalPrefill] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'sign_date',dir:'desc'})

  useEffect(() => { loadContracts() }, [tab])

  useEffect(() => {
    if(prefill) {
      setLocalPrefill(prefill)
      setTab('client')
      setEditItem(null)
      setShowForm(true)
      onClearPrefill?.()
    }
  }, [])

  async function loadContracts() {
    setLoading(true)
    const {data:rows,error} = await supabase.from('contracts').select('*').eq('contract_type',tab).order('created_at',{ascending:false})
    if(error) console.error(error)
    setContracts(rows||[])
    setLoading(false)
  }

  const filtered = applySortDate(applyDateFilter(contracts.filter(c =>
    !filter ||
    (c.contract_code||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_a_name||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_b_name||'').toLowerCase().includes(filter.toLowerCase())
  ),'sign_date',dateFrom,dateTo),sort)

  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:'#374151',borderBottom:'1px solid #E2E8F0',textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid #F1F5F9',verticalAlign:'middle',color:'#1F2937'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Hợp đồng</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo hợp đồng</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'#F1F5F9',padding:4,borderRadius:10,width:'fit-content',border:'1px solid #E2E8F0'}}>
        {[['client','HĐ Dịch vụ (Client)'],['kol','HĐ Cộng tác viên (KOL)']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':CB.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Inter',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}}>
        {[
          ['Tổng HĐ', contracts.length],
          ['Draft', contracts.filter(c=>c.status==='Draft').length],
          ['Đã ký', contracts.filter(c=>c.status==='Signed').length],
          ['Tổng giá trị', cfmtS(contracts.reduce((a,c)=>a+Number(c.total_with_vat||0),0))+' VND']
        ].map(([l,v])=>(
          <div key={l} style={{background:'#FFFFFF',borderRadius:12,padding:'12px 16px',border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:20,fontWeight:900,color:'#3B82F6',marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Tìm theo số HĐ, tên client, KOL..." value={filter} onChange={e=>setFilter(e.target.value)} style={{...CINP_S,maxWidth:380}}/>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>

      <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead>
            <tr>
              {['Số HĐ','Bên đối tác','Dự án','Giá trị (VND)'].map(h=><th key={h} style={TH}>{h}</th>)}
              <SortHdr field="sign_date" sort={sort} setSort={setSort} thStyle={TH}>Ngày ký</SortHdr>
              {['Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading && filtered.map(c=>(
              <tr key={c.id}>
                <td style={{...TD,fontWeight:800,color:'#6366F1',fontSize:12}}>{c.contract_code}</td>
                <td style={{...TD,fontWeight:600}}>{tab==='client'?c.party_a_name:c.party_b_name}</td>
                <td style={{...TD,fontSize:11,color:'#94A3B8'}}>{data.projects.find(p=>p.id===c.project_id)?.campaign||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{vnd(c.total_with_vat)}</td>
                <td style={{...TD,fontSize:11,color:'#475569'}}>{c.sign_date||'—'}</td>
                <td style={TD}><CBadge text={c.status}/></td>
                <td style={{...TD,display:'flex',gap:6,alignItems:'center'}}>
                  {c.contract_file_url&&<span title="File HĐ đã ký" onClick={()=>window.open(c.contract_file_url,'_blank')} style={{cursor:'pointer',fontSize:14}}>📄</span>}
                  {(c.attachment_urls||[]).length>0&&<span title={`${(c.attachment_urls||[]).length} đính kèm`} style={{fontSize:11,color:'#94A3B8'}}>+{(c.attachment_urls||[]).length}</span>}
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
          prefill={editItem ? null : localPrefill}
          onClose={()=>{setShowForm(false);setEditItem(null);setLocalPrefill(null)}}
          onSaved={()=>{loadContracts();reload();log('Lưu HĐ client');setLocalPrefill(null)}}
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
function ContractClientForm({data, supabase, edit, prefill, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || genCode('HDDV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    sign_location: edit?.sign_location || prefill?.sign_location || 'Văn phòng Công Ty TNHH Quảng cáo K&K',
    project_id: edit?.project_id || prefill?.project_id || '',
    party_a_name: edit?.party_a_name || prefill?.party_a_name || '',
    party_a_tax: edit?.party_a_tax || prefill?.party_a_tax || '',
    party_a_address: edit?.party_a_address || prefill?.party_a_address || '',
    party_a_rep: edit?.party_a_rep || prefill?.party_a_rep || '',
    party_a_title: edit?.party_a_title || 'Giám Đốc',
    party_a_bank_account: edit?.party_a_bank_account || prefill?.party_a_bank_account || '',
    party_a_bank_name: edit?.party_a_bank_name || prefill?.party_a_bank_name || '',
    service_type: edit?.service_type || prefill?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || prefill?.scope_of_work || '',
    kol_list: edit?.kol_list || prefill?.kol_list || [],
    total_fee: edit?.total_fee || prefill?.total_fee || 0,
    vat_rate: edit?.vat_rate || 8,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || 'Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày làm việc sau khi Bên B hoàn tất toàn bộ công việc và Bên A đã nhận đầy đủ chứng từ hợp lệ bao gồm: Hợp đồng, Biên bản nghiệm thu và Hoá đơn GTGT hợp lệ.',
    start_date: edit?.start_date || prefill?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || prefill?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const [clientContractFile, setClientContractFile] = useState(edit?.contract_file_url||'')
  const [clientAttachments, setClientAttachments] = useState(edit?.attachment_urls||[])
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
      status: form.status, notes: form.notes, created_by: 'User',
      contract_file_url: clientContractFile, attachment_urls: clientAttachments
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
    // Auto-link when signed
    if(form.status === 'Signed' || payload.status === 'Signed') {
      const val = Number(form.total_with_vat||0)
      const client = data.clients.find(c=>c.name===form.party_a_name||c.tax_code===form.party_a_tax)
      if(client) {
        await supabase.from('clients').update({
          total_contracts: (Number(client.total_contracts||0)+1),
          total_revenue: (Number(client.total_revenue||0)+val)
        }).eq('id',client.id)
      }
      if(!edit) {
        const contractData = await supabase.from('contracts').select('id').eq('contract_code',form.contract_code).single()
        if(contractData.data) {
          await supabase.from('payments').insert([{
            type:'thu',
            amount: val,
            category: 'Hợp đồng',
            description: `Thu HĐ ${form.contract_code} — ${form.party_a_name}`,
            payment_date: form.sign_date||new Date().toISOString().slice(0,10),
            status:'pending',
            reference_id: contractData.data.id
          }])
        }
      }
    }
    // Notify admins if ordered from project
    if(!edit && prefill?._project_campaign) {
      const admins = (data.team||[]).filter(m=>(m.role||'').toLowerCase().includes('admin')||(m.role||'').toLowerCase().includes('director'))
      for(const admin of admins) {
        await supabase.from('notifications').insert([{recipient_email:admin.email||'',recipient_name:admin.name,type:'CONTRACT_FROM_PROJECT',title:`HĐ mới từ dự án ${prefill._project_campaign}`,message:`Đã tạo Hợp đồng ${form.contract_code} từ dự án "${prefill._project_campaign}" - cần Admin xử lý`,data:{project_campaign:prefill._project_campaign},send_email:false,email_sent:false}])
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Dịch vụ':'Tạo HĐ Dịch vụ — Bên A: Client | Bên B: K&K'} onClose={onClose} lg>
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
                  <td style={{padding:'5px 4px'}}><input type="text" value={fmtNum(k.fee)} onChange={e=>updKol(i,'fee',Number(parseNum(e.target.value)))} style={{...CINP_S,padding:'5px 8px',fontSize:12,width:130}}/></td>
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
              <input type="text" value={fmtNum(form.total_fee)} onChange={e=>set('total_fee',Number(parseNum(e.target.value)))} style={CINP_S}/>
            </CFG>
            <CFG label="Thuế GTGT (%)">
              <input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/>
            </CFG>
            <CFG label="Tổng giá trị (VND)">
              <div style={{padding:'9px 12px',background:'rgba(26,86,219,0.06)',borderRadius:8,fontSize:15,fontWeight:800,color:CB.primary,border:'1px solid rgba(26,86,219,0.15)'}}>{vnd(form.total_with_vat)}</div>
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

        <CSec title="File hợp đồng">
          <CRow2>
            <CFG label="HĐ đã ký (PDF)">
              <FileUpload supabase={supabase} bucket="contracts" folder="client-signed" label="Upload PDF" accept=".pdf,image/*" maxMB={20} value={clientContractFile} onChange={setClientContractFile}/>
            </CFG>
            <CFG label="Tài liệu đính kèm">
              <FileUpload supabase={supabase} bucket="contracts" folder="client-attachments" label="Upload file" accept=".pdf,image/*" maxMB={20} value={clientAttachments} onChange={setClientAttachments} multiple/>
            </CFG>
          </CRow2>
        </CSec>

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
  const [cccdUrls, setCccdUrls] = useState({front:edit?.cccd_front_url||'', back:edit?.cccd_back_url||''})
  const [includeCccd, setIncludeCccd] = useState(edit?.include_cccd||false)
  const [contractFileUrl, setContractFileUrl] = useState(edit?.contract_file_url||'')
  const [attachmentUrls, setAttachmentUrls] = useState(edit?.attachment_urls||[])
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
      if(k.cccd_front_url || k.cccd_back_url) {
        setCccdUrls({front:k.cccd_front_url||'', back:k.cccd_back_url||''})
      }
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
      status: form.status, notes: form.notes, created_by: 'User',
      include_cccd: includeCccd, cccd_front_url: cccdUrls.front, cccd_back_url: cccdUrls.back,
      contract_file_url: contractFileUrl, attachment_urls: attachmentUrls
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
    if(form.status === 'Signed') {
      const kolRecord = data.kols.find(k=>k.name===form.party_b_name||k.real_name===form.party_b_name)
      if(kolRecord) {
        await supabase.from('kols').update({
          total_campaigns: (Number(kolRecord.total_campaigns||0)+1),
          total_earned: (Number(kolRecord.total_earned||0)+Number(form.total_with_vat||0))
        }).eq('id',kolRecord.id)
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Cộng tác viên':'Tạo HĐ Cộng tác viên — Bên A: K&K | Bên B: KOL'} onClose={onClose} lg>
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
          {(cccdUrls.front||cccdUrls.back) && (
            <div style={{background:'rgba(26,86,219,0.04)',borderRadius:10,padding:'12px',border:'1px solid rgba(26,86,219,0.1)',marginTop:8}}>
              <label style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,cursor:'pointer',fontSize:12,fontWeight:600,color:CB.textSec}}>
                <input type="checkbox" checked={includeCccd} onChange={e=>setIncludeCccd(e.target.checked)} style={{width:15,height:15}}/>
                Đính kèm ảnh CCCD trong hợp đồng
              </label>
              <div style={{display:'flex',gap:12}}>
                {cccdUrls.front && <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,fontWeight:700,color:CB.textTer,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>MẶT TRƯỚC</div>
                  <img src={cccdUrls.front} alt="" style={{width:130,height:85,objectFit:'cover',borderRadius:6,border:'1px solid #E2E8F0'}}/>
                  <a href={cccdUrls.front} target="_blank" rel="noreferrer" style={{display:'block',fontSize:10,color:CB.primary,marginTop:3,fontWeight:600}}>Xem</a>
                </div>}
                {cccdUrls.back && <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,fontWeight:700,color:CB.textTer,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>MẶT SAU</div>
                  <img src={cccdUrls.back} alt="" style={{width:130,height:85,objectFit:'cover',borderRadius:6,border:'1px solid #E2E8F0'}}/>
                  <a href={cccdUrls.back} target="_blank" rel="noreferrer" style={{display:'block',fontSize:10,color:CB.primary,marginTop:3,fontWeight:600}}>Xem</a>
                </div>}
              </div>
            </div>
          )}
        </CSec>

        <CSec title="File hợp đồng">
          <CRow2>
            <CFG label="File HĐ đã ký (PDF)">
              <FileUpload supabase={supabase} bucket="contracts" folder="kol-signed" label="Upload PDF" accept=".pdf,image/*" maxMB={20} value={contractFileUrl} onChange={setContractFileUrl}/>
            </CFG>
            <CFG label="Tài liệu đính kèm">
              <FileUpload supabase={supabase} bucket="contracts" folder="kol-attachments" label="Upload file" accept=".pdf,image/*" maxMB={20} value={attachmentUrls} onChange={setAttachmentUrls} multiple/>
            </CFG>
          </CRow2>
        </CSec>

        <CSec title="Phạm vi công việc">
          <CFG label="Nội dung công việc"><textarea value={form.scope_of_work} onChange={e=>set('scope_of_work',e.target.value)} style={{...CINP_S,minHeight:80}}/></CFG>
        </CSec>

        <CSec title="Thù lao">
          <CRow3>
            <CFG label="Thù lao gốc (VND)"><input type="text" value={fmtNum(form.total_fee)} onChange={e=>set('total_fee',Number(parseNum(e.target.value)))} style={CINP_S}/></CFG>
            <CFG label="Thuế TNCN (%)"><input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Thù lao thực nhận">
              <div style={{padding:'9px 12px',background:'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:'#059669',border:'1px solid rgba(5,150,105,0.2)'}}>{vnd(form.total_with_vat)}</div>
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
      .cccd-section{margin-top:20px;padding:14px;border:1px solid #E2E8F0;border-radius:8px}
      .cccd-images{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px}
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
    ${!isClient && (c.cccd_front_url||c.cccd_back_url) ? `
    <div class="cccd-section">
      <h3>GIẤY TỜ TÙY THÂN - BÊN B</h3>
      <div class="cccd-images">
        ${c.cccd_front_url?`<div><p><strong>CCCD Mặt trước:</strong></p><img src="${c.cccd_front_url}" style="max-width:280px;border:1px solid #ccc;border-radius:4px"/></div>`:''}
        ${c.cccd_back_url?`<div><p><strong>CCCD Mặt sau:</strong></p><img src="${c.cccd_back_url}" style="max-width:280px;border:1px solid #ccc;border-radius:4px"/></div>`:''}
      </div>
    </div>` : ''}
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
        <CBtn primary onClick={printDoc}>In / Export PDF</CBtn>
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
        {!isClient && c.include_cccd && (c.cccd_front_url || c.cccd_back_url) && (
          <div style={{marginBottom:14,padding:'12px',background:'#f8f9fa',borderRadius:8,border:'1px solid #e0e0e0'}}>
            <div style={{fontWeight:700,fontSize:13,textTransform:'uppercase',marginBottom:8,letterSpacing:'0.04em'}}>GIẤY TỜ TÙY THÂN</div>
            <div style={{display:'flex',gap:16}}>
              {c.cccd_front_url && <div>
                <div style={{fontSize:11,color:'#64748B',marginBottom:4,fontWeight:600}}>CCCD Mặt trước</div>
                <img src={c.cccd_front_url} alt="CCCD mặt trước" style={{width:180,height:115,objectFit:'cover',border:'1px solid #ccc',borderRadius:4}}/>
              </div>}
              {c.cccd_back_url && <div>
                <div style={{fontSize:11,color:'#64748B',marginBottom:4,fontWeight:600}}>CCCD Mặt sau</div>
                <img src={c.cccd_back_url} alt="CCCD mặt sau" style={{width:180,height:115,objectFit:'cover',border:'1px solid #ccc',borderRadius:4}}/>
              </div>}
            </div>
          </div>
        )}
        {isClient&&kolList.length>0&&(
          <div style={{margin:'12px 0'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên KOL','Link TikTok','Nội dung','Chi phí'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>
                {kolList.map((k,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.tiktok}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.work}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>{vnd(k.fee)}</td></tr>)}
                <tr style={{background:'#f0f0f0'}}><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>TOTAL + VAT ({c.vat_rate}%)</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>{vnd(total)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{marginTop:12,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,fontSize:12}}>
          <div><strong>Giá trị HĐ:</strong> {vnd(total)}</div>
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
function AcceptanceReports({data, supabase, reload, log, prefill, onClearPrefill}) {
  const [reports, setReports] = useState([])
  const [contracts, setContracts] = useState([])
  const [tab, setTab] = useState('client')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [localPrefill, setLocalPrefill] = useState(null)
  const [prefillContract, setPrefillContract] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'sign_date',dir:'desc'})

  useEffect(()=>{ loadData() },[tab])

  useEffect(()=>{
    if(prefill?.project_id) {
      async function findAndOpen() {
        setLocalPrefill(prefill)
        onClearPrefill?.()
        const {data:linked} = await supabase.from('contracts').select('*').eq('project_id',prefill.project_id).limit(1)
        setPrefillContract(linked?.[0]||null)
        setEditItem(null)
        setShowForm(true)
      }
      findAndOpen()
    }
  },[])

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

  const filtered = applySortDate(applyDateFilter(reports.filter(r => contracts.some(c=>c.id===r.contract_id)),'sign_date',dateFrom,dateTo),sort)
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:'#374151',borderBottom:'1px solid #E2E8F0',textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'10px 14px',borderBottom:'1px solid #F1F5F9',verticalAlign:'middle',color:'#1F2937'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Biên bản nghiệm thu</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo BBNT</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:12,background:'#F1F5F9',padding:4,borderRadius:10,width:'fit-content',border:'1px solid #E2E8F0'}}>
        {[['client','BBNT Client'],['kol','BBNT KOL/CTV']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':'#64748B',cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Inter',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>

      <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
          <thead><tr>
            {['Số BBNT','HĐ tham chiếu','Giá trị NT','Còn lại'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="sign_date" sort={sort} setSort={setSort} thStyle={TH}>Ngày ký</SortHdr>
            {['Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading&&filtered.map(r=>{
              const ct=contracts.find(c=>c.id===r.contract_id)
              return <tr key={r.id}>
                <td style={{...TD,fontWeight:800,color:'#3B82F6'}}>{r.report_code}</td>
                <td style={{...TD,fontWeight:600}}>{ct?.contract_code||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{vnd(r.accepted_value)}</td>
                <td style={{...TD,fontWeight:700,color:Number(r.remaining_amount)>0?'#F59E0B':'#10B981'}}>{vnd(r.remaining_amount)}</td>
                <td style={{...TD,fontSize:11,color:'#475569'}}>{r.sign_date||'—'}</td>
                <td style={TD}><CBadge text={r.status}/></td>
                <td style={{...TD,display:'flex',gap:6,alignItems:'center'}}>
                  {r.bbnt_file_url&&<span title="File BBNT" onClick={()=>window.open(r.bbnt_file_url,'_blank')} style={{cursor:'pointer',fontSize:14}}>📄</span>}
                  {(r.evidence_urls||[]).length>0&&<span title={`${(r.evidence_urls||[]).length} bằng chứng`} onClick={()=>window.open(r.evidence_urls[0],'_blank')} style={{cursor:'pointer',fontSize:14}}>🖼️</span>}
                  <CBtn sm onClick={()=>setViewItem({report:r,contract:ct,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(r);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            })}
            {!loading&&!filtered.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:CB.textTer,fontSize:12}}>Chưa có biên bản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm&&<BBNTForm contracts={contracts} data={data} supabase={supabase} edit={editItem} type={tab} prefill={editItem?null:localPrefill} prefillContract={editItem?null:prefillContract} onClose={()=>{setShowForm(false);setEditItem(null);setLocalPrefill(null);setPrefillContract(null)}} onSaved={()=>{loadData();reload();log('Lưu BBNT');setLocalPrefill(null);setPrefillContract(null)}}/>}
      {viewItem&&<BBNTPreview report={viewItem.report} contract={viewItem.contract} type={viewItem.type} onClose={()=>setViewItem(null)}/>}
    </div>
  )
}

function BBNTForm({contracts, data, supabase, edit, type, prefill, prefillContract, onClose, onSaved}) {
  const [form, setForm] = useState({
    report_code: edit?.report_code || genCode('BBNT'),
    contract_id: edit?.contract_id || prefillContract?.id || '',
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    actual_start_date: edit?.actual_start_date || prefill?.actual_start_date || prefillContract?.start_date || '',
    actual_end_date: edit?.actual_end_date || prefill?.actual_end_date || new Date().toISOString().slice(0,10),
    deliverables: edit?.deliverables || prefill?.deliverables || [],
    contract_value: edit?.contract_value || prefillContract?.total_with_vat || 0,
    accepted_value: edit?.accepted_value || prefillContract?.total_with_vat || 0,
    paid_amount: edit?.paid_amount || 0,
    remaining_amount: edit?.remaining_amount || 0,
    payment_deadline: edit?.payment_deadline || (type==='kol'?15:30),
    status: edit?.status || 'Draft',
    notes: edit?.notes || prefill?.notes || '',
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const [bbntFileUrl, setBbntFileUrl] = useState(edit?.bbnt_file_url||'')
  const [evidenceUrls, setEvidenceUrls] = useState(edit?.evidence_urls||[])
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
      payment_deadline:Number(form.payment_deadline||30), status:form.status, notes:form.notes,
      bbnt_file_url:bbntFileUrl, evidence_urls:evidenceUrls
    }
    let error
    if(edit){({error}=await supabase.from('acceptance_reports').update(payload).eq('id',edit.id))}
    else{({error}=await supabase.from('acceptance_reports').insert([payload]))}
    if(error){alert('Lỗi: '+error.message);return}
    if(!edit && prefill?._project_campaign) {
      const admins = (data.team||[]).filter(m=>(m.role||'').toLowerCase().includes('admin')||(m.role||'').toLowerCase().includes('director'))
      for(const admin of admins) {
        await supabase.from('notifications').insert([{recipient_email:admin.email||'',recipient_name:admin.name,type:'BBNT_FROM_PROJECT',title:`BBNT mới từ dự án ${prefill._project_campaign}`,message:`Đã tạo Biên bản nghiệm thu ${form.report_code} từ dự án "${prefill._project_campaign}" - cần Admin xử lý`,data:{project_campaign:prefill._project_campaign},send_email:false,email_sent:false}])
      }
    }
    onSaved();onClose()
  }

  return (
    <CModal title={edit?'Sửa BBNT':'Tạo biên bản nghiệm thu'} onClose={onClose} lg>
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
            <strong>{selectedContract.contract_code}</strong> — {type==='client'?selectedContract.party_a_name:selectedContract.party_b_name} — <span style={{color:CB.primary,fontWeight:700}}>{vnd(selectedContract.total_with_vat)}</span>
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
            <CFG label="Giá trị theo HĐ (VND)"><input type="text" value={fmtNum(form.contract_value)} onChange={e=>set('contract_value',Number(parseNum(e.target.value)))} style={CINP_S}/></CFG>
            <CFG label="Giá trị nghiệm thu (VND)"><input type="text" value={fmtNum(form.accepted_value)} onChange={e=>set('accepted_value',Number(parseNum(e.target.value)))} style={CINP_S}/></CFG>
          </CRow2>
          <CRow3>
            <CFG label="Đã thanh toán (VND)"><input type="text" value={fmtNum(form.paid_amount)} onChange={e=>set('paid_amount',Number(parseNum(e.target.value)))} style={CINP_S}/></CFG>
            <CFG label="Còn phải thanh toán">
              <div style={{padding:'9px 12px',background:Number(form.remaining_amount)>0?'rgba(217,119,6,0.08)':'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:Number(form.remaining_amount)>0?CB.warning:CB.success,border:`1px solid ${Number(form.remaining_amount)>0?CB.warning:CB.success}30`}}>{vnd(form.remaining_amount)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.remaining_amount)}</div>
            </CFG>
            <CFG label="TT trong (ngày làm việc)"><input type="number" value={form.payment_deadline} onChange={e=>set('payment_deadline',Number(e.target.value))} style={CINP_S}/></CFG>
          </CRow3>
        </CSec>

        <CFG label="Ghi chú"><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...CINP_S,minHeight:60}}/></CFG>

        <CSec title="File biên bản">
          <CRow2>
            <CFG label="BBNT đã ký (PDF)">
              <FileUpload supabase={supabase} bucket="contracts" folder="bbnt-signed" label="Upload PDF" accept=".pdf,image/*" maxMB={20} value={bbntFileUrl} onChange={setBbntFileUrl}/>
            </CFG>
            <CFG label="Bằng chứng / Screenshots">
              <FileUpload supabase={supabase} bucket="contracts" folder="bbnt-evidence" label="Upload ảnh/PDF" accept=".pdf,image/*" maxMB={10} value={evidenceUrls} onChange={setEvidenceUrls} multiple/>
            </CFG>
          </CRow2>
        </CSec>

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

    const evidenceHtml = (r.evidence_urls||[]).length ? `
      <h3>Bằng chứng thực hiện / Air links evidence</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">
        ${(r.evidence_urls||[]).map((url,i)=>{
          const isImg=/\.(jpg|jpeg|png|gif|webp)$/i.test((url||'').split('?')[0])
          return isImg
            ? `<div style="text-align:center"><img src="${url}" style="max-width:100%;max-height:160px;object-fit:cover;border:1px solid #ccc;border-radius:4px"/><div style="font-size:10px;color:#666;margin-top:3px">Ảnh ${i+1}</div></div>`
            : `<div style="text-align:center;padding:16px;background:#f5f5f5;border-radius:4px"><div style="font-size:28px">📄</div><a href="${url}" style="font-size:11px;color:#1A56DB">File ${i+1}</a></div>`
        }).join('')}
      </div>` : ''

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
    ${evidenceHtml}
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
        <CBtn primary onClick={printBBNT}>In / Export PDF</CBtn>
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
          <div>Giá trị HĐ: <strong>{vnd(r.contract_value)}</strong></div>
          <div>Giá trị NT: <strong>{vnd(r.accepted_value)}</strong></div>
          <div>Đã thanh toán: <strong>{vnd(r.paid_amount)}</strong></div>
          <div>Còn lại: <strong style={{color:Number(r.remaining_amount)>0?CB.warning:CB.success}}>{vnd(r.remaining_amount)}</strong></div>
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
  {id:'dashboard',label:'Dashboard',icon:'▣',grp:'OVERVIEW'},
  {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
  {id:'workflow',label:'Công việc',icon:'⚡',grp:'OPERATIONS'},
  {id:'projects',label:'Dự án',icon:'▤',grp:'OPERATIONS'},
  {id:'quotations',label:'Báo giá',icon:'💰',grp:'OPERATIONS'},
  {id:'pricing',label:'Pricing Engine',icon:'◊',grp:'OPERATIONS'},
  {id:'invoices',label:'Hóa đơn',icon:'≡',grp:'OPERATIONS'},
  {id:'approval',label:'Approvals',icon:'✓',grp:'OPERATIONS'},
  {id:'contracts',label:'Hợp đồng',icon:'⊟',grp:'LEGAL'},
  {id:'bbnt',label:'Biên bản NT',icon:'☐',grp:'LEGAL'},
  {id:'clients',label:'Clients',icon:'◉',grp:'DATA'},
  {id:'kols',label:'KOL / KOC',icon:'◆',grp:'DATA'},
  {id:'vendors',label:'Vendors',icon:'⬡',grp:'DATA'},
  {id:'team',label:'Team',icon:'◑',grp:'DATA'},
  {id:'reports',label:'Analytics',icon:'▦',grp:'INSIGHTS'},
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
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#F8FAFF 0%,#EFF6FF 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',system-ui,sans-serif"}}>

      <div style={{width:420,position:'relative'}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 8px 32px rgba(59,130,246,0.25)'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:28,letterSpacing:'-0.05em'}}>K</span>
          </div>
          <div style={{fontSize:22,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em'}}>K&K Advertising</div>
          <div style={{fontSize:13,color:'#64748B',marginTop:4,fontWeight:500}}>Agency OS — Đăng nhập</div>
        </div>

        {/* Card */}
        <div style={{background:'#FFFFFF',borderRadius:20,padding:'32px 36px',border:'1px solid #E2E8F0',boxShadow:'0 8px 40px rgba(59,130,246,0.1)'}}>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email</label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                placeholder="your@email.com"
                style={{width:'100%',padding:'11px 14px',border:'1px solid #D1D5DB',borderRadius:10,fontSize:13,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#3B82F6'}
                onBlur={e=>e.target.style.borderColor='#D1D5DB'}
              />
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Mật khẩu</label>
              <input
                type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{width:'100%',padding:'11px 14px',border:'1px solid #D1D5DB',borderRadius:10,fontSize:13,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#3B82F6'}
                onBlur={e=>e.target.style.borderColor='#D1D5DB'}
              />
            </div>
            {error&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#EF4444',marginBottom:18,fontWeight:500}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 16px rgba(59,130,246,0.3)',opacity:loading?0.7:1}}>
              {loading?'Đang đăng nhập...':'Đăng nhập →'}
            </button>
          </form>
          <div style={{marginTop:20,padding:'12px 14px',background:'rgba(59,130,246,0.05)',borderRadius:8,fontSize:11,color:'#64748B',textAlign:'center',border:'1px solid #E2E8F0'}}>
            Liên hệ admin để được cấp tài khoản
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
      const defaultView = m.id==='workflow' || m.id==='quotations'
      const defaultCreate = m.id==='quotations'
      map[m.id] = {
        can_view: p ? p.can_view : defaultView,
        can_create: p ? p.can_create : defaultCreate,
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
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#FFFFFF',borderRadius:20,padding:'24px 28px',width:700,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 8px 40px rgba(0,0,0,0.12)',border:'1px solid #E2E8F0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid #F1F5F9'}}>
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
                  <th style={{fontSize:10,fontWeight:700,color:'#374151',textAlign:'left',padding:'5px 8px',borderBottom:'1px solid #E2E8F0',background:'#F1F5F9'}}>Module</th>
                  {permCols.map(p=><th key={p} style={{fontSize:10,fontWeight:700,color:'#374151',textAlign:'center',padding:'5px 8px',width:70,borderBottom:'1px solid #E2E8F0',background:'#F1F5F9'}}>{permLabels[p]}</th>)}
                  <th style={{fontSize:10,fontWeight:700,color:'#374151',textAlign:'center',padding:'5px 8px',width:120,borderBottom:'1px solid #E2E8F0',background:'#F1F5F9'}}>Nhanh</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.filter(m=>m.grp===grp).map(m=>(
                  <tr key={m.id} style={{borderBottom:'1px solid #F1F5F9'}}>
                    <td style={{padding:'8px 8px',fontSize:12.5,fontWeight:500,color:'#1F2937'}}>
                      <span style={{marginRight:8,opacity:0.6}}>{m.icon}</span>{m.label}
                    </td>
                    {permCols.map(p=>(
                      <td key={p} style={{textAlign:'center',padding:'8px'}}>
                        <input type="checkbox" checked={perms[m.id]?.[p]||false}
                          onChange={()=>toggle(m.id,p)}
                          style={{width:16,height:16,cursor:'pointer',accentColor:'#6366F1'}}
                        />
                      </td>
                    ))}
                    <td style={{textAlign:'center',padding:'8px'}}>
                      <div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <button onClick={()=>setAll(m.id,true)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(16,185,129,0.3)',background:'rgba(16,185,129,0.08)',color:'#10B981',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Tất cả</button>
                        <button onClick={()=>setViewOnly(m.id)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(99,102,241,0.3)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Chỉ xem</button>
                        <button onClick={()=>setAll(m.id,false)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)',color:'#EF4444',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid #F1F5F9'}}>
          <button onClick={onClose} style={{padding:'8px 18px',borderRadius:9,border:'1px solid #E2E8F0',background:'#F8FAFC',color:'#374151',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Đóng</button>
          <button onClick={save} disabled={saving} style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 3px 12px rgba(59,130,246,0.3)'}}>
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
        {currentUser?.isMaster && <button onClick={()=>setShowAdd(true)} style={{padding:'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(99,102,241,0.3)'}}>+ Thêm thành viên</button>}
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
            <div key={m.id} style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${col},${col}88)`}}/>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:m.avatar_color||col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 12px ${col}40`}}>
                  {m.avatar_initials||init}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:13.5,color:'#0F172A'}}>{m.name}</div>
                  <div style={{fontSize:11,color:'#94A3B8',marginTop:1}}>{m.role}</div>
                  {acc&&<div style={{fontSize:10,color:acc.is_active?'#10B981':'#EF4444',fontWeight:600,marginTop:2}}>{acc.is_active?'● Online account':'● Bị khoá'}</div>}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:11}}>
                <span style={{color:'#475569'}}>Projects: <strong style={{color:'#0F172A'}}>{active}/{m.max_projects||5}</strong></span>
                <span style={{fontWeight:800,color:util>=80?'#EF4444':util>=60?'#F59E0B':'#10B981'}}>{util}%</span>
              </div>
              <div style={{height:6,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:util+'%',background:util>=80?'#EF4444':'linear-gradient(90deg,#3B82F6,#0EA5E9)',borderRadius:99}}/>
              </div>
              {currentUser?.isMaster && (
                <div style={{display:'flex',gap:6,marginTop:12}}>
                  {acc ? (
                    <>
                      <button onClick={()=>setEditPerms(acc)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:10.5,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Phân quyền</button>
                      {acc.is_active
                        ? <button onClick={()=>deactivate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                        : <button onClick={()=>activate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(5,150,105,0.2)',background:'rgba(5,150,105,0.06)',color:'#059669',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Mở</button>
                      }
                    </>
                  ) : (
                    <button onClick={()=>setShowAdd(m)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1.5px dashed rgba(99,102,241,0.25)',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Tạo tài khoản</button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Accounts table */}
      <div style={{background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:14,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              {['Thành viên','Email','SĐT','Role','Lần cuối đăng nhập','Trạng thái','Quyền truy cập',''].map(h=>(
                <th key={h} style={{padding:'10px 14px',fontSize:10,fontWeight:800,color:'#374151',borderBottom:'1px solid #E2E8F0',textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map(a=>{
              const modCount = a.permissions?.filter(p=>p.can_view).length||0
              return (
                <tr key={a.id}>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid #F1F5F9'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:a.avatar_color||'#6366F1',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0}}>
                        {a.avatar_initials||getInitials(a.team?.name||a.email)}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:12.5,color:'#0F172A'}}>{a.team?.name||'—'}</div>
                        <div style={{fontSize:10.5,color:'#94A3B8'}}>{a.team?.role||'Staff'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid #F1F5F9',color:'#94A3B8'}}>{a.email}</td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid #F1F5F9',color:'#94A3B8'}}>{a.phone||'—'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid #F1F5F9'}}><span style={{background:'rgba(99,102,241,0.1)',color:'#6366F1',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:600}}>{a.team?.role||'Staff'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11,color:'#94A3B8',borderBottom:'1px solid #F1F5F9'}}>{a.last_login?new Date(a.last_login).toLocaleDateString('vi-VN'):'Chưa đăng nhập'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid #F1F5F9'}}><span style={{background:a.is_active?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:a.is_active?'#10B981':'#EF4444',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:700}}>{a.is_active?'Active':'Khoá'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid #F1F5F9',color:'#6366F1',fontWeight:600}}>{modCount}/{MODULES.length} modules</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid #F1F5F9'}}>
                    {currentUser?.isMaster && (
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>setEditPerms(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Quyền</button>
                        <button onClick={()=>setEditAcc(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid #E2E8F0',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Edit</button>
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
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#FFFFFF',borderRadius:20,padding:'24px 28px',width:520,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 8px 40px rgba(0,0,0,0.12)',border:'1px solid #E2E8F0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid #F1F5F9'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Thêm thành viên & tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Avatar preview */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(59,130,246,0.05)',borderRadius:12,border:'1px solid #E2E8F0'}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:form.avatar_color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${form.avatar_color}50`,flexShrink:0}}>
              {getInitials(form.name||'?')}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#64748B',marginBottom:8}}>Màu Avatar</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>set('avatar_color',c)} style={{width:22,height:22,borderRadius:'50%',background:c,cursor:'pointer',border:form.avatar_color===c?`3px solid #0F172A`:'3px solid transparent',transition:'border 0.1s'}}/>
                ))}
              </div>
            </div>
          </div>

          {!preselected && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>Thành viên hiện có</div>
              <select value={form.team_id} onChange={e=>{const m=teamMembers.find(t=>t.id===e.target.value);set('team_id',e.target.value);if(m){set('name',m.name);set('role',m.role)}}} style={{width:'100%',padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:9,fontSize:12.5,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none'}}>
                <option value="">— Tạo thành viên mới —</option>
                {teamMembers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}

          {!form.team_id && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:4}}>
              {[['Họ và tên *','name','text',''],['Role','role','text','']].map(([l,k,t,ph])=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:9,fontSize:12.5,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box'}} required={k==='name'}/>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[['Email *','email','email'],['Số điện thoại','phone','tel'],['Mật khẩu *','password','password'],['Xác nhận mật khẩu *','confirm_password','password']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={{width:'100%',padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:9,fontSize:12.5,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box'}} required={['email','password','confirm_password'].includes(k)}/>
              </div>
            ))}
          </div>

          {error&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#EF4444',marginBottom:16,fontWeight:500}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8,paddingTop:14,borderTop:'1px solid #F1F5F9'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1px solid #E2E8F0',background:'#F8FAFC',color:'#374151',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
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
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#FFFFFF',borderRadius:20,padding:'24px 28px',width:420,maxWidth:'95vw',boxShadow:'0 8px 40px rgba(0,0,0,0.12)',border:'1px solid #E2E8F0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid #F1F5F9'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Chỉnh sửa tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={save}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(59,130,246,0.05)',borderRadius:12,border:'1px solid #E2E8F0'}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${color}50`,flexShrink:0}}>
              {account.avatar_initials||getInitials(account.team?.name||account.email)}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:'#0F172A'}}>{account.team?.name||account.email}</div>
              <div style={{fontSize:11,color:'#94A3B8',marginBottom:8}}>{account.email}</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>setColor(c)} style={{width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border:color===c?`3px solid #0F172A`:'3px solid transparent'}}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Số điện thoại</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" style={{width:'100%',padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:9,fontSize:12.5,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#64748B',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Đổi mật khẩu mới (để trống nếu không đổi)</label>
            <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} type="password" placeholder="Mật khẩu mới (≥6 ký tự)" style={{width:'100%',padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:9,fontSize:12.5,fontFamily:"'Inter',sans-serif",background:'#FFFFFF',color:'#1F2937',outline:'none',boxSizing:'border-box'}}/>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid #F1F5F9'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1px solid #E2E8F0',background:'#F8FAFC',color:'#374151',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
              {saving?'Đang lưu...':'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



// ════════════════════════════════════════════════════════════
// IMPORT ENGINE + QUOTATION MODULE — K&K Agency OS
// ════════════════════════════════════════════════════════════

// ── IMPORT BUTTON COMPONENT ──────────────────────────────
function ImportBtn({module, data, supabase, reload, log}) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button onClick={()=>setShow(true)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:9,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        📥 Import Excel
      </button>
      {show && <ImportModal module={module} data={data} supabase={supabase} reload={reload} log={log} onClose={()=>setShow(false)}/>}
    </>
  )
}

// ── IMPORT MODAL ─────────────────────────────────────────
function ImportModal({module, data, supabase, reload, log, onClose}) {
  const [step, setStep] = useState('upload') // upload | preview | duplicates | done
  const [rows, setRows] = useState([])
  const [headers, setHeaders] = useState([])
  const [duplicates, setDuplicates] = useState([])
  const [dupIdx, setDupIdx] = useState(0)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const MODULE_CONFIG = {
    kols: {
      label: 'KOL/KOC', sheet: 'KOL_KOC',
      keyField: 'Số CCCD *', softKey: 'Tên nghệ danh *',
      mapper: (row) => ({
        name: row['Tên nghệ danh *']||'', real_name: row['Tên thật *']||'',
        gender: row['Giới tính']||'', location: row['Tỉnh/Thành phố']||'',
        city: row['Tỉnh/Thành phố']||'', age_range: row['Độ tuổi']||'',
        cccd: row['Số CCCD *']||'', personal_tax_code: row['MST Cá nhân']||'',
        contact: row['Email']||'', phone: row['Số điện thoại']||'',
        platform: row['Platform chính']||'TikTok', tier: row['Tier']||'Micro',
        niche: row['Niche/Category']||'',
        followers: Number(row['Followers TikTok']||0),
        engagement: Number(row['Engagement TikTok%']||0),
        rate: Number(row['Giá TikTok 1 video (VND)']||0),
        avg_views: Number(row['Avg Views/video']||0),
        reliability: Number(row['Reliability (1-5)']||5),
        available: row['Trạng thái']==='Available',
        bank_account: row['Số tài khoản']||'',
        bank_name: row['Ngân hàng']||'',
        bank_holder: row['Chủ tài khoản']||'',
        address: row['Tỉnh/Thành phố']||'',
        social_links: {
          tiktok: row['Link TikTok']||'',
          instagram: row['Link Instagram']||'',
          youtube: row['Link YouTube']||'',
          facebook: row['Link Facebook']||'',
        },
        platform_pricing: {
          tiktok: Number(row['Giá TikTok 1 video (VND)']||0),
          instagram: Number(row['Giá Instagram 1 post (VND)']||0),
          youtube: Number(row['Giá YouTube 1 video (VND)']||0),
          facebook: Number(row['Giá Facebook 1 post (VND)']||0),
        },
        audience_gender: row['Audience Giới tính chính']||'',
        audience_age: row['Audience Độ tuổi chính']||'',
        audience_location: row['Audience Địa điểm chính']||'',
        avatar_url: row['Link ảnh đại diện']||'',
        cccd_front_url: row['Link CCCD mặt trước']||'',
        cccd_back_url: row['Link CCCD mặt sau']||'',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const cccd = row['Số CCCD *']
        if(!cccd) return null
        const {data:d} = await sb.from('kols').select('id,name,cccd').eq('cccd', cccd)
        return d?.length ? d[0] : null
      }
    },
    clients: {
      label: 'Clients', sheet: 'Clients',
      keyField: 'MST (Mã số thuế) *', softKey: 'Tên Brand/Công ty *',
      mapper: (row) => ({
        name: row['Tên Brand/Công ty *']||'',
        company_type: row['Loại công ty']||'',
        industry: row['Ngành chính']||'',
        industry_sub: row['Ngành phụ']||'',
        size: row['Quy mô']||'SME',
        tax_code: row['MST (Mã số thuế) *']||'',
        address: row['Địa chỉ pháp lý']||'',
        billing_address: row['Địa chỉ xuất hóa đơn']||'',
        legal_rep: row['Người đại diện pháp lý']||'',
        legal_rep_title: row['Chức vụ đại diện']||'',
        bank_account: row['Số tài khoản']||'',
        bank_name: row['Ngân hàng']||'',
        bank_branch: row['Chi nhánh ngân hàng']||'',
        email: row['Email liên hệ *']||'',
        phone: row['SĐT liên hệ']||'',
        contact: row['Contact người phụ trách']||'',
        website: row['Website']||'',
        payment_term: Number(row['Hạn thanh toán (ngày)']||30),
        credit_limit: Number(row['Hạn tín dụng (VND)']||0),
        since: row['Ngày bắt đầu hợp tác']||'',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const tax = row['MST (Mã số thuế) *']
        if(!tax) return null
        const {data:d} = await sb.from('clients').select('id,name,tax_code').eq('tax_code', tax)
        return d?.length ? d[0] : null
      }
    },
    projects: {
      label: 'Dự án', sheet: 'Projects',
      keyField: 'Project Code *', softKey: 'Tên Campaign *',
      mapper: (row) => ({
        project_code: row['Project Code *']||'',
        campaign: row['Tên Campaign *']||'',
        client: row['Client *']||'',
        service: row['Loại dịch vụ']||'KOL/KOC',
        campaign_type: row['Loại Campaign']||'',
        product_name: row['Tên sản phẩm']||'',
        brief: row['Mô tả Brief']||'',
        pm: row['PM phụ trách']||'',
        kols: row['Danh sách KOL (cách dấu phẩy)'] ? row['Danh sách KOL (cách dấu phẩy)'].split(',').map(s=>s.trim()) : [],
        budget_plan: Number(row['Budget Plan (VND)']||0),
        actual_cost: Number(row['Actual Cost (VND)']||0),
        revenue: Number(row['Revenue (VND)']||0),
        start_date: row['Ngày bắt đầu']||null,
        end_date: row['Deadline']||null,
        status: row['Trạng thái']||'Active',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const code = row['Project Code *']
        if(!code) return null
        const {data:d} = await sb.from('projects').select('id,campaign,project_code').eq('project_code', code)
        return d?.length ? d[0] : null
      }
    },
    invoices: {
      label: 'Hóa đơn', sheet: 'Invoices',
      keyField: 'Mã hóa đơn *', softKey: 'Client *',
      mapper: (row) => ({
        invoice_code: row['Mã hóa đơn *']||'',
        client: row['Client *']||'',
        project: row['Tên dự án']||'',
        amount: Number(row['Tổng tiền (VND) *']||0),
        paid: Number(row['Đã thanh toán (VND)']||0),
        due_date: row['Hạn thanh toán']||null,
        status: row['Trạng thái']||'Unpaid',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const code = row['Mã hóa đơn *']
        if(!code) return null
        const {data:d} = await sb.from('invoices').select('id,client,invoice_code').eq('invoice_code', code)
        return d?.length ? d[0] : null
      }
    },
    deals: {
      label: 'Deal Pipeline', sheet: 'Deals_Pipeline',
      keyField: 'Client/Prospect *', softKey: 'Client/Prospect *',
      mapper: (row) => ({
        client: row['Client/Prospect *']||'',
        service: row['Loại dịch vụ']||'KOL/KOC',
        value: Number(row['Giá trị deal (VND)']||0),
        stage: row['Stage']||'Lead',
        pm: row['PM phụ trách']||'',
        deal_date: row['Ngày tạo']||new Date().toLocaleDateString('vi-VN'),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async () => null
    },
    vendors: {
      label: 'Vendors', sheet: 'Vendors',
      keyField: 'Tên Vendor/Công ty *', softKey: 'Tên Vendor/Công ty *',
      mapper: (row) => ({
        name: row['Tên Vendor/Công ty *']||'',
        type: row['Loại dịch vụ']||'Other',
        contact: row['Liên hệ']||'',
        rating: Number(row['Rating (1-5)']||5),
        total_spent: Number(row['Tổng đã chi (VND)']||0),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const name = row['Tên Vendor/Công ty *']
        if(!name) return null
        const {data:d} = await sb.from('vendors').select('id,name').ilike('name', name)
        return d?.length ? d[0] : null
      }
    },
    team: {
      label: 'Team', sheet: 'Team',
      keyField: 'Email *', softKey: 'Họ và tên *',
      mapper: (row) => ({
        name: row['Họ và tên *']||'',
        role: row['Role/Chức danh *']||'Account Manager',
        email: row['Email *']||'',
        phone: row['Số điện thoại']||'',
        max_projects: Number(row['Max Projects']||5),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const email = row['Email *']
        if(!email) return null
        const {data:d} = await sb.from('team').select('id,name,email').eq('email', email)
        return d?.length ? d[0] : null
      }
    },
  }

  const config = MODULE_CONFIG[module]

  // Parse CSV (we'll use SheetJS from CDN in browser)
  function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Simple CSV/text parse fallback
          // In browser with SheetJS this would be proper Excel parse
          const text = e.target.result
          const lines = text.split('\n').filter(l=>l.trim())
          if(!lines.length) { reject('File trống'); return }
          const hdrs = lines[0].split('\t').map(h=>h.trim().replace(/^"|"$/g,''))
          const data = lines.slice(1).map(line => {
            const vals = line.split('\t').map(v=>v.trim().replace(/^"|"$/g,''))
            const obj = {}
            hdrs.forEach((h,i) => { obj[h] = vals[i]||'' })
            return obj
          }).filter(row => Object.values(row).some(v=>v))
          resolve({headers: hdrs, rows: data})
        } catch(err) { reject(err.message) }
      }
      reader.onerror = () => reject('Không đọc được file')
      // Try as text first (for TSV/CSV export from Excel)
      reader.readAsText(file)
    })
  }

  async function handleFile(file) {
    if(!file) return
    try {
      // Use SheetJS if available (loaded via CDN)
      let parsedRows = [], parsedHeaders = []
      if(window.XLSX) {
        const buf = await file.arrayBuffer()
        const wb = window.XLSX.read(buf, {type:'array'})
        // Find the right sheet
        const sheetName = wb.SheetNames.find(n=>n===config.sheet) || wb.SheetNames[1]
        const ws = wb.Sheets[sheetName]
        const json = window.XLSX.utils.sheet_to_json(ws, {header:1, defval:''})
        // Find header row (row 5 in template = index 4)
        const headerRowIdx = json.findIndex(row => row.some(cell=>String(cell||'').includes('*')||String(cell||'').includes('Tên')))
        if(headerRowIdx < 0) { alert('Không tìm thấy hàng header. Dùng đúng file template K&K.'); return }
        parsedHeaders = json[headerRowIdx].map(h=>String(h||'').trim())
        parsedRows = json.slice(headerRowIdx+1)
          .filter(row => row.some(cell=>cell!==''))
          .map(row => {
            const obj = {}
            parsedHeaders.forEach((h,i) => { obj[h] = String(row[i]||'').trim() })
            return obj
          })
          .filter(row => Object.values(row).some(v=>v))
      } else {
        alert('⚠️ Vui lòng chờ thư viện Excel load xong rồi thử lại (F5 trang)')
        return
      }
      setHeaders(parsedHeaders)
      setRows(parsedRows)
      setStep('preview')
    } catch(err) {
      alert('Lỗi đọc file: '+err)
    }
  }

  async function startImport() {
    setImporting(true)
    const dups = []
    for(const row of rows) {
      const existing = await config.checkDup(row, supabase)
      if(existing) dups.push({row, existing, action:'skip'})
    }
    if(dups.length > 0) {
      setDuplicates(dups); setDupIdx(0); setImporting(false); setStep('duplicates')
    } else {
      await doImport(rows, [])
    }
  }

  async function doImport(allRows, dupDecisions) {
    setImporting(true)
    let imported=0, skipped=0, updated=0, errors=[]
    const table = module==='deals'?'deals': module==='team'?'team': module

    for(const row of allRows) {
      const dupDec = dupDecisions.find(d=>d.row===row)
      if(dupDec) {
        if(dupDec.action==='skip') { skipped++; continue }
        if(dupDec.action==='update') {
          const {error} = await supabase.from(table).update(config.mapper(row)).eq('id', dupDec.existing.id)
          if(error) errors.push(error.message)
          else updated++
          continue
        }
      }
      // Check if it's a dup we haven't decided on
      const existing = await config.checkDup(row, supabase)
      if(existing && !dupDec) { skipped++; continue }

      const {error} = await supabase.from(table).insert([config.mapper(row)])
      if(error) errors.push(`${row[config.softKey]}: ${error.message}`)
      else imported++
    }

    await supabase.from('import_logs').insert([{
      module, filename: 'import.xlsx', total_rows: allRows.length,
      imported, skipped, updated, errors, imported_by: 'User'
    }])
    await reload()
    log(`Import ${config.label}: ${imported} thêm, ${updated} cập nhật, ${skipped} bỏ qua`)
    setResult({imported, skipped, updated, errors})
    setImporting(false)
    setStep('done')
  }

  function handleDupDecision(action) {
    const updated = [...duplicates]
    updated[dupIdx].action = action
    setDuplicates(updated)
    if(dupIdx < duplicates.length-1) {
      setDupIdx(dupIdx+1)
    } else {
      // All decided - do import
      const dupRows = duplicates.map(d=>d.row)
      const allRows = rows
      doImport(allRows, updated)
    }
  }

  const curDup = duplicates[dupIdx]
  const configData = MODULE_CONFIG[module]

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget&&step!=='duplicates')onClose()}}>
      <div style={{background:'#FFFFFF',borderRadius:20,padding:'28px 32px',width:700,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.5)',border:'1px solid #E2E8F0'}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,paddingBottom:16,borderBottom:'1px solid #F1F5F9'}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:'#0F172A'}}>📥 Import {configData?.label}</div>
            <div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>Dùng file template K&K — Sheet: {configData?.sheet}</div>
          </div>
          {step!=='duplicates'&&<button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>}
        </div>

        {/* Steps indicator */}
        <div style={{display:'flex',gap:0,marginBottom:24}}>
          {[['upload','1. Upload'],['preview','2. Preview'],['duplicates','3. Duplicates'],['done','4. Done']].map(([s,l],i)=>{
            const steps=['upload','preview','duplicates','done']
            const cur=steps.indexOf(step), idx=steps.indexOf(s)
            const active=cur===idx, done2=cur>idx
            return <div key={s} style={{flex:1,textAlign:'center',padding:'8px 4px',fontSize:10.5,fontWeight:active||done2?700:500,color:active?'#6366F1':done2?'#10B981':'#94A3B8',background:active?'rgba(99,102,241,0.1)':done2?'rgba(16,185,129,0.06)':'transparent',borderBottom:`2px solid ${active?'#6366F1':done2?'#10B981':'rgba(255,255,255,0.08)'}`,transition:'all 0.2s'}}>
              {done2?'✓ ':''}{l}
            </div>
          })}
        </div>

        {/* STEP 1: Upload */}
        {step==='upload'&&(
          <div>
            <div
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}}
              style={{border:`2px dashed ${dragOver?'#6366F1':'rgba(99,102,241,0.25)'}`,borderRadius:16,padding:'48px 32px',textAlign:'center',background:dragOver?'rgba(99,102,241,0.06)':'#F8FAFF',transition:'all 0.2s',cursor:'pointer'}}
              onClick={()=>document.getElementById('file-input-'+module).click()}
            >
              <div style={{fontSize:40,marginBottom:12}}>📊</div>
              <div style={{fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:6}}>Kéo thả file Excel vào đây</div>
              <div style={{fontSize:12,color:'#94A3B8',marginBottom:16}}>hoặc click để chọn file (.xlsx)</div>
              <div style={{display:'inline-block',padding:'8px 20px',borderRadius:9,background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',fontSize:12,fontWeight:700}}>Chọn file</div>
            </div>
            <input id={'file-input-'+module} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>

            <div style={{marginTop:20,padding:'14px 16px',background:'rgba(99,102,241,0.06)',borderRadius:12,border:'1px solid rgba(99,102,241,0.15)'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#6366F1',marginBottom:8}}>📋 Chưa có template? Download tại đây:</div>
              <div style={{fontSize:11,color:'#94A3B8'}}>Dùng file <strong>KK_Import_Templates.xlsx</strong> đã được cung cấp → Điền vào sheet <strong>{configData?.sheet}</strong> → Upload lại file này</div>
            </div>
          </div>
        )}

        {/* STEP 2: Preview */}
        {step==='preview'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:700,color:'#0F172A'}}>Tìm thấy <span style={{color:'#6366F1'}}>{rows.length} records</span> để import</div>
              <button onClick={()=>setStep('upload')} style={{padding:'5px 12px',borderRadius:7,border:'1px solid #E2E8F0',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>← Chọn lại file</button>
            </div>
            <div style={{overflowX:'auto',maxHeight:340,border:'1px solid #E2E8F0',borderRadius:10}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                <thead>
                  <tr>{headers.slice(0,8).map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:700,color:'#94A3B8',borderBottom:'1px solid #F1F5F9',textAlign:'left',background:'#FFFFFF',whiteSpace:'nowrap',textTransform:'uppercase'}}>{h.replace(' *','')}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0,10).map((row,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid #F8FAFF',background:i%2===0?'transparent':'#F8FAFF'}}>
                      {headers.slice(0,8).map(h=><td key={h} style={{padding:'7px 10px',fontSize:11,color:'#0F172A',maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row[h]||'—'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length>10&&<div style={{fontSize:11,color:'#94A3B8',marginTop:8,textAlign:'center'}}>...và {rows.length-10} records khác</div>}
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
              <button onClick={()=>setStep('upload')} style={{padding:'8px 18px',borderRadius:9,border:'1px solid #E2E8F0',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
              <button onClick={startImport} disabled={importing} style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                {importing?'Đang kiểm tra...':'Tiếp tục →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Duplicates */}
        {step==='duplicates'&&curDup&&(
          <div>
            <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:'16px 20px',marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:800,color:'#F59E0B',marginBottom:4}}>
                ⚠️ Phát hiện trùng lặp ({dupIdx+1}/{duplicates.length})
              </div>
              <div style={{fontSize:12,color:'#F59E0B'}}>Record này đã tồn tại trong database. Bạn muốn làm gì?</div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div style={{background:'rgba(99,102,241,0.06)',borderRadius:12,padding:'16px',border:'1px solid rgba(99,102,241,0.15)'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#6366F1',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>📥 Data mới (từ Excel)</div>
                {Object.entries(curDup.row).slice(0,8).map(([k,v])=>v?(
                  <div key={k} style={{fontSize:11,marginBottom:4,display:'flex',gap:8}}>
                    <span style={{color:'#94A3B8',minWidth:120,flexShrink:0}}>{k.replace(' *','')}:</span>
                    <span style={{color:'#0F172A',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
                  </div>
                ):null)}
              </div>
              <div style={{background:'rgba(16,185,129,0.06)',borderRadius:12,padding:'16px',border:'1px solid rgba(16,185,129,0.15)'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#10B981',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>✅ Data hiện tại (trong DB)</div>
                {Object.entries(curDup.existing).map(([k,v])=>v&&k!=='id'?(
                  <div key={k} style={{fontSize:11,marginBottom:4,display:'flex',gap:8}}>
                    <span style={{color:'#94A3B8',minWidth:80,flexShrink:0}}>{k}:</span>
                    <span style={{color:'#0F172A',fontWeight:500}}>{String(v)}</span>
                  </div>
                ):null)}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
              <button onClick={()=>handleDupDecision('update')} style={{padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                🔄 Update<br/><span style={{fontSize:10,fontWeight:500,opacity:0.8}}>Cập nhật bằng data mới</span>
              </button>
              <button onClick={()=>handleDupDecision('skip')} style={{padding:'12px',borderRadius:10,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.06)',color:'#6366F1',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                ⏭️ Bỏ qua<br/><span style={{fontSize:10,fontWeight:500}}>Giữ nguyên data cũ</span>
              </button>
              <button onClick={()=>{
                const updated=[...duplicates].map(d=>({...d,action:'skip'}))
                doImport(rows,updated)
              }} style={{padding:'12px',borderRadius:10,border:'1.5px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.05)',color:'#DC2626',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                ⏩ Skip tất cả<br/><span style={{fontSize:10,fontWeight:500}}>Bỏ qua mọi record trùng</span>
              </button>
            </div>

            <div style={{marginTop:16,padding:'10px 14px',background:'rgba(59,130,246,0.04)',borderRadius:8,border:'1px solid #EFF6FF'}}>
              <div style={{display:'flex',gap:4}}>
                {duplicates.map((d,i)=>(
                  <div key={i} style={{width:12,height:12,borderRadius:3,background:i<dupIdx?'#10B981':i===dupIdx?'#6366F1':'#D1D5DB',display:'inline-block',marginRight:4}}/>
                ))}
              </div>
              <div style={{fontSize:11,color:'#94A3B8',marginTop:6}}>
                Còn lại {duplicates.length-dupIdx} records cần xử lý
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Done */}
        {step==='done'&&result&&(
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:48,marginBottom:16}}>🎉</div>
            <div style={{fontSize:18,fontWeight:900,color:'#0F172A',marginBottom:8}}>Import hoàn tất!</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,margin:'24px 0',textAlign:'left'}}>
              {[['✅ Đã thêm mới',result.imported,'#10B981','rgba(16,185,129,0.08)'],
                ['🔄 Đã cập nhật',result.updated,'#6366F1','rgba(99,102,241,0.08)'],
                ['⏭️ Đã bỏ qua',result.skipped,'#F59E0B','rgba(245,158,11,0.08)']].map(([l,v,c,bg])=>(
                <div key={l} style={{background:bg,borderRadius:12,padding:'16px',border:`1px solid ${c}25`}}>
                  <div style={{fontSize:11,color:c,fontWeight:700,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:28,fontWeight:900,color:'#0F172A'}}>{v}</div>
                </div>
              ))}
            </div>
            {result.errors?.length>0&&(
              <div style={{background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:10,padding:'12px 16px',marginBottom:16,textAlign:'left'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#DC2626',marginBottom:6}}>⚠️ {result.errors.length} lỗi:</div>
                {result.errors.slice(0,5).map((e,i)=><div key={i} style={{fontSize:11,color:'#DC2626',marginBottom:2}}>{e}</div>)}
              </div>
            )}
            <button onClick={onClose} style={{padding:'10px 28px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Đóng & Xem kết quả
            </button>
          </div>
        )}

        {importing&&step!=='done'&&(
          <div style={{position:'absolute',inset:0,background:'rgba(26,29,46,0.9)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:20,flexDirection:'column',gap:12}}>
            <div style={{width:40,height:40,border:'4px solid rgba(99,102,241,0.2)',borderTop:'4px solid #6366F1',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
            <div style={{fontSize:13,fontWeight:600,color:'#6366F1'}}>Đang import...</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// QUOTATION MODULE — Báo giá
// ════════════════════════════════════════════════════════════
function Quotations({data, supabase, reload, log}) {
  const [quotes, setQuotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [sort,setSort]=useState({field:'created_at',dir:'desc'})

  useEffect(()=>{ loadQuotes() },[])

  async function loadQuotes() {
    setLoading(true)
    const {data:rows} = await supabase.from('quotations').select('*').order('created_at',{ascending:false})
    setQuotes(rows||[])
    setLoading(false)
  }

  const total = quotes.reduce((a,q)=>a+Number(q.total||0),0)
  const filteredQuotes = applySortDate(applyDateFilter(quotes.filter(q=>!search||(q.client_name||'').toLowerCase().includes(search.toLowerCase())||(q.quote_code||'').toLowerCase().includes(search.toLowerCase())),'created_at',dateFrom,dateTo),sort)
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'#FFFFFF',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Báo giá</h2>
        <button onClick={()=>{setEditItem(null);setShowForm(true)}} style={{padding:'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>
          + Tạo báo giá
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:14}}>
        {[['Tổng báo giá',quotes.length,'',B.primary],['Draft',quotes.filter(q=>q.status==='Draft').length,'',B.textTer],['Đã gửi',quotes.filter(q=>q.status==='Sent').length,'',B.warning],['Tổng giá trị',cfmtS(total)+' VND','',B.success]].map(([l,v,s,c])=>(
          <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'14px 16px',border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:22,fontWeight:900,color:c||'#0F172A',marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:10,marginBottom:10,flexWrap:'wrap'}}>
        <input placeholder="Tìm báo giá..." value={search} onChange={e=>setSearch(e.target.value)} style={{...INP.style,maxWidth:260}}/>
      </div>
      <div style={{marginBottom:14}}><DateFilterBar from={dateFrom} setFrom={setDateFrom} to={dateTo} setTo={setDateTo}/></div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>
            {['Mã BG','Client','Campaign','Loại DV','Tổng (VND)','Hiệu lực','Trạng thái'].map(h=><th key={h} style={TH}>{h}</th>)}
            <SortHdr field="created_at" sort={sort} setSort={setSort} thStyle={TH}>Ngày tạo</SortHdr>
            <th style={TH}></th>
          </tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={9} style={{textAlign:'center',padding:32,color:'#94A3B8'}}>Đang tải...</td></tr>}
            {!loading&&filteredQuotes.map(q=>(
              <tr key={q.id}>
                <td style={{...TD,fontWeight:800,color:'#1A56DB',fontSize:12}}>{q.quote_code}</td>
                <td style={{...TD,fontWeight:600}}>{q.client_name||'—'}</td>
                <td style={{...TD,fontSize:11,color:'#475569'}}>{q.campaign_name||'—'}</td>
                <td style={TD}><span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:600}}>{q.service_type||'—'}</span></td>
                <td style={{...TD,fontWeight:800,color:'#0F172A'}}>{vnd(q.total)}</td>
                <td style={{...TD,fontSize:11,color:'#94A3B8'}}>{q.valid_days} ngày</td>
                <td style={TD}><QBadge text={q.status}/></td>
                <td style={{...TD,fontSize:10,color:'#94A3B8'}}>{q.created_at?.slice(0,10)||'—'}</td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <button onClick={()=>setViewItem(q)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xem & In</button>
                  <button onClick={()=>{setEditItem(q);setShowForm(true)}} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Sửa</button>
                </td>
              </tr>
            ))}
            {!loading&&!filteredQuotes.length&&<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có báo giá nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm&&<QuotationForm data={data} supabase={supabase} edit={editItem} onClose={()=>{setShowForm(false);setEditItem(null)}} onSaved={()=>{loadQuotes();reload();log('Lưu báo giá')}}/>}
      {viewItem&&<QuotationPreview quote={viewItem} onClose={()=>setViewItem(null)} onStatusChange={async(status)=>{await supabase.from('quotations').update({status}).eq('id',viewItem.id);loadQuotes();setViewItem({...viewItem,status})}}/>}
    </div>
  )
}

function QBadge({text}) {
  const colors={Draft:'#94A3B8',Sent:'#1A56DB',Accepted:'#059669',Rejected:'#DC2626',Expired:'#D97706'}
  const c=colors[text]||'#94A3B8'
  return <span style={{background:c+'18',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>
}


function numWords(n) {
  n=Math.round(Number(n||0))
  if(!n) return 'Không đồng'
  const u=['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
  const t=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi']
  const teen=['mười','mười một','mười hai','mười ba','mười bốn','mười lăm','mười sáu','mười bảy','mười tám','mười chín']
  function r(x){
    if(!x)return''
    if(x>=1e9)return u[Math.floor(x/1e9)]+' tỷ '+(x%1e9?r(x%1e9):'')
    if(x>=1e6){const m=Math.floor(x/1e6);return(m>=20?t[Math.floor(m/10)]+(m%10?' '+u[m%10]:''):m>=10?teen[m-10]:u[m])+' triệu '+(x%1e6?r(x%1e6):'') }
    if(x>=1e3)return r(Math.floor(x/1e3))+' nghìn '+(x%1e3?r(x%1e3):'')
    if(x>=100)return u[Math.floor(x/100)]+' trăm '+(x%100?r(x%100):'')
    if(x>=20)return t[Math.floor(x/10)]+(x%10?' '+u[x%10]:'')
    if(x>=10)return teen[x-10]
    return u[x]
  }
  const w=r(n).trim()
  return w.charAt(0).toUpperCase()+w.slice(1)+' đồng./.'
}


// ════════════════════════════════════════════════════════════
// QUOTATION FORM & PREVIEW — Full pricing logic
// ════════════════════════════════════════════════════════════

function getPricing(sourceType, sourceName, platform, data) {
  if(sourceType === 'KOL') {
    const kol = data.kols.find(k => k.name === sourceName || k.real_name === sourceName)
    if(!kol) return null
    if(kol.pricing?.length) {
      const match = platform ? kol.pricing.find(p => p.platform?.toLowerCase() === platform?.toLowerCase()) : null
      if(match) return Number(match.amount||0)
      return Math.min(...kol.pricing.map(p => Number(p.amount||0)))
    }
    return Number(kol.rate||0) || null
  }
  if(sourceType === 'Vendor') {
    const vendor = data.vendors.find(v => v.name === sourceName)
    if(!vendor) return null
    return Number(vendor.min_price||vendor.rate||0) || null
  }
  return null
}

const TAX_TYPES = ['PIT','VAT']
const TAX_RATES = [0, 5, 8, 10]

// Pricing logic per line item:
// PIT: Giá sau thuế = Giá gốc / (1 - tax/100)  [gross-up]
// VAT: Giá sau thuế = Giá gốc (VAT tính riêng ở bảng tổng)
// Giá bán = Giá sau thuế × (1 + markup/100)
// VAT amount = Giá bán × vat_rate/100 (chỉ với loại VAT)

function calcItem(item) {
  const basePrice = Number(item.base_price || item.unit_price || 0)
  const qty = Number(item.qty || 1)
  const taxType = item.tax_type || 'VAT'
  const taxRate = Number(item.tax_rate || 0)
  const markup = Number(item.markup ?? '')  // must be explicitly set

  // After-tax price per unit
  let priceAfterTax = basePrice
  if (taxType === 'PIT' && taxRate > 0) {
    priceAfterTax = basePrice / (1 - taxRate / 100)
  }

  // Selling price per unit (after markup)
  const sellPrice = priceAfterTax * (1 + markup / 100)

  // Line totals
  const lineBeforeVAT = sellPrice * qty
  const lineVAT = taxType === 'VAT' ? lineBeforeVAT * taxRate / 100 : 0
  const lineTotal = lineBeforeVAT + lineVAT

  return { basePrice, priceAfterTax, sellPrice, lineBeforeVAT, lineVAT, lineTotal }
}

function QuotationForm({data, supabase, edit, prefill, onClose, onSaved}) {
  const genQCode = () => {
    const d = new Date()
    return `KK-BG-${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getFullYear()).slice(2)}-${Math.floor(Math.random()*900+100)}`
  }

  const defaultItem = () => ({
    description: '',
    item_type: 'KOL',      // KOL | Vendor | Service
    source_name: '',       // KOL name or vendor name (read-only ref)
    base_price: 0,         // Giá gốc - NEVER changes
    unit: 'Video',
    qty: 1,
    tax_type: 'PIT',       // PIT or VAT
    tax_rate: 10,          // 0/5/8/10
    markup: '',            // REQUIRED - empty string forces user to fill
    note: '',
  })

  const [form, setForm] = useState({
    quote_code: edit?.quote_code || genQCode(),
    client_name: edit?.client_name || prefill?.client_name || '',
    brand_name: edit?.brand_name || '',
    campaign_name: edit?.campaign_name || prefill?.campaign_name || '',
    service_type: edit?.service_type || 'KOL/KOC',
    project_id: edit?.project_id || prefill?.project_id || '',
    prepared_by: edit?.prepared_by || 'Tô Nguyễn Đăng Khoa',
    valid_days: edit?.valid_days || 30,
    items: edit?.items?.length ? edit.items : [defaultItem()],
    discount: edit?.discount || 0,
    notes: edit?.notes || 'Báo giá có hiệu lực trong vòng 30 ngày kể từ ngày phát hành.\nMọi thay đổi cần được xác nhận bằng văn bản.',
    status: edit?.status || 'Draft',
  })
  const [saving, setSaving] = useState(false)
  const [markupError, setMarkupError] = useState(false)
  const [showPicker, setShowPicker] = useState(null) // {idx, type:'KOL'|'Vendor'}
  const [pickerSearch, setPickerSearch] = useState('')
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function selectFromPicker(item) {
    const idx = showPicker.idx
    const arr = [...form.items]
    if (showPicker.type === 'KOL') {
      const rate = item.pricing?.length ? Math.min(...item.pricing.map(p=>Number(p.amount||0))) : Number(item.rate||0)
      const unit = item.platform==='YouTube' ? 'Video' : item.platform==='Instagram' ? 'Post' : 'Video'
      arr[idx] = { ...arr[idx], source_name: item.name, base_price: rate, unit, item_type:'KOL', tax_type:'PIT', tax_rate:10 }
    } else {
      arr[idx] = { ...arr[idx], source_name: item.name, description: item.services_detail||item.type||'', item_type:'Vendor', tax_type:'VAT', tax_rate:8 }
    }
    set('items', arr)
    setShowPicker(null)
    setPickerSearch('')
  }

  // Compute totals
  const itemCalcs = form.items.map(calcItem)
  const subtotalBeforeVAT = itemCalcs.reduce((a, c) => a + c.lineBeforeVAT, 0)
  const totalVAT = itemCalcs.reduce((a, c) => a + c.lineVAT, 0)
  const discountAmt = subtotalBeforeVAT * Number(form.discount || 0) / 100
  const grandTotal = subtotalBeforeVAT - discountAmt + totalVAT

  // Update item field
  function updItem(i, k, v) {
    const arr = [...form.items]
    // If changing item_type, reset tax defaults
    if (k === 'item_type') {
      arr[i] = {
        ...arr[i],
        item_type: v,
        tax_type: v === 'KOL' ? 'PIT' : 'VAT',
        tax_rate: v === 'KOL' ? 10 : 8,
        source_name: '',
        base_price: 0,
      }
    } else if (k === 'source_name') {
      // Auto-fill base price from KOL/Vendor DB
      if (arr[i].item_type === 'KOL') {
        const kol = data.kols.find(x => x.name === v || x.real_name === v)
        if (kol) {
          const rate = kol.pricing?.length ? Math.min(...kol.pricing.map(p=>Number(p.amount||0))) : Number(kol.rate||0)
          const unit = kol.platform==='YouTube' ? 'Video' : kol.platform==='Instagram' ? 'Post' : 'Video'
          arr[i] = { ...arr[i], source_name: v, base_price: rate, unit }
        } else {
          arr[i] = { ...arr[i], source_name: v }
        }
      } else if (arr[i].item_type === 'Vendor') {
        const vendor = data.vendors.find(vd => vd.name === v)
        if (vendor) {
          arr[i] = { ...arr[i], source_name: v, description: vendor.services_detail || vendor.type || '' }
        } else {
          arr[i] = { ...arr[i], source_name: v }
        }
      } else {
        arr[i] = { ...arr[i], source_name: v }
      }
    } else {
      arr[i] = { ...arr[i], [k]: v }
    }
    set('items', arr)
  }

  function addItem() { set('items', [...form.items, defaultItem()]) }
  function delItem(i) { set('items', form.items.filter((_, j) => j !== i)) }

  async function handleSubmit(e) {
    e.preventDefault()
    // Validate markup required on all items
    const missing = form.items.some(item => item.markup === '' || item.markup === null || item.markup === undefined)
    if (missing) {
      setMarkupError(true)
      alert('⚠️ Markup % là bắt buộc cho tất cả hạng mục. Vui lòng điền đầy đủ (kể cả 0%).')
      return
    }
    setMarkupError(false)
    setSaving(true)

    const payload = {
      quote_code: form.quote_code,
      client_name: form.client_name,
      brand_name: form.brand_name,
      campaign_name: form.campaign_name,
      service_type: form.service_type,
      project_id: form.project_id || null,
      client_id: data.clients.find(c => c.name === form.client_name)?.id || null,
      prepared_by: form.prepared_by,
      valid_days: Number(form.valid_days || 30),
      items: form.items,
      subtotal: subtotalBeforeVAT,
      discount: Number(form.discount || 0),
      vat_rate: 0, // VAT per-item now
      total: grandTotal,
      notes: form.notes,
      status: form.status,
    }

    let error
    if (edit) {
      ({ error } = await supabase.from('quotations').update(payload).eq('id', edit.id))
    } else {
      ({ error } = await supabase.from('quotations').insert([payload]))
    }
    if (error) { alert('Lỗi: ' + error.message); setSaving(false); return }
    // Audit log
    await supabase.from('audit_log').insert([{
      message: `[${form.project_id||''}] Quote ${edit?'updated':'created'}: ${form.quote_code} | project: ${form.campaign_name||form.client_name}`,
      role: 'User', entity_type:'quotation', entity_name:form.quote_code,
      action: edit?'quote_updated':'quote_created', changes_json:{total:grandTotal,client:form.client_name}
    }])
    setSaving(false); onSaved(); onClose()
  }

  const INP_S = {
    width: '100%', padding: '7px 10px',
    border: '1.5px solid rgba(26,86,219,0.12)', borderRadius: 7,
    fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: '#fff', color: '#0F172A', outline: 'none', boxSizing: 'border-box'
  }
  const LABEL = { fontSize: 10, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }

  return (
    <>
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:'100%',maxWidth:'min(1100px,98vw)',maxHeight:'95vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.18)'}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:'#0F172A'}}>{edit ? 'Sửa báo giá' : 'Tạo báo giá mới'}</div>
            <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>Giá gốc KOL/NCC được bảo vệ — không thay đổi khi quote thay đổi</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Meta info */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
            {[['Mã báo giá *','quote_code'],['Người lập','prepared_by'],['Hiệu lực (ngày)','valid_days']].map(([l,k])=>(
              <div key={k}>
                <label style={LABEL}>{l}</label>
                <input value={form[k]} onChange={e=>set(k,e.target.value)} style={INP_S} required={k==='quote_code'}/>
              </div>
            ))}
            <div>
              <label style={LABEL}>Trạng thái</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)} style={INP_S}>
                <option>Draft</option><option>Sent</option><option>Accepted</option><option>Rejected</option><option>Expired</option>
              </select>
            </div>
            <div>
              <label style={LABEL}>Chiết khấu (%)</label>
              <input type="number" min={0} max={100} value={form.discount} onChange={e=>set('discount',Number(e.target.value))} style={INP_S}/>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:16}}>
            <div>
              <label style={LABEL}>Client *</label>
              <input value={form.client_name} onChange={e=>set('client_name',e.target.value)} list="q-cl" style={INP_S} required/>
              <datalist id="q-cl">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
            </div>
            <div>
              <label style={LABEL}>Brand/Nhãn hàng</label>
              <input value={form.brand_name} onChange={e=>set('brand_name',e.target.value)} style={INP_S}/>
            </div>
            <div>
              <label style={LABEL}>Tên Campaign</label>
              <input value={form.campaign_name} onChange={e=>set('campaign_name',e.target.value)} style={INP_S}/>
            </div>
            <div>
              <label style={LABEL}>Link với Project (PO)</label>
              <select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={INP_S}>
                <option value="">— Chọn project —</option>
                {data.projects.map(p=><option key={p.id} value={p.id}>{p.project_code} — {p.campaign}</option>)}
              </select>
            </div>
          </div>

          {/* Line items table */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'2px solid rgba(26,86,219,0.1)',textTransform:'uppercase',letterSpacing:'0.06em',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span>Hạng mục & Định giá</span>
              <div style={{fontSize:10,color:'#DC2626',fontWeight:600,textTransform:'none',letterSpacing:0}}>⚠️ Markup % BẮT BUỘC cho tất cả hạng mục (điền 0 nếu không mark up)</div>
            </div>

            {/* Table header */}
            <div style={{display:'grid',gridTemplateColumns:'110px 1fr 60px 80px 110px 90px 70px 80px 100px 110px 110px 36px',gap:4,marginBottom:4}}>
              {['Loại','Mô tả / Nguồn','ĐV','SL','Giá gốc (locked)','Loại thuế','Thuế%','Giá sau thuế','Markup% *','Giá bán','VAT amount',''].map(h=>(
                <div key={h} style={{fontSize:9,fontWeight:800,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.04em',padding:'4px 6px',background:'rgba(248,250,255,0.9)',borderRadius:5,textAlign:h.includes('Giá')||h.includes('VAT')||h.includes('SL')||h.includes('Thuế%')||h.includes('Markup')?'right':'left'}}>{h}</div>
              ))}
            </div>

            {form.items.map((item, i) => {
              const calc = calcItem(item)
              const missingMarkup = markupError && (item.markup === '' || item.markup === null || item.markup === undefined)
              const rowBg = i % 2 === 0 ? '#fff' : '#F8FAFF'
              return (
                <div key={i} style={{display:'grid',gridTemplateColumns:'110px 1fr 60px 80px 110px 90px 70px 80px 100px 110px 110px 36px',gap:4,marginBottom:5,padding:'6px 0',background:rowBg,borderRadius:8,border:missingMarkup?'1.5px solid #DC2626':'1px solid rgba(26,86,219,0.06)'}}>

                  {/* Loại: KOL / Vendor / Service */}
                  <select value={item.item_type} onChange={e=>updItem(i,'item_type',e.target.value)}
                    style={{...INP_S,fontSize:11,padding:'6px 7px',background:item.item_type==='KOL'?'rgba(26,86,219,0.06)':item.item_type==='Vendor'?'rgba(5,150,105,0.06)':'rgba(124,58,237,0.06)'}}>
                    <option>KOL</option><option>Vendor</option><option>Service</option>
                  </select>

                  {/* Mô tả / Nguồn */}
                  <div style={{display:'flex',flexDirection:'column',gap:3}}>
                    {item.item_type==='KOL' ? (
                      <>
                        <div style={{display:'flex',gap:4}}>
                          <input value={item.source_name} onChange={e=>updItem(i,'source_name',e.target.value)}
                            list={`kol-list-${i}`} style={{...INP_S,fontSize:11,padding:'4px 7px',flex:1}} placeholder="Tên KOL..."/>
                          <button type="button" onClick={()=>{setShowPicker({idx:i,type:'KOL'});setPickerSearch('')}}
                            style={{padding:'4px 8px',borderRadius:6,border:'1px solid rgba(26,86,219,0.25)',background:'rgba(26,86,219,0.08)',color:'#1A56DB',cursor:'pointer',fontSize:10,fontWeight:600,whiteSpace:'nowrap',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                            📋 DS
                          </button>
                        </div>
                        <datalist id={`kol-list-${i}`}>{data.kols.map(k=><option key={k.id} value={k.name}/>)}</datalist>
                        {(()=>{const kol=data.kols.find(x=>x.name===item.source_name||x.real_name===item.source_name);return kol?(<div style={{fontSize:9,color:'#059669',fontWeight:600,display:'flex',gap:6}}><span>{kol.tier||'—'}</span><span>·</span><span>{Number(kol.followers||0).toLocaleString('vi-VN')} followers</span><span>·</span><span>{kol.platform}</span></div>):null})()}
                        <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                          style={{...INP_S,fontSize:10,padding:'3px 7px',color:'#94A3B8'}} placeholder="Nội dung công việc..."/>
                      </>
                    ) : item.item_type==='Vendor' ? (
                      <>
                        <div style={{display:'flex',gap:4}}>
                          <input value={item.source_name} onChange={e=>updItem(i,'source_name',e.target.value)}
                            list={`vd-list-${i}`} style={{...INP_S,fontSize:11,padding:'4px 7px',flex:1}} placeholder="Tên NCC..."/>
                          <button type="button" onClick={()=>{setShowPicker({idx:i,type:'Vendor'});setPickerSearch('')}}
                            style={{padding:'4px 8px',borderRadius:6,border:'1px solid rgba(5,150,105,0.25)',background:'rgba(5,150,105,0.08)',color:'#059669',cursor:'pointer',fontSize:10,fontWeight:600,whiteSpace:'nowrap',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                            📋 DS
                          </button>
                        </div>
                        <datalist id={`vd-list-${i}`}>{data.vendors.map(v=><option key={v.id} value={v.name}/>)}</datalist>
                        {(()=>{const vd=data.vendors.find(x=>x.name===item.source_name);return vd?(<div style={{fontSize:9,color:'#059669',fontWeight:600}}>{vd.type||''}{vd.price_range?` · ${vd.price_range}`:''}</div>):null})()}
                        <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                          style={{...INP_S,fontSize:10,padding:'3px 7px',color:'#94A3B8'}} placeholder="Mô tả dịch vụ..."/>
                      </>
                    ) : (
                      <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                        style={{...INP_S,fontSize:11,padding:'6px 7px'}} placeholder="Mô tả dịch vụ..."/>
                    )}
                  </div>

                  {/* ĐV */}
                  <select value={item.unit} onChange={e=>updItem(i,'unit',e.target.value)} style={{...INP_S,fontSize:10,padding:'6px 4px'}}>
                    <option>Video</option><option>Post</option><option>Story</option><option>Live</option>
                    <option>Campaign</option><option>Gói</option><option>Tháng</option><option>Người</option>
                  </select>

                  {/* SL */}
                  <input type="number" min={1} value={item.qty} onChange={e=>updItem(i,'qty',Number(e.target.value))}
                    style={{...INP_S,fontSize:11,padding:'6px 7px',textAlign:'right'}}/>

                  {/* Giá gốc - LOCKED */}
                  <div style={{position:'relative'}}>
                    <input type="text" value={fmtNum(item.base_price)} onChange={e=>updItem(i,'base_price',Number(parseNum(e.target.value)))}
                      style={{...INP_S,fontSize:11,padding:'6px 7px',textAlign:'right',
                        background: (item.item_type==='KOL'||item.item_type==='Vendor')&&item.source_name?'rgba(5,150,105,0.06)':'#fff',
                        borderColor: (item.item_type==='KOL'||item.item_type==='Vendor')&&item.source_name?'rgba(5,150,105,0.3)':'rgba(26,86,219,0.12)',
                      }}/>
                    {(()=>{
                      if(!item.source_name||(item.item_type!=='KOL'&&item.item_type!=='Vendor')) return null
                      const dbPrice = getPricing(item.item_type, item.source_name, null, data)
                      if(dbPrice===null) return null
                      const synced = Number(item.base_price)===dbPrice
                      return (
                        <div style={{marginTop:2}}>
                          <div style={{fontSize:8,color:synced?'#059669':'#D97706',fontWeight:700}}>DB: {vnd(dbPrice)}{synced?' ✓':''}</div>
                          {!synced&&<button type="button" onClick={()=>updItem(i,'base_price',dbPrice)}
                            style={{fontSize:8,padding:'1px 6px',borderRadius:4,border:'1px solid rgba(26,86,219,0.3)',background:'rgba(26,86,219,0.08)',color:'#1A56DB',cursor:'pointer',fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:1}}>
                            Sync giá từ DB
                          </button>}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Loại thuế */}
                  <select value={item.tax_type} onChange={e=>updItem(i,'tax_type',e.target.value)}
                    style={{...INP_S,fontSize:11,padding:'6px 4px',
                      background:item.tax_type==='PIT'?'rgba(217,119,6,0.07)':'rgba(26,86,219,0.06)',
                      color:item.tax_type==='PIT'?'#92400E':'#1A56DB',fontWeight:600}}>
                    <option value="PIT">PIT (CTV)</option>
                    <option value="VAT">VAT (Cty)</option>
                  </select>

                  {/* Thuế suất */}
                  <select value={item.tax_rate} onChange={e=>updItem(i,'tax_rate',Number(e.target.value))}
                    style={{...INP_S,fontSize:11,padding:'6px 4px',textAlign:'right'}}>
                    {TAX_RATES.map(r=><option key={r} value={r}>{r}%</option>)}
                  </select>

                  {/* Giá sau thuế (computed, readonly) */}
                  <div style={{padding:'6px 7px',fontSize:11,fontWeight:600,color:'#475569',textAlign:'right',
                    background:'rgba(248,250,252,0.8)',borderRadius:7,border:'1px solid rgba(26,86,219,0.08)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {vnd(Math.round(calc.priceAfterTax))}
                  </div>

                  {/* Markup % - REQUIRED */}
                  <div style={{position:'relative'}}>
                    <input type="number" min={0} max={500}
                      value={item.markup}
                      onChange={e=>updItem(i,'markup',e.target.value===''?'':Number(e.target.value))}
                      placeholder="0"
                      style={{...INP_S,fontSize:12,padding:'6px 7px',textAlign:'right',fontWeight:700,
                        borderColor:missingMarkup?'#DC2626':item.markup!==''?'rgba(5,150,105,0.4)':'rgba(26,86,219,0.12)',
                        background:missingMarkup?'rgba(220,38,38,0.05)':item.markup!==''?'rgba(5,150,105,0.05)':'#fff',
                      }}/>
                    <div style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',fontSize:10,color:'#94A3B8',pointerEvents:'none'}}>%</div>
                  </div>

                  {/* Giá bán (computed) */}
                  <div style={{padding:'6px 7px',fontSize:12,fontWeight:800,color:'#1A56DB',textAlign:'right',
                    background:'rgba(26,86,219,0.06)',borderRadius:7,border:'1px solid rgba(26,86,219,0.15)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {item.markup!==''?vnd(Math.round(calc.lineBeforeVAT)):'—'}
                  </div>

                  {/* VAT amount */}
                  <div style={{padding:'6px 7px',fontSize:11,fontWeight:600,
                    color:item.tax_type==='VAT'&&item.tax_rate>0?'#7C3AED':'#94A3B8',textAlign:'right',
                    background:item.tax_type==='VAT'&&item.tax_rate>0?'rgba(124,58,237,0.06)':'rgba(248,250,252,0.5)',
                    borderRadius:7,border:'1px solid rgba(26,86,219,0.06)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {item.tax_type==='VAT'&&item.tax_rate>0&&item.markup!==''?vnd(Math.round(calc.lineVAT)):'—'}
                  </div>

                  {/* Delete */}
                  <button type="button" onClick={()=>delItem(i)}
                    style={{background:'none',border:'none',cursor:'pointer',color:'#DC2626',fontSize:18,lineHeight:1,alignSelf:'center',justifySelf:'center'}}>×</button>
                </div>
              )
            })}

            <button type="button" onClick={addItem}
              style={{marginTop:6,padding:'7px 16px',borderRadius:8,border:'1.5px dashed rgba(26,86,219,0.3)',background:'transparent',color:'#1A56DB',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              + Thêm hạng mục
            </button>
          </div>

          {/* Summary box */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16,marginBottom:16}}>
            <div>
              <label style={LABEL}>Điều kiện & Ghi chú</label>
              <textarea value={form.notes} onChange={e=>set('notes',e.target.value)}
                style={{...INP_S,minHeight:100}}/>
            </div>

            {/* Totals - 3 rows clean */}
            <div style={{background:'rgba(15,23,42,0.03)',borderRadius:14,padding:'18px 20px',border:'1px solid rgba(26,86,219,0.12)'}}>
              <div style={{fontSize:11,fontWeight:800,color:'#0F172A',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>Tổng kết</div>

              {/* Line items summary */}
              {form.items.map((item,i)=>{
                const c=calcItem(item)
                if(item.markup===''||!item.description&&!item.source_name) return null
                return <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:11}}>
                  <span style={{color:'#475569',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.source_name||item.description||`Hạng mục ${i+1}`}</span>
                  <span style={{fontWeight:600,color:'#0F172A'}}>{vnd(Math.round(c.lineBeforeVAT))}</span>
                </div>
              })}

              <div style={{height:1,background:'rgba(26,86,219,0.1)',margin:'12px 0'}}/>

              {/* 3 main rows */}
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#475569',fontWeight:500}}>Tổng tiền trước thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#0F172A'}}>{vnd(Math.round(subtotalBeforeVAT))}</span>
              </div>

              {form.discount>0&&(
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#D97706',fontWeight:500}}>Chiết khấu ({form.discount}%)</span>
                  <span style={{fontSize:13,fontWeight:700,color:'#D97706'}}>- {vnd(Math.round(discountAmt))}</span>
                </div>
              )}

              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#7C3AED',fontWeight:500}}>Thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#7C3AED'}}>{vnd(Math.round(totalVAT))}</span>
              </div>

              <div style={{height:2,background:'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99,margin:'12px 0'}}/>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:900,color:'#0F172A'}}>Tổng tiền sau thuế VAT</span>
                <span style={{fontSize:18,fontWeight:900,color:'#1A56DB'}}>{vnd(Math.round(grandTotal))}</span>
              </div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:5,fontStyle:'italic',textAlign:'right'}}>
                {numWords(Math.round(grandTotal))}
              </div>

              {/* PIT note */}
              {form.items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)&&(
                <div style={{marginTop:10,padding:'8px 10px',background:'rgba(217,119,6,0.08)',borderRadius:8,border:'1px solid rgba(217,119,6,0.2)',fontSize:10,color:'#92400E'}}>
                  💡 Thuế TNCN (PIT) đã được gross-up vào giá bán. K&K sẽ khấu trừ và nộp thay cho CTV.
                </div>
              )}
            </div>
          </div>

          {markupError&&(
            <div style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.3)',borderRadius:10,padding:'12px 16px',marginBottom:14,fontSize:12,color:'#DC2626',fontWeight:600}}>
              ⚠️ Vui lòng điền Markup % cho tất cả hạng mục (kể cả 0% nếu không mark up)
            </div>
          )}

          <div style={{display:'flex',justifyContent:'flex-end',gap:10,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'9px 20px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'9px 24px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 4px 16px rgba(26,86,219,0.25)'}}>
              {saving?'Đang lưu...':'Lưu báo giá'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* KOL / Vendor picker modal */}

    {showPicker&&(
      <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={e=>{if(e.target===e.currentTarget)setShowPicker(null)}}>
        <div style={{background:'#fff',borderRadius:18,padding:'22px 24px',width:600,maxWidth:'95vw',maxHeight:'80vh',display:'flex',flexDirection:'column',boxShadow:'0 24px 80px rgba(0,0,0,0.2)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:800,color:'#0F172A'}}>Chọn {showPicker.type==='KOL'?'KOL / KOC':'Nhà cung cấp'}</div>
            <button onClick={()=>setShowPicker(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#94A3B8'}}>×</button>
          </div>
          <input value={pickerSearch} onChange={e=>setPickerSearch(e.target.value)} placeholder={`Tìm ${showPicker.type==='KOL'?'KOL...':'vendor...'}`}
            style={{padding:'8px 12px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:9,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',marginBottom:12}}/>
          <div style={{overflowY:'auto',flex:1}}>
            {showPicker.type==='KOL' ? (
              data.kols.filter(k=>!pickerSearch||k.name?.toLowerCase().includes(pickerSearch.toLowerCase())).map(k=>{
                const minRate=k.pricing?.length?Math.min(...k.pricing.map(p=>Number(p.amount||0))):Number(k.rate||0)
                return <div key={k.id} onClick={()=>selectFromPicker(k)} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:4,border:'1px solid rgba(26,86,219,0.08)',background:'#F8FAFF',transition:'background 0.1s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(26,86,219,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='#F8FAFF'}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700,flexShrink:0}}>
                    {(k.name||'K')[0]}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#0F172A'}}>{k.name}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{k.tier||'—'} · {k.platform} · {Number(k.followers||0).toLocaleString('vi-VN')} followers</div>
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:'#1A56DB',textAlign:'right'}}>
                    {vnd(minRate)}
                    <div style={{fontSize:9,color:'#94A3B8',fontWeight:400}}>/ {k.platform==='Instagram'?'Post':'Video'}</div>
                  </div>
                </div>
              })
            ) : (
              data.vendors.filter(v=>!pickerSearch||v.name?.toLowerCase().includes(pickerSearch.toLowerCase())).map(v=>(
                <div key={v.id} onClick={()=>selectFromPicker(v)} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:4,border:'1px solid rgba(5,150,105,0.1)',background:'#F0FDF4',transition:'background 0.1s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(5,150,105,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='#F0FDF4'}>
                  <div style={{width:36,height:36,borderRadius:10,background:'rgba(5,150,105,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#059669',fontSize:16,flexShrink:0}}>⬡</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#0F172A'}}>{v.name}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{v.type||'—'}{v.price_range?` · ${v.price_range}`:''}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function QuotationPreview({quote:q, onClose, onStatusChange}) {
  const items = q.items || []
  const itemCalcs = items.map(calcItem)
  const subtotalBeforeVAT = itemCalcs.reduce((a,c)=>a+c.lineBeforeVAT,0)
  const totalVAT = itemCalcs.reduce((a,c)=>a+c.lineVAT,0)
  const discountAmt = subtotalBeforeVAT * Number(q.discount||0)/100
  const grandTotal = subtotalBeforeVAT - discountAmt + totalVAT
  const today = new Date()
  const validUntil = new Date(q.created_at||today)
  validUntil.setDate(validUntil.getDate()+(q.valid_days||30))

  function printQuote() {
    const w = window.open('','_blank')
    const itemRows = items.map((item,i)=>{
      const c = calcItem(item)
      const name = item.source_name||item.description||`Hạng mục ${i+1}`
      const desc = item.source_name&&item.description ? item.description : ''
      const taxLabel = item.tax_type==='PIT'
        ? `Gross-up PIT ${item.tax_rate}%`
        : item.tax_rate>0 ? `VAT ${item.tax_rate}%` : 'Không thuế'
      return `<tr>
        <td style="text-align:center;color:#94A3B8">${i+1}</td>
        <td><strong>${name}</strong>${desc?`<br><span style="font-size:10px;color:#94A3B8">${desc}</span>`:''}</td>
        <td style="text-align:center">${item.unit}</td>
        <td style="text-align:right">${item.qty}</td>
        <td style="text-align:right">${cfmt(Math.round(Number(item.base_price||0)))}</td>
        <td style="text-align:center;font-size:10px;color:${item.tax_type==='PIT'?'#92400E':'#6D28D9'}">${taxLabel}</td>
        <td style="text-align:right">${item.markup!==''?item.markup+'%':'—'}</td>
        <td style="text-align:right;font-weight:700;color:#1A56DB">${cfmt(Math.round(c.lineBeforeVAT))}</td>
        <td style="text-align:right;color:#6D28D9">${item.tax_type==='VAT'&&item.tax_rate>0?cfmt(Math.round(c.lineVAT)):'—'}</td>
        <td style="text-align:right;font-weight:800">${cfmt(Math.round(c.lineTotal))}</td>
      </tr>`
    }).join('')

    w.document.write(`<html><head><title>Báo giá ${q.quote_code}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;font-size:12px;color:#0F172A;padding:28px 36px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #1A56DB}
      .logo{font-size:22px;font-weight:900;color:#1A56DB}.logo span{color:#06B6D4}
      .co{font-size:10px;color:#475569;text-align:right;line-height:1.7}
      h1{text-align:center;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin:16px 0 4px}
      .qnum{text-align:center;color:#94A3B8;font-size:11px;margin-bottom:18px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
      .box{background:#F8FAFF;border-radius:7px;padding:12px 14px;border:1px solid #E2E8F0}
      .box h3{font-size:9px;font-weight:700;color:#1A56DB;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
      .row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
      .row .v{font-weight:600}
      table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px}
      thead{background:#0F172A}
      th{padding:8px 8px;color:#fff;font-size:9px;text-align:left;letter-spacing:.04em;font-weight:700}
      td{padding:8px 8px;border-bottom:1px solid #E2E8F0;vertical-align:top}
      tr:nth-child(even) td{background:#F8FAFF}
      .totals{display:flex;justify-content:flex-end;margin-bottom:18px}
      .tbox{width:340px;background:#F8FAFF;border-radius:8px;padding:16px;border:1px solid #E2E8F0}
      .trow{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;align-items:center}
      .trow.grand{font-size:16px;font-weight:900;color:#1A56DB;border-top:2px solid #1A56DB;padding-top:10px;margin-top:4px}
      .trow.vat{color:#6D28D9;font-weight:600}
      .trow.disc{color:#D97706}
      .words{font-size:10px;color:#94A3B8;font-style:italic;margin-top:5px;text-align:right}
      .pit-note{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:9px 12px;font-size:10px;color:#92400E;margin-top:8px}
      .notes{background:#FFFBEB;border:1px solid #FCD34D;border-radius:7px;padding:12px;margin-bottom:20px;font-size:11px;color:#92400E;line-height:1.7}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:28px}
      .sigbox{text-align:center;padding-top:12px;border-top:1px dashed #CBD5E1}
      .footer{margin-top:24px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:10px;color:#94A3B8;text-align:center;line-height:1.8}
      @media print{body{padding:14px 18px}@page{margin:.8cm}}
    </style></head><body>
    <div class="hdr">
      <div><div class="logo">K&K <span>advertising</span></div><div style="font-size:10px;color:#94A3B8;margin-top:2px">Creative & KOL Marketing Agency</div></div>
      <div class="co">CÔNG TY TNHH QUẢNG CÁO K&K<br>737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM<br>MST: 0317776715 | ĐT: 0938 223 668<br>Email: contact@weareknk.com</div>
    </div>
    <h1>BÁO GIÁ DỊCH VỤ</h1>
    <div class="qnum">Số: ${q.quote_code}</div>
    <div class="meta">
      <div class="box"><h3>Thông tin khách hàng</h3>
        <div class="row"><span>Client:</span><span class="v">${q.client_name||'—'}</span></div>
        <div class="row"><span>Brand/Nhãn hàng:</span><span class="v">${q.brand_name||'—'}</span></div>
        <div class="row"><span>Campaign:</span><span class="v">${q.campaign_name||'—'}</span></div>
        <div class="row"><span>Loại dịch vụ:</span><span class="v">${q.service_type||'—'}</span></div>
      </div>
      <div class="box"><h3>Thông tin báo giá</h3>
        <div class="row"><span>Mã báo giá:</span><span class="v">${q.quote_code}</span></div>
        <div class="row"><span>Ngày lập:</span><span class="v">${new Date(q.created_at||today).toLocaleDateString('vi-VN')}</span></div>
        <div class="row"><span>Hiệu lực đến:</span><span class="v">${validUntil.toLocaleDateString('vi-VN')}</span></div>
        <div class="row"><span>Người lập:</span><span class="v">${q.prepared_by||'—'}</span></div>
      </div>
    </div>
    <table>
      <thead><tr>
        <th style="width:30px">STT</th>
        <th>Mô tả dịch vụ</th>
        <th style="width:50px;text-align:center">ĐV</th>
        <th style="width:35px;text-align:right">SL</th>
        <th style="width:90px;text-align:right">Giá gốc</th>
        <th style="width:90px;text-align:center">Thuế</th>
        <th style="width:55px;text-align:right">Markup</th>
        <th style="width:100px;text-align:right">Giá bán</th>
        <th style="width:80px;text-align:right">VAT</th>
        <th style="width:105px;text-align:right">Thành tiền</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="totals"><div class="tbox">
      <div class="trow"><span>Tổng tiền trước thuế VAT:</span><span style="font-weight:700">${cfmt(Math.round(subtotalBeforeVAT))} VND</span></div>
      ${q.discount>0?`<div class="trow disc"><span>Chiết khấu (${q.discount}%):</span><span>- ${cfmt(Math.round(discountAmt))} VND</span></div>`:''}
      <div class="trow vat"><span>Thuế VAT:</span><span>${cfmt(Math.round(totalVAT))} VND</span></div>
      <div class="trow grand"><span>TỔNG TIỀN SAU THUẾ VAT:</span><span>${cfmt(Math.round(grandTotal))} VND</span></div>
      <div class="words">Bằng chữ: ${numWords(Math.round(grandTotal))}</div>
      ${items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)?`<div class="pit-note">💡 Thuế TNCN (PIT) đã được gross-up vào giá bán. K&K khấu trừ và nộp thay cho CTV theo quy định.</div>`:''}
    </div></div>
    ${q.notes?`<div class="notes"><strong>📋 Điều kiện & Ghi chú:</strong><br>${q.notes.replace(/\n/g,'<br>')}</div>`:''}
    <div class="sig">
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên A</div><div style="font-size:11px;color:#475569;margin-top:3px">${q.client_name||'Client'}</div><br><br><br><div style="font-size:10px;color:#94A3B8">(Ký, ghi rõ họ tên)</div></div>
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên B</div><div style="font-size:11px;color:#475569;margin-top:3px">CÔNG TY TNHH QUẢNG CÁO K&K</div><br><br><br><div style="font-size:12px;font-weight:700">TÔ NGUYỄN ĐĂNG KHOA</div><div style="font-size:10px;color:#94A3B8">Giám Đốc</div></div>
    </div>
    <div class="footer">K&K Advertising | 737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM | MST: 0317776715 | ĐT: 0938 223 668 | contact@weareknk.com</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(),600)
  }

  function printQuoteClient() {
    const w = window.open('','_blank')
    const clientItemRows = items.map((item,i)=>{
      const c = calcItem(item)
      const name = item.source_name||item.description||`Hạng mục ${i+1}`
      const desc = item.source_name&&item.description ? item.description : ''
      return `<tr>
        <td style="text-align:center;color:#94A3B8">${i+1}</td>
        <td><strong>${name}</strong>${desc?`<br><span style="font-size:10px;color:#94A3B8">${desc}</span>`:''}</td>
        <td style="text-align:center">${item.unit}</td>
        <td style="text-align:right">${item.qty}</td>
        <td style="text-align:right;font-weight:800">${cfmt(Math.round(c.lineTotal))}</td>
      </tr>`
    }).join('')

    w.document.write(`<html><head><title>Báo giá ${q.quote_code}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;font-size:12px;color:#0F172A;padding:28px 36px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #1A56DB}
      .logo{font-size:22px;font-weight:900;color:#1A56DB}.logo span{color:#06B6D4}
      .co{font-size:10px;color:#475569;text-align:right;line-height:1.7}
      h1{text-align:center;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin:16px 0 4px}
      .qnum{text-align:center;color:#94A3B8;font-size:11px;margin-bottom:18px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
      .box{background:#F8FAFF;border-radius:7px;padding:12px 14px;border:1px solid #E2E8F0}
      .box h3{font-size:9px;font-weight:700;color:#1A56DB;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
      .row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
      .row .v{font-weight:600}
      table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px}
      thead{background:#0F172A}
      th{padding:8px 8px;color:#fff;font-size:9px;text-align:left;letter-spacing:.04em;font-weight:700}
      td{padding:8px 8px;border-bottom:1px solid #E2E8F0;vertical-align:top}
      tr:nth-child(even) td{background:#F8FAFF}
      .totals{display:flex;justify-content:flex-end;margin-bottom:18px}
      .tbox{width:340px;background:#F8FAFF;border-radius:8px;padding:16px;border:1px solid #E2E8F0}
      .trow{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;align-items:center}
      .trow.grand{font-size:16px;font-weight:900;color:#1A56DB;border-top:2px solid #1A56DB;padding-top:10px;margin-top:4px}
      .trow.vat{color:#6D28D9;font-weight:600}
      .trow.disc{color:#D97706}
      .words{font-size:10px;color:#94A3B8;font-style:italic;margin-top:5px;text-align:right}
      .notes{background:#FFFBEB;border:1px solid #FCD34D;border-radius:7px;padding:12px;margin-bottom:20px;font-size:11px;color:#92400E;line-height:1.7}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:28px}
      .sigbox{text-align:center;padding-top:12px;border-top:1px dashed #CBD5E1}
      .footer{margin-top:24px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:10px;color:#94A3B8;text-align:center;line-height:1.8}
      @media print{body{padding:14px 18px}@page{margin:.8cm}}
    </style></head><body>
    <div class="hdr">
      <div><div class="logo">K&K <span>advertising</span></div><div style="font-size:10px;color:#94A3B8;margin-top:2px">Creative & KOL Marketing Agency</div></div>
      <div class="co">CÔNG TY TNHH QUẢNG CÁO K&K<br>737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM<br>MST: 0317776715 | ĐT: 0938 223 668<br>Email: contact@weareknk.com</div>
    </div>
    <h1>BÁO GIÁ DỊCH VỤ</h1>
    <div class="qnum">Số: ${q.quote_code}</div>
    <div class="meta">
      <div class="box"><h3>Thông tin khách hàng</h3>
        <div class="row"><span>Client:</span><span class="v">${q.client_name||'—'}</span></div>
        <div class="row"><span>Brand/Nhãn hàng:</span><span class="v">${q.brand_name||'—'}</span></div>
        <div class="row"><span>Campaign:</span><span class="v">${q.campaign_name||'—'}</span></div>
      </div>
      <div class="box"><h3>Thông tin báo giá</h3>
        <div class="row"><span>Mã báo giá:</span><span class="v">${q.quote_code}</span></div>
        <div class="row"><span>Ngày lập:</span><span class="v">${new Date(q.created_at||today).toLocaleDateString('vi-VN')}</span></div>
        <div class="row"><span>Hiệu lực đến:</span><span class="v">${validUntil.toLocaleDateString('vi-VN')}</span></div>
      </div>
    </div>
    <table>
      <thead><tr>
        <th style="width:30px">STT</th>
        <th>Tên KOL / Dịch vụ</th>
        <th style="width:50px;text-align:center">ĐV</th>
        <th style="width:40px;text-align:right">SL</th>
        <th style="width:120px;text-align:right">Thành tiền (VND)</th>
      </tr></thead>
      <tbody>${clientItemRows}</tbody>
    </table>
    <div class="totals"><div class="tbox">
      <div class="trow"><span>Tổng trước VAT:</span><span style="font-weight:700">${cfmt(Math.round(subtotalBeforeVAT))} VND</span></div>
      ${q.discount>0?`<div class="trow disc"><span>Chiết khấu (${q.discount}%):</span><span>- ${cfmt(Math.round(discountAmt))} VND</span></div>`:''}
      <div class="trow vat"><span>Thuế VAT:</span><span>${cfmt(Math.round(totalVAT))} VND</span></div>
      <div class="trow grand"><span>TỔNG SAU THUẾ VAT:</span><span>${cfmt(Math.round(grandTotal))} VND</span></div>
      <div class="words">Bằng chữ: ${numWords(Math.round(grandTotal))}</div>
    </div></div>
    ${q.notes?`<div class="notes"><strong>📋 Điều kiện & Ghi chú:</strong><br>${q.notes.replace(/\n/g,'<br>')}</div>`:''}
    <div class="sig">
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên A</div><div style="font-size:11px;color:#475569;margin-top:3px">${q.client_name||'Client'}</div><br><br><br><div style="font-size:10px;color:#94A3B8">(Ký, ghi rõ họ tên)</div></div>
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên B</div><div style="font-size:11px;color:#475569;margin-top:3px">CÔNG TY TNHH QUẢNG CÁO K&K</div><br><br><br><div style="font-size:12px;font-weight:700">TÔ NGUYỄN ĐĂNG KHOA</div><div style="font-size:10px;color:#94A3B8">Giám Đốc</div></div>
    </div>
    <div class="footer">K&K Advertising | 737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM | MST: 0317776715 | ĐT: 0938 223 668 | contact@weareknk.com</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(),600)
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:860,maxWidth:'97vw',maxHeight:'93vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.18)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Preview: {q.quote_code}</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={printQuote} style={{padding:'8px 18px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>In / Export PDF</button>
            <button onClick={printQuoteClient} style={{padding:'8px 18px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#059669,#10B981)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(5,150,105,0.25)'}}>In (Client)</button>
            <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
          </div>
        </div>

        {/* Preview content */}
        <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.12)',borderRadius:14,padding:'24px 28px',fontFamily:'Arial,sans-serif',fontSize:12,color:'#0F172A'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,paddingBottom:14,borderBottom:'3px solid #1A56DB'}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:'#1A56DB'}}>K&K <span style={{color:'#06B6D4'}}>advertising</span></div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>Creative & KOL Marketing Agency</div>
            </div>
            <div style={{fontSize:10,color:'#475569',textAlign:'right',lineHeight:1.7}}>
              CÔNG TY TNHH QUẢNG CÁO K&K<br/>737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM<br/>MST: 0317776715 | 0938 223 668
            </div>
          </div>
          <div style={{textAlign:'center',marginBottom:18}}>
            <div style={{fontSize:18,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.05em'}}>BÁO GIÁ DỊCH VỤ</div>
            <div style={{fontSize:11,color:'#94A3B8',marginTop:4}}>Số: {q.quote_code}</div>
          </div>

          {/* Items table preview */}
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:16,fontSize:11}}>
            <thead style={{background:'#0F172A'}}>
              <tr>{['STT','Mô tả','ĐV','SL','Giá gốc','Thuế','Markup','Giá bán','VAT','Thành tiền'].map(h=>(
                <th key={h} style={{padding:'7px 8px',color:'#fff',fontSize:9,textAlign:['Giá gốc','Markup','Giá bán','VAT','Thành tiền','SL'].includes(h)?'right':'left',letterSpacing:'0.04em'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {items.map((item,i)=>{
                const c=calcItem(item)
                return <tr key={i} style={{borderBottom:'1px solid #E2E8F0',background:i%2===0?'#fff':'#F8FAFF'}}>
                  <td style={{padding:'7px 8px',textAlign:'center',color:'#94A3B8'}}>{i+1}</td>
                  <td style={{padding:'7px 8px'}}>
                    <div style={{fontWeight:600}}>{item.source_name||item.description||'—'}</div>
                    {item.source_name&&item.description&&<div style={{fontSize:10,color:'#94A3B8'}}>{item.description}</div>}
                    <div style={{fontSize:9,color:item.tax_type==='PIT'?'#D97706':'#7C3AED',marginTop:2,fontWeight:600}}>{item.item_type}</div>
                  </td>
                  <td style={{padding:'7px 8px'}}>{item.unit}</td>
                  <td style={{padding:'7px 8px',textAlign:'right'}}>{item.qty}</td>
                  <td style={{padding:'7px 8px',textAlign:'right'}}>{vnd(Math.round(Number(item.base_price||0)))}</td>
                  <td style={{padding:'7px 8px',textAlign:'center',fontSize:9,color:item.tax_type==='PIT'?'#92400E':'#6D28D9'}}>{item.tax_type} {item.tax_rate}%</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:700,color:'#059669'}}>{item.markup!==''?item.markup+'%':'—'}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:700,color:'#1A56DB'}}>{vnd(Math.round(c.lineBeforeVAT))}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',color:'#7C3AED'}}>{item.tax_type==='VAT'&&item.tax_rate>0?vnd(Math.round(c.lineVAT)):'—'}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:800}}>{vnd(Math.round(c.lineTotal))}</td>
                </tr>
              })}
            </tbody>
          </table>

          {/* 3-row totals */}
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
            <div style={{width:360,background:'#F8FAFF',borderRadius:10,padding:'16px 18px',border:'1px solid #E2E8F0'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#475569',fontWeight:500}}>Tổng tiền trước thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#0F172A'}}>{vnd(Math.round(subtotalBeforeVAT))}</span>
              </div>
              {q.discount>0&&(
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#D97706',fontWeight:500}}>Chiết khấu ({q.discount}%)</span>
                  <span style={{fontSize:13,fontWeight:700,color:'#D97706'}}>- {vnd(Math.round(discountAmt))}</span>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#7C3AED',fontWeight:500}}>Thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#7C3AED'}}>{vnd(Math.round(totalVAT))}</span>
              </div>
              <div style={{height:2,background:'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99,margin:'10px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:14,fontWeight:900,color:'#0F172A'}}>Tổng tiền sau thuế VAT</span>
                <span style={{fontSize:18,fontWeight:900,color:'#1A56DB'}}>{vnd(Math.round(grandTotal))}</span>
              </div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:5,fontStyle:'italic',textAlign:'right'}}>{numWords(Math.round(grandTotal))}</div>
              {items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)&&(
                <div style={{marginTop:10,padding:'8px 10px',background:'rgba(217,119,6,0.08)',borderRadius:7,border:'1px solid rgba(217,119,6,0.2)',fontSize:10,color:'#92400E'}}>
                  💡 Thuế TNCN (PIT) đã gross-up vào giá bán. K&K khấu trừ nộp thay.
                </div>
              )}
            </div>
          </div>

          {q.notes&&<div style={{background:'#FFFBEB',border:'1px solid #FCD34D',borderRadius:8,padding:'12px 14px',fontSize:11,color:'#92400E',lineHeight:1.7,marginBottom:12}}>
            <strong>📋 Điều kiện & Ghi chú:</strong><br/>
            {q.notes.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}
          </div>}
        </div>

        <div style={{display:'flex',justifyContent:'space-between',marginTop:16,alignItems:'center'}}>
          <div style={{display:'flex',gap:6}}>
            {['Draft','Sent','Accepted','Rejected'].map(s=>(
              <button key={s} onClick={()=>onStatusChange(s)}
                style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${q.status===s?'#1A56DB':'rgba(26,86,219,0.15)'}`,background:q.status===s?'rgba(26,86,219,0.1)':'transparent',color:q.status===s?'#1A56DB':'#475569',cursor:'pointer',fontSize:11,fontWeight:q.status===s?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{padding:'7px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Đóng</button>
        </div>
      </div>
    </div>
  )
}


// ════════════════════════════════════════════════════════════
// PROJECT WORKFLOW MODULE — K&K Agency OS
// 10-Stage flexible workflow with approvals, tasks, KPI tracking
// ════════════════════════════════════════════════════════════

const STAGES = [
  { id:'LEAD',           label:'Lead',           icon:'01', color:'#94A3B8', desc:'Khách hàng tiềm năng' },
  { id:'BRIEF',          label:'Brief',          icon:'02', color:'#3B82F6', desc:'Tiếp nhận brief từ client' },
  { id:'PROPOSAL',       label:'Proposal',       icon:'03', color:'#8B5CF6', desc:'Lên ý tưởng, đề xuất' },
  { id:'PRICING',        label:'Pricing',        icon:'04', color:'#F59E0B', desc:'Định giá, P&L' },
  { id:'CONTRACT',       label:'Contract',       icon:'05', color:'#06B6D4', desc:'Ký hợp đồng' },
  { id:'PRE_PRODUCTION', label:'Pre-Production', icon:'06', color:'#6366F1', desc:'Chuẩn bị sản xuất' },
  { id:'EXECUTION',      label:'Execution',      icon:'07', color:'#10B981', desc:'Triển khai' },
  { id:'REPORTING',      label:'Reporting',      icon:'08', color:'#0891B2', desc:'Báo cáo kết quả' },
  { id:'PAYMENT',        label:'Payment',        icon:'09', color:'#059669', desc:'Thanh toán' },
  { id:'CLOSED',         label:'Closed',         icon:'10', color:'#1A56DB', desc:'Hoàn tất' },
]

// Tasks mặc định theo từng stage
const STAGE_TASKS = {
  LEAD: [
    { title:'Qualify lead', role:'AM', priority:'High', kpi_weight:3 },
    { title:'Ghi nhận thông tin client', role:'AM', priority:'Normal', kpi_weight:1 },
    { title:'Đưa vào Deal Pipeline', role:'AM', priority:'Normal', kpi_weight:1 },
  ],
  BRIEF: [
    { title:'Nhận brief từ client', role:'AM', priority:'High', kpi_weight:3 },
    { title:'Phân tích brief & objectives', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Họp nội bộ kick-off', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Clarify brief với client', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
  PROPOSAL: [
    { title:'Nghiên cứu thị trường & đối thủ', role:'Creative', priority:'Normal', kpi_weight:2 },
    { title:'Lên concept & ý tưởng', role:'Creative', priority:'High', kpi_weight:3 },
    { title:'Build proposal deck', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Internal review proposal', role:'Director', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Present proposal cho client', role:'AM', priority:'High', kpi_weight:3 },
  ],
  PRICING: [
    { title:'Lập danh sách KOL/resources', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Tính chi phí & P&L', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Finance duyệt P&L', role:'Finance', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Director duyệt pricing', role:'Director', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Tạo báo giá', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Gửi báo giá cho client', role:'AM', priority:'High', kpi_weight:2 },
  ],
  CONTRACT: [
    { title:'AM order hợp đồng', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Admin soạn hợp đồng', role:'Admin', priority:'High', kpi_weight:3 },
    { title:'Legal review hợp đồng', role:'Director', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Gửi hợp đồng cho client ký', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Nhận lại hợp đồng đã ký', role:'Admin', priority:'High', kpi_weight:2 },
    { title:'Lưu trữ hợp đồng', role:'Admin', priority:'Normal', kpi_weight:1 },
  ],
  PRE_PRODUCTION: [
    { title:'Assign KOL/team cho dự án', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Ký HĐ CTV với KOL', role:'Admin', priority:'High', kpi_weight:2 },
    { title:'Briefing KOL & team', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Duyệt kịch bản/concept', role:'PM', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Finance duyệt chi phí phát sinh', role:'Finance', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Chuẩn bị tài liệu & assets', role:'Creative', priority:'Normal', kpi_weight:2 },
    { title:'Setup tracking links', role:'Performance', priority:'Normal', kpi_weight:2 },
  ],
  EXECUTION: [
    { title:'KOL đăng content đúng lịch', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Monitor & seeding', role:'Performance', priority:'High', kpi_weight:3 },
    { title:'Daily check-in với KOL', role:'KOL Executive', priority:'Normal', kpi_weight:2 },
    { title:'Report tiến độ hàng ngày', role:'PM', priority:'Normal', kpi_weight:2 },
    { title:'Xử lý phát sinh', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Thu thập air links', role:'KOL Executive', priority:'High', kpi_weight:3 },
  ],
  REPORTING: [
    { title:'Thu thập số liệu & kết quả', role:'Performance', priority:'High', kpi_weight:3 },
    { title:'Phân tích KPIs campaign', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Tạo Biên bản nghiệm thu (BBNT)', role:'Admin', priority:'High', kpi_weight:3 },
    { title:'Client duyệt BBNT', role:'AM', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Build báo cáo tổng kết', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Present kết quả cho client', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
  PAYMENT: [
    { title:'Gửi hóa đơn VAT cho client', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Follow up công nợ', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Xác nhận thanh toán', role:'Finance', priority:'High', kpi_weight:2 },
    { title:'Thanh toán cho KOL/NCC', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Đối soát P&L thực tế', role:'Finance', priority:'High', kpi_weight:3 },
  ],
  CLOSED: [
    { title:'Lưu trữ hồ sơ dự án', role:'Admin', priority:'Normal', kpi_weight:1 },
    { title:'Cập nhật KPI team', role:'Director', priority:'Normal', kpi_weight:2 },
    { title:'Post-mortem review', role:'PM', priority:'Normal', kpi_weight:2 },
    { title:'Client feedback & satisfaction', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
}

const PRIORITY_COLOR = { Urgent:'#DC2626', High:'#F59E0B', Normal:'#1A56DB', Low:'#94A3B8' }
const TASK_STATUS_COLOR = { Todo:'#94A3B8', 'In Progress':'#1A56DB', Review:'#F59E0B', Done:'#059669', Blocked:'#DC2626' }
const APPROVAL_ROLES = { Finance:'#059669', Director:'#1A56DB', Admin:'#7C3AED', AM:'#F59E0B', PM:'#06B6D4' }

const MEMBER_COLORS = ['#4F8EF7','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#F97316','#EC4899','#14B8A6','#6366F1']
function getMemberColor(name) {
  if(!name) return '#94A3B8'
  let hash = 0
  for(let i=0; i<name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return MEMBER_COLORS[Math.abs(hash) % MEMBER_COLORS.length]
}

// ── NOTIFICATION HELPER ──────────────────────────────────
async function sendNotification(supabase, {recipient_email, recipient_name, type, title, message, data={}, send_email=false}) {
  await supabase.from('notifications').insert([{
    recipient_email, recipient_name, type, title, message, data, send_email, email_sent: false
  }])
}

// ══════════════════════════════════════════════════════════
// WORKFLOW PAGE — Project list với stages
// ══════════════════════════════════════════════════════════
function WorkflowPage({data, supabase, reload, log, currentUser}) {
  const [view, setView] = useState('board') // board | list
  const [filterStage, setFilterStage] = useState('')
  const [filterMember, setFilterMember] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [search, setSearch] = useState('')

  const projects = data.projects.filter(p => {
    if(search && !p.campaign?.toLowerCase().includes(search.toLowerCase()) && !p.client?.toLowerCase().includes(search.toLowerCase())) return false
    if(filterStage && (p.current_stage||'LEAD') !== filterStage) return false
    if(filterMember && p.pm !== filterMember) return false
    return true
  })

  const stageCount = {}
  STAGES.forEach(s => { stageCount[s.id] = data.projects.filter(p=>(p.current_stage||'LEAD')===s.id).length })

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A',letterSpacing:'-0.03em'}}>Project Workflow</h2>
          <div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{data.projects.length} dự án · {data.projects.filter(p=>p.current_stage==='EXECUTION').length} đang thực hiện</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm dự án..."
            style={{padding:'7px 12px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:9,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',width:200}}/>
          <select value={filterStage} onChange={e=>setFilterStage(e.target.value)}
            style={{padding:'7px 10px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:9,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none'}}>
            <option value="">Tất cả stages</option>
            {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div style={{display:'flex',background:'rgba(255,255,255,0.7)',borderRadius:9,border:'1px solid rgba(26,86,219,0.1)',overflow:'hidden'}}>
            {[['board','⊞'],['list','≡']].map(([v,icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:'7px 12px',border:'none',background:view===v?'linear-gradient(135deg,#1A56DB,#06B6D4)':'transparent',color:view===v?'#fff':'#94A3B8',cursor:'pointer',fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage pipeline overview */}
      <div style={{display:'flex',gap:0,marginBottom:20,background:'#FFFFFF',borderRadius:14,padding:'14px 16px',border:'1px solid #E2E8F0',overflowX:'auto'}}>
        {STAGES.map((s,i)=>(
          <div key={s.id} style={{display:'flex',alignItems:'center',flexShrink:0}}>
            <div onClick={()=>setFilterStage(filterStage===s.id?'':s.id)} style={{
              display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 14px',borderRadius:10,cursor:'pointer',
              background:filterStage===s.id?s.color+'20':'transparent',
              border:filterStage===s.id?`1.5px solid ${s.color}40`:'1.5px solid transparent',
              transition:'all 0.15s'
            }}>
              <div style={{fontSize:18,marginBottom:3}}>{s.icon}</div>
              <div style={{fontSize:10,fontWeight:700,color:filterStage===s.id?s.color:'#94A3B8',whiteSpace:'nowrap'}}>{s.label}</div>
              <div style={{fontSize:13,fontWeight:900,color:s.color,marginTop:2}}>{stageCount[s.id]||0}</div>
            </div>
            {i<STAGES.length-1&&<div style={{color:'#E2E8F0',fontSize:16,margin:'0 2px'}}>›</div>}
          </div>
        ))}
      </div>

      {/* Board view */}
      {view==='board'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
          {projects.map(p=>(
            <ProjectCard key={p.id} project={p} data={data} onClick={()=>setSelectedProject(p)}/>
          ))}
          {!projects.length&&(
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'#94A3B8',fontSize:13}}>
              Không có dự án nào
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {view==='list'&&(
        <div style={{background:'#FFFFFF',borderRadius:14,overflow:'auto',border:'1px solid #E2E8F0'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr>
                {['Project','Client','Stage','PM','Priority','Progress','Deadline',''].map(h=>(
                  <th key={h} style={{padding:'10px 14px',fontSize:10,fontWeight:800,color:'#374151',borderBottom:'1px solid #E2E8F0',textAlign:'left',background:'#F1F5F9',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p=>{
                const stage = STAGES.find(s=>s.id===(p.current_stage||'LEAD'))
                const urgentStyle = p.is_urgent?{background:'rgba(239,68,68,0.04)'}:{}
                return <tr key={p.id} style={{borderBottom:'1px solid #F1F5F9',...urgentStyle}}>
                  <td style={{padding:'11px 14px'}}>
                    <div style={{fontWeight:700,fontSize:12.5,color:'#0F172A'}}>{p.campaign||'—'}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{p.project_code}</div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:12,color:'#94A3B8'}}>{p.client||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    <span style={{background:stage?.color+'18',color:stage?.color,padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,border:`1px solid ${stage?.color}25`}}>
                      {stage?.icon} {stage?.label}
                    </span>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:12,color:'#94A3B8'}}>{p.pm||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    {p.is_urgent&&<span style={{background:'rgba(239,68,68,0.1)',color:'#EF4444',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700}}>🔥 URGENT</span>}
                    {!p.is_urgent&&<span style={{background:'rgba(99,102,241,0.1)',color:'#6366F1',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:600}}>{p.priority||'Normal'}</span>}
                  </td>
                  <td style={{padding:'11px 14px'}}>
                    <StageProgress current={p.current_stage||'LEAD'}/>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:11,color:'#94A3B8'}}>{p.end_date||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    <button onClick={()=>setSelectedProject(p)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
                      Quản lý →
                    </button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project detail modal */}
      {selectedProject&&(
        <ProjectWorkflowDetail
          project={selectedProject}
          data={data}
          supabase={supabase}
          reload={reload}
          log={log}
          currentUser={currentUser}
          onClose={()=>setSelectedProject(null)}
          onUpdate={(updated)=>setSelectedProject(updated)}
        />
      )}
    </div>
  )
}

// ── STAGE PROGRESS BAR ───────────────────────────────────
function StageProgress({current}) {
  const idx = STAGES.findIndex(s=>s.id===current)
  const pct = Math.round((idx+1)/STAGES.length*100)
  const stage = STAGES[idx]||STAGES[0]
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{flex:1,height:6,background:'rgba(26,86,219,0.08)',borderRadius:99,overflow:'hidden',minWidth:80}}>
        <div style={{height:'100%',width:pct+'%',background:`linear-gradient(90deg,#1A56DB,${stage.color})`,borderRadius:99,transition:'width 0.3s'}}/>
      </div>
      <span style={{fontSize:10,fontWeight:700,color:'#94A3B8',minWidth:28}}>{pct}%</span>
    </div>
  )
}

// ── PROJECT CARD ─────────────────────────────────────────
function ProjectCard({project:p, data, onClick}) {
  const stage = STAGES.find(s=>s.id===(p.current_stage||'LEAD'))||STAGES[0]
  const idx = STAGES.findIndex(s=>s.id===(p.current_stage||'LEAD'))
  const pct = Math.round((idx+1)/STAGES.length*100)

  return (
    <div onClick={onClick} style={{
      background:'rgba(255,255,255,0.92)',border:`1px solid ${stage.color}25`,
      borderRadius:16,padding:'18px 20px',cursor:'pointer',
      boxShadow:`0 2px 12px ${stage.color}12`,
      transition:'transform 0.15s, box-shadow 0.15s',
      position:'relative',overflow:'hidden'
    }}>
      {p.is_urgent&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#DC2626,#F59E0B)'}}/>}
      {!p.is_urgent&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,#1A56DB,${stage.color})`}}/>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
        <div style={{flex:1,minWidth:0,marginRight:8}}>
          <div style={{fontWeight:800,fontSize:13,color:'#0F172A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.campaign||'Untitled'}</div>
          <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>{p.client||'—'} · {p.project_code||'—'}</div>
        </div>
        <div style={{flexShrink:0}}>
          <span style={{background:stage.color+'18',color:stage.color,padding:'3px 9px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${stage.color}25`,whiteSpace:'nowrap'}}>
            {stage.icon} {stage.label}
          </span>
        </div>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
        {p.is_urgent&&<span style={{background:'rgba(220,38,38,0.1)',color:'#DC2626',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700}}>🔥 URGENT</span>}
        {p.pm&&<span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:600}}>👤 {p.pm}</span>}
        {p.service&&<span style={{background:'rgba(124,58,237,0.08)',color:'#7C3AED',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:600}}>{p.service}</span>}
      </div>

      <div style={{marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#94A3B8',marginBottom:4}}>
          <span>Progress</span><span style={{fontWeight:700,color:stage.color}}>{pct}%</span>
        </div>
        <div style={{height:6,background:'rgba(26,86,219,0.07)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:pct+'%',background:`linear-gradient(90deg,#1A56DB,${stage.color})`,borderRadius:99}}/>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
        <span style={{color:'#94A3B8'}}>Revenue: <strong style={{color:'#0F172A'}}>{p.revenue?Number(p.revenue).toLocaleString('vi-VN'):'—'}</strong></span>
        {p.end_date&&<span style={{color:new Date(p.end_date)<new Date()?'#DC2626':'#94A3B8'}}>📅 {p.end_date}</span>}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PROJECT WORKFLOW DETAIL — Full management view
// ══════════════════════════════════════════════════════════
function ProjectWorkflowDetail({project, data, supabase, reload, log, currentUser, onClose, onUpdate}) {
  const [tasks, setTasks] = useState([])
  const [approvals, setApprovals] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [showStageChange, setShowStageChange] = useState(false)
  const [pendingStageChange, setPendingStageChange] = useState(null)
  const [viewingStage, setViewingStage] = useState(project.current_stage||'LEAD')
  const [notifications, setNotifications] = useState([])
  const [taskDetail, setTaskDetail] = useState(null)
  const [taskComments, setTaskComments] = useState([])
  const [quotations, setQuotations] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [viewQuote, setViewQuote] = useState(null)
  const [incompleteTasks, setIncompleteTasks] = useState(null)

  async function openTaskDetail(task) {
    setTaskDetail(task)
    const {data:cdata} = await supabase.from('task_comments').select('*').eq('task_id',task.id).order('created_at',{ascending:true})
    setTaskComments(cdata||[])
  }

  useEffect(()=>{ loadData() },[project.id])

  async function loadData() {
    setLoading(true)
    const [t, a, n, q, al] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', project.id).order('created_at'),
      supabase.from('stage_approvals').select('*').eq('project_id', project.id).order('created_at',{ascending:false}),
      supabase.from('notifications').select('*').eq('data->>project_id', project.id).order('created_at',{ascending:false}).limit(20),
      supabase.from('quotations').select('*').eq('project_id', project.id).order('created_at',{ascending:false}),
      supabase.from('audit_log').select('*').ilike('message','%'+project.id+'%').order('created_at',{ascending:false}).limit(50),
    ])
    setTasks(t.data||[])
    setApprovals(a.data||[])
    setNotifications(n.data||[])
    setQuotations(q.data||[])
    setAuditLog(al.data||[])
    setLoading(false)
  }

  async function initStageTasks(stage) {
    const defaultTasks = STAGE_TASKS[stage]||[]
    const existing = tasks.filter(t=>t.stage===stage)
    if(existing.length > 0) return // already initialized

    const newTasks = defaultTasks.map(t=>({
      project_id: project.id,
      stage,
      title: t.title,
      task_type: t.requires_approval?'approval':'task',
      assigned_to: '', // will be assigned manually
      priority: t.priority||'Normal',
      status: 'Todo',
      requires_approval: t.requires_approval||false,
      kpi_weight: t.kpi_weight||1,
    }))
    if(newTasks.length) await supabase.from('tasks').insert(newTasks)
    await loadData()
  }

  async function changeStage(newStage, force=false) {
    // Check if required approvals are done
    const currentStage = project.current_stage||'LEAD'
    const pendingApprovalsList = approvals.filter(a=>a.stage===currentStage&&a.status==='Pending')
    if(pendingApprovalsList.length > 0) {
      alert(`⚠️ Còn ${pendingApprovalsList.length} approval chưa được xử lý ở stage hiện tại!`)
      setPendingStageChange(null)
      return
    }

    // Check incomplete tasks (unless force=true)
    if(!force) {
      const undoneTasks = tasks.filter(t=>t.stage===currentStage&&t.status!=='Done')
      if(undoneTasks.length > 0) {
        setIncompleteTasks({tasks: undoneTasks, targetStage: newStage})
        return
      }
    }

    // Special checks
    if(newStage==='EXECUTION') {
      const plApproved = approvals.some(a=>a.stage==='PRICING'&&a.approval_type==='PL_FINANCE'&&a.status==='Approved')
      const dirApproved = approvals.some(a=>a.stage==='PRICING'&&a.approval_type==='DIRECTOR'&&a.status==='Approved')
      if(!plApproved||!dirApproved) {
        alert('⚠️ Cần Finance duyệt P&L và Director duyệt trước khi vào EXECUTION!')
        setPendingStageChange(null)
        return
      }
    }

    await supabase.from('projects').update({
      current_stage: newStage,
      stage_history: [...(project.stage_history||[]), {stage:currentStage, completed_at:new Date().toISOString(), moved_by:currentUser?.name}]
    }).eq('id', project.id)

    // Audit log
    await supabase.from('audit_log').insert([{
      message: `[${project.id}] Stage changed: ${currentStage} → ${newStage} | project: ${project.campaign}`,
      role: currentUser?.name||'User',
      entity_type:'project', entity_id:project.id, entity_name:project.campaign,
      action:'stage_changed', changes_json:{from:currentStage,to:newStage,forced:force}
    }])

    await initStageTasks(newStage)
    const updated = {...project, current_stage:newStage}
    onUpdate(updated)
    setViewingStage(newStage)
    log(`Stage: ${project.campaign} → ${newStage}`)
    setShowStageChange(false)
    setPendingStageChange(null)
    setIncompleteTasks(null)
    await loadData()
  }

  async function saveTask(taskData) {
    if(editTask) {
      await supabase.from('tasks').update(taskData).eq('id', editTask.id)
    } else {
      await supabase.from('tasks').insert([{...taskData, project_id:project.id, stage:viewingStage}])
    }
    // Send notification if assigned
    if(taskData.assigned_to && taskData.assigned_to !== editTask?.assigned_to) {
      let recipientEmail = data.team.find(m=>m.name===taskData.assigned_to)?.email
      if(!recipientEmail) {
        const {data:acct} = await supabase.from('team_accounts').select('email').eq('name',taskData.assigned_to).single()
        recipientEmail = acct?.email
      }
      if(recipientEmail) {
        await sendNotification(supabase, {
          recipient_email: recipientEmail,
          recipient_name: taskData.assigned_to,
          type: 'TASK_ASSIGNED',
          title: `Task mới được assign: ${taskData.title}`,
          message: `Bạn được assign task "${taskData.title}" trong dự án "${project.campaign}". Deadline: ${taskData.due_date||'Chưa có'}`,
          data: {project_id:project.id, task_title:taskData.title},
          send_email: true
        })
      }
    }
    setEditTask(null); setShowTaskForm(false)
    await loadData()
    log(`Task: ${taskData.title}`)
  }

  async function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t=>t.id===taskId)
    const oldStatus = task?.status||'Todo'
    const updates = {status:newStatus}
    if(newStatus==='Done') updates.completed_at = new Date().toISOString()
    if(newStatus==='Done' && task?.due_date) {
      const due = new Date(task.due_date)
      const now = new Date()
      if(now > due) updates.late_minutes = Math.round((now-due)/60000)
    }
    await supabase.from('tasks').update(updates).eq('id', taskId)
    // Audit
    await supabase.from('audit_log').insert([{
      message: `[${project.id}] Task "${task?.title}" status: ${oldStatus} → ${newStatus} | project: ${project.campaign}`,
      role: currentUser?.name||'User',
      entity_type:'task', entity_id:taskId, entity_name:task?.title||'',
      action:'task_status_changed', changes_json:{from:oldStatus,to:newStatus}
    }])
    await loadData()
  }

  async function requestApproval(type, stage, data_payload={}) {
    const existing = approvals.find(a=>a.stage===stage&&a.approval_type===type&&a.status==='Pending')
    if(existing) { alert('Approval này đang chờ xử lý!'); return }

    await supabase.from('stage_approvals').insert([{
      project_id: project.id,
      stage, approval_type: type,
      requested_by: currentUser?.name,
      required_role: type==='PL_FINANCE'?'Finance':'Director',
      status: 'Pending',
      data: data_payload
    }])
    await loadData()
    log(`Gửi approval ${type}: ${project.campaign}`)
  }

  async function resolveApproval(approvalId, approved, comment='') {
    await supabase.from('stage_approvals').update({
      status: approved?'Approved':'Rejected',
      reviewed_by: currentUser?.name,
      reviewed_at: new Date().toISOString(),
      comment
    }).eq('id', approvalId)
    await loadData()
    log(`${approved?'Approved':'Rejected'} approval: ${project.campaign}`)
  }

  const currentStageData = STAGES.find(s=>s.id===(project.current_stage||'LEAD'))||STAGES[0]
  const currentStageIdx = STAGES.findIndex(s=>s.id===(project.current_stage||'LEAD'))
  const viewingStageData = STAGES.find(s=>s.id===viewingStage)||STAGES[0]
  const viewingStageIdx = STAGES.findIndex(s=>s.id===viewingStage)
  const isViewingPastStage = viewingStageIdx < currentStageIdx
  const stageTasks = tasks.filter(t=>t.stage===viewingStage)
  const doneTasks = stageTasks.filter(t=>t.status==='Done').length
  const stageCompletion = stageTasks.length ? Math.round(doneTasks/stageTasks.length*100) : 0
  const pendingApprovals = approvals.filter(a=>a.status==='Pending')

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',display:'flex',alignItems:'stretch',justifyContent:'flex-end',zIndex:2000,backdropFilter:'blur(4px)'}}>
      <div style={{width:'85vw',maxWidth:1100,background:'#F0F4FF',overflowY:'auto',display:'flex',flexDirection:'column',boxShadow:'-20px 0 60px rgba(0,0,0,0.2)'}}>

        {/* Viewing past stage banner */}
        {viewingStage !== (project.current_stage||'LEAD') && (
          <div style={{background:'rgba(245,158,11,0.15)',borderBottom:'1px solid rgba(245,158,11,0.3)',padding:'8px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:600,color:'#92400E'}}>👁 Đang xem: <strong>{viewingStageData.label}</strong> (stage cũ)</span>
            <button onClick={()=>setViewingStage(project.current_stage||'LEAD')} style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(245,158,11,0.4)',background:'rgba(245,158,11,0.1)',color:'#92400E',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Về stage hiện tại ({currentStageData.label})</button>
          </div>
        )}

        {/* Project header */}
        <div style={{background:`linear-gradient(135deg,#0F172A,${currentStageData.color}88)`,padding:'24px 28px',position:'relative',overflow:'hidden',flexShrink:0}}>
          <div style={{position:'absolute',top:-30,right:-30,width:150,height:150,borderRadius:'50%',background:'#F8FAFF'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',position:'relative'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <span style={{background:currentStageData.color+'30',color:currentStageData.color,padding:'4px 12px',borderRadius:99,fontSize:11,fontWeight:700,border:`1px solid ${currentStageData.color}40`}}>
                  {currentStageData.icon} {currentStageData.label}
                </span>
                {project.is_urgent&&<span style={{background:'rgba(220,38,38,0.3)',color:'#FCA5A5',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700}}>🔥 URGENT</span>}
                {pendingApprovals.length>0&&<span style={{background:'rgba(245,158,11,0.3)',color:'#FCD34D',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700}}>{pendingApprovals.length} pending approval</span>}
              </div>
              <div style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.03em',marginBottom:4}}>{project.campaign||'Untitled Project'}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.6)'}}>{project.client} · {project.project_code} · PM: {project.pm||'—'}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setShowStageChange(true)} style={{padding:'8px 16px',borderRadius:9,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                Chuyển Stage →
              </button>
              <button onClick={onClose} style={{padding:'8px 16px',borderRadius:9,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'#fff',cursor:'pointer',fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>✕ Đóng</button>
            </div>
          </div>

          {/* Stage progress timeline — click to view that stage */}
          <div style={{display:'flex',alignItems:'center',marginTop:18,gap:0}}>
            {STAGES.map((s,i)=>(
              <div key={s.id} style={{display:'flex',alignItems:'center',flex:i<STAGES.length-1?1:'auto'}}>
                <div onClick={()=>{ if(i<=currentStageIdx) setViewingStage(s.id) }} style={{
                  width:28,height:28,borderRadius:'50%',flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,
                  background:s.id===viewingStage?'rgba(255,255,255,0.9)':(i<currentStageIdx?'#059669':i===currentStageIdx?currentStageData.color:'rgba(255,255,255,0.15)'),
                  border:s.id===viewingStage?`2px solid #fff`:(i===currentStageIdx?`2px solid ${currentStageData.color}`:'2px solid transparent'),
                  boxShadow:s.id===viewingStage?'0 0 12px rgba(255,255,255,0.6)':(i===currentStageIdx?`0 0 10px ${currentStageData.color}80`:'none'),
                  cursor:i<=currentStageIdx?'pointer':'default',
                  color:s.id===viewingStage?currentStageData.color:'inherit',
                  fontWeight:s.id===viewingStage?900:400,
                  transition:'all 0.15s',
                }} title={i<=currentStageIdx?`Xem stage: ${s.label}`:(s.label+' — chưa đến')}>
                  {(()=>{
                    const stageTasks = tasks.filter(t=>t.stage===s.id)
                    if(i>currentStageIdx) return <span style={{fontSize:10,opacity:0.5}}>{s.icon}</span>
                    if(stageTasks.length===0) return i===currentStageIdx?s.icon:'✓'
                    const allDone = stageTasks.every(t=>t.status==='Done')
                    const today = new Date().toISOString().slice(0,10)
                    const hasOverdue = stageTasks.some(t=>t.status!=='Done'&&t.due_date&&t.due_date<today)
                    const anyInProgress = stageTasks.some(t=>t.status==='In Progress'||t.status==='Review')
                    if(allDone) return <span style={{color:'#10B981',fontSize:14}}>✓</span>
                    if(hasOverdue) return <span style={{fontSize:14}}>🔴</span>
                    if(anyInProgress) return <span style={{fontSize:12}}>🟡</span>
                    return <span style={{fontSize:12}}>⚪</span>
                  })()}
                </div>
                {i<STAGES.length-1&&<div style={{flex:1,height:2,background:i<currentStageIdx?'#059669':'rgba(255,255,255,0.1)',margin:'0 2px'}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:'rgba(255,255,255,0.7)',borderBottom:'1px solid rgba(26,86,219,0.1)',padding:'0 28px',display:'flex',gap:0,flexShrink:0}}>
          {[['overview','Tổng quan'],['tasks','Tasks'],['approvals','Approvals'],['quotations','Báo giá'],['kpi','KPIs'],['history','Lịch sử']].map(([id,label])=>(
            <button key={id} onClick={()=>setActiveTab(id)} style={{
              padding:'12px 18px',border:'none',background:'transparent',cursor:'pointer',
              fontSize:12,fontWeight:activeTab===id?700:500,
              color:activeTab===id?'#1A56DB':'#94A3B8',
              borderBottom:activeTab===id?'2px solid #1A56DB':'2px solid transparent',
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              position:'relative'
            }}>
              {label}
              {id==='approvals'&&pendingApprovals.length>0&&(
                <span style={{position:'absolute',top:8,right:8,background:'#DC2626',color:'#fff',fontSize:9,padding:'1px 5px',borderRadius:99,fontWeight:700}}>{pendingApprovals.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,padding:'24px 28px',overflowY:'auto'}}>
          {loading&&<div style={{textAlign:'center',padding:60,color:'#94A3B8'}}>Đang tải...</div>}

          {/* OVERVIEW TAB */}
          {!loading&&activeTab==='overview'&&(
            <div>
              {/* Quick action buttons */}
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                <button onClick={()=>{
                  const client=data.clients.find(c=>c.name===project.client)
                  const kolList=(project.kols||[]).map(kn=>{const k=data.kols.find(x=>x.name===kn);return{name:kn,tiktok:k?.tiktok_url||'',work:'Sản xuất 1 video theo yêu cầu của nhãn hàng',fee:k?.pricing?.length?Math.min(...k.pricing.map(p=>Number(p.amount||0))):Number(k?.rate||0)}})
                  window.dispatchEvent(new CustomEvent('navigate',{detail:{page:'contracts',prefill:{party_a_name:project.client,party_a_tax:client?.tax_code||'',party_a_address:client?.address||'',party_a_rep:client?.legal_rep||'',party_a_bank_account:client?.bank_account||'',party_a_bank_name:client?.bank_name||'',project_id:project.id,service_type:project.service||'KOL/KOC',kol_list:kolList,scope_of_work:project.brief||'',start_date:project.start_date||'',notes:`Ordered from project: ${project.campaign}`,_project_campaign:project.campaign}}}))
                }} style={{padding:'7px 14px',borderRadius:8,border:'1px solid rgba(59,130,246,0.25)',background:'rgba(59,130,246,0.08)',color:'#3B82F6',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>📄 Order Hợp đồng</button>
                <button onClick={()=>{
                  const deliverables=(project.kols||[]).map((kn,i)=>({stt:i+1,name:kn,link:'',result:'Hoàn thành 100%'}))
                  window.dispatchEvent(new CustomEvent('navigate',{detail:{page:'bbnt',prefill:{project_id:project.id,actual_start_date:project.start_date||'',actual_end_date:project.end_date||'',deliverables,_project_campaign:project.campaign}}}))
                }} style={{padding:'7px 14px',borderRadius:8,border:'1px solid rgba(16,185,129,0.25)',background:'rgba(16,185,129,0.08)',color:'#10B981',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>✅ Order BBNT</button>
              </div>
              {/* KPI cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:20}}>
                {[
                  ['Đang xem stage',viewingStageData.label+' ('+Math.round((viewingStageIdx+1)/STAGES.length*100)+'%)',isViewingPastStage?'Stage đã hoàn thành':'Stage hiện tại',viewingStageData.color],
                  ['Tasks stage này',`${doneTasks}/${stageTasks.length} done (${stageCompletion}%)`,stageTasks.filter(t=>t.status==='In Progress').length+' đang làm','#1A56DB'],
                  ['Pending approvals',pendingApprovals.length,pendingApprovals.length?'Cần xử lý':'OK ✓',pendingApprovals.length?'#DC2626':'#059669'],
                  ['Revenue',project.revenue?Number(project.revenue).toLocaleString('vi-VN'):'—','VND','#059669'],
                ].map(([l,v,s,c])=>(
                  <div key={l} style={{background:'#FFFFFF',borderRadius:12,padding:'14px 16px',border:`1px solid #E2E8F0`,borderTop:`2px solid ${c}`}}>
                    <div style={{fontSize:10,fontWeight:700,color:c,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:900,color:'#0F172A'}}>{v}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:3}}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Stage tasks summary */}
              <div style={{background:'#FFFFFF',borderRadius:14,padding:'18px 20px',marginBottom:16,border:'1px solid #E2E8F0'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Tasks — {viewingStageData.label}{isViewingPastStage&&<span style={{fontSize:10,color:'#10B981',marginLeft:8,fontWeight:600}}>✓ Đã hoàn thành</span>}</div>
                  <div style={{display:'flex',gap:8}}>
                    {!isViewingPastStage && stageTasks.length===0&&(
                      <button onClick={()=>initStageTasks(viewingStage)} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                        ⚡ Khởi tạo tasks cho stage này
                      </button>
                    )}
                    {!isViewingPastStage&&<button onClick={()=>{setEditTask(null);setShowTaskForm(true)}} style={{padding:'6px 14px',borderRadius:8,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                      + Task
                    </button>}
                  </div>
                </div>
                {stageTasks.slice(0,5).map(t=><TaskRow key={t.id} task={t} onStatusChange={isViewingPastStage?()=>{}:updateTaskStatus} onEdit={()=>openTaskDetail(t)} readOnly={isViewingPastStage}/>)}
                {stageTasks.length>5&&<div style={{fontSize:11,color:'#94A3B8',textAlign:'center',marginTop:8,cursor:'pointer'}} onClick={()=>setActiveTab('tasks')}>+ {stageTasks.length-5} tasks khác → Xem tất cả</div>}
                {!stageTasks.length&&<div style={{textAlign:'center',padding:'20px 0',color:'#94A3B8',fontSize:12}}>{isViewingPastStage?'Không có tasks nào ở stage này.':'Chưa có tasks. Click "Khởi tạo tasks" để tạo tự động.'}</div>}
              </div>

              {/* Required approvals for current stage */}
              <ApprovalPanel
                project={project} stage={viewingStage}
                approvals={approvals} currentUser={currentUser}
                onRequest={isViewingPastStage?()=>{}:requestApproval} onResolve={isViewingPastStage?()=>{}:resolveApproval}
              />

              {/* Báo giá liên quan */}
              {quotations.length>0&&(
                <div style={{background:'#FFFFFF',borderRadius:12,padding:'14px 16px',border:'1px solid rgba(26,86,219,0.12)',marginTop:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <div style={{fontSize:12,fontWeight:800,color:'#0F172A'}}>💰 Báo giá liên quan ({quotations.length})</div>
                    <button onClick={()=>setActiveTab('quotations')} style={{fontSize:11,color:'#1A56DB',background:'none',border:'none',cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xem tất cả →</button>
                  </div>
                  <div style={{display:'flex',gap:12}}>
                    <div><div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase'}}>Tổng giá trị</div><div style={{fontSize:14,fontWeight:900,color:'#1A56DB'}}>{vnd(quotations.reduce((a,q)=>a+Number(q.total||0),0))}</div></div>
                    <div><div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase'}}>Đã gửi</div><div style={{fontSize:14,fontWeight:900,color:'#F59E0B'}}>{quotations.filter(q=>q.status==='Sent'||q.status==='Accepted').length}</div></div>
                    <div><div style={{fontSize:9,fontWeight:700,color:'#94A3B8',textTransform:'uppercase'}}>Chấp thuận</div><div style={{fontSize:14,fontWeight:900,color:'#10B981'}}>{quotations.filter(q=>q.status==='Accepted').length}</div></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TASKS TAB */}
          {!loading&&activeTab==='tasks'&&(
            <TasksTab
              tasks={tasks} project={project} data={data}
              onStatusChange={updateTaskStatus}
              onEdit={(t)=>{setEditTask(t);setShowTaskForm(true)}}
              onAdd={()=>{setEditTask(null);setShowTaskForm(true)}}
              onInit={()=>initStageTasks(viewingStage)}
              currentStage={viewingStage}
            />
          )}

          {/* APPROVALS TAB */}
          {!loading&&activeTab==='approvals'&&(
            <ApprovalsTab
              approvals={approvals} project={project} currentUser={currentUser}
              onRequest={requestApproval} onResolve={resolveApproval}
            />
          )}

          {/* QUOTATIONS TAB */}
          {!loading&&activeTab==='quotations'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Báo giá dự án</div>
                <button onClick={()=>setShowQuoteForm(true)} style={{padding:'7px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Tạo báo giá mới</button>
              </div>
              {quotations.length===0&&<div style={{textAlign:'center',padding:'28px 0',color:'#94A3B8',fontSize:12}}>Chưa có báo giá nào cho dự án này.</div>}
              {quotations.map(q=>(
                <div key={q.id} style={{background:'#FFFFFF',borderRadius:12,padding:'14px 16px',marginBottom:8,border:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:800,color:'#1A56DB'}}>{q.quote_code}</div>
                    <div style={{fontSize:11,color:'#475569',marginTop:2}}>{q.client_name} · {q.campaign_name||'—'}</div>
                    <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>{q.created_at?.slice(0,10)}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:900,color:'#0F172A'}}>{vnd(q.total)}</div>
                  <span style={{padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,background:q.status==='Accepted'?'rgba(16,185,129,0.1)':q.status==='Draft'?'rgba(148,163,184,0.1)':'rgba(245,158,11,0.1)',color:q.status==='Accepted'?'#10B981':q.status==='Draft'?'#94A3B8':'#F59E0B'}}>{q.status}</span>
                  <button onClick={()=>setViewQuote(q)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid #E2E8F0',background:'#F8FAFC',color:'#374151',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xem</button>
                </div>
              ))}
            </div>
          )}

          {/* KPI TAB */}
          {!loading&&activeTab==='kpi'&&(
            <KPITab tasks={tasks} project={project} data={data}/>
          )}

          {/* HISTORY TAB */}
          {!loading&&activeTab==='history'&&(
            <div>
              <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:14}}>📋 Lịch sử thay đổi</div>
              {auditLog.length===0&&<div style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có lịch sử nào</div>}
              {auditLog.map((entry,i)=>{
                const actionColor={stage_changed:'#1A56DB',task_status_changed:'#10B981',contract_created:'#7C3AED',quote_created:'#F59E0B'}[entry.action]||'#94A3B8'
                const actionIcon={stage_changed:'🔄',task_status_changed:'✅',contract_created:'📄',quote_created:'💰'}[entry.action]||'📝'
                return <div key={entry.id||i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #F1F5F9'}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:actionColor+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{actionIcon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:'#0F172A'}}>{entry.role||'System'}</div>
                    <div style={{fontSize:11,color:'#64748B',marginTop:2}}>{entry.message?.split('|').pop()?.trim()||entry.message}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>{entry.created_at?new Date(entry.created_at).toLocaleString('vi-VN'):''}</div>
                  </div>
                </div>
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stage change modal */}
      {showStageChange&&(
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#FFFFFF',borderRadius:18,padding:'24px 28px',width:480,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,0.5)',border:'1px solid #E2E8F0'}}>
            <div style={{fontSize:15,fontWeight:800,color:'#0F172A',marginBottom:16}}>Chuyển Stage dự án</div>
            {!pendingStageChange ? (
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                  {STAGES.map((s,i)=>{
                    const isCurrent = s.id===(project.current_stage||'LEAD')
                    const isPrev = i < STAGES.findIndex(st=>st.id===(project.current_stage||'LEAD'))
                    return <button key={s.id} onClick={()=>!isCurrent&&setPendingStageChange(s)}
                      disabled={isCurrent}
                      style={{
                        padding:'10px 12px',borderRadius:10,border:`1.5px solid ${isCurrent?s.color:isPrev?'rgba(5,150,105,0.3)':'#E2E8F0'}`,
                        background:isCurrent?s.color+'18':isPrev?'rgba(5,150,105,0.06)':'#F8FAFF',
                        color:isCurrent?s.color:isPrev?'#059669':'#94A3B8',
                        cursor:isCurrent?'default':'pointer',
                        fontSize:12,fontWeight:isCurrent?700:500,
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                        textAlign:'left',
                      }}>
                      <span style={{marginRight:6}}>{s.icon}</span>{s.label}
                      {isCurrent&&<span style={{marginLeft:6,fontSize:10,opacity:0.7}}>(hiện tại)</span>}
                    </button>
                  })}
                </div>
                <div style={{padding:'10px 14px',background:'rgba(245,158,11,0.08)',borderRadius:8,border:'1px solid rgba(245,158,11,0.25)',fontSize:11,color:'#F59E0B',marginBottom:14}}>
                  ⚠️ Vào EXECUTION cần Finance & Director đã approve P&L. Vào PAYMENT cần có BBNT.
                </div>
                <button onClick={()=>setShowStageChange(false)} style={{width:'100%',padding:'9px',borderRadius:9,border:'1.5px solid #E2E8F0',background:'#F8FAFC',color:'#64748B',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
              </>
            ) : (
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#0F172A',marginBottom:8}}>Xác nhận chuyển stage</div>
                <div style={{background:'rgba(99,102,241,0.06)',borderRadius:10,padding:'14px 16px',marginBottom:16,fontSize:13,color:'#1F2937'}}>
                  Bạn có chắc muốn chuyển dự án <strong>"{project.campaign}"</strong> sang stage <strong>{pendingStageChange.icon} {pendingStageChange.label}</strong>?
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setPendingStageChange(null)} style={{flex:1,padding:'9px',borderRadius:9,border:'1.5px solid #E2E8F0',background:'#F8FAFC',color:'#64748B',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>← Quay lại</button>
                  <button onClick={()=>changeStage(pendingStageChange.id)} style={{flex:1,padding:'9px',borderRadius:9,border:'none',background:`linear-gradient(135deg,${pendingStageChange.color},${pendingStageChange.color}cc)`,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xác nhận chuyển</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task form */}
      {showTaskForm&&(
        <TaskForm
          task={editTask} project={project} data={data}
          onSave={saveTask}
          onClose={()=>{setShowTaskForm(false);setEditTask(null)}}
          currentStage={viewingStage}
        />
      )}

      {taskDetail&&<TaskDetailPanel task={taskDetail} comments={taskComments} supabase={supabase} currentUser={currentUser} onClose={()=>setTaskDetail(null)} onUpdate={()=>{}}/>}

      {/* Incomplete tasks blocking modal */}
      {incompleteTasks&&(
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,background:'rgba(0,0,0,0.4)'}}>
          <div style={{background:'#FFFFFF',borderRadius:18,padding:'24px 28px',width:480,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',border:'1px solid #E2E8F0'}}>
            <div style={{fontSize:15,fontWeight:800,color:'#DC2626',marginBottom:8}}>⚠️ Tasks chưa hoàn thành</div>
            <div style={{fontSize:12,color:'#475569',marginBottom:12}}>Còn <strong>{incompleteTasks.tasks.length}</strong> task chưa Done trong stage hiện tại:</div>
            <div style={{maxHeight:180,overflowY:'auto',marginBottom:14}}>
              {incompleteTasks.tasks.map(t=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 10px',borderRadius:7,marginBottom:4,background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.12)'}}>
                  <span style={{fontSize:12,fontWeight:600,color:'#0F172A'}}>{t.title}</span>
                  <span style={{fontSize:10,color:'#94A3B8'}}>{t.assigned_to||'Unassigned'} · {t.status}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:'#64748B',marginBottom:14}}>Bạn có muốn tiếp tục chuyển sang <strong>{STAGES.find(s=>s.id===incompleteTasks.targetStage)?.label}</strong>?</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setIncompleteTasks(null)} style={{flex:1,padding:'9px',borderRadius:9,border:'1.5px solid #E2E8F0',background:'#F8FAFC',color:'#64748B',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Quay lại hoàn thành task</button>
              {(currentUser?.isMaster||(currentUser?.role||'').toLowerCase().includes('director'))&&(
                <button onClick={()=>{setShowStageChange(false);setPendingStageChange(null);changeStage(incompleteTasks.targetStage,true)}} style={{flex:1,padding:'9px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#DC2626,#EF4444)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Bắt buộc chuyển</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quotation form from project */}
      {showQuoteForm&&<QuotationForm data={data} supabase={supabase} edit={null} prefill={{project_id:project.id,client_name:project.client,campaign_name:project.campaign}} onClose={()=>setShowQuoteForm(false)} onSaved={()=>{loadData();setShowQuoteForm(false)}}/>}
      {viewQuote&&<QuotationPreview quote={viewQuote} onClose={()=>setViewQuote(null)} onStatusChange={async(status)=>{await supabase.from('quotations').update({status}).eq('id',viewQuote.id);loadData();setViewQuote({...viewQuote,status})}}/>}
    </div>
  )
}

// ── TASK ROW ─────────────────────────────────────────────
function TaskRow({task:t, onStatusChange, onEdit, readOnly}) {
  const isLate = t.due_date && new Date(t.due_date)<new Date() && t.status!=='Done'
  const memberColor = getMemberColor(t.assigned_to)
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #F1F5F9',opacity:readOnly?0.75:1,borderLeft:`3px solid ${memberColor}40`,paddingLeft:8}}>
      {readOnly
        ? <span style={{padding:'3px 10px',borderRadius:6,border:`1px solid ${TASK_STATUS_COLOR[t.status]||'#94A3B8'}30`,background:(TASK_STATUS_COLOR[t.status]||'#94A3B8')+'15',color:TASK_STATUS_COLOR[t.status]||'#94A3B8',fontSize:10,fontWeight:700,minWidth:60,textAlign:'center',display:'inline-block'}}>{t.status}</span>
        : <select value={t.status} onChange={e=>onStatusChange(t.id,e.target.value)}
            style={{padding:'3px 6px',borderRadius:6,border:`1px solid ${TASK_STATUS_COLOR[t.status]||'#94A3B8'}30`,background:(TASK_STATUS_COLOR[t.status]||'#94A3B8')+'15',color:TASK_STATUS_COLOR[t.status]||'#94A3B8',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            {['Todo','In Progress','Review','Done','Blocked'].map(s=><option key={s}>{s}</option>)}
          </select>
      }
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,color:t.status==='Done'?'#475569':'#CBD5E1',textDecoration:t.status==='Done'?'line-through':'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>
          {t.requires_approval&&<span style={{fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:4,background:'rgba(99,102,241,0.15)',color:'#6366F1',flexShrink:0}}>APR</span>}
          {t.priority==='Urgent'&&<span style={{width:5,height:5,borderRadius:'50%',background:'#EF4444',flexShrink:0,display:'inline-block'}}/>}
          {t.title}
        </div>
        <div style={{fontSize:10,color:'#475569',marginTop:1,display:'flex',alignItems:'center',gap:5}}>
          <span style={{width:14,height:14,borderRadius:'50%',background:memberColor,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:7,fontWeight:800,flexShrink:0}}>{(t.assigned_to||'?').charAt(0).toUpperCase()}</span>
          <span style={{color:memberColor,fontWeight:600}}>{t.assigned_to||'Unassigned'}</span>
          {t.due_date&&<span style={{marginLeft:4,color:isLate?'#EF4444':'#94A3B8'}}>{t.due_date}{isLate?' · Late':''}</span>}
        </div>
      </div>
      <span style={{background:(PRIORITY_COLOR[t.priority]||'#94A3B8')+'15',color:PRIORITY_COLOR[t.priority]||'#94A3B8',padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:700,flexShrink:0}}>{t.priority}</span>
      <button onClick={onEdit} style={{background:'none',border:'none',cursor:'pointer',color:'#94A3B8',fontSize:14,padding:'2px 6px',borderRadius:5}}>✎</button>
    </div>
  )
}

// ── TASK DETAIL PANEL ───────────────────────────────────
function TaskDetailPanel({task, comments, supabase, currentUser, onClose, onUpdate}) {
  const [newComment, setNewComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [localComments, setLocalComments] = useState(comments)

  useEffect(() => { setLocalComments(comments) }, [comments])

  async function addComment(e) {
    e.preventDefault()
    if(!newComment.trim()) return
    setSaving(true)
    const mentions = [...newComment.matchAll(/@(\w+)/g)].map(m=>m[1])
    const {data} = await supabase.from('task_comments').insert([{
      task_id: task.id,
      author_name: currentUser?.name || 'User',
      content: newComment,
      mentions: mentions
    }]).select()
    if(data) setLocalComments(p=>[...p, ...data])
    setNewComment('')
    setSaving(false)
  }

  const PRIORITY_COLOR = {'Urgent':'#EF4444','High':'#F59E0B','Medium':'#3B82F6','Low':'#10B981'}
  const TASK_STATUS_COLOR = {'Todo':'#94A3B8','In Progress':'#3B82F6','Review':'#F59E0B','Done':'#10B981','Blocked':'#EF4444'}
  const isLate = task.due_date && new Date(task.due_date)<new Date() && task.status!=='Done'

  return (
    <>
      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',zIndex:2100}} onClick={onClose}/>
      <div style={{position:'fixed',top:0,right:0,width:'55vw',height:'100vh',background:'#fff',boxShadow:'-8px 0 40px rgba(0,0,0,0.15)',zIndex:2101,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'18px 24px',borderBottom:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexShrink:0,background:'#F8FAFF'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:16,fontWeight:800,color:'#0F172A',marginBottom:4}}>{task.title}</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <span style={{background:(TASK_STATUS_COLOR[task.status]||'#94A3B8')+'20',color:TASK_STATUS_COLOR[task.status]||'#94A3B8',padding:'2px 10px',borderRadius:99,fontSize:10,fontWeight:700}}>{task.status}</span>
              <span style={{background:(PRIORITY_COLOR[task.priority]||'#94A3B8')+'15',color:PRIORITY_COLOR[task.priority]||'#94A3B8',padding:'2px 10px',borderRadius:99,fontSize:10,fontWeight:700}}>{task.priority}</span>
              {task.assigned_to&&<span style={{fontSize:10,color:'#64748B',padding:'2px 8px',background:'#F1F5F9',borderRadius:6}}>👤 {task.assigned_to}</span>}
              {task.due_date&&<span style={{fontSize:10,color:isLate?'#EF4444':'#64748B',padding:'2px 8px',background:isLate?'#FEF2F2':'#F1F5F9',borderRadius:6}}>📅 {task.due_date}{isLate?' · Trễ':''}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{background:'#F1F5F9',border:'none',cursor:'pointer',width:32,height:32,borderRadius:8,fontSize:18,color:'#64748B',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
          {task.description&&<div style={{marginBottom:20,padding:14,background:'#F8FAFF',borderRadius:10,border:'1px solid #E2E8F0',fontSize:13,color:'#374151',lineHeight:1.6}}>{task.description}</div>}

          <div style={{fontSize:11,fontWeight:800,color:'#0F172A',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:12}}>Bình luận ({localComments.length})</div>

          {localComments.map((c,i)=>(
            <div key={i} style={{marginBottom:14,display:'flex',gap:10}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:11,flexShrink:0}}>{(c.author_name||'?')[0].toUpperCase()}</div>
              <div style={{flex:1,background:'#F8FAFF',borderRadius:10,padding:'10px 14px',border:'1px solid #E2E8F0'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontWeight:700,fontSize:11,color:'#0F172A'}}>{c.author_name}</span>
                  <span style={{fontSize:10,color:'#94A3B8'}}>{c.created_at?new Date(c.created_at).toLocaleString('vi-VN'):''}</span>
                </div>
                <div style={{fontSize:12,color:'#374151',lineHeight:1.5,whiteSpace:'pre-wrap'}}>{c.content}</div>
                {c.mentions&&c.mentions.length>0&&<div style={{marginTop:6,display:'flex',gap:4,flexWrap:'wrap'}}>{c.mentions.map(m=><span key={m} style={{background:'rgba(59,130,246,0.1)',color:'#3B82F6',padding:'1px 7px',borderRadius:99,fontSize:10,fontWeight:600}}>@{m}</span>)}</div>}
              </div>
            </div>
          ))}
          {!localComments.length&&<div style={{textAlign:'center',padding:'24px 0',color:'#94A3B8',fontSize:12}}>Chưa có bình luận nào</div>}
        </div>
        <div style={{padding:'16px 24px',borderTop:'1px solid #E2E8F0',flexShrink:0}}>
          <form onSubmit={addComment} style={{display:'flex',gap:8}}>
            <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Nhập bình luận... Dùng @tên để mention" style={{flex:1,padding:'9px 12px',border:'1px solid #D1D5DB',borderRadius:8,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",outline:'none',background:'#fff',color:'#0F172A'}}/>
            <button type="submit" disabled={saving||!newComment.trim()} style={{padding:'9px 18px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,opacity:(saving||!newComment.trim())?0.5:1,fontFamily:"'Inter',system-ui,sans-serif"}}>Gửi</button>
          </form>
          <div style={{fontSize:10,color:'#94A3B8',marginTop:6}}>Tip: Dùng @tên để mention thành viên</div>
        </div>
      </div>
    </>
  )
}

// ── TASKS TAB ────────────────────────────────────────────
function TasksTab({tasks, project, data, onStatusChange, onEdit, onAdd, onInit, currentStage}) {
  const [filterStage, setFilterStage] = useState(currentStage)
  const [filterAssignee, setFilterAssignee] = useState('')

  const filtered = tasks.filter(t=>
    (!filterStage||t.stage===filterStage)&&
    (!filterAssignee||t.assigned_to===filterAssignee)
  )

  const assignees = [...new Set(tasks.map(t=>t.assigned_to).filter(Boolean))]

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{display:'flex',gap:8}}>
          <select value={filterStage} onChange={e=>setFilterStage(e.target.value)}
            style={{padding:'6px 10px',border:'1px solid #E2E8F0',borderRadius:8,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',background:'#FFFFFF',color:'#0F172A'}}>
            <option value="">Tất cả stages</option>
            {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)}
            style={{padding:'6px 10px',border:'1px solid #E2E8F0',borderRadius:8,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',background:'#FFFFFF',color:'#0F172A'}}>
            <option value="">Tất cả assignees</option>
            {data.team.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onInit} style={{padding:'7px 14px',borderRadius:8,border:'1px solid rgba(99,102,241,0.25)',background:'rgba(99,102,241,0.08)',color:'#6366F1',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Auto-tạo tasks</button>
          <button onClick={onAdd} style={{padding:'7px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Task mới</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
        {['Todo','In Progress','Review','Done','Blocked'].map(s=>{
          const cnt = filtered.filter(t=>t.status===s).length
          return <div key={s} style={{background:'#FFFFFF',borderRadius:10,padding:'10px 12px',border:'1px solid #E2E8F0',borderTop:`2px solid ${TASK_STATUS_COLOR[s]||'#94A3B8'}`,textAlign:'center'}}>
            <div style={{fontSize:18,fontWeight:900,color:TASK_STATUS_COLOR[s]||'#94A3B8'}}>{cnt}</div>
            <div style={{fontSize:10,color:'#94A3B8',fontWeight:600,marginTop:2}}>{s}</div>
          </div>
        })}
      </div>

      {/* Tasks by stage */}
      {(filterStage?[STAGES.find(s=>s.id===filterStage)]:STAGES).filter(Boolean).map(stage=>{
        const stageTasks = filtered.filter(t=>t.stage===stage.id)
        if(!stageTasks.length) return null
        return (
          <div key={stage.id} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:stage.color,marginBottom:8,display:'flex',alignItems:'center',gap:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>
              {stage.icon} {stage.label}
              <span style={{background:stage.color+'18',color:stage.color,padding:'1px 8px',borderRadius:99,fontSize:10,fontWeight:600}}>{stageTasks.length}</span>
            </div>
            <div style={{background:'#FFFFFF',borderRadius:12,padding:'12px 16px',border:'1px solid #E2E8F0'}}>
              {stageTasks.map(t=><TaskRow key={t.id} task={t} onStatusChange={onStatusChange} onEdit={()=>onEdit(t)}/>)}
            </div>
          </div>
        )
      })}
      {!filtered.length&&<div style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có tasks</div>}
    </div>
  )
}

// ── APPROVAL PANEL ───────────────────────────────────────
function ApprovalPanel({project, stage, approvals, currentUser, onRequest, onResolve}) {
  const stageApprovals = {
    PRICING: [
      {type:'PL_FINANCE', label:'Finance duyệt P&L', role:'Finance', icon:'💰', desc:'Kiểm tra margin và P&L trước khi gửi báo giá'},
      {type:'DIRECTOR', label:'Director duyệt Pricing', role:'Director', icon:'👔', desc:'Duyệt cuối trước khi gửi cho client'},
    ],
    CONTRACT: [
      {type:'CONTRACT_LEGAL', label:'Director review HĐ', role:'Director', icon:'📝', desc:'Review điều khoản trước khi gửi client ký'},
    ],
    PRE_PRODUCTION: [
      {type:'CONCEPT_PM', label:'PM duyệt concept/kịch bản', role:'PM', icon:'💡', desc:'Duyệt nội dung trước khi brief KOL'},
      {type:'BUDGET_FINANCE', label:'Finance duyệt chi phí', role:'Finance', icon:'💰', desc:'Duyệt budget phát sinh'},
    ],
    REPORTING: [
      {type:'BBNT_CLIENT', label:'Client duyệt BBNT', role:'AM', icon:'✅', desc:'Gửi BBNT cho client ký'},
    ],
  }

  const needed = stageApprovals[stage]||[]
  if(!needed.length) return null

  return (
    <div style={{background:'#FFFFFF',borderRadius:14,padding:'18px 20px',border:'1px solid #E2E8F0'}}>
      <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:14}}>Approvals — Stage {stage}</div>
      {needed.map(item=>{
        const existing = approvals.find(a=>a.stage===stage&&a.approval_type===item.type)
        const isPending = existing?.status==='Pending'
        const isApproved = existing?.status==='Approved'
        const isRejected = existing?.status==='Rejected'
        const canResolve = currentUser?.isMaster || currentUser?.role?.includes(item.role)

        return (
          <div key={item.type} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',marginBottom:8,background:isApproved?'rgba(16,185,129,0.06)':isRejected?'rgba(239,68,68,0.06)':isPending?'rgba(245,158,11,0.06)':'#F8FAFF',borderRadius:10,border:`1px solid ${isApproved?'rgba(16,185,129,0.2)':isRejected?'rgba(239,68,68,0.2)':isPending?'rgba(245,158,11,0.2)':'rgba(255,255,255,0.08)'}`}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#0F172A'}}>{item.label}</div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>{item.desc}</div>
              {existing?.comment&&<div style={{fontSize:10,color:'#475569',marginTop:3,fontStyle:'italic'}}>"{existing.comment}"</div>}
              {existing?.reviewed_by&&<div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>Bởi: {existing.reviewed_by} — {existing.reviewed_at?new Date(existing.reviewed_at).toLocaleDateString('vi-VN'):''}</div>}
            </div>
            <div style={{flexShrink:0,marginLeft:12}}>
              {!existing&&(
                <button onClick={()=>onRequest(item.type, stage)} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Gửi yêu cầu</button>
              )}
              {isPending&&canResolve&&(
                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>onResolve(existing.id, true)} style={{padding:'6px 12px',borderRadius:8,border:'none',background:'rgba(5,150,105,0.1)',color:'#059669',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",border:'1px solid rgba(5,150,105,0.3)'}}>✓ Approve</button>
                  <button onClick={()=>onResolve(existing.id, false, prompt('Lý do reject:'))} style={{padding:'6px 12px',borderRadius:8,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>✗ Reject</button>
                </div>
              )}
              {isPending&&!canResolve&&<span style={{background:'rgba(245,158,11,0.1)',color:'#D97706',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:600,border:'1px solid rgba(245,158,11,0.2)'}}>Chờ duyệt</span>}
              {isApproved&&<span style={{background:'rgba(5,150,105,0.1)',color:'#059669',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700,border:'1px solid rgba(5,150,105,0.2)'}}>✓ Đã duyệt</span>}
              {isRejected&&<span style={{background:'rgba(220,38,38,0.1)',color:'#DC2626',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700,border:'1px solid rgba(220,38,38,0.2)'}}>✗ Từ chối</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── APPROVALS TAB ────────────────────────────────────────
function ApprovalsTab({approvals, project, currentUser, onRequest, onResolve}) {
  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:16}}>Toàn bộ Approvals — {project.campaign}</div>
      {STAGES.map(stage=>{
        const stageApprovals = approvals.filter(a=>a.stage===stage.id)
        if(!stageApprovals.length) return null
        return (
          <div key={stage.id} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:stage.color,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.06em'}}>{stage.icon} {stage.label}</div>
            {stageApprovals.map(a=>(
              <div key={a.id} style={{background:'#FFFFFF',borderRadius:10,padding:'12px 16px',marginBottom:8,border:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'#0F172A'}}>{a.approval_type}</div>
                  <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>Requested by {a.requested_by} · {new Date(a.requested_at).toLocaleDateString('vi-VN')}</div>
                  {a.comment&&<div style={{fontSize:11,color:'#475569',marginTop:4,fontStyle:'italic'}}>"{a.comment}"</div>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {a.status==='Pending'&&(currentUser?.isMaster)&&(
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>onResolve(a.id,true)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(5,150,105,0.3)',background:'rgba(5,150,105,0.06)',color:'#059669',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>✓</button>
                      <button onClick={()=>onResolve(a.id,false,'')} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>✗</button>
                    </div>
                  )}
                  <span style={{
                    background:a.status==='Approved'?'rgba(5,150,105,0.1)':a.status==='Rejected'?'rgba(220,38,38,0.1)':'rgba(245,158,11,0.1)',
                    color:a.status==='Approved'?'#059669':a.status==='Rejected'?'#DC2626':'#D97706',
                    padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,
                    border:`1px solid ${a.status==='Approved'?'rgba(5,150,105,0.2)':a.status==='Rejected'?'rgba(220,38,38,0.2)':'rgba(245,158,11,0.2)'}`
                  }}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )
      })}
      {!approvals.length&&<div style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có approval nào</div>}
    </div>
  )
}

// ── KPI TAB ──────────────────────────────────────────────
function KPITab({tasks, project, data}) {
  const members = [...new Set(tasks.map(t=>t.assigned_to).filter(Boolean))]

  function calcKPI(member) {
    const memberTasks = tasks.filter(t=>t.assigned_to===member)
    if(!memberTasks.length) return null
    const total = memberTasks.length
    const done = memberTasks.filter(t=>t.status==='Done').length
    const late = memberTasks.filter(t=>t.late_minutes>0).length
    const blocked = memberTasks.filter(t=>t.status==='Blocked').length
    const completionRate = total?Math.round(done/total*100):0
    const onTimeRate = done?Math.round((done-late)/done*100):100
    const totalWeight = memberTasks.reduce((a,t)=>a+Number(t.kpi_weight||1),0)
    const doneWeight = memberTasks.filter(t=>t.status==='Done').reduce((a,t)=>a+Number(t.kpi_weight||1),0)
    const weightedScore = totalWeight?Math.round(doneWeight/totalWeight*100):0
    const kpiScore = Math.round((completionRate*0.4)+(onTimeRate*0.4)+(weightedScore*0.2))
    return { total, done, late, blocked, completionRate, onTimeRate, weightedScore, kpiScore }
  }

  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:16}}>📈 KPI Performance — {project.campaign}</div>
      <div style={{background:'rgba(99,102,241,0.06)',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid rgba(99,102,241,0.15)',fontSize:11,color:'#94A3B8'}}>
        <strong>Công thức KPI:</strong> Completion Rate (40%) + On-time Rate (40%) + Weighted Task Score (20%)
      </div>

      {members.map(member=>{
        const kpi = calcKPI(member)
        if(!kpi) return null
        const scoreColor = kpi.kpiScore>=80?'#059669':kpi.kpiScore>=60?'#D97706':'#DC2626'
        return (
          <div key={member} style={{background:'#FFFFFF',borderRadius:14,padding:'18px 20px',marginBottom:12,border:'1px solid #E2E8F0'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13}}>
                  {member.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:'#0F172A'}}>{member}</div>
                  <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{data.team.find(m=>m.name===member)?.role||'—'}</div>
                </div>
              </div>
              <div style={{textAlign:'center',background:scoreColor+'12',borderRadius:12,padding:'10px 18px',border:`1px solid ${scoreColor}25`}}>
                <div style={{fontSize:28,fontWeight:900,color:scoreColor,lineHeight:1}}>{kpi.kpiScore}</div>
                <div style={{fontSize:10,color:scoreColor,fontWeight:700,marginTop:2}}>KPI Score</div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10}}>
              {[
                ['Tasks tổng',kpi.total,'','#94A3B8'],
                ['Hoàn thành',kpi.done+'/'+kpi.total+' ('+kpi.completionRate+'%)','',kpi.completionRate>=80?'#059669':kpi.completionRate>=50?'#D97706':'#DC2626'],
                ['Đúng hạn',kpi.onTimeRate+'%',kpi.late+' task trễ',kpi.onTimeRate>=80?'#059669':kpi.onTimeRate>=60?'#D97706':'#DC2626'],
                ['Bị chặn',kpi.blocked,'tasks blocked',kpi.blocked>0?'#DC2626':'#059669'],
              ].map(([l,v,s,c])=>(
                <div key={l} style={{background:c+'08',borderRadius:8,padding:'10px 12px',border:`1px solid ${c}15`}}>
                  <div style={{fontSize:9,fontWeight:700,color:c,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{l}</div>
                  <div style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>{v}</div>
                  {s&&<div style={{fontSize:9,color:'#94A3B8',marginTop:2}}>{s}</div>}
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[['Completion',kpi.completionRate],['On-time',kpi.onTimeRate]].map(([l,v])=>(
                <div key={l}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#94A3B8',marginBottom:4}}>
                    <span>{l}</span><span style={{fontWeight:700}}>{v}%</span>
                  </div>
                  <div style={{height:6,background:'rgba(99,102,241,0.12)',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:v+'%',background:v>=80?'#059669':v>=60?'#D97706':'#DC2626',borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {!members.length&&<div style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có tasks được assign</div>}
    </div>
  )
}

// ── ACTIVITY TAB ─────────────────────────────────────────
function ActivityTab({notifications, project}) {
  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:16}}>🔔 Activity Log</div>
      {notifications.map(n=>(
        <div key={n.id} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #F1F5F9'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(99,102,241,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>
            {n.type==='TASK_ASSIGNED'?'✅':n.type==='APPROVAL'?'🔐':'🔔'}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:'#0F172A'}}>{n.title}</div>
            <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>{n.message}</div>
            <div style={{fontSize:10,color:'#94A3B8',marginTop:3}}>{new Date(n.created_at).toLocaleString('vi-VN')}</div>
          </div>
          {n.send_email&&<span style={{fontSize:9,color:n.email_sent?'#059669':'#D97706',padding:'2px 6px',borderRadius:99,border:`1px solid ${n.email_sent?'rgba(5,150,105,0.2)':'rgba(217,119,6,0.2)'}`,alignSelf:'flex-start',fontWeight:600,flexShrink:0}}>
            {n.email_sent?'✉️ Sent':'✉️ Pending'}
          </span>}
        </div>
      ))}
      {!notifications.length&&<div style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có activity nào</div>}
    </div>
  )
}

// ── TASK FORM ────────────────────────────────────────────
function TaskForm({task, project, data, onSave, onClose, currentStage}) {
  const [form, setForm] = useState({
    title: task?.title||'',
    description: task?.description||'',
    stage: task?.stage||currentStage,
    task_type: task?.task_type||'task',
    assigned_to: task?.assigned_to||'',
    priority: task?.priority||'Normal',
    status: task?.status||'Todo',
    due_date: task?.due_date||'',
    requires_approval: task?.requires_approval||false,
    kpi_weight: task?.kpi_weight||1,
    is_urgent: task?.is_urgent||false,
    notes: task?.notes||'',
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  const INP={width:'100%',padding:'8px 11px',border:'1px solid #E2E8F0',borderRadius:8,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#FFFFFF',color:'#0F172A',outline:'none',boxSizing:'border-box'}

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000,backdropFilter:'blur(4px)'}}>
      <div style={{background:'#FFFFFF',borderRadius:18,padding:'24px 26px',width:520,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid #E2E8F0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid #F1F5F9'}}>
          <span style={{fontSize:15,fontWeight:800,color:'#0F172A'}}>{task?'Sửa task':'Tạo task mới'}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:13}}>
            <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Tiêu đề task *</label>
            <input value={form.title} onChange={e=>set('title',e.target.value)} style={INP} required/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Stage</label>
              <select value={form.stage} onChange={e=>set('stage',e.target.value)} style={INP}>
                {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Assign cho</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:'6px 0'}}>
                {['', ...data.team.map(m=>m.name)].map(name=>{
                  const color = getMemberColor(name)
                  const active = form.assigned_to === name
                  return <div key={name||'__none'} onClick={()=>set('assigned_to',name)}
                    style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:99,cursor:'pointer',border:`1.5px solid ${active?color:'#E2E8F0'}`,background:active?color+'18':'#F8FAFC',transition:'all 0.12s'}}>
                    {name
                      ? <span style={{width:18,height:18,borderRadius:'50%',background:color,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:9,fontWeight:800}}>{name.charAt(0)}</span>
                      : <span style={{fontSize:12}}>—</span>
                    }
                    <span style={{fontSize:11,fontWeight:active?700:500,color:active?color:'#374151'}}>{name||'Chưa assign'}</span>
                  </div>
                })}
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Priority</label>
              <select value={form.priority} onChange={e=>set('priority',e.target.value)} style={INP}>
                <option>Urgent</option><option>High</option><option>Normal</option><option>Low</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Status</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)} style={INP}>
                <option>Todo</option><option>In Progress</option><option>Review</option><option>Done</option><option>Blocked</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>KPI Weight (1-5)</label>
              <select value={form.kpi_weight} onChange={e=>set('kpi_weight',Number(e.target.value))} style={INP}>
                <option value={1}>1 — Nhỏ</option><option value={2}>2</option><option value={3}>3 — Vừa</option><option value={4}>4</option><option value={5}>5 — Quan trọng</option>
              </select>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Deadline</label>
              <input type="date" value={form.due_date} onChange={e=>set('due_date',e.target.value)} style={INP}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,justifyContent:'center'}}>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:'#94A3B8'}}>
                <input type="checkbox" checked={form.requires_approval} onChange={e=>set('requires_approval',e.target.checked)} style={{accentColor:'#6366F1',width:15,height:15}}/>
                🔐 Cần approval
              </label>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:'#DC2626'}}>
                <input type="checkbox" checked={form.is_urgent} onChange={e=>set('is_urgent',e.target.checked)} style={{accentColor:'#DC2626',width:15,height:15}}/>
                🔥 Urgent
              </label>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:'#94A3B8',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Ghi chú</label>
            <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...INP,minHeight:70}}/>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <button type="button" onClick={onClose} style={{padding:'8px 18px',borderRadius:9,border:'1px solid #E2E8F0',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366F1,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Lưu task</button>
          </div>
        </form>
      </div>
    </div>
  )
}
