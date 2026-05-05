import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

const COLORS = ['#185FA5','#27AE60','#E94560','#F5A623','#8B5CF6','#0891B2']
const STATUS_COLOR = {
  Active:'#27AE60', Completed:'#185FA5', 'On Hold':'#F5A623',
  Cancelled:'#E94560', Pitching:'#888', Lead:'#888',
  Negotiation:'#185FA5', Won:'#27AE60', Lost:'#E94560',
  Paid:'#27AE60', Unpaid:'#F5A623', Partial:'#185FA5',
  Overdue:'#E94560', Pending:'#F5A623', Approved:'#27AE60', Rejected:'#E94560'
}

function Badge({ text }) {
  const color = STATUS_COLOR[text] || '#888'
  return <span style={{background:color+'22',color,padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:500,whiteSpace:'nowrap'}}>{text}</span>
}

function fmt(n) { return Number(n||0).toLocaleString('vi-VN') }
function fmtS(n) { n=Number(n||0); if(n>=1e9) return (n/1e9).toFixed(1)+'B'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(0)+'K'; return n.toString() }

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [data, setData] = useState({
    projects:[], clients:[], kols:[], team:[],
    invoices:[], deals:[], dealHistory:[], vendors:[], approvals:[]
  })
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const tables = ['projects','clients','kols','team','invoices','deals','deal_history','vendors','approvals']
    const results = await Promise.all(tables.map(t => supabase.from(t).select('*').order('created_at', {ascending:false})))
    setData({
      projects: results[0].data||[],
      clients: results[1].data||[],
      kols: results[2].data||[],
      team: results[3].data||[],
      invoices: results[4].data||[],
      deals: results[5].data||[],
      dealHistory: results[6].data||[],
      vendors: results[7].data||[],
      approvals: results[8].data||[]
    })
    setLoading(false)
  }

  async function addRecord(table, record) {
    const { error } = await supabase.from(table).insert([record])
    if (error) { alert('Lỗi: ' + error.message); return }
    await loadAll()
    setModal(null)
  }

  async function updateRecord(table, id, record) {
    const { error } = await supabase.from(table).update(record).eq('id', id)
    if (error) { alert('Lỗi: ' + error.message); return }
    await loadAll()
    setModal(null)
  }

  async function deleteRecord(table, id) {
    if (!confirm('Xác nhận xóa?')) return
    await supabase.from(table).delete().eq('id', id)
    await loadAll()
    setModal(null)
  }

  async function logAudit(msg) {
    await supabase.from('audit_log').insert([{message:msg, role:'User'}])
  }

  const nav = [
    {id:'dashboard', label:'Dashboard CEO', grp:'Tổng quan'},
    {id:'pipeline', label:'Deal Pipeline', grp:'Tổng quan'},
    {id:'projects', label:'Dự án', grp:'Vận hành'},
    {id:'pricing', label:'Pricing Engine', grp:'Vận hành'},
    {id:'invoices', label:'Hóa đơn / Công nợ', grp:'Vận hành'},
    {id:'approval', label:'Approval Queue', grp:'Vận hành'},
    {id:'clients', label:'Khách hàng', grp:'Dữ liệu'},
    {id:'kols', label:'KOL / KOC', grp:'Dữ liệu'},
    {id:'vendors', label:'Vendor / Supplier', grp:'Dữ liệu'},
    {id:'team', label:'Team & Capacity', grp:'Dữ liệu'},
    {id:'reports', label:'Báo cáo', grp:'Báo cáo'},
  ]

  const groups = [...new Set(nav.map(n=>n.grp))]
  const totalRev = data.projects.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totalCost = data.projects.reduce((a,p)=>a+Number(p.actual_cost||0),0)
  const totalProfit = totalRev - totalCost
  const overdueCount = data.invoices.filter(i=>i.status==='Overdue').length
  const pendingAppr = data.approvals.filter(a=>a.status==='Pending').length

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16}}>
      <div style={{width:40,height:40,borderRadius:10,background:'#185FA5',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:16}}>AGC</div>
      <div style={{fontSize:13,color:'#888'}}>Đang tải dữ liệu...</div>
    </div>
  )

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'system-ui,sans-serif',fontSize:13,background:'#f5f5f5',overflow:'hidden'}}>
      {/* SIDEBAR */}
      <div style={{width:220,background:'#fff',borderRight:'1px solid #eee',display:'flex',flexDirection:'column',overflow:'auto'}}>
        <div style={{padding:'14px 16px 12px',borderBottom:'1px solid #eee'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:8,background:'#185FA5',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>AGC</div>
            <div><div style={{fontWeight:600,fontSize:14}}>AGC Agency</div><div style={{fontSize:10,color:'#999'}}>Agency OS v2.0</div></div>
          </div>
        </div>
        {groups.map(grp => (
          <div key={grp}>
            <div style={{padding:'10px 14px 4px',fontSize:10,fontWeight:600,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.07em'}}>{grp}</div>
            {nav.filter(n=>n.grp===grp).map(n => (
              <div key={n.id} onClick={()=>setPage(n.id)}
                style={{padding:'7px 16px',cursor:'pointer',fontSize:12,color:page===n.id?'#185FA5':'#555',background:page===n.id?'#EAF2FB':'transparent',borderLeft:page===n.id?'2px solid #185FA5':'2px solid transparent',fontWeight:page===n.id?600:400,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span>{n.label}</span>
                {n.id==='approval' && pendingAppr>0 && <span style={{background:'#E24B4A',color:'#fff',fontSize:9,padding:'1px 5px',borderRadius:99}}>{pendingAppr}</span>}
                {n.id==='invoices' && overdueCount>0 && <span style={{background:'#E24B4A',color:'#fff',fontSize:9,padding:'1px 5px',borderRadius:99}}>!</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:48,background:'#fff',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',padding:'0 20px',gap:10}}>
          <span style={{flex:1,fontWeight:600,fontSize:14}}>{nav.find(n=>n.id===page)?.label||page}</span>
          <span style={{fontSize:11,color:'#888'}}>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <div style={{flex:1,overflow:'auto',padding:20}}>
          {page==='dashboard' && <Dashboard data={data} setPage={setPage} />}
          {page==='pipeline' && <Pipeline data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='projects' && <Projects data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='pricing' && <Pricing data={data} addRecord={addRecord} logAudit={logAudit} />}
          {page==='invoices' && <Invoices data={data} addRecord={addRecord} updateRecord={updateRecord} logAudit={logAudit} />}
          {page==='approval' && <Approval data={data} updateRecord={updateRecord} logAudit={logAudit} />}
          {page==='clients' && <Clients data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='kols' && <Kols data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='vendors' && <Vendors data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='team' && <Team data={data} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} logAudit={logAudit} />}
          {page==='reports' && <Reports data={data} />}
        </div>
      </div>
      {modal && <Modal modal={modal} setModal={setModal} addRecord={addRecord} updateRecord={updateRecord} deleteRecord={deleteRecord} data={data} logAudit={logAudit} />}
    </div>
  )
}// ── DASHBOARD ──
function Dashboard({ data, setPage }) {
  const totalRev = data.projects.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totalCost = data.projects.reduce((a,p)=>a+Number(p.actual_cost||0),0)
  const totalProfit = totalRev - totalCost
  const margin = totalRev ? Math.round(totalProfit/totalRev*100) : 0
  const active = data.projects.filter(p=>p.status==='Active').length
  const overdue = data.invoices.filter(i=>i.status==='Overdue')
  const pending = data.approvals.filter(a=>a.status==='Pending')

  const kpis = [
    {label:'Tổng Revenue', value:fmtS(totalRev), sub:'VND', color:'#185FA5'},
    {label:'Tổng Profit', value:fmtS(totalProfit), sub:margin+'% margin', color:'#27AE60'},
    {label:'Dự án Active', value:active, sub:data.projects.length+' tổng', color:'#185FA5'},
    {label:'KOL Database', value:data.kols.length, sub:'contacts', color:'#8B5CF6'},
    {label:'Clients', value:data.clients.length, sub:'', color:'#0891B2'},
    {label:'Công nợ quá hạn', value:overdue.length, sub:overdue.length?'Cần xử lý':'Tốt', color:overdue.length?'#E94560':'#27AE60'},
  ]

  const svcs = ['KOL/KOC','Performance','Creative','Event','PR','Consulting']
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:16}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:'#f8f9fa',borderRadius:8,padding:'12px 14px'}}>
            <div style={{fontSize:10,color:'#888',fontWeight:500,marginBottom:5}}>{k.label}</div>
            <div style={{fontSize:20,fontWeight:600,color:k.color}}>{k.value}</div>
            <div style={{fontSize:10,color:'#aaa',marginTop:3}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card title="Doanh thu theo service">
          {svcs.map((s,i)=>{
            const r=data.projects.filter(p=>p.service===s).reduce((a,p)=>a+Number(p.revenue||0),0)
            const pct=totalRev?Math.round(r/totalRev*100):0
            return <div key={s} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2}}><span>{s}</span><span style={{color:'#888'}}>{fmtS(r)}</span></div>
              <div style={{height:5,background:'#eee',borderRadius:99}}><div style={{height:'100%',width:pct+'%',background:COLORS[i],borderRadius:99}}></div></div>
            </div>
          })}
        </Card>
        <Card title="Dự án gần đây" action={<Btn sm onClick={()=>setPage('projects')}>Xem tất</Btn>}>
          {data.projects.slice(0,5).map(p=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #f0f0f0'}}>
              <div><div style={{fontWeight:500,fontSize:12}}>{p.campaign||'—'}</div><div style={{fontSize:10,color:'#888'}}>{p.client||'—'}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontSize:11}}>{fmtS(p.revenue)}</div><Badge text={p.status}/></div>
            </div>
          ))}
          {!data.projects.length && <Empty>Chưa có dự án</Empty>}
        </Card>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Card title="Công nợ quá hạn" action={<Btn sm onClick={()=>setPage('invoices')}>Chi tiết</Btn>}>
          {overdue.slice(0,4).map(i=>(
            <div key={i.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f0f0f0'}}>
              <span style={{fontSize:12}}>{i.client}</span>
              <div style={{textAlign:'right'}}><div style={{fontSize:11,color:'#E94560'}}>{fmtS(Number(i.amount)-Number(i.paid))}</div><Badge text={i.status}/></div>
            </div>
          ))}
          {!overdue.length && <Empty>Không có công nợ quá hạn</Empty>}
        </Card>
        <Card title="Approval đang chờ" action={<Btn sm onClick={()=>setPage('approval')}>Xử lý</Btn>}>
          {pending.slice(0,4).map(a=>(
            <div key={a.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f0f0f0'}}>
              <div><div style={{fontSize:12,fontWeight:500}}>{a.title}</div><div style={{fontSize:10,color:'#888'}}>{a.type} · {a.submitted_by}</div></div>
              <Badge text={a.status}/>
            </div>
          ))}
          {!pending.length && <Empty>Không có item chờ duyệt</Empty>}
        </Card>
      </div>
    </div>
  )
}

// ── PIPELINE ──
function Pipeline({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [editDeal, setEditDeal] = useState(null)
  const [showAdd, setShowAdd] = useState(null)
  const stages = ['Lead','Pitching','Negotiation','Won','Lost']

  async function saveDeal(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {client:fd.get('client'),service:fd.get('service'),value:Number(fd.get('value')||0),stage:fd.get('stage'),pm:fd.get('pm'),notes:fd.get('notes'),deal_date:new Date().toLocaleDateString('vi-VN')}
    if (editDeal) { await updateRecord('deals', editDeal.id, record); logAudit('Cập nhật deal: '+record.client) }
    else { await addRecord('deals', record); logAudit('Thêm deal: '+record.client+' — '+record.stage) }
    setEditDeal(null); setShowAdd(null)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Deal Pipeline</h2>
        <Btn primary onClick={()=>setShowAdd('Lead')}>+ Thêm deal</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
        {stages.map(stage=>{
          const deals=data.deals.filter(d=>d.stage===stage)
          const tot=deals.reduce((a,d)=>a+Number(d.value||0),0)
          return <div key={stage} style={{background:'#f8f9fa',borderRadius:10,padding:10}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:600}}>{stage}</span>
              <span style={{fontSize:10,color:'#888'}}>{deals.length} · {fmtS(tot)}</span>
            </div>
            {deals.map(d=>(
              <div key={d.id} onClick={()=>setEditDeal(d)} style={{background:'#fff',border:'1px solid #eee',borderRadius:8,padding:8,marginBottom:6,cursor:'pointer'}}>
                <div style={{fontWeight:500,fontSize:11,marginBottom:2}}>{d.client||'—'}</div>
                <div style={{fontSize:10,color:'#888',marginBottom:4}}>{d.service||'—'}</div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:11,fontWeight:500}}>{fmtS(d.value)}</span><span style={{fontSize:9,color:'#aaa'}}>{d.deal_date||''}</span></div>
              </div>
            ))}
            <button onClick={()=>setShowAdd(stage)} style={{width:'100%',padding:'5px',border:'1px dashed #ddd',borderRadius:6,background:'none',cursor:'pointer',fontSize:11,color:'#888'}}>+ Add</button>
          </div>
        })}
      </div>
      {(showAdd||editDeal) && (
        <ModalWrap title={editDeal?'Cập nhật deal':'Thêm deal'} onClose={()=>{setShowAdd(null);setEditDeal(null)}}>
          <form onSubmit={saveDeal}>
            <FG label="Client"><input name="client" defaultValue={editDeal?.client||''} required/></FG>
            <Row2>
              <FG label="Service"><select name="service" defaultValue={editDeal?.service||'KOL/KOC'}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Package</option></select></FG>
              <FG label="Deal Value (VND)"><input name="value" type="number" defaultValue={editDeal?.value||0}/></FG>
            </Row2>
            <Row2>
              <FG label="Stage"><select name="stage" defaultValue={editDeal?.stage||showAdd||'Lead'}><option>Lead</option><option>Pitching</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></FG>
              <FG label="PM"><select name="pm" defaultValue={editDeal?.pm||''}><option value="">—</option>{data.team.map(t=><option key={t.id}>{t.name}</option>)}</select></FG>
            </Row2>
            <FG label="Ghi chú"><textarea name="notes" defaultValue={editDeal?.notes||''}/></FG>
            <ModalFooter onClose={()=>{setShowAdd(null);setEditDeal(null)}} onDelete={editDeal?()=>deleteRecord('deals',editDeal.id):null}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}

// ── PROJECTS ──
function Projects({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [search, setSearch] = useState('')
  const [stFilter, setStFilter] = useState('')
  const [svFilter, setSvFilter] = useState('')
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = data.projects.filter(p=>
    (!search||(p.client+p.campaign).toLowerCase().includes(search.toLowerCase()))&&
    (!stFilter||p.status===stFilter)&&(!svFilter||p.service===svFilter))

  async function saveProject(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {
      project_code: fd.get('code'), client:fd.get('client'), campaign:fd.get('campaign'),
      service:fd.get('service'), pm:fd.get('pm'),
      budget_plan:Number(fd.get('budget_plan')||0), actual_cost:Number(fd.get('actual_cost')||0),
      revenue:Number(fd.get('revenue')||0), start_date:fd.get('start_date')||null,
      end_date:fd.get('end_date')||null, status:fd.get('status'),
      kols:fd.get('kols').split(',').map(s=>s.trim()).filter(Boolean),
      vendors:fd.get('vendors').split(',').map(s=>s.trim()).filter(Boolean),
      notes:fd.get('notes')
    }
    if (edit) { await updateRecord('projects',edit.id,record); logAudit('Cập nhật: '+record.campaign) }
    else { await addRecord('projects',record); logAudit('Thêm dự án: '+record.campaign) }
    setEdit(null); setShowAdd(false)
  }

  const totRev=filtered.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totProfit=filtered.reduce((a,p)=>a+Number(p.revenue||0)-Number(p.actual_cost||0),0)

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Quản lý dự án</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Dự án mới</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
        {[['Dự án',filtered.length,''],['Revenue',fmtS(totRev),'VND'],['Profit',fmtS(totProfit),''],['Avg Margin',totRev?Math.round(totProfit/totRev*100)+'%':'—','']].map(([l,v,s])=>(
          <div key={l} style={{background:'#f8f9fa',borderRadius:8,padding:'12px 14px'}}><div style={{fontSize:10,color:'#888',fontWeight:500}}>{l}</div><div style={{fontSize:20,fontWeight:600}}>{v}</div><div style={{fontSize:10,color:'#aaa'}}>{s}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Tìm kiếm..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,maxWidth:200,padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}/>
        <select value={stFilter} onChange={e=>setStFilter(e.target.value)} style={{padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}><option value="">Tất cả trạng thái</option><option>Active</option><option>Completed</option><option>On Hold</option><option>Cancelled</option></select>
        <select value={svFilter} onChange={e=>setSvFilter(e.target.value)} style={{padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}><option value="">Tất cả service</option><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select>
      </div>
      <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['ID','Client','Campaign','Service','PM','Budget Plan','Actual Cost','Revenue','Margin','Status','Deadline',''].map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left',background:'#fafafa',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>{
              const margin=Number(p.revenue)?Math.round((Number(p.revenue)-Number(p.actual_cost))/Number(p.revenue)*100):0
              const bv=Number(p.budget_plan)?Math.round((Number(p.actual_cost)-Number(p.budget_plan))/Number(p.budget_plan)*100):0
              return <tr key={p.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'8px 10px',fontSize:10,color:'#aaa'}}>{p.project_code||'—'}</td>
                <td style={{padding:'8px 10px',fontWeight:500}}>{p.client||'—'}</td>
                <td style={{padding:'8px 10px'}}>{p.campaign||'—'}</td>
                <td style={{padding:'8px 10px'}}><span style={{background:'#f0f0f0',padding:'1px 7px',borderRadius:4,fontSize:10}}>{p.service||'—'}</span></td>
                <td style={{padding:'8px 10px',fontSize:11}}>{p.pm||'—'}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(p.budget_plan)}</td>
                <td style={{padding:'8px 10px',fontSize:11,color:bv>10?'#E94560':bv>0?'#F5A623':'#27AE60'}}>{fmtS(p.actual_cost)} {p.budget_plan?<span style={{fontSize:9}}>({bv}%)</span>:''}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(p.revenue)}</td>
                <td style={{padding:'8px 10px',fontSize:11,color:margin>=30?'#27AE60':margin>=15?'#F5A623':'#E94560'}}>{Number(p.revenue)?margin+'%':'—'}</td>
                <td style={{padding:'8px 10px'}}><Badge text={p.status}/></td>
                <td style={{padding:'8px 10px',fontSize:10}}>{p.end_date||'—'}</td>
                <td style={{padding:'8px 10px'}}><Btn sm onClick={()=>setEdit(p)}>Edit</Btn></td>
              </tr>
            })}
            {!filtered.length && <tr><td colSpan={12} style={{textAlign:'center',padding:24,color:'#aaa',fontSize:12}}>Không có dự án</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit) && (
        <ModalWrap title={edit?'Sửa dự án':'Thêm dự án mới'} onClose={()=>{setEdit(null);setShowAdd(false)}}>
          <form onSubmit={saveProject}>
            <Row2>
              <FG label="Project Code"><input name="code" defaultValue={edit?.project_code||'AGC-'+String(data.projects.length+1).padStart(3,'0')}/></FG>
              <FG label="Client"><input name="client" defaultValue={edit?.client||''} list="cl-list" required/><datalist id="cl-list">{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</datalist></FG>
            </Row2>
            <FG label="Campaign"><input name="campaign" defaultValue={edit?.campaign||''} required/></FG>
            <Row2>
              <FG label="Service"><select name="service" defaultValue={edit?.service||'KOL/KOC'}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG>
              <FG label="PM"><select name="pm" defaultValue={edit?.pm||''}><option value="">—</option>{data.team.map(t=><option key={t.id}>{t.name}</option>)}</select></FG>
            </Row2>
            <Row2>
              <FG label="Budget Plan (VND)"><input name="budget_plan" type="number" defaultValue={edit?.budget_plan||0}/></FG>
              <FG label="Actual Cost (VND)"><input name="actual_cost" type="number" defaultValue={edit?.actual_cost||0}/></FG>
            </Row2>
            <Row2>
              <FG label="Revenue (VND)"><input name="revenue" type="number" defaultValue={edit?.revenue||0}/></FG>
              <FG label="Status"><select name="status" defaultValue={edit?.status||'Active'}><option>Active</option><option>Pitching</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select></FG>
            </Row2>
            <Row2>
              <FG label="Start date"><input name="start_date" type="date" defaultValue={edit?.start_date||''}/></FG>
              <FG label="Deadline"><input name="end_date" type="date" defaultValue={edit?.end_date||''}/></FG>
            </Row2>
            <FG label="KOLs (cách nhau dấu phẩy)"><input name="kols" defaultValue={(edit?.kols||[]).join(', ')}/></FG>
            <FG label="Vendors"><input name="vendors" defaultValue={(edit?.vendors||[]).join(', ')}/></FG>
            <FG label="Ghi chú"><textarea name="notes" defaultValue={edit?.notes||''}/></FG>
            <ModalFooter onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>deleteRecord('projects',edit.id):null}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}// ── PRICING ──
function Pricing({ data, addRecord, logAudit }) {
  const [inputs, setInputs] = useState({budget:0,margin:30,service:'KOL/KOC',kolNum:0,kolCost:0,prod:0,ads:0,ops:0,other:0,client:''})
  const [scenarios, setScenarios] = useState([{tier:'Macro',platform:'TikTok',num:2,cost:8000000},{tier:'Micro',platform:'Instagram',num:5,cost:3000000}])

  const set = (k,v) => setInputs(p=>({...p,[k]:v}))
  const kolCostTotal = scenarios.reduce((a,s)=>a+Number(s.num||0)*Number(s.cost||0),0)
  const totalCost = kolCostTotal + Number(inputs.prod||0) + Number(inputs.ads||0) + Number(inputs.ops||0) + Number(inputs.other||0)
  const mg = Number(inputs.margin||0)/100
  const recPrice = mg<1 ? Math.round(totalCost/(1-mg)) : 0
  const profit = recPrice - totalCost
  const actualMg = recPrice ? Math.round(profit/recPrice*100) : 0
  const gap = Number(inputs.budget||0) - recPrice
  const accept = recPrice>0 && recPrice<=Number(inputs.budget||0)

  async function saveHistory() {
    if (!recPrice) { alert('Nhập dữ liệu trước'); return }
    if (!inputs.client) { alert('Nhập tên client'); return }
    await addRecord('deal_history',{client:inputs.client,service:inputs.service,price:recPrice,margin:actualMg,decision:accept?'Accepted':'Rejected',deal_date:new Date().toLocaleDateString('vi-VN')})
    logAudit('Lưu deal history: '+inputs.client)
    alert('Đã lưu!')
  }

  async function submitApproval() {
    if (!recPrice) { alert('Nhập dữ liệu trước'); return }
    if (!inputs.client) { alert('Nhập tên client'); return }
    await addRecord('approvals',{type:'Quote',title:'Quote cho '+inputs.client+' — '+fmtS(recPrice),submitted_by:'User',status:'Pending',price:recPrice,approval_date:new Date().toLocaleDateString('vi-VN'),notes:''})
    logAudit('Gửi duyệt quote: '+inputs.client)
    alert('Đã gửi Approval Queue!')
  }

  const inp = (label, key, type='number', placeholder='0') => (
    <FG label={label}><input type={type} value={inputs[key]||''} onChange={e=>set(key,e.target.value)} placeholder={placeholder}/></FG>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Pricing Engine</h2>
        <div style={{display:'flex',gap:8}}>
          <Btn sm onClick={submitApproval}>Gửi duyệt</Btn>
          <Btn sm primary onClick={saveHistory}>Lưu Deal History</Btn>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div>
          <Card title="Input Parameters">
            <Row2>{inp('Client Budget (VND)','budget')}{inp('Target Margin (%)','margin')}</Row2>
            <FG label="Service Type"><select value={inputs.service} onChange={e=>set('service',e.target.value)}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG>
            <FG label="Tên client"><input type="text" value={inputs.client} onChange={e=>set('client',e.target.value)} placeholder="Tên client..."/></FG>
            <div style={{height:1,background:'#f0f0f0',margin:'8px 0'}}/>
            <Row2>{inp('Số KOL/KOC','kolNum')}{inp('Avg Cost/KOL','kolCost')}</Row2>
            <Row2>{inp('Production','prod')}{inp('Ads/Seeding','ads')}</Row2>
            <Row2>{inp('Agency Ops','ops')}{inp('Chi phí khác','other')}</Row2>
          </Card>
          <Card title="KOL Scenario Planner" action={<Btn sm onClick={()=>setScenarios(p=>[...p,{tier:'Micro',platform:'TikTok',num:0,cost:0}])}>+ Tier</Btn>}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['Tier','Platform','Số lượng','Cost/KOL','Total',''].map(h=><th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left'}}>{h}</th>)}</tr></thead>
              <tbody>
                {scenarios.map((s,i)=>(
                  <tr key={i}>
                    <td style={{padding:'4px 6px'}}><input value={s.tier} onChange={e=>{const n=[...scenarios];n[i].tier=e.target.value;setScenarios(n)}} style={{width:70,padding:'4px 6px',border:'1px solid #eee',borderRadius:4,fontSize:11}}/></td>
                    <td style={{padding:'4px 6px'}}><select value={s.platform} onChange={e=>{const n=[...scenarios];n[i].platform=e.target.value;setScenarios(n)}} style={{width:90,padding:'4px 6px',border:'1px solid #eee',borderRadius:4,fontSize:11}}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></td>
                    <td style={{padding:'4px 6px'}}><input type="number" value={s.num} onChange={e=>{const n=[...scenarios];n[i].num=e.target.value;setScenarios(n)}} style={{width:55,padding:'4px 6px',border:'1px solid #eee',borderRadius:4,fontSize:11}}/></td>
                    <td style={{padding:'4px 6px'}}><input type="number" value={s.cost} onChange={e=>{const n=[...scenarios];n[i].cost=e.target.value;setScenarios(n)}} style={{width:90,padding:'4px 6px',border:'1px solid #eee',borderRadius:4,fontSize:11}}/></td>
                    <td style={{padding:'4px 6px',fontWeight:500,fontSize:11}}>{fmtS(Number(s.num||0)*Number(s.cost||0))}</td>
                    <td style={{padding:'4px 6px'}}><button onClick={()=>setScenarios(p=>p.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:'#E94560',fontSize:14}}>×</button></td>
                  </tr>
                ))}
                <tr style={{background:'#f8f9fa'}}>
                  <td colSpan={4} style={{padding:'6px 8px',fontWeight:600,fontSize:11}}>Tổng KOL Cost</td>
                  <td style={{padding:'6px 8px',fontWeight:600,color:'#185FA5',fontSize:11}}>{fmtS(kolCostTotal)}</td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <Card title="Kết quả tính giá">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
              <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#888',marginBottom:4}}>Total KOL Cost</div><div style={{fontSize:16,fontWeight:600}}>{fmtS(kolCostTotal)}</div></div>
              <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#888',marginBottom:4}}>Total Cost</div><div style={{fontSize:16,fontWeight:600}}>{fmtS(totalCost)}</div></div>
            </div>
            <div style={{background:'#EAF2FB',borderRadius:8,padding:14,textAlign:'center',marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:600,color:'#185FA5',marginBottom:4}}>GIÁ ĐỀ XUẤT</div>
              <div style={{fontSize:28,fontWeight:700,color:'#185FA5'}}>{fmt(recPrice)} ₫</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
              <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#888',marginBottom:4}}>Expected Profit</div><div style={{fontSize:15,fontWeight:600,color:'#27AE60'}}>{fmtS(profit)}</div></div>
              <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#888',marginBottom:4}}>Margin thực</div><div style={{fontSize:15,fontWeight:600,color:'#27AE60'}}>{actualMg}%</div></div>
            </div>
            <div style={{background:accept?'#d4edda':'#f8d7da',borderRadius:8,padding:12,textAlign:'center'}}>
              <div style={{fontSize:14,fontWeight:700,color:accept?'#27AE60':'#E94560'}}>{!recPrice?'Nhập dữ liệu để tính →':accept?'✓ ACCEPT DEAL':'✗ RENEGOTIATE / REJECT'}</div>
              {recPrice>0&&<div style={{fontSize:11,color:accept?'#27AE60':'#E94560',marginTop:4}}>Budget gap: {fmt(gap)} ₫</div>}
            </div>
          </Card>
          <Card title="Deal History">
            <div style={{maxHeight:260,overflowY:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Ngày','Client','Service','Giá','Margin','Decision'].map(h=><th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left'}}>{h}</th>)}</tr></thead>
                <tbody>
                  {data.dealHistory.map(d=>(
                    <tr key={d.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                      <td style={{padding:'6px 8px',fontSize:10}}>{d.deal_date}</td>
                      <td style={{padding:'6px 8px',fontSize:11}}>{d.client}</td>
                      <td style={{padding:'6px 8px',fontSize:11}}>{d.service}</td>
                      <td style={{padding:'6px 8px',fontSize:11}}>{fmtS(d.price)}</td>
                      <td style={{padding:'6px 8px',fontSize:11}}>{d.margin}%</td>
                      <td style={{padding:'6px 8px'}}><Badge text={d.decision}/></td>
                    </tr>
                  ))}
                  {!data.dealHistory.length&&<tr><td colSpan={6} style={{textAlign:'center',padding:16,color:'#aaa',fontSize:12}}>Chưa có deal</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── INVOICES ──
function Invoices({ data, addRecord, updateRecord, logAudit }) {
  const [filter, setFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const invs = data.invoices.filter(i=>!filter||i.status===filter)
  const totAmt = data.invoices.reduce((a,i)=>a+Number(i.amount||0),0)
  const totPaid = data.invoices.reduce((a,i)=>a+Number(i.paid||0),0)
  const overdue = data.invoices.filter(i=>i.status==='Overdue').reduce((a,i)=>a+Number(i.amount||0)-Number(i.paid||0),0)

  async function saveInvoice(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const amt = Number(fd.get('amount')||0), paid = Number(fd.get('paid')||0)
    const due = fd.get('due_date')
    const od = due && new Date(due)<new Date() && paid<amt
    await addRecord('invoices',{
      invoice_code:'INV-'+String(data.invoices.length+1).padStart(3,'0'),
      client:fd.get('client'), project:fd.get('project'),
      amount:amt, paid, due_date:due||null,
      status:paid>=amt?'Paid':od?'Overdue':paid>0?'Partial':'Unpaid',
      notes:fd.get('notes')
    })
    logAudit('Tạo hóa đơn: '+fd.get('client'))
    setShowAdd(false)
  }

  async function markPaid(inv) {
    const amt = Number(prompt(`Thu từ ${inv.client}\nCòn lại: ${fmt(Number(inv.amount)-Number(inv.paid))} VND\nSố tiền:`, Number(inv.amount)-Number(inv.paid))||0)
    if (!amt) return
    const newPaid = Math.min(Number(inv.paid)+amt, Number(inv.amount))
    await updateRecord('invoices', inv.id, {paid:newPaid, status:newPaid>=Number(inv.amount)?'Paid':newPaid>0?'Partial':'Unpaid'})
    logAudit('Thu tiền '+inv.invoice_code+': '+fmt(amt)+' từ '+inv.client)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Hóa đơn & Công nợ</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Tạo hóa đơn</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
        {[['Tổng HĐ',fmtS(totAmt),''],['Đã thu',fmtS(totPaid),'#27AE60'],['Còn phải thu',fmtS(totAmt-totPaid),'#F5A623'],['Quá hạn',fmtS(overdue),'#E94560']].map(([l,v,c])=>(
          <div key={l} style={{background:'#f8f9fa',borderRadius:8,padding:'12px 14px'}}><div style={{fontSize:10,color:'#888',fontWeight:500}}>{l}</div><div style={{fontSize:20,fontWeight:600,color:c||'inherit'}}>{v}</div></div>
        ))}
      </div>
      <div style={{marginBottom:12}}>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}>
          <option value="">Tất cả</option><option value="Unpaid">Chưa TT</option><option value="Partial">Một phần</option><option value="Paid">Đã TT</option><option value="Overdue">Quá hạn</option>
        </select>
      </div>
      <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Mã HĐ','Client','Dự án','Tổng tiền','Đã thu','Còn lại','Hạn','Status',''].map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left',background:'#fafafa'}}>{h}</th>)}</tr></thead>
          <tbody>
            {invs.map(i=>(
              <tr key={i.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'8px 10px',fontSize:10,color:'#aaa'}}>{i.invoice_code}</td>
                <td style={{padding:'8px 10px',fontWeight:500}}>{i.client}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{i.project||'—'}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(i.amount)}</td>
                <td style={{padding:'8px 10px',fontSize:11,color:'#27AE60'}}>{fmtS(i.paid)}</td>
                <td style={{padding:'8px 10px',fontSize:11,color:Number(i.amount)-Number(i.paid)>0?'#F5A623':'#27AE60'}}>{fmtS(Number(i.amount)-Number(i.paid))}</td>
                <td style={{padding:'8px 10px',fontSize:10}}>{i.due_date||'—'}</td>
                <td style={{padding:'8px 10px'}}><Badge text={i.status}/></td>
                <td style={{padding:'8px 10px'}}><Btn sm onClick={()=>markPaid(i)}>Thu tiền</Btn></td>
              </tr>
            ))}
            {!invs.length&&<tr><td colSpan={9} style={{textAlign:'center',padding:24,color:'#aaa',fontSize:12}}>Không có hóa đơn</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <ModalWrap title="Tạo hóa đơn" onClose={()=>setShowAdd(false)}>
          <form onSubmit={saveInvoice}>
            <FG label="Client"><select name="client"><option value="">— Chọn —</option>{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</select></FG>
            <FG label="Tên dự án"><input name="project"/></FG>
            <Row2><FG label="Tổng tiền (VND)"><input name="amount" type="number" required/></FG><FG label="Đặt cọc trước"><input name="paid" type="number" defaultValue={0}/></FG></Row2>
            <FG label="Hạn thanh toán"><input name="due_date" type="date"/></FG>
            <FG label="Ghi chú"><textarea name="notes"/></FG>
            <ModalFooter onClose={()=>setShowAdd(false)}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}

// ── APPROVAL ──
function Approval({ data, updateRecord, logAudit }) {
  async function resolve(a, approved) {
    const note = document.getElementById('note-'+a.id)?.value||''
    await updateRecord('approvals', a.id, {status:approved?'Approved':'Rejected', notes:note, resolved_by:'CEO'})
    logAudit((approved?'Approve':'Reject')+': '+a.title)
  }

  return (
    <div>
      <h2 style={{margin:'0 0 16px',fontSize:15,fontWeight:600}}>Approval Queue</h2>
      {data.approvals.length ? data.approvals.map(a=>(
        <div key={a.id} style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:'14px 18px',marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{a.title}</div><div style={{fontSize:11,color:'#888',marginTop:2}}>{a.type} · Gửi bởi {a.submitted_by} · {a.approval_date}</div></div>
            <Badge text={a.status}/>
          </div>
          {a.notes&&<div style={{fontSize:11,color:'#666',marginBottom:8,padding:'6px 8px',background:'#f8f9fa',borderRadius:6}}>{a.notes}</div>}
          {a.status==='Pending'&&(
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button onClick={()=>resolve(a,true)} style={{padding:'5px 14px',background:'#d4edda',color:'#27AE60',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600,fontSize:12}}>✓ Approve</button>
              <button onClick={()=>resolve(a,false)} style={{padding:'5px 14px',background:'#f8d7da',color:'#E94560',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600,fontSize:12}}>✗ Reject</button>
              <input id={'note-'+a.id} placeholder="Ghi chú..." style={{flex:1,padding:'5px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}/>
            </div>
          )}
          {a.status!=='Pending'&&<div style={{fontSize:10,color:'#aaa'}}>Đã xử lý bởi {a.resolved_by||'—'}</div>}
        </div>
      )) : <div style={{textAlign:'center',padding:40,color:'#aaa',fontSize:12}}>Không có item nào cần duyệt</div>}
    </div>
  )
}// ── CLIENTS ──
function Clients({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [search, setSearch] = useState('')
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  async function saveClient(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {name:fd.get('name'),industry:fd.get('industry'),size:fd.get('size'),contact:fd.get('contact'),email:fd.get('email'),phone:fd.get('phone'),notes:fd.get('notes'),since:new Date().toLocaleDateString('vi-VN')}
    if (edit) { await updateRecord('clients',edit.id,record); logAudit('Cập nhật client: '+record.name) }
    else { await addRecord('clients',record); logAudit('Thêm client: '+record.name) }
    setEdit(null); setShowAdd(false)
  }

  const filtered = data.clients.filter(c=>!search||(c.name||'').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Khách hàng</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Thêm client</Btn>
      </div>
      <input placeholder="Tìm client..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:14,padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12,width:250}}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:12}}>
        {filtered.map((c,i)=>{
          const rev = data.projects.filter(p=>p.client===c.name).reduce((a,p)=>a+Number(p.revenue||0),0)
          const pc = data.projects.filter(p=>p.client===c.name).length
          const col = COLORS[i%COLORS.length]
          const init = (c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
          return (
            <div key={c.id} onClick={()=>setEdit(c)} style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:'14px 16px',cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:8,background:col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>{init}</div>
                <div><div style={{fontWeight:600,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:'#888'}}>{c.industry||'—'}</div></div>
              </div>
              <div style={{height:1,background:'#f0f0f0',margin:'8px 0'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:8}}>
                <div><div style={{fontSize:10,color:'#aaa'}}>Projects</div><div style={{fontSize:13,fontWeight:600}}>{pc}</div></div>
                <div><div style={{fontSize:10,color:'#aaa'}}>Revenue</div><div style={{fontSize:13,fontWeight:600}}>{fmtS(rev)}</div></div>
              </div>
              <div style={{fontSize:11,color:'#888',marginTop:6}}>{c.contact||'—'}</div>
            </div>
          )
        })}
        {!filtered.length&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#aaa',fontSize:12}}>Chưa có client</div>}
      </div>
      {(showAdd||edit)&&(
        <ModalWrap title={edit?'Sửa client':'Thêm khách hàng'} onClose={()=>{setEdit(null);setShowAdd(false)}}>
          <form onSubmit={saveClient}>
            <FG label="Tên Brand / Công ty"><input name="name" defaultValue={edit?.name||''} required/></FG>
            <Row2><FG label="Ngành"><input name="industry" defaultValue={edit?.industry||''} placeholder="FMCG, F&B, Tech..."/></FG><FG label="Quy mô"><select name="size" defaultValue={edit?.size||'SME'}><option>Enterprise</option><option>SME</option><option>Startup</option></select></FG></Row2>
            <FG label="Contact người"><input name="contact" defaultValue={edit?.contact||''} placeholder="Họ tên – Chức vụ"/></FG>
            <Row2><FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''}/></FG><FG label="Điện thoại"><input name="phone" defaultValue={edit?.phone||''}/></FG></Row2>
            <FG label="Ghi chú"><textarea name="notes" defaultValue={edit?.notes||''}/></FG>
            <ModalFooter onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>deleteRecord('clients',edit.id):null}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}

// ── KOLS ──
function Kols({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [search, setSearch] = useState('')
  const [platF, setPlatF] = useState('')
  const [tierF, setTierF] = useState('')
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [history, setHistory] = useState(null)

  async function saveKol(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {name:fd.get('name'),platform:fd.get('platform'),tier:fd.get('tier'),niche:fd.get('niche'),followers:Number(fd.get('followers')||0),engagement:Number(fd.get('engagement')||0),rate:Number(fd.get('rate')||0),avg_views:Number(fd.get('avg_views')||0),reliability:Number(fd.get('reliability')||5),available:fd.get('available')==='true',contact:fd.get('contact'),notes:fd.get('notes')}
    if (edit) { await updateRecord('kols',edit.id,record); logAudit('Cập nhật KOL: '+record.name) }
    else { await addRecord('kols',record); logAudit('Thêm KOL: '+record.name) }
    setEdit(null); setShowAdd(false)
  }

  const filtered = data.kols.filter(k=>
    (!search||(k.name||'').toLowerCase().includes(search.toLowerCase()))&&
    (!platF||k.platform===platF)&&(!tierF||k.tier===tierF))

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>KOL / KOC Database</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Thêm KOL</Btn>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Tìm KOL..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,maxWidth:200,padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}/>
        <select value={platF} onChange={e=>setPlatF(e.target.value)} style={{padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}><option value="">Tất cả platform</option><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select>
        <select value={tierF} onChange={e=>setTierF(e.target.value)} style={{padding:'6px 9px',border:'1px solid #ddd',borderRadius:6,fontSize:12}}><option value="">Tất cả tier</option><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select>
      </div>
      <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['ID','Tên','Platform','Tier','Followers','Eng%','Rate','Campaigns','Reliability','Status',''].map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left',background:'#fafafa',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((k,i)=>{
              const used = data.projects.filter(p=>(p.kols||[]).includes(k.name)).length
              const stars = '★'.repeat(Math.min(5,Number(k.reliability||0)))+'☆'.repeat(Math.max(0,5-Number(k.reliability||0)))
              return <tr key={k.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'8px 10px',fontSize:10,color:'#aaa'}}>KOL-{String(i+1).padStart(3,'0')}</td>
                <td style={{padding:'8px 10px',fontWeight:500}}>{k.name}</td>
                <td style={{padding:'8px 10px'}}><span style={{background:'#f0f0f0',padding:'1px 7px',borderRadius:4,fontSize:10}}>{k.platform}</span></td>
                <td style={{padding:'8px 10px'}}><Badge text={k.tier}/></td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(k.followers)}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{Number(k.engagement||0).toFixed(1)}%</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(k.rate)}</td>
                <td style={{padding:'8px 10px',textAlign:'center',fontSize:11}}>{used}</td>
                <td style={{padding:'8px 10px',fontSize:12,color:'#F5A623'}}>{stars}</td>
                <td style={{padding:'8px 10px'}}><Badge text={k.available?'Active':'Booked'}/></td>
                <td style={{padding:'8px 10px',display:'flex',gap:4}}>
                  <Btn sm onClick={()=>setEdit(k)}>Edit</Btn>
                  <Btn sm onClick={()=>setHistory(k)}>History</Btn>
                </td>
              </tr>
            })}
            {!filtered.length&&<tr><td colSpan={11} style={{textAlign:'center',padding:24,color:'#aaa',fontSize:12}}>Không có KOL</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&(
        <ModalWrap title={edit?'Sửa KOL':'Thêm KOL / KOC'} onClose={()=>{setEdit(null);setShowAdd(false)}}>
          <form onSubmit={saveKol}>
            <Row2><FG label="Tên"><input name="name" defaultValue={edit?.name||''} required/></FG><FG label="Platform"><select name="platform" defaultValue={edit?.platform||'TikTok'}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></FG></Row2>
            <Row2><FG label="Tier"><select name="tier" defaultValue={edit?.tier||'Micro'}><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select></FG><FG label="Niche"><input name="niche" defaultValue={edit?.niche||''} placeholder="Beauty, Lifestyle..."/></FG></Row2>
            <Row2><FG label="Followers"><input name="followers" type="number" defaultValue={edit?.followers||0}/></FG><FG label="Engagement (%)"><input name="engagement" type="number" step="0.1" defaultValue={edit?.engagement||0}/></FG></Row2>
            <Row2><FG label="Rate (VND/post)"><input name="rate" type="number" defaultValue={edit?.rate||0}/></FG><FG label="Avg Views"><input name="avg_views" type="number" defaultValue={edit?.avg_views||0}/></FG></Row2>
            <Row2><FG label="Reliability (1-5)"><select name="reliability" defaultValue={edit?.reliability||5}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG><FG label="Trạng thái"><select name="available" defaultValue={edit?.available!==false?'true':'false'}><option value="true">Available</option><option value="false">Booked</option></select></FG></Row2>
            <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''} placeholder="Zalo/IG/Email"/></FG>
            <FG label="Ghi chú / kinh nghiệm"><textarea name="notes" defaultValue={edit?.notes||''}/></FG>
            <ModalFooter onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>deleteRecord('kols',edit.id):null}/>
          </form>
        </ModalWrap>
      )}
      {history&&(
        <ModalWrap title={'Performance History: '+history.name} onClose={()=>setHistory(null)}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
            {[['Campaigns',data.projects.filter(p=>(p.kols||[]).includes(history.name)).length],['Rate',fmtS(history.rate)+' VND'],['Reliability',history.reliability+'/5']].map(([l,v])=>(
              <div key={l} style={{background:'#f8f9fa',borderRadius:8,padding:'10px 12px'}}><div style={{fontSize:10,color:'#888',marginBottom:4}}>{l}</div><div style={{fontSize:15,fontWeight:600}}>{v}</div></div>
            ))}
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Campaign','Client','Service','Status','Date'].map(h=><th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left'}}>{h}</th>)}</tr></thead>
            <tbody>
              {data.projects.filter(p=>(p.kols||[]).includes(history.name)).map(p=>(
                <tr key={p.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                  <td style={{padding:'6px 8px',fontSize:11}}>{p.campaign}</td>
                  <td style={{padding:'6px 8px',fontSize:11}}>{p.client}</td>
                  <td style={{padding:'6px 8px',fontSize:11}}>{p.service}</td>
                  <td style={{padding:'6px 8px'}}><Badge text={p.status}/></td>
                  <td style={{padding:'6px 8px',fontSize:10}}>{p.start_date||'—'}</td>
                </tr>
              ))}
              {!data.projects.filter(p=>(p.kols||[]).includes(history.name)).length&&<tr><td colSpan={5} style={{textAlign:'center',padding:16,color:'#aaa',fontSize:12}}>Chưa có campaign nào</td></tr>}
            </tbody>
          </table>
          {history.notes&&<div style={{marginTop:12,padding:8,background:'#f8f9fa',borderRadius:6,fontSize:11,color:'#666'}}>{history.notes}</div>}
          <div style={{textAlign:'right',marginTop:12}}><Btn onClick={()=>setHistory(null)}>Đóng</Btn></div>
        </ModalWrap>
      )}
    </div>
  )
}

// ── VENDORS ──
function Vendors({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  async function saveVendor(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {name:fd.get('name'),type:fd.get('type'),rating:Number(fd.get('rating')||5),contact:fd.get('contact'),total_spent:Number(fd.get('total_spent')||0),notes:fd.get('notes')}
    if (edit) { await updateRecord('vendors',edit.id,record); logAudit('Cập nhật vendor: '+record.name) }
    else { await addRecord('vendors',record); logAudit('Thêm vendor: '+record.name) }
    setEdit(null); setShowAdd(false)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Vendor / Supplier</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Thêm vendor</Btn>
      </div>
      <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Tên','Loại','Contact','Rating','Tổng đã chi','Ghi chú',''].map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left',background:'#fafafa'}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.vendors.map(v=>(
              <tr key={v.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'8px 10px',fontWeight:500}}>{v.name}</td>
                <td style={{padding:'8px 10px'}}><span style={{background:'#f0f0f0',padding:'1px 7px',borderRadius:4,fontSize:10}}>{v.type||'—'}</span></td>
                <td style={{padding:'8px 10px',fontSize:11}}>{v.contact||'—'}</td>
                <td style={{padding:'8px 10px',fontSize:12,color:'#F5A623'}}>{'★'.repeat(Number(v.rating||0))+'☆'.repeat(Math.max(0,5-Number(v.rating||0)))}</td>
                <td style={{padding:'8px 10px',fontSize:11}}>{fmtS(v.total_spent)}</td>
                <td style={{padding:'8px 10px',fontSize:11,color:'#888'}}>{v.notes||'—'}</td>
                <td style={{padding:'8px 10px'}}><Btn sm onClick={()=>setEdit(v)}>Edit</Btn></td>
              </tr>
            ))}
            {!data.vendors.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:24,color:'#aaa',fontSize:12}}>Chưa có vendor</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&(
        <ModalWrap title={edit?'Sửa vendor':'Thêm Vendor'} onClose={()=>{setEdit(null);setShowAdd(false)}}>
          <form onSubmit={saveVendor}>
            <FG label="Tên vendor"><input name="name" defaultValue={edit?.name||''} required/></FG>
            <Row2><FG label="Loại dịch vụ"><select name="type" defaultValue={edit?.type||'Production'}><option>Production</option><option>Photography</option><option>Video</option><option>Media Buy</option><option>Event</option><option>Design</option><option>PR</option><option>Other</option></select></FG><FG label="Rating (1-5)"><select name="rating" defaultValue={edit?.rating||5}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG></Row2>
            <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''}/></FG>
            <FG label="Tổng đã chi (VND)"><input name="total_spent" type="number" defaultValue={edit?.total_spent||0}/></FG>
            <FG label="Ghi chú"><textarea name="notes" defaultValue={edit?.notes||''}/></FG>
            <ModalFooter onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>deleteRecord('vendors',edit.id):null}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}

// ── TEAM ──
function Team({ data, addRecord, updateRecord, deleteRecord, logAudit }) {
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  async function saveMember(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const record = {name:fd.get('name'),role:fd.get('role'),max_projects:Number(fd.get('max_projects')||5),email:fd.get('email')}
    if (edit) { await updateRecord('team',edit.id,record); logAudit('Cập nhật team: '+record.name) }
    else { await addRecord('team',record); logAudit('Thêm thành viên: '+record.name) }
    setEdit(null); setShowAdd(false)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <h2 style={{margin:0,fontSize:15,fontWeight:600}}>Team & Capacity</h2>
        <Btn primary onClick={()=>setShowAdd(true)}>+ Thêm thành viên</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:16}}>
        {data.team.map((m,i)=>{
          const active = data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length
          const util = m.max_projects ? Math.round(active/m.max_projects*100) : 0
          const col = COLORS[i%COLORS.length]
          const init = (m.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
          return (
            <div key={m.id} onClick={()=>setEdit(m)} style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:'14px 16px',cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>{init}</div>
                <div><div style={{fontWeight:600,fontSize:13}}>{m.name}</div><div style={{fontSize:11,color:'#888'}}>{m.role}</div></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8,fontSize:11}}>
                <div>Projects: <strong>{active}/{m.max_projects||5}</strong></div>
                <div>Util: <strong>{util}%</strong></div>
              </div>
              <div style={{height:5,background:'#eee',borderRadius:99}}><div style={{height:'100%',width:util+'%',background:util>=80?'#E94560':util>=60?'#F5A623':'#27AE60',borderRadius:99}}/></div>
              <div style={{marginTop:5,fontSize:10,color:util>=80?'#E94560':util>=60?'#F5A623':'#27AE60'}}>{util>=80?'Full — không nhận thêm':util>=60?'Tải cao':'Có thể nhận thêm'}</div>
            </div>
          )
        })}
        {!data.team.length&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#aaa',fontSize:12}}>Chưa có thành viên</div>}
      </div>
      <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Tên','Role','Max Projects','Đang làm','Utilization','Trạng thái'].map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:600,color:'#888',borderBottom:'1px solid #eee',textAlign:'left',background:'#fafafa'}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.team.map(m=>{
              const active=data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length
              const util=m.max_projects?Math.round(active/m.max_projects*100):0
              return <tr key={m.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                <td style={{padding:'8px 10px',fontWeight:500}}>{m.name}</td>
                <td style={{padding:'8px 10px'}}>{m.role}</td>
                <td style={{padding:'8px 10px',textAlign:'center'}}>{m.max_projects||5}</td>
                <td style={{padding:'8px 10px',textAlign:'center'}}>{active}</td>
                <td style={{padding:'8px 10px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{flex:1,height:4,background:'#eee',borderRadius:2}}><div style={{height:'100%',width:util+'%',background:util>=80?'#E94560':'#185FA5',borderRadius:2}}/></div>
                    <span style={{fontSize:11,minWidth:32}}>{util}%</span>
                  </div>
                </td>
                <td style={{padding:'8px 10px',fontSize:11,color:util>=80?'#E94560':util>=60?'#F5A623':'#27AE60'}}>{util>=80?'Full':util>=60?'High':'OK'}</td>
              </tr>
            })}
            {!data.team.length&&<tr><td colSpan={6} style={{textAlign:'center',padding:20,color:'#aaa',fontSize:12}}>Chưa có thành viên</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&(
        <ModalWrap title={edit?'Sửa thành viên':'Thêm thành viên'} onClose={()=>{setEdit(null);setShowAdd(false)}}>
          <form onSubmit={saveMember}>
            <FG label="Họ tên"><input name="name" defaultValue={edit?.name||''} required/></FG>
            <Row2><FG label="Role"><select name="role" defaultValue={edit?.role||'Account Manager'}><option>Account Manager</option><option>Project Manager</option><option>Creative</option><option>KOL Executive</option><option>Performance</option><option>Finance</option><option>Director</option></select></FG><FG label="Max Projects"><input name="max_projects" type="number" defaultValue={edit?.max_projects||5}/></FG></Row2>
            <FG label="Email"><input name="email" type="email" defaultValue={edit?.email||''}/></FG>
            <ModalFooter onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>deleteRecord('team',edit.id):null}/>
          </form>
        </ModalWrap>
      )}
    </div>
  )
}

// ── REPORTS ──
function Reports({ data }) {
  const P = data.projects
  const totalRev = P.reduce((a,p)=>a+Number(p.revenue||0),0)
  const totalProfit = P.reduce((a,p)=>a+Number(p.revenue||0)-Number(p.actual_cost||0),0)
  const margin = totalRev ? Math.round(totalProfit/totalRev*100) : 0
  const won = data.deals.filter(d=>d.stage==='Won').length
  const winRate = data.deals.length ? Math.round(won/data.deals.length*100) : 0
  const byM = Array(12).fill(0)
  P.forEach(p=>{if(p.start_date){const m=new Date(p.start_date).getMonth();byM[m]+=Number(p.revenue||0)}})
  const svcs = ['KOL/KOC','Performance','Creative','Event','PR','Consulting']
  const clRev = {}
  P.forEach(p=>{if(p.client)clRev[p.client]=(clRev[p.client]||0)+Number(p.revenue||0)})
  const top5 = Object.entries(clRev).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const stageMap = {}
  data.deals.forEach(d=>stageMap[d.stage]=(stageMap[d.stage]||0)+1)
  const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']

  return (
    <div>
      <h2 style={{margin:'0 0 16px',fontSize:15,fontWeight:600}}>Báo cáo & Analytics</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        {[['Total Revenue',fmtS(totalRev),'VND','#185FA5'],['Total Profit',fmtS(totalProfit),'','#27AE60'],['Avg Margin',margin+'%','','#8B5CF6'],['Win Rate',winRate+'%','Deals','#F5A623']].map(([l,v,s,c])=>(
          <div key={l} style={{background:'#f8f9fa',borderRadius:8,padding:'12px 14px'}}><div style={{fontSize:10,color:'#888',fontWeight:500}}>{l}</div><div style={{fontSize:20,fontWeight:600,color:c}}>{v}</div><div style={{fontSize:10,color:'#aaa'}}>{s}</div></div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <Card title="Revenue theo tháng 2026">
          {months.map((m,i)=>(
            <div key={m} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
              <span style={{fontSize:10,color:'#888',width:24}}>{m}</span>
              <div style={{flex:1,height:14,background:'#f0f0f0',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:(byM[i]/(Math.max(...byM)||1)*100)+'%',background:'#185FA5',borderRadius:3}}/>
              </div>
              <span style={{fontSize:10,color:'#666',minWidth:40,textAlign:'right'}}>{fmtS(byM[i])}</span>
            </div>
          ))}
        </Card>
        <Card title="Margin theo service">
          {svcs.map((s,i)=>{
            const ps=P.filter(p=>p.service===s),r=ps.reduce((a,p)=>a+Number(p.revenue||0),0),c=ps.reduce((a,p)=>a+Number(p.actual_cost||0),0)
            const mg=r?Math.round((r-c)/r*100):0
            return <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
              <span style={{fontSize:11,width:90,flexShrink:0}}>{s}</span>
              <div style={{flex:1,height:10,background:'#f0f0f0',borderRadius:99}}><div style={{height:'100%',width:mg+'%',background:COLORS[i],borderRadius:99}}/></div>
              <span style={{fontSize:11,color:'#666',minWidth:36,textAlign:'right'}}>{mg}%</span>
            </div>
          })}
        </Card>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:14}}>
        <Card title="Top 5 clients">
          {top5.map(([nm,rv],i)=>(
            <div key={nm} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:'1px solid #f5f5f5'}}>
              <span style={{fontSize:10,color:'#aaa',width:14}}>{i+1}</span>
              <span style={{flex:1,fontSize:12,fontWeight:500}}>{nm}</span>
              <span style={{fontSize:11,color:'#185FA5'}}>{fmtS(rv)}</span>
            </div>
          ))}
          {!top5.length&&<Empty>Chưa có dữ liệu</Empty>}
        </Card>
        <Card title="Deal stages">
          {Object.entries(stageMap).map(([st,cnt])=>(
            <div key={st} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f5f5f5',fontSize:12}}>
              <span>{st}</span><div style={{display:'flex',alignItems:'center',gap:6}}><Badge text={st}/><strong>{cnt}</strong></div>
            </div>
          ))}
          {!data.deals.length&&<Empty>Chưa có deal</Empty>}
        </Card>
        <Card title="KOL usage top">
          {(()=>{const ku={};P.forEach(p=>(p.kols||[]).forEach(k=>{ku[k]=(ku[k]||0)+1}));return Object.entries(ku).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([nm,cnt])=>(
            <div key={nm} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f5f5f5',fontSize:12}}>
              <span style={{fontWeight:500}}>{nm}</span>
              <Badge text={cnt+' campaigns'}/>
            </div>
          ))})()}
        </Card>
      </div>
    </div>
  )
}

// ── UI HELPERS ──
function Card({ title, children, action }) {
  return <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:'14px 18px',marginBottom:14}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
      <span style={{fontSize:12,fontWeight:600}}>{title}</span>{action}
    </div>
    {children}
  </div>
}
function Btn({ children, onClick, primary, sm, style:s }) {
  return <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:5,padding:sm?'3px 9px':'5px 12px',borderRadius:6,border:'1px solid '+(primary?'#185FA5':'#ddd'),background:primary?'#185FA5':'#fff',color:primary?'#fff':'#333',cursor:'pointer',fontSize:sm?10:11,fontWeight:500,...s}}>{children}</button>
}
function FG({ label, children }) {
  return <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:500,color:'#666',marginBottom:4,display:'block'}}>{label}</label>{children}</div>
}
function Row2({ children }) {
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>{children}</div>
}
function Empty({ children }) {
  return <div style={{textAlign:'center',padding:'20px 0',color:'#aaa',fontSize:12}}>{children}</div>
}
function ModalWrap({ title, children, onClose }) {
  return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div style={{background:'#fff',borderRadius:12,padding:'20px 24px',width:520,maxWidth:'95vw',maxHeight:'85vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <span style={{fontSize:14,fontWeight:600}}>{title}</span>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#888',lineHeight:1,padding:'0 4px'}}>×</button>
      </div>
      {children}
    </div>
  </div>
}
function ModalFooter({ onClose, onDelete }) {
  return <div style={{display:'flex',justifyContent:'space-between',marginTop:14}}>
    <div>{onDelete&&<Btn onClick={onDelete} style={{background:'#fff0f0',color:'#E94560',borderColor:'#E94560'}}>Xóa</Btn>}</div>
    <div style={{display:'flex',gap:8}}><Btn onClick={onClose}>Huỷ</Btn><button type="submit" style={{padding:'5px 14px',borderRadius:6,border:'none',background:'#185FA5',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:500}}>Lưu</button></div>
  </div>
}
function Modal({ modal, setModal, addRecord, updateRecord, deleteRecord, data, logAudit }) {
  return null
}