import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


function Pipeline({data,add,upd,del,log,reload,supabase}){
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
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Deal Pipeline</h2><div style={{display:'flex',gap:8}}><ImportBtn module="deals" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd('Lead')}>+ New Deal</Btn></div></div>
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
export default Pipeline
