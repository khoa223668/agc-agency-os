import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


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
            <Row2><FG label="Client Budget (VND)"><input type="number" value={I.budget} onChange={e=>s('budget',e.target.value)} {...inp()}/></FG><FG label="Target Margin (%)"><input type="number" value={I.margin} onChange={e=>s('margin',e.target.value)} {...inp()}/></FG></Row2>
            <FG label="Service Type"><select value={I.service} onChange={e=>s('service',e.target.value)} {...inp()}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option><option>Consulting</option></select></FG>
            <FG label="Client Name"><input type="text" value={I.client} onChange={e=>s('client',e.target.value)} placeholder="Tên client..." {...inp()}/></FG>
            <div style={{height:1,background:B.border,margin:'10px 0'}}/>
            <Row2><FG label="Số KOL/KOC"><input type="number" value={I.kolNum||0} onChange={e=>s('kolNum',e.target.value)} {...inp()}/></FG><FG label="Avg Cost/KOL"><input type="number" value={I.kolCost||0} onChange={e=>s('kolCost',e.target.value)} {...inp()}/></FG></Row2>
            <Row2><FG label="Production"><input type="number" value={I.prod||0} onChange={e=>s('prod',e.target.value)} {...inp()}/></FG><FG label="Ads/Seeding"><input type="number" value={I.ads||0} onChange={e=>s('ads',e.target.value)} {...inp()}/></FG></Row2>
            <Row2><FG label="Agency Ops"><input type="number" value={I.ops||0} onChange={e=>s('ops',e.target.value)} {...inp()}/></FG><FG label="Other"><input type="number" value={I.other||0} onChange={e=>s('other',e.target.value)} {...inp()}/></FG></Row2>
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
                    <td style={{padding:'5px 6px'}}><input type="number" value={s.cost} onChange={e=>{const n=[...sc];n[i]={...n[i],cost:e.target.value};setSc(n)}} style={{width:95,...INP.style,padding:'5px 8px'}}/></td>
                    <td style={{padding:'5px 6px',fontWeight:800,fontSize:11,color:B.primary}}>{fmtS(Number(s.num||0)*Number(s.cost||0))}</td>
                    <td><button onClick={()=>setSc(p=>p.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:B.danger,fontSize:18,lineHeight:1}}>×</button></td>
                  </tr>
                ))}
                <tr style={{background:B.gradSoft}}><td colSpan={4} style={{padding:'8px',fontWeight:800,fontSize:11,color:B.textSec}}>Total KOL Cost</td><td style={{padding:'8px',fontWeight:900,color:B.primary,fontSize:13}}>{fmtS(kt)}</td><td/></tr>
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <Card title="Pricing Output" glow>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>KOL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{fmtS(kt)}</div></div>
              <div style={{background:B.gradSoft,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>TOTAL COST</div><div style={{fontSize:18,fontWeight:900,color:B.text}}>{fmtS(tc)}</div></div>
            </div>
            <div style={{background:B.gradPrimary,borderRadius:16,padding:'20px 24px',textAlign:'center',marginBottom:16,boxShadow:`0 8px 32px ${B.primaryGlow}`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-15,right:-15,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
              <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>RECOMMENDED PRICE</div>
              <div style={{fontSize:34,fontWeight:900,color:'#fff',letterSpacing:'-0.04em'}}>{fmt(rp)}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:4,fontWeight:600}}>VND</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              <div style={{background:B.successBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${B.success}25`}}><div style={{fontSize:9,fontWeight:800,color:B.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>PROFIT</div><div style={{fontSize:18,fontWeight:900,color:B.success}}>{fmtS(pr)}</div></div>
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
                  {data.dealHistory.map(d=><tr key={d.id} style={{borderBottom:`1px solid ${B.border}`}}><td style={{padding:'7px 8px',fontSize:10,color:B.textTer}}>{d.deal_date}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:700}}>{d.client}</td><td style={{padding:'7px 8px',fontSize:11,fontWeight:800,color:B.primary}}>{fmtS(d.price)}</td><td style={{padding:'7px 8px',fontSize:11}}>{d.margin}%</td><td style={{padding:'7px 8px'}}><Badge text={d.decision}/></td></tr>)}
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
export default Pricing
