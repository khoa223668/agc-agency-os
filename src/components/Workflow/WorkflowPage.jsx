import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { STAGES, STAGE_TASKS, PRIORITY_COLOR, TASK_STATUS_COLOR } from './workflowConstants.js'
import { ProjectWorkflowDetail } from './ProjectDetail.jsx'
// ══════════════════════════════════════════════════════════
function WorkflowPage({data, supabase, reload, log, currentUser, goTo}) {
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
          <button
            onClick={()=>goTo?.('projects')}
            style={{
              padding:'8px 12px',
              borderRadius:10,
              border:'none',
              background:'linear-gradient(135deg,#1A56DB,#06B6D4)',
              color:'#fff',
              cursor:'pointer',
              fontSize:12,
              fontWeight:700,
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:'0 6px 18px rgba(26,86,219,0.2)',
            }}
            title="Tạo dự án để bắt đầu workflow & tasks"
          >
            + Dự án
          </button>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Tìm dự án..."
            style={{padding:'7px 12px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:9,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',width:200}}/>
          <select value={filterStage} onChange={e=>setFilterStage(e.target.value)}
            style={{padding:'7px 10px',border:'1.5px solid rgba(26,86,219,0.15)',borderRadius:9,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none'}}>
            <option value="">Tất cả stages</option>
            {STAGES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          </select>
          <div style={{display:'flex',background:'rgba(255,255,255,0.7)',borderRadius:9,border:'1px solid rgba(26,86,219,0.1)',overflow:'hidden'}}>
            {[['board','⊞'],['list','≡']].map(([v,icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:'7px 12px',border:'none',background:view===v?'linear-gradient(135deg,#1A56DB,#06B6D4)':'transparent',color:view===v?'#fff':'#94A3B8',cursor:'pointer',fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage pipeline overview */}
      <div style={{display:'flex',gap:0,marginBottom:20,background:'rgba(255,255,255,0.8)',borderRadius:14,padding:'14px 16px',border:'1px solid rgba(26,86,219,0.1)',overflowX:'auto'}}>
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
              <div style={{fontWeight:800,color:'#0F172A',fontSize:14,marginBottom:6}}>Chưa có dự án nào</div>
              <div style={{marginBottom:14}}>Tạo dự án để bắt đầu workflow → mở dự án → tab Tasks/Approvals/KPIs.</div>
              <button
                onClick={()=>goTo?.('projects')}
                style={{
                  padding:'10px 14px',
                  borderRadius:12,
                  border:'1px solid rgba(26,86,219,0.18)',
                  background:'rgba(26,86,219,0.06)',
                  color:'#1A56DB',
                  cursor:'pointer',
                  fontSize:12,
                  fontWeight:700,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                }}
              >
                + Tạo dự án
              </button>
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {view==='list'&&(
        <div style={{background:'rgba(255,255,255,0.9)',borderRadius:16,overflow:'auto',border:'1px solid rgba(26,86,219,0.1)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr>
                {['Project','Client','Stage','PM','Priority','Progress','Deadline',''].map(h=>(
                  <th key={h} style={{padding:'10px 14px',fontSize:10,fontWeight:800,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p=>{
                const stage = STAGES.find(s=>s.id===(p.current_stage||'LEAD'))
                const urgentStyle = p.is_urgent?{background:'rgba(220,38,38,0.03)'}:{}
                return <tr key={p.id} style={{borderBottom:'1px solid rgba(26,86,219,0.06)',...urgentStyle}}>
                  <td style={{padding:'11px 14px'}}>
                    <div style={{fontWeight:700,fontSize:12.5,color:'#0F172A'}}>{p.campaign||'—'}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>{p.project_code}</div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:12,color:'#475569'}}>{p.client||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    <span style={{background:stage?.color+'18',color:stage?.color,padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,border:`1px solid ${stage?.color}25`}}>
                      {stage?.icon} {stage?.label}
                    </span>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:12,color:'#475569'}}>{p.pm||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    {p.is_urgent&&<span style={{background:'rgba(220,38,38,0.1)',color:'#DC2626',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:700}}>🔥 URGENT</span>}
                    {!p.is_urgent&&<span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 8px',borderRadius:99,fontSize:10,fontWeight:600}}>{p.priority||'Normal'}</span>}
                  </td>
                  <td style={{padding:'11px 14px'}}>
                    <StageProgress current={p.current_stage||'LEAD'}/>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:11,color:'#94A3B8'}}>{p.end_date||'—'}</td>
                  <td style={{padding:'11px 14px'}}>
                    <button onClick={()=>setSelectedProject(p)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
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
export default WorkflowPage
