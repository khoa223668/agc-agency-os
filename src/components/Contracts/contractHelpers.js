export 
function cfmt(n){return Number(n||0).toLocaleString('vi-VN')}
function cfmtS(n){n=Number(n||0);if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(0)+'K';return n.toString()}

function toWords(n) {
  n = Math.round(Number(n||0))
  if(!n) return 'Không đồng'
  const units=['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
  const teens=['mười','mười một','mười hai','mười ba','mười bốn','mười lăm','mười sáu','mười bảy','mười tám','mười chín']
  const tens=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi']
  function num(x) {
    if(!x) return ''
    if(x>=1e9){const b=Math.floor(x/1e9);return units[b]+' tỷ '+(x%1e9?num(x%1e9):'')}
    if(x>=1e6){const m=Math.floor(x/1e6);const mw=m>=20?tens[Math.floor(m/10)]+(m%10?' '+units[m%10]:''):(m>=10?teens[m-10]:units[m]);return mw+' triệu '+(x%1e6?num(x%1e6):'')}
    if(x>=1e3){const k=Math.floor(x/1e3);return num(k)+' nghìn '+(x%1e3?num(x%1e3):'')}
    if(x>=100){return units[Math.floor(x/100)]+' trăm '+(x%100?num(x%100):'') }
    if(x>=20) return tens[Math.floor(x/10)]+(x%10?' '+units[x%10]:'')
    if(x>=10) return teens[x-10]
    return units[x]
  }
  const w = num(n).trim()
  return w.charAt(0).toUpperCase()+w.slice(1)+' đồng./.'
}

function fmtDate(s) {
  if(!s) return '___/___/______'
  const d=new Date(s)
  return `ngày ${d.getDate()} tháng ${d.getMonth()+1} năm ${d.getFullYear()}`
}

function genCode(prefix) {
  const d=new Date()
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getFullYear()).slice(2)}-${prefix}-KnK-`
}

// ── UI Components ─────────────────────────────────────────
function CModal({title,children,onClose,wide}) {
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}}
      style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:wide?880:600,maxWidth:'96vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(26,86,219,0.15)',border:'1px solid rgba(26,86,219,0.1)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:CB.navy}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:CB.textTer,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CBadge({text}) {
  const colors={Draft:'#94A3B8',Sent:'#1A56DB',Signed:'#059669',Completed:'#059669',Cancelled:'#DC2626',Pending:'#D97706'}
  const c=colors[text]||'#94A3B8'
  return <span style={{background:c+'18',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>
}

function CBtn({children,onClick,primary,sm,danger,type,style:s}) {
  const base={display:'inline-flex',alignItems:'center',gap:6,padding:sm?'5px 12px':'7px 16px',borderRadius:9,cursor:'pointer',fontSize:sm?10.5:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",...s}
  if(primary) return <button type={type||'button'} onClick={onClick} style={{...base,border:'none',background:CB.grad,color:'#fff'}}>{children}</button>
  if(danger) return <button type={type||'button'} onClick={onClick} style={{...base,border:'1.5px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626'}}>{children}</button>
  return <button type={type||'button'} onClick={onClick} style={{...base,border:'1.5px solid rgba(26,86,219,0.1)',background:'rgba(255,255,255,0.8)',color:CB.textSec}}>{children}</button>
}

function CFG({label,children,required}) {
  return (
    <div style={{marginBottom:13}}>
      <label style={{fontSize:11,fontWeight:700,color:CB.textSec,marginBottom:5,display:'block',letterSpacing:'0.04em',textTransform:'uppercase'}}>
        {label}{required&&<span style={{color:CB.danger,marginLeft:3}}>*</span>}
      </label>
      {children}
    </div>
  )
}

function CRow2({children}) {return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>}
function CRow3({children}) {return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>{children}</div>}
function CSec({title,children}) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontSize:11.5,fontWeight:800,color:CB.navy,marginBottom:10,paddingBottom:6,borderBottom:`2px solid ${CB.border}`,textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</div>
      {children}
    </div>
  )
}
function CMFoot({onClose,onDelete,label}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',marginTop:18,paddingTop:14,borderTop:`1px solid ${CB.border}`}}>
      <div>{onDelete&&<CBtn danger onClick={onDelete}>Xóa</CBtn>}</div>
      <div style={{display:'flex',gap:8}}>
        <CBtn onClick={onClose}>Huỷ</CBtn>
        <button type="submit" style={{padding:'7px 20px',borderRadius:9,border:'none',background:CB.grad,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label||'Lưu'}</button>
      </div>
    </div>
  )
}

export { cfmt, cfmtS, toWords, fmtDate, genCode, CModal, CBadge, CBtn, CFG, CRow2, CRow3, CSec, CMFoot }
