import { useState } from 'react'
import { B } from '../../theme.js'
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
      const role = (currentUser?.role||'').toLowerCase()
      return (a.type==='Finance' && role.includes('finance')) ||
             (a.type==='Director' && (role.includes('director')||role.includes('giám')))
    })

  const kpiCards = [
    { l:'REVENUE', v:fmtS(rev), s:'VND', c:'#00D4FF', e:'💹', pg:'reports' },
    { l:'PROFIT',  v:fmtS(profit), s:margin+'% margin', c:'#10B981', e:'📈', pg:'reports' },
    { l:'PROJECTS',v:active, s:data.projects.length+' tổng', c:'#8B5CF6', e:'🚀', pg:'workflow' },
    { l:'KOL DB',  v:data.kols.length, s:'contacts', c:'#F59E0B', e:'⭐', pg:'kols' },
    { l:'CLIENTS', v:data.clients.length, s:'active', c:'#4F8EF7', e:'🏢', pg:'clients' },
    { l:'WIN RATE',v:wr+'%', s:won+'/'+data.deals.length+' deals', c:wr>=50?'#10B981':'#F59E0B', e:'🎯', pg:'pipeline' },
  ]

  const stages = [
    ['LEAD','🎯','#64748B'],['BRIEF','📋','#3B82F6'],['PROPOSAL','💡','#8B5CF6'],
    ['PRICING','💰','#F59E0B'],['CONTRACT','📝','#00D4FF'],['EXECUTION','🚀','#10B981'],['PAYMENT','💳','#4F8EF7'],
  ]

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{greeting},</p>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            {firstName} <span className="gradient-text">Make Things Simple!</span>
          </h1>
          <p className="text-slate-600 text-xs mt-2">
            {now.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </p>
        </div>
        {myPending.length > 0 && (
          <button onClick={() => setPage('approval')}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-lg">⚡</div>
            <div className="text-left">
              <div className="text-red-300 font-bold text-sm">{myPending.length} Approvals pending</div>
              <div className="text-red-400/60 text-xs mt-0.5">Click để xử lý ngay</div>
            </div>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3 mb-5">
        {kpiCards.map(({l,v,s,c,e,pg}) => (
          <div key={l} onClick={() => setPage(pg)}
            className="glass rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden group"
            style={{borderColor: c+'20'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{background:`radial-gradient(circle at 80% 20%,${c}08,transparent 60%)`}}/>
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{background:`linear-gradient(90deg,${c},transparent)`}}/>
            <div className="text-xl mb-2">{e}</div>
            <div className="text-xs font-black uppercase tracking-widest mb-1.5" style={{color:c}}>{l}</div>
            <div className="text-2xl font-black text-slate-100">{v}</div>
            <div className="text-xs text-slate-600 mt-1">{s}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart - 2/3 width */}
        <div className="col-span-2 glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-black text-slate-100">Revenue Overview 2026</h3>
              <p className="text-slate-600 text-xs mt-0.5">Monthly breakdown · VND</p>
            </div>
            <div className="flex gap-2">
              {[['Total',fmtS(rev),'#00D4FF'],['This month',fmtS(byM[now.getMonth()]),'#8B5CF6'],['Avg',fmtS(Math.round(rev/12)),'#10B981']].map(([l,v,c]) => (
                <div key={l} className="text-center px-3 py-1.5 rounded-lg" style={{background:c+'12',border:`1px solid ${c}20`}}>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{color:c}}>{l}</div>
                  <div className="text-xs font-black text-slate-200 mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {months.map((m,i) => {
              const h = byM[i] ? Math.max(10, Math.round(byM[i]/maxM*100)) : 4
              const isNow = i === now.getMonth()
              const isPast = i < now.getMonth()
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-md transition-all" style={{
                    height: h+'%', minHeight:4,
                    background: isNow ? 'linear-gradient(180deg,#00D4FF,#4F8EF7)' : isPast && byM[i]>0 ? 'rgba(79,142,247,0.3)' : 'rgba(255,255,255,0.04)',
                    boxShadow: isNow ? '0 0 16px rgba(0,212,255,0.4)' : 'none',
                    border: isNow ? '1px solid rgba(0,212,255,0.3)' : 'none',
                  }}/>
                  <div className="text-xs font-medium" style={{color: isNow ? '#00D4FF' : '#334155', fontSize:'0.55rem'}}>{m}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-100 text-sm">Project Pipeline</h3>
            <button onClick={() => setPage('workflow')} className="text-xs font-semibold" style={{color:'#00D4FF',background:'none',border:'none',cursor:'pointer'}}>View all →</button>
          </div>
          {stages.map(([stage,icon,c]) => {
            const cnt = data.projects.filter(p => (p.current_stage||'LEAD')===stage).length
            const pct = data.projects.length ? Math.round(cnt/data.projects.length*100) : 0
            return (
              <div key={stage} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{icon} {stage}</span>
                  <span className="font-bold" style={{color:c}}>{cnt}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                  <div className="h-full rounded-full transition-all" style={{width:pct+'%',background:c,boxShadow:cnt>0?`0 0 6px ${c}60`:'none'}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Active Projects */}
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-100 text-sm">Active Projects</h3>
            <button onClick={() => setPage('workflow')} className="text-xs font-semibold" style={{color:'#00D4FF',background:'none',border:'none',cursor:'pointer'}}>Workflow →</button>
          </div>
          {data.projects.filter(p => ['Active','EXECUTION','PRE_PRODUCTION'].includes(p.status||p.current_stage||'')).slice(0,4).map(p => (
            <div key={p.id} className="flex justify-between items-center py-2" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div className="flex-1 min-w-0 mr-3">
                <div className="font-semibold text-xs text-slate-300 truncate">{p.campaign||'—'}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                  <div className="text-slate-500" style={{fontSize:'0.6rem'}}>{p.client||'—'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold" style={{color:'#00D4FF'}}>{p.revenue ? fmtS(Number(p.revenue)) : '-'}</div>
                <div className="text-emerald-500 font-semibold mt-0.5" style={{fontSize:'0.6rem'}}>{p.current_stage||p.status||'—'}</div>
              </div>
            </div>
          ))}
          {!data.projects.filter(p => p.status==='Active').length &&
            <p className="text-slate-600 text-xs text-center py-5">Chưa có dự án active</p>}
        </div>

        {/* Overdue */}
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-100 text-sm">Công nợ quá hạn</h3>
            <button onClick={() => setPage('invoices')} className="text-xs font-semibold" style={{color:'#00D4FF',background:'none',border:'none',cursor:'pointer'}}>Chi tiết →</button>
          </div>
          {overdue.slice(0,4).map(inv => (
            <div key={inv.id} className="flex justify-between items-center py-2" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div>
                <div className="text-xs font-semibold text-slate-300">{inv.client}</div>
                <div className="text-red-400 mt-0.5" style={{fontSize:'0.6rem'}}>Quá hạn</div>
              </div>
              <span className="text-sm font-black text-red-300">{fmtS(Number(inv.amount)-Number(inv.paid||0))}</span>
            </div>
          ))}
          {!overdue.length && (
            <div className="text-center py-5">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-emerald-500 text-xs font-semibold">Không có công nợ quá hạn</p>
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-100 text-sm">
              {currentUser?.isMaster ? 'All Approvals' : 'Approvals của bạn'}
            </h3>
            <button onClick={() => setPage('approval')} className="text-xs font-semibold" style={{color:'#00D4FF',background:'none',border:'none',cursor:'pointer'}}>Xử lý →</button>
          </div>
          {myPending.length === 0 && (
            <div className="text-center py-5">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-emerald-500 text-xs font-semibold">Queue trống</p>
              {!currentUser?.isMaster && pendingAppr.length > 0 &&
                <p className="text-slate-600 text-xs mt-1">Không có approval nào cần bạn xử lý</p>}
            </div>
          )}
          {myPending.slice(0,4).map(a => (
            <div key={a.id} className="py-2" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div className="text-xs font-semibold text-slate-300 truncate">{a.title||a.type||'Approval'}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-slate-600" style={{fontSize:'0.6rem'}}>{a.created_at?.slice(0,10)||'—'}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
            {[{l:'+ Báo giá',p:'quotations',c:'#F59E0B'},{l:'Workflow',p:'workflow',c:'#10B981'}].map(({l,p,c}) => (
              <button key={p} onClick={() => setPage(p)}
                className="py-2 rounded-lg text-xs font-bold transition-all"
                style={{border:`1px solid ${c}25`,background:c+'10',color:c,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:'pointer'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
