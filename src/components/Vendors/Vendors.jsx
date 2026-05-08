import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


function Vendors({data,add,upd,del,log,reload,supabase}){
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),type:fd.get('type'),rating:Number(fd.get('rating')||5),contact:fd.get('contact'),total_spent:Number(fd.get('total_spent')||0),notes:fd.get('notes')};edit?await upd('vendors',edit.id,r):await add('vendors',r);log('Vendor: '+r.name);setEdit(null);setShowAdd(false)}
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>Vendors & Suppliers</h2><div style={{display:'flex',gap:8}}><ImportBtn module="vendors" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Add Vendor</Btn></div></div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Name','Type','Contact','Rating','Total Spent','Notes',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {data.vendors.map(v=><tr key={v.id}>
              <td style={{...TD,fontWeight:800,color:B.text}}>{v.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{v.type||'—'}</span></td>
              <td style={{...TD,fontSize:11,color:B.textSec}}>{v.contact||'—'}</td>
              <td style={{...TD,fontSize:14,color:'#F59E0B',letterSpacing:'-1px'}}>{'★'.repeat(Number(v.rating||0))+'☆'.repeat(Math.max(0,5-Number(v.rating||0)))}</td>
              <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{fmtS(v.total_spent)}</td>
              <td style={{...TD,fontSize:11,color:B.textTer}}>{v.notes||'—'}</td>
              <td style={TD}><Btn sm onClick={()=>setEdit(v)}>Edit</Btn></td>
            </tr>)}
            {!data.vendors.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No vendors yet</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit Vendor':'Add Vendor'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <FG label="Company Name"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG>
        <Row2><FG label="Service Type"><select name="type" defaultValue={edit?.type||'Production'} {...inp()}><option>Production</option><option>Photography</option><option>Video</option><option>Media Buy</option><option>Event</option><option>Design</option><option>PR</option><option>Other</option></select></FG><FG label="Rating (1-5)"><select name="rating" defaultValue={edit?.rating||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG></Row2>
        <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''} {...inp()}/></FG>
        <FG label="Total Spent (VND)"><input name="total_spent" type="number" defaultValue={edit?.total_spent||0} {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('vendors',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
    </div>
  )
}
export default Vendors
