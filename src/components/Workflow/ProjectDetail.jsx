import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { STAGES, STAGE_TASKS, PRIORITY_COLOR, TASK_STATUS_COLOR, APPROVAL_ROLES, sendNotification } from './workflowConstants.js'
// ══════════════════════════════════════════════════════════
function ProjectWorkflowDetail({project, data, supabase, reload, log, currentUser, onClose, onUpdate}) {
  const [tasks, setTasks] = useState([])
  const [approvals, setApprovals] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [showStageChange, setShowStageChange] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(()=>{ loadData() },[project.id])

  async function loadData() {
    setLoading(true)
    const [t, a, n] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', project.id).order('created_at'),
      supabase.from('stage_approvals').select('*').eq('project_id', project.id).order('created_at',{ascending:false}),
      supabase.from('notifications').select('*').eq('data->>project_id', project.id).order('created_at',{ascending:false}).limit(20),
    ])
    setTasks(t.data||[])
    setApprovals(a.data||[])
    setNotifications(n.data||[])
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

  async function changeStage(newStage) {
    // Check if required approvals are done
    const currentStage = project.current_stage||'LEAD'
    const pendingApprovals = approvals.filter(a=>a.stage===currentStage&&a.status==='Pending')
    if(pendingApprovals.length > 0) {
      alert(`⚠️ Còn ${pendingApprovals.length} approval chưa được xử lý ở stage hiện tại!`)
      return
    }

    // Special checks
    if(newStage==='EXECUTION') {
      const plApproved = approvals.some(a=>a.stage==='PRICING'&&a.approval_type==='PL_FINANCE'&&a.status==='Approved')
      const dirApproved = approvals.some(a=>a.stage==='PRICING'&&a.approval_type==='DIRECTOR'&&a.status==='Approved')
      if(!plApproved||!dirApproved) {
        alert('⚠️ Cần Finance duyệt P&L và Director duyệt trước khi vào EXECUTION!')
        return
      }
    }

    await supabase.from('projects').update({
      current_stage: newStage,
      stage_history: [...(project.stage_history||[]), {stage:currentStage, completed_at:new Date().toISOString(), moved_by:currentUser?.name}]
    }).eq('id', project.id)

    await initStageTasks(newStage)
    await reload()
    onUpdate({...project, current_stage:newStage})
    log(`Stage: ${project.campaign} → ${newStage}`)
    setShowStageChange(false)
  }

  async function saveTask(taskData) {
    if(editTask) {
      await supabase.from('tasks').update(taskData).eq('id', editTask.id)
    } else {
      await supabase.from('tasks').insert([{...taskData, project_id:project.id, stage:project.current_stage||'LEAD'}])
    }
    // Send notification if assigned
    if(taskData.assigned_to && taskData.assigned_to !== editTask?.assigned_to) {
      const member = data.team.find(m=>m.name===taskData.assigned_to)
      if(member?.email) {
        await sendNotification(supabase, {
          recipient_email: member.email,
          recipient_name: member.name,
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

  async function updateTaskStatus(taskId, status) {
    const updates = {status}
    if(status==='Done') updates.completed_at = new Date().toISOString()
    if(status==='Done') {
      // Calculate if late
      const task = tasks.find(t=>t.id===taskId)
      if(task?.due_date) {
        const due = new Date(task.due_date)
        const now = new Date()
        if(now > due) {
          updates.late_minutes = Math.round((now-due)/60000)
        }
      }
    }
    await supabase.from('tasks').update(updates).eq('id', taskId)
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
  const stageTasks = tasks.filter(t=>t.stage===project.current_stage||'LEAD')
  const doneTasks = stageTasks.filter(t=>t.status==='Done').length
  const stageCompletion = stageTasks.length ? Math.round(doneTasks/stageTasks.length*100) : 0
  const pendingApprovals = approvals.filter(a=>a.status==='Pending')

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',display:'flex',alignItems:'stretch',justifyContent:'flex-end',zIndex:2000,backdropFilter:'blur(4px)'}}>
      <div style={{width:'85vw',maxWidth:1100,background:'#F0F4FF',overflowY:'auto',display:'flex',flexDirection:'column',boxShadow:'-20px 0 60px rgba(0,0,0,0.2)'}}>

        {/* Project header */}
        <div style={{background:`linear-gradient(135deg,#0F172A,${currentStageData.color}88)`,padding:'24px 28px',position:'relative',overflow:'hidden',flexShrink:0}}>
          <div style={{position:'absolute',top:-30,right:-30,width:150,height:150,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',position:'relative'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <span style={{background:currentStageData.color+'30',color:currentStageData.color,padding:'4px 12px',borderRadius:99,fontSize:11,fontWeight:700,border:`1px solid ${currentStageData.color}40`}}>
                  {currentStageData.icon} {currentStageData.label}
                </span>
                {project.is_urgent&&<span style={{background:'rgba(220,38,38,0.3)',color:'#FCA5A5',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700}}>🔥 URGENT</span>}
                {pendingApprovals.length>0&&<span style={{background:'rgba(245,158,11,0.3)',color:'#FCD34D',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700}}>⏳ {pendingApprovals.length} pending approval</span>}
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

          {/* Stage progress timeline */}
          <div style={{display:'flex',alignItems:'center',marginTop:18,gap:0}}>
            {STAGES.map((s,i)=>(
              <div key={s.id} style={{display:'flex',alignItems:'center',flex:i<STAGES.length-1?1:'auto'}}>
                <div style={{
                  width:28,height:28,borderRadius:'50%',flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,
                  background:i<currentStageIdx?'#059669':i===currentStageIdx?currentStageData.color:'rgba(255,255,255,0.15)',
                  border:i===currentStageIdx?`2px solid ${currentStageData.color}`:'2px solid transparent',
                  boxShadow:i===currentStageIdx?`0 0 10px ${currentStageData.color}80`:'none',
                  cursor:'pointer',
                }} title={s.label}>
                  {i<currentStageIdx?'✓':s.icon}
                </div>
                {i<STAGES.length-1&&<div style={{flex:1,height:2,background:i<currentStageIdx?'#059669':'rgba(255,255,255,0.1)',margin:'0 2px'}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:'rgba(255,255,255,0.7)',borderBottom:'1px solid rgba(26,86,219,0.1)',padding:'0 28px',display:'flex',gap:0,flexShrink:0}}>
          {[['overview','📊 Tổng quan'],['tasks','✅ Tasks'],['approvals','🔐 Approvals'],['kpi','📈 KPIs'],['activity','🔔 Activity']].map(([id,label])=>(
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
              {/* KPI cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
                {[
                  ['Stage hiện tại',currentStageData.label+' ('+Math.round((currentStageIdx+1)/STAGES.length*100)+'%)',currentStageData.icon,currentStageData.color],
                  ['Tasks stage này',`${doneTasks}/${stageTasks.length} done (${stageCompletion}%)`,stageTasks.filter(t=>t.status==='In Progress').length+' đang làm','#1A56DB'],
                  ['Pending approvals',pendingApprovals.length,pendingApprovals.length?'Cần xử lý':'OK ✓',pendingApprovals.length?'#DC2626':'#059669'],
                  ['Revenue',project.revenue?Number(project.revenue).toLocaleString('vi-VN'):'—','VND','#059669'],
                ].map(([l,v,s,c])=>(
                  <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'14px 16px',border:`1px solid ${c}20`}}>
                    <div style={{fontSize:10,fontWeight:700,color:c,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:900,color:'#0F172A'}}>{v}</div>
                    <div style={{fontSize:10,color:'#94A3B8',marginTop:3}}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Stage tasks summary */}
              <div style={{background:'rgba(255,255,255,0.9)',borderRadius:14,padding:'18px 20px',marginBottom:16,border:'1px solid rgba(26,86,219,0.1)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:800,color:'#0F172A'}}>Tasks — {currentStageData.icon} {currentStageData.label}</div>
                  <div style={{display:'flex',gap:8}}>
                    {stageTasks.length===0&&(
                      <button onClick={()=>initStageTasks(project.current_stage||'LEAD')} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                        ⚡ Khởi tạo tasks cho stage này
                      </button>
                    )}
                    <button onClick={()=>{setEditTask(null);setShowTaskForm(true)}} style={{padding:'6px 14px',borderRadius:8,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                      + Task
                    </button>
                  </div>
                </div>
                {stageTasks.slice(0,5).map(t=><TaskRow key={t.id} task={t} onStatusChange={updateTaskStatus} onEdit={()=>{setEditTask(t);setShowTaskForm(true)}}/>)}
                {stageTasks.length>5&&<div style={{fontSize:11,color:'#94A3B8',textAlign:'center',marginTop:8,cursor:'pointer'}} onClick={()=>setActiveTab('tasks')}>+ {stageTasks.length-5} tasks khác → Xem tất cả</div>}
                {!stageTasks.length&&<div style={{textAlign:'center',padding:'20px 0',color:'#94A3B8',fontSize:12}}>Chưa có tasks. Click "Khởi tạo tasks" để tạo tự động.</div>}
              </div>

              {/* Required approvals for current stage */}
              <ApprovalPanel
                project={project} stage={project.current_stage||'LEAD'}
                approvals={approvals} currentUser={currentUser}
                onRequest={requestApproval} onResolve={resolveApproval}
              />
            </div>
          )}

          {/* TASKS TAB */}
          {!loading&&activeTab==='tasks'&&(
            <TasksTab
              tasks={tasks} project={project} data={data}
              onStatusChange={updateTaskStatus}
              onEdit={(t)=>{setEditTask(t);setShowTaskForm(true)}}
              onAdd={()=>{setEditTask(null);setShowTaskForm(true)}}
              onInit={()=>initStageTasks(project.current_stage||'LEAD')}
              currentStage={project.current_stage||'LEAD'}
            />
          )}

          {/* APPROVALS TAB */}
          {!loading&&activeTab==='approvals'&&(
            <ApprovalsTab
              approvals={approvals} project={project} currentUser={currentUser}
              onRequest={requestApproval} onResolve={resolveApproval}
            />
          )}

          {/* KPI TAB */}
          {!loading&&activeTab==='kpi'&&(
            <KPITab tasks={tasks} project={project} data={data}/>
          )}

          {/* ACTIVITY TAB */}
          {!loading&&activeTab==='activity'&&(
            <ActivityTab notifications={notifications} project={project}/>
          )}
        </div>
      </div>

      {/* Stage change modal */}
      {showStageChange&&(
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#fff',borderRadius:18,padding:'24px 28px',width:480,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <div style={{fontSize:15,fontWeight:800,color:'#0F172A',marginBottom:16}}>Chuyển Stage dự án</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
              {STAGES.map((s,i)=>{
                const isCurrent = s.id===(project.current_stage||'LEAD')
                const isPrev = i < STAGES.findIndex(st=>st.id===(project.current_stage||'LEAD'))
                return <button key={s.id} onClick={()=>changeStage(s.id)}
                  disabled={isCurrent}
                  style={{
                    padding:'10px 12px',borderRadius:10,border:`1.5px solid ${isCurrent?s.color:isPrev?'rgba(5,150,105,0.3)':'rgba(26,86,219,0.15)'}`,
                    background:isCurrent?s.color+'18':isPrev?'rgba(5,150,105,0.06)':'rgba(255,255,255,0.8)',
                    color:isCurrent?s.color:isPrev?'#059669':'#475569',
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
            <div style={{padding:'10px 14px',background:'rgba(217,119,6,0.06)',borderRadius:8,border:'1px solid rgba(217,119,6,0.2)',fontSize:11,color:'#92400E',marginBottom:14}}>
              ⚠️ Vào EXECUTION cần Finance & Director đã approve P&L. Vào PAYMENT cần có BBNT.
            </div>
            <button onClick={()=>setShowStageChange(false)} style={{width:'100%',padding:'9px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.15)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
          </div>
        </div>
      )}

      {/* Task form */}
      {showTaskForm&&(
        <TaskForm
          task={editTask} project={project} data={data}
          onSave={saveTask}
          onClose={()=>{setShowTaskForm(false);setEditTask(null)}}
          currentStage={project.current_stage||'LEAD'}
        />
      )}
    </div>
  )
}

// ── TASK ROW ─────────────────────────────────────────────
function TaskRow({task:t, onStatusChange, onEdit}) {
  const isLate = t.due_date && new Date(t.due_date)<new Date() && t.status!=='Done'
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
      <select value={t.status} onChange={e=>onStatusChange(t.id,e.target.value)}
        style={{padding:'3px 6px',borderRadius:6,border:`1px solid ${TASK_STATUS_COLOR[t.status]||'#94A3B8'}30`,background:(TASK_STATUS_COLOR[t.status]||'#94A3B8')+'15',color:TASK_STATUS_COLOR[t.status]||'#94A3B8',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        {['Todo','In Progress','Review','Done','Blocked'].map(s=><option key={s}>{s}</option>)}
      </select>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,color:t.status==='Done'?'#94A3B8':'#0F172A',textDecoration:t.status==='Done'?'line-through':'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {t.requires_approval&&<span style={{marginRight:4,fontSize:10}}>🔐</span>}
          {t.priority==='Urgent'&&<span style={{marginRight:4,fontSize:10}}>🔥</span>}
          {t.title}
        </div>
        <div style={{fontSize:10,color:'#94A3B8',marginTop:1}}>
          {t.assigned_to?`👤 ${t.assigned_to}`:'Chưa assign'}
          {t.due_date&&<span style={{marginLeft:8,color:isLate?'#DC2626':'#94A3B8'}}>📅 {t.due_date}{isLate?' ⚠️ Trễ':''}</span>}
        </div>
      </div>
      <span style={{background:(PRIORITY_COLOR[t.priority]||'#94A3B8')+'15',color:PRIORITY_COLOR[t.priority]||'#94A3B8',padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:700,flexShrink:0}}>{t.priority}</span>
      <button onClick={onEdit} style={{background:'none',border:'none',cursor:'pointer',color:'#94A3B8',fontSize:14,padding:'2px 6px',borderRadius:5}}>✎</button>
    </div>
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
            style={{padding:'6px 10px',border:'1.5px solid rgba(26,86,219,0.12)',borderRadius:8,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none'}}>
            <option value="">Tất cả stages</option>
            {STAGES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          </select>
          <select value={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)}
            style={{padding:'6px 10px',border:'1.5px solid rgba(26,86,219,0.12)',borderRadius:8,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none'}}>
            <option value="">Tất cả assignees</option>
            {data.team.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onInit} style={{padding:'7px 14px',borderRadius:8,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>⚡ Auto-tạo tasks</button>
          <button onClick={onAdd} style={{padding:'7px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Task mới</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
        {['Todo','In Progress','Review','Done','Blocked'].map(s=>{
          const cnt = filtered.filter(t=>t.status===s).length
          return <div key={s} style={{background:'rgba(255,255,255,0.9)',borderRadius:10,padding:'10px 12px',border:`1px solid ${TASK_STATUS_COLOR[s]||'#94A3B8'}20`,textAlign:'center'}}>
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
            <div style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'12px 16px',border:`1px solid ${stage.color}15`}}>
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
    <div style={{background:'rgba(255,255,255,0.9)',borderRadius:14,padding:'18px 20px',border:'1px solid rgba(26,86,219,0.1)'}}>
      <div style={{fontSize:13,fontWeight:800,color:'#0F172A',marginBottom:14}}>🔐 Approvals — Stage {stage}</div>
      {needed.map(item=>{
        const existing = approvals.find(a=>a.stage===stage&&a.approval_type===item.type)
        const isPending = existing?.status==='Pending'
        const isApproved = existing?.status==='Approved'
        const isRejected = existing?.status==='Rejected'
        const canResolve = currentUser?.isMaster || currentUser?.role?.includes(item.role)

        return (
          <div key={item.type} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',marginBottom:8,background:isApproved?'rgba(5,150,105,0.06)':isRejected?'rgba(220,38,38,0.06)':isPending?'rgba(245,158,11,0.06)':'rgba(248,250,255,0.8)',borderRadius:10,border:`1px solid ${isApproved?'rgba(5,150,105,0.2)':isRejected?'rgba(220,38,38,0.2)':isPending?'rgba(245,158,11,0.2)':'rgba(26,86,219,0.1)'}`}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#0F172A'}}>{item.icon} {item.label}</div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>{item.desc}</div>
              {existing?.comment&&<div style={{fontSize:10,color:'#475569',marginTop:3,fontStyle:'italic'}}>"{existing.comment}"</div>}
              {existing?.reviewed_by&&<div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>Bởi: {existing.reviewed_by} — {existing.reviewed_at?new Date(existing.reviewed_at).toLocaleDateString('vi-VN'):''}</div>}
            </div>
            <div style={{flexShrink:0,marginLeft:12}}>
              {!existing&&(
                <button onClick={()=>onRequest(item.type, stage)} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Gửi yêu cầu</button>
              )}
              {isPending&&canResolve&&(
                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>onResolve(existing.id, true)} style={{padding:'6px 12px',borderRadius:8,border:'none',background:'rgba(5,150,105,0.1)',color:'#059669',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",border:'1px solid rgba(5,150,105,0.3)'}}>✓ Approve</button>
                  <button onClick={()=>onResolve(existing.id, false, prompt('Lý do reject:'))} style={{padding:'6px 12px',borderRadius:8,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>✗ Reject</button>
                </div>
              )}
              {isPending&&!canResolve&&<span style={{background:'rgba(245,158,11,0.1)',color:'#D97706',padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:600,border:'1px solid rgba(245,158,11,0.2)'}}>⏳ Chờ duyệt</span>}
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
              <div key={a.id} style={{background:'rgba(255,255,255,0.9)',borderRadius:10,padding:'12px 16px',marginBottom:8,border:'1px solid rgba(26,86,219,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
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
      <div style={{background:'rgba(26,86,219,0.04)',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid rgba(26,86,219,0.1)',fontSize:11,color:'#475569'}}>
        <strong>Công thức KPI:</strong> Completion Rate (40%) + On-time Rate (40%) + Weighted Task Score (20%)
      </div>

      {members.map(member=>{
        const kpi = calcKPI(member)
        if(!kpi) return null
        const scoreColor = kpi.kpiScore>=80?'#059669':kpi.kpiScore>=60?'#D97706':'#DC2626'
        return (
          <div key={member} style={{background:'rgba(255,255,255,0.9)',borderRadius:14,padding:'18px 20px',marginBottom:12,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13}}>
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

            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
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
                  <div style={{height:6,background:'rgba(26,86,219,0.08)',borderRadius:99,overflow:'hidden'}}>
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
        <div key={n.id} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(26,86,219,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>
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

  const INP={width:'100%',padding:'8px 11px',border:'1.5px solid rgba(26,86,219,0.12)',borderRadius:8,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000,backdropFilter:'blur(4px)'}}>
      <div style={{background:'#fff',borderRadius:18,padding:'24px 26px',width:520,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:15,fontWeight:800,color:'#0F172A'}}>{task?'Sửa task':'Tạo task mới'}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:13}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Tiêu đề task *</label>
            <input value={form.title} onChange={e=>set('title',e.target.value)} style={INP} required/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Stage</label>
              <select value={form.stage} onChange={e=>set('stage',e.target.value)} style={INP}>
                {STAGES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Assign cho</label>
              <select value={form.assigned_to} onChange={e=>set('assigned_to',e.target.value)} style={INP}>
                <option value="">— Chọn thành viên —</option>
                {data.team.map(m=><option key={m.id} value={m.name}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Priority</label>
              <select value={form.priority} onChange={e=>set('priority',e.target.value)} style={INP}>
                <option>Urgent</option><option>High</option><option>Normal</option><option>Low</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Status</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)} style={INP}>
                <option>Todo</option><option>In Progress</option><option>Review</option><option>Done</option><option>Blocked</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>KPI Weight (1-5)</label>
              <select value={form.kpi_weight} onChange={e=>set('kpi_weight',Number(e.target.value))} style={INP}>
                <option value={1}>1 — Nhỏ</option><option value={2}>2</option><option value={3}>3 — Vừa</option><option value={4}>4</option><option value={5}>5 — Quan trọng</option>
              </select>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:13}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Deadline</label>
              <input type="date" value={form.due_date} onChange={e=>set('due_date',e.target.value)} style={INP}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,justifyContent:'center'}}>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:'#475569'}}>
                <input type="checkbox" checked={form.requires_approval} onChange={e=>set('requires_approval',e.target.checked)} style={{accentColor:'#1A56DB',width:15,height:15}}/>
                🔐 Cần approval
              </label>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:'#DC2626'}}>
                <input type="checkbox" checked={form.is_urgent} onChange={e=>set('is_urgent',e.target.checked)} style={{accentColor:'#DC2626',width:15,height:15}}/>
                🔥 Urgent
              </label>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Ghi chú</label>
            <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...INP,minHeight:70}}/>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <button type="button" onClick={onClose} style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.12)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Lưu task</button>
          </div>
        </form>
      </div>
    </div>
  )
export { ProjectWorkflowDetail }
