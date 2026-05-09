import { useState } from 'react'
import { fmtS } from '../../lib/helpers.jsx'

export default function Dashboard({ data, setPage, currentUser }) {
  const rev = data.projects.reduce((a,p) => a + Number(p.revenue||0), 0)
  const cost = data.projects.reduce((a,p) => a + Number(p.actual_cost||0), 0)
  const profit = rev - cost
  const margin = rev ? Math.round(profit/rev*100) : 0
  const active = data.projects.filter(p => p.status==='Active' || p.current_stage==='EXECUTION').length
  const overdue = data.invoices.filter(i => i.status==='Overdue')
  const pendingAppr = data.approvals.filter(a => a.status==='Pending')
  const won = data.deals.filter(d => d.stage==='Won').length
  const wr = data.deals.length ? Math.round(won/data.deals.length*100) : 0
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = currentUser?.name?.split(' ').slice(-1)[0] || 'Khoa'

  const byM = Array(12).fill(0)
  data.projects.forEach(p => {
    if (p.start_date) byM[new Date(p.start_date).getMonth()] += Number(p.revenue||0)
  })
  const maxM = Math.max(...byM, 1)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const myPending = currentUser?.isMaster ? pendingAppr :
    pendingAppr.filter(a => {
      const role = (currentUser?.role||''). toLowerCase()
      return (a.type==='Finance' && role.includes('finance')) ||
             (a.type==='Director' && (role.includes('director')||role.includes('gi\u00e1m')))
    })

  const kpiCards = [
    { label:'Total Revenue', value:fmtS(rev), sub:'VND', color:'#00D4FF', trend:'+0%' },
    { label:'Net Profit', value:fmtS(profit), sub:margin+'% margin', color:'#10B981', trend:'+0%' },
    { label:'Active Projects', value:active, sub:data.projects.length+' total', color:'#8B5CF6', trend:'' },
    { label:'KOL Database', value:data.kols.length, sub:'contacts', color:'#F59E0B', trend:'' },
    { label:'Clients', value:data.clients.length, sub:'active', color:'#4F8EF7', trend:'' },
    { label:'Win Rate', value:wr+'%', sub:won+'/'+data.deals.length+' deals', color:wr>=50?'#10B981':'#F59E0B', trend:'' },
  ]

  const stageData = [
    ['LEAD','#64748B'],['BRIEF','#3B82F6'],['PROPOSAL','#8B5CF6'],
    ['PRICING','#F59E0B'],['CONTRACT','#00D4FF'],['EXECUTION','#10B981'],['PAYMENT','#4F8EF7'],
  ]

  return (
    <div style={{width:'100%',fontFamily:"'Inter','Plus Jakarta Sans',sans-serif"}}>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <div style={{fontSize:11,color:'#475569',fontWeight:500,marginBottom:4,letterSpacing:'0.04em',textTransform:'uppercase'}}>{greeting}</div>
          <div style={{fontSize:26,fontWeight:800,color:'#F1F5F9',letterSpacing:'-0.03em',lineHeight:1.2}}>
            {firstName},{' '}
            <span style={{background:'linear-gradient(135deg,#4F8EF7,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Welcome back.
            </span>
          </div>
          <div style={{fontSize:11,color:'#334155',marginTop:5}}>
            {now.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            {'  ·  '}{data.projects.filter(p=>p.status==='Active').length} active projects
          </div>
        </div>
        {myPending.length > 0 && (
          <button onClick={() => setPage('approval')} style={{
            display:'flex',alignItems:'center',gap:10,
            padding:'10px 16px',borderRadius:10,cursor:'pointer',
            background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',
            fontFamily:"'Inter',sans-serif",transition:'all 0.15s'
          }}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#EF4444',boxShadow:'0 0 6px rgba(239,68,68,0.8)'}}/>
            <span style={{fontSize:12,fontWeight:600,color:'#FCA5A5'}}>{myPending.length} pending approval{myPending.length>1?'s':''}</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:16}}>
        {kpiCards.map(({label,value,sub,color,trend}) => (
          <div key={label} style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:12,padding:'16px 14px',
            position:'relative',overflow:'hidden',
            transition:'border-color 0.2s,transform 0.2s',cursor:'default'
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=color+'40';e.currentTarget.style.transform='translateY(-1px)'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`}}/>
            <div style={{fontSize:9,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{label}</div>
            <div style={{fontSize:22,fontWeight:800,color:'#F1F5F9',letterSpacing:'-0.02em',lineHeight:1}}>{value}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6}}>
              <span style={{fontSize:10,color:'#475569'}}>{sub}</span>
              {trend&&<span style={{fontSize:9,color:'#10B981',fontWeight:600}}>{trend}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:12,marginBottom:12}}>
        {/* Revenue Chart */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'18px 20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'#F1F5F9',letterSpacing:'-0.01em'}}>Revenue Overview</div>
              <div style={{fontSize:10,color:'#334155',marginTop:2}}>2026 · Monthly · VND</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {[['Total',fmtS(rev),'#00D4FF'],['This month',fmtS(byM[now.getMonth()]),'#8B5CF6'],['Avg',fmtS(Math.round(rev/12)),'#10B981']].map(([l,v,c])=>(
                <div key={l} style={{textAlign:'center',padding:'5px 10px',borderRadius:7,background:c+'10',border:`1px solid ${c}20`}}>
                  <div style={{fontSize:8,color:c,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:700,color:'#F1F5F9',marginTop:1}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:3,height:110}}>
            {months.map((m,i) => {
              const h = byM[i] ? Math.max(8, Math.round(byM[i]/maxM*100)) : 3
              const isNow = i === now.getMonth()
              const isPast = i < now.getMonth()
              return (
                <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{
                    width:'100%',borderRadius:'3px 3px 1px 1px',minHeight:3,
                    height:h+'%',
                    background: isNow ? 'linear-gradient(180deg,#00D4FF,#4F8EF7)' : isPast&&byM[i]>0 ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.04)',
                    boxShadow: isNow ? '0 0 12px rgba(0,212,255,0.35)' : 'none',
                  }}/>
                  <div style={{fontSize:8,color:isNow?'#00D4FF':'#2D3748',fontWeight:isNow?700:400}}>{m}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'18px 18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:'#F1F5F9'}}>Project Pipeline</div>
            <button onClick={()=>setPage('workflow')} style={{fontSize:10,color:'#4F8EF7',background:'none',border:'none',cursor:'pointer',fontFamily:"'Inter',sans-serif",fontWeight:500}}>View all →</button>
          </div>
          {stageData.map(([stage,c]) => {
            const cnt = data.projects.filter(p => (p.current_stage||'LEAD')===stage).length
            const pct = data.projects.length ? Math.round(cnt/data.projects.length*100) : 0
            return (
              <div key={stage} style={{marginBottom:9}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:10,color:'#475569',fontWeight:500,letterSpacing:'0.02em'}}>{stage}</span>
                  <span style={{fontSize:10,fontWeight:700,color:cnt>0?c:'#334155'}}>{cnt}</span>
                </div>
                <div style={{height:3,background:'rgba(255,255,255,0.05)',borderRadius:99,overflow:'hidden'}}>
                  <div style={{height:'100%',width:pct+'%',background:c,borderRadius:99,transition:'width 0.5s ease'}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        {/* Active Projects */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'16px 18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:'#F1F5F9'}}>Active Projects</div>
            <button onClick={()=>setPage('workflow')} style={{fontSize:10,color:'#4F8EF7',background:'none',border:'none',cursor:'pointer',fontWeight:500,fontFamily:"'Inter',sans-serif"}}>Workflow →</button>
          </div>
          {data.projects.filter(p => ['Active','EXECUTION','PRE_PRODUCTION'].includes(p.status||p.current_stage||'')).slice(0,4).map(p => (
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div style={{flex:1,minWidth:0,marginRight:8}}>
                <div style={{fontWeight:600,fontSize:12,color:'#CBD5E1',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.campaign||'—'}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                  <div style={{width:4,height:4,borderRadius:'50%',background:'#10B981'}}/>
                  <div style={{fontSize:10,color:'#475569'}}>{p.client||'—'}</div>
                </div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:700,color:'#00D4FF'}}>{p.revenue?fmtS(Number(p.revenue)):'-'}</div>
                <div style={{fontSize:9,color:'#10B981',fontWeight:600,marginTop:1,textTransform:'uppercase',letterSpacing:'0.03em'}}>{p.current_stage||p.status||'—'}</div>
              </div>
            </div>
          ))}
          {!data.projects.filter(p => p.status==='Active').length &&
            <div style={{textAlign:'center',padding:'18px 0',color:'#2D3748',fontSize:11}}>No active projects</div>}
        </div>

        {/* Overdue Invoices */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'16px 18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:'#F1F5F9'}}>Outstanding Invoices</div>
            <button onClick={()=>setPage('invoices')} style={{fontSize:10,color:'#4F8EF7',background:'none',border:'none',cursor:'pointer',fontWeight:500,fontFamily:"'Inter',sans-serif"}}>View →</button>
          </div>
          {overdue.slice(0,4).map(inv => (
            <div key={inv.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'#CBD5E1'}}>{inv.client}</div>
                <div style={{fontSize:10,color:'#EF4444',marginTop:1,fontWeight:500}}>Overdue</div>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:'#FCA5A5'}}>{fmtS(Number(inv.amount)-Number(inv.paid||0))}</span>
            </div>
          ))}
          {!overdue.length && (
            <div style={{textAlign:'center',padding:'18px 0'}}>
              <div style={{fontSize:11,color:'#10B981',fontWeight:600'}}>All invoices cleared</div>
              <div style={{fontSize:10,color:'#334155',marginTop:2}}>No outstanding payments</div>
            </div>
          )}
        </div>

        {/* Approvals & Actions */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'16px 18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:'#F1F5F9'}}>{currentUser?.isMaster ? 'Approval Queue' : 'My Approvals'}</div>
            <button onClick={()=>setPage('approval')} style={{fontSize:10,color:'#4F8EF7',background:'none',border:'none',cursor:'pointer',fontWeight:500,fontFamily:"'Inter',sans-serif"}}>Review →</button>
          </div>

          {myPending.length === 0 ? (
            <div style={{textAlign:'center',padding:'14px 0'}}>
              <div style={{fontSize:11,color:'#10B981',fontWeight:600'}}>Queue clear</div>
              <div style={{fontSize:10,color:'#334155',marginTop:2}}>
                {!currentUser?.isMaster && pendingAppr.length > 0 ? 'Nothing requires your action' : 'No pending approvals'}
              </div>
            </div>
          ) : (
            myPending.slice(0,3).map(a => (
              <div key={a.id} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                  <div style={{fontSize:11,fontWeight:600,color:'#CBD5E1',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title||a.type||'Approval'}</div>
                  <span style={{flexShrink:0,fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,background:'rgba(245,158,11,0.1)',color:'#F59E0B',border:'1px solid rgba(245,158,11,0.2)'}}>PENDING</span>
                </div>
                <div style={{fontSize:10,color:'#334155',marginTop:2}}>{a.created_at?.slice(0,10)||'—'}</div>
              </div>
            ))
          )}

          {/* Quick actions */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.04)'}}>
            {[['New Quote','quotations','#F59E0B'],['New KOL','kols','#8B5CF6'],['New Project','projects','#4F8EF7'],['Workflow','workflow','#10B981']].map(([l,pg,c]) => (
              <button key={pg} onClick={() => setPage(pg)} style={{
                padding:'7px 8px',borderRadius:7,
                border:`1px solid ${c}20`,background:c+'0A',
                color:c,cursor:'pointer',fontSize:10,fontWeight:600,
                fontFamily:"'Inter',sans-serif",letterSpacing:'0.01em'
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
