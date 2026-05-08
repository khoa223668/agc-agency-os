import { useState, useEffect, useRef } from 'react'
import { B, STATUS, PALETTE } from '../../theme.js'
import { Badge, fmt, fmtS, Btn, FG, Row2, Modal, MFoot, inp, StatCard, StatusBadge, Empty, Card, Logo } from '../../lib/helpers.jsx'


function Kols({data,add,upd,del,log,reload,supabase}){
  const [search,setSearch]=useState('')
  const [platF,setPlatF]=useState('')
  const [tierF,setTierF]=useState('')
  const [edit,setEdit]=useState(null)
  const [showAdd,setShowAdd]=useState(false)
  const [hist,setHist]=useState(null)
  async function save(e){e.preventDefault();const fd=new FormData(e.target);const r={name:fd.get('name'),platform:fd.get('platform'),tier:fd.get('tier'),niche:fd.get('niche'),followers:Number(fd.get('followers')||0),engagement:Number(fd.get('engagement')||0),rate:Number(fd.get('rate')||0),avg_views:Number(fd.get('avg_views')||0),reliability:Number(fd.get('reliability')||5),available:fd.get('available')==='true',contact:fd.get('contact'),notes:fd.get('notes')};edit?await upd('kols',edit.id,r):await add('kols',r);log('KOL: '+r.name);setEdit(null);setShowAdd(false)}
  const list=data.kols.filter(k=>(!search||(k.name||'').toLowerCase().includes(search.toLowerCase()))&&(!platF||k.platform===platF)&&(!tierF||k.tier===tierF))
  const TH={padding:'10px 14px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'11px 14px',borderBottom:`1px solid ${B.border}`,verticalAlign:'middle'}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><h2 style={{margin:0,fontSize:18,fontWeight:900,color:B.navy,letterSpacing:'-0.03em'}}>KOL / KOC Database</h2><div style={{display:'flex',gap:8}}><ImportBtn module="kols" data={data} supabase={supabase} reload={reload} log={log}/><Btn primary onClick={()=>setShowAdd(true)}>+ Add KOL</Btn></div></div>
      <div style={{display:'flex',gap:10,marginBottom:16}}>
        <input placeholder="🔍  Search..." value={search} onChange={e=>setSearch(e.target.value)} {...inp({style:{...INP.style,maxWidth:220}})}/>
        <select value={platF} onChange={e=>setPlatF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Platforms</option><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select>
        <select value={tierF} onChange={e=>setTierF(e.target.value)} {...inp({style:{...INP.style,width:'auto'}})}><option value="">All Tiers</option><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select>
      </div>
      <div style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:`1px solid ${B.border}`,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,86,219,0.06)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:950}}>
          <thead><tr>{['ID','Name','Platform','Tier','Followers','Eng%','Rate/post','Campaigns','Stars','Status',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {list.map((k,i)=>{const used=data.projects.filter(p=>(p.kols||[]).includes(k.name)).length;const stars='★'.repeat(Math.min(5,Number(k.reliability||0)))+'☆'.repeat(Math.max(0,5-Number(k.reliability||0)));return <tr key={k.id}>
              <td style={{...TD,fontSize:10,color:B.textTer,fontWeight:600}}>KOL-{String(i+1).padStart(3,'0')}</td>
              <td style={{...TD,fontWeight:800,color:B.text,fontSize:12.5}}>{k.name}</td>
              <td style={TD}><span style={{background:B.infoBg,color:B.info,padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:700,border:`1px solid ${B.borderStrong}`}}>{k.platform}</span></td>
              <td style={TD}><Badge text={k.tier}/></td>
              <td style={{...TD,fontSize:11,fontWeight:600}}>{fmtS(k.followers)}</td>
              <td style={{...TD,fontSize:11,fontWeight:700,color:Number(k.engagement)>=5?B.success:B.textSec}}>{Number(k.engagement||0).toFixed(1)}%</td>
              <td style={{...TD,fontSize:12,fontWeight:800,color:B.primary}}>{fmtS(k.rate)}</td>
              <td style={{...TD,textAlign:'center',fontSize:12,fontWeight:800,color:B.accent}}>{used}</td>
              <td style={{...TD,fontSize:13,color:'#F59E0B',letterSpacing:'-1px'}}>{stars}</td>
              <td style={TD}><Badge text={k.available?'Active':'Booked'}/></td>
              <td style={{...TD,display:'flex',gap:6}}><Btn sm onClick={()=>setEdit(k)}>Edit</Btn><Btn sm onClick={()=>setHist(k)}>History</Btn></td>
            </tr>})}
            {!list.length&&<tr><td colSpan={11} style={{textAlign:'center',padding:40,color:B.textTer,fontSize:12}}>No KOLs found</td></tr>}
          </tbody>
        </table>
      </div>
      {(showAdd||edit)&&<Modal title={edit?'Edit KOL':'Add KOL / KOC'} onClose={()=>{setEdit(null);setShowAdd(false)}}><form onSubmit={save}>
        <Row2><FG label="Name"><input name="name" defaultValue={edit?.name||''} required {...inp()}/></FG><FG label="Platform"><select name="platform" defaultValue={edit?.platform||'TikTok'} {...inp()}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></select></FG></Row2>
        <Row2><FG label="Tier"><select name="tier" defaultValue={edit?.tier||'Micro'} {...inp()}><option>Mega</option><option>Macro</option><option>Mid</option><option>Micro</option><option>Nano/KOC</option></select></FG><FG label="Niche"><input name="niche" defaultValue={edit?.niche||''} placeholder="Beauty, Lifestyle..." {...inp()}/></FG></Row2>
        <Row2><FG label="Followers"><input name="followers" type="number" defaultValue={edit?.followers||0} {...inp()}/></FG><FG label="Engagement (%)"><input name="engagement" type="number" step="0.1" defaultValue={edit?.engagement||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Rate (VND/post)"><input name="rate" type="number" defaultValue={edit?.rate||0} {...inp()}/></FG><FG label="Avg Views"><input name="avg_views" type="number" defaultValue={edit?.avg_views||0} {...inp()}/></FG></Row2>
        <Row2><FG label="Reliability (1-5)"><select name="reliability" defaultValue={edit?.reliability||5} {...inp()}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FG><FG label="Status"><select name="available" defaultValue={edit?.available!==false?'true':'false'} {...inp()}><option value="true">Available</option><option value="false">Booked</option></select></FG></Row2>
        <FG label="Contact"><input name="contact" defaultValue={edit?.contact||''} {...inp()}/></FG>
        <FG label="Notes"><textarea name="notes" defaultValue={edit?.notes||''} {...inp({style:{...INP.style,minHeight:70}})}/></FG>
        <MFoot onClose={()=>{setEdit(null);setShowAdd(false)}} onDelete={edit?()=>{del('kols',edit.id);setEdit(null)}:null}/>
      </form></Modal>}
      {hist&&<Modal title={'History: '+hist.name} onClose={()=>setHist(null)}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
          {[['Campaigns',data.projects.filter(p=>(p.kols||[]).includes(hist.name)).length],['Rate',fmtS(hist.rate)+' VND'],['Stars',hist.reliability+'/5']].map(([l,v])=>(
            <div key={l} style={{background:B.gradSoft,borderRadius:12,padding:'12px 14px',border:`1px solid ${B.border}`}}><div style={{fontSize:9,fontWeight:800,color:B.textTer,textTransform:'uppercase',marginBottom:5}}>{l}</div><div style={{fontSize:17,fontWeight:900,color:B.navy}}>{v}</div></div>
          ))}
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Campaign','Client','Service','Status','Date'].map(h=><th key={h} style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:B.textTer,borderBottom:`1px solid ${B.border}`,textAlign:'left',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.projects.filter(p=>(p.kols||[]).includes(hist.name)).map(p=><tr key={p.id} style={{borderBottom:`1px solid ${B.border}`}}><td style={{padding:'7px 8px',fontSize:11,fontWeight:700}}>{p.campaign}</td><td style={{padding:'7px 8px',fontSize:11}}>{p.client}</td><td style={{padding:'7px 8px',fontSize:11}}>{p.service}</td><td style={{padding:'7px 8px'}}><Badge text={p.status}/></td><td style={{padding:'7px 8px',fontSize:10,color:B.textTer}}>{p.start_date||'—'}</td></tr>)}
            {!data.projects.filter(p=>(p.kols||[]).includes(hist.name)).length&&<tr><td colSpan={5} style={{textAlign:'center',padding:20,color:B.textTer,fontSize:12}}>No campaigns yet</td></tr>}
          </tbody>
        </table>
        {hist.notes&&<div style={{marginTop:14,padding:12,background:B.gradSoft,borderRadius:10,fontSize:11,color:B.textSec,border:`1px solid ${B.border}`}}>{hist.notes}</div>}
        <div style={{textAlign:'right',marginTop:16}}><Btn onClick={()=>setHist(null)}>Close</Btn></div>
      </Modal>}
    </div>
  )
}
export default Kols
