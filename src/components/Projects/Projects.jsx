import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


function Projects({data,add,upd,del,log,reload,supabase}){
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
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Quản lý dự án</h2><div style={{display:'flex',gap:8}}><ImportBtn module="projects" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Dự án mới</Btn></div></div>
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
export default Projects
