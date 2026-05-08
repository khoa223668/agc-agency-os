import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


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
export default Team
