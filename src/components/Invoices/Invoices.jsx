import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


function Invoices({data,add,upd,log,reload,supabase}){
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
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Hóa đơn & Công nợ</h2><div style={{display:'flex',gap:8}}><ImportBtn module="invoices" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Tạo hóa đơn</Btn></div></div>
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
export default Invoices
