import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { cfmt, cfmtS } from '../Contracts/contractHelpers.js'
// ════════════════════════════════════════════════════════════
function Quotations({data, supabase, reload, log}) {
  const [quotes, setQuotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ loadQuotes() },[])

  async function loadQuotes() {
    setLoading(true)
    const {data:rows} = await supabase.from('quotations').select('*').order('created_at',{ascending:false})
    setQuotes(rows||[])
    setLoading(false)
  }

  const total = quotes.reduce((a,q)=>a+Number(q.total||0),0)
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Báo giá</h2>
        <button onClick={()=>{setEditItem(null);setShowForm(true)}} style={{padding:'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>
          + Tạo báo giá
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        {[['Tổng báo giá',quotes.length,'',B.primary],['Draft',quotes.filter(q=>q.status==='Draft').length,'',B.textTer],['Đã gửi',quotes.filter(q=>q.status==='Sent').length,'',B.warning],['Tổng giá trị',cfmtS(total)+' VND','',B.success]].map(([l,v,s,c])=>(
          <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'14px 16px',border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:22,fontWeight:900,color:c||'#0F172A',marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead><tr>{['Mã BG','Client','Campaign','Loại DV','Tổng (VND)','Hiệu lực','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={8} style={{textAlign:'center',padding:32,color:'#94A3B8'}}>Đang tải...</td></tr>}
            {!loading&&quotes.map(q=>(
              <tr key={q.id}>
                <td style={{...TD,fontWeight:800,color:'#1A56DB',fontSize:12}}>{q.quote_code}</td>
                <td style={{...TD,fontWeight:600}}>{q.client_name||'—'}</td>
                <td style={{...TD,fontSize:11,color:'#475569'}}>{q.campaign_name||'—'}</td>
                <td style={TD}><span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:600}}>{q.service_type||'—'}</span></td>
                <td style={{...TD,fontWeight:800,color:'#0F172A'}}>{cfmt(q.total)}</td>
                <td style={{...TD,fontSize:11,color:'#94A3B8'}}>{q.valid_days} ngày</td>
                <td style={TD}><QBadge text={q.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <button onClick={()=>setViewItem(q)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Xem & In</button>
                  <button onClick={()=>{setEditItem(q);setShowForm(true)}} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Sửa</button>
                </td>
              </tr>
            ))}
            {!loading&&!quotes.length&&<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có báo giá nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm&&<QuotationForm data={data} supabase={supabase} edit={editItem} onClose={()=>{setShowForm(false);setEditItem(null)}} onSaved={()=>{loadQuotes();reload();log('Lưu báo giá')}}/>}
      {viewItem&&<QuotationPreview quote={viewItem} onClose={()=>setViewItem(null)} onStatusChange={async(status)=>{await supabase.from('quotations').update({status}).eq('id',viewItem.id);loadQuotes();setViewItem({...viewItem,status})}}/>}
    </div>
  )
}

function QBadge({text}) {
  const colors={Draft:'#94A3B8',Sent:'#1A56DB',Accepted:'#059669',Rejected:'#DC2626',Expired:'#D97706'}
  const c=colors[text]||'#94A3B8'
  return <span style={{background:c+'18',color:c,padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700,border:`1px solid ${c}25`}}>{text}</span>
}


function numWords(n) {
  n=Math.round(Number(n||0))
  if(!n) return 'Không đồng'
  const u=['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín']
  const t=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi']
  const teen=['mười','mười một','mười hai','mười ba','mười bốn','mười lăm','mười sáu','mười bảy','mười tám','mười chín']
  function r(x){
    if(!x)return''
    if(x>=1e9)return u[Math.floor(x/1e9)]+' tỷ '+(x%1e9?r(x%1e9):'')
    if(x>=1e6){const m=Math.floor(x/1e6);return(m>=20?t[Math.floor(m/10)]+(m%10?' '+u[m%10]:''):m>=10?teen[m-10]:u[m])+' triệu '+(x%1e6?r(x%1e6):'') }
    if(x>=1e3)return r(Math.floor(x/1e3))+' nghìn '+(x%1e3?r(x%1e3):'')
    if(x>=100)return u[Math.floor(x/100)]+' trăm '+(x%100?r(x%100):'')
    if(x>=20)return t[Math.floor(x/10)]+(x%10?' '+u[x%10]:'')
    if(x>=10)return teen[x-10]
    return u[x]
  }
  const w=r(n).trim()
  return w.charAt(0).toUpperCase()+w.slice(1)+' đồng./.'
}


// ════════════════════════════════════════════════════════════
// QUOTATION FORM & PREVIEW — Full pricing logic
// ════════════════════════════════════════════════════════════

const TAX_TYPES = ['PIT','VAT']
const TAX_RATES = [0, 5, 8, 10]

// Pricing logic per line item:
// PIT: Giá sau thuế = Giá gốc / (1 - tax/100)  [gross-up]
// VAT: Giá sau thuế = Giá gốc (VAT tính riêng ở bảng tổng)
// Giá bán = Giá sau thuế × (1 + markup/100)
// VAT amount = Giá bán × vat_rate/100 (chỉ với loại VAT)

function calcItem(item) {
  const basePrice = Number(item.base_price || item.unit_price || 0)
  const qty = Number(item.qty || 1)
  const taxType = item.tax_type || 'VAT'
  const taxRate = Number(item.tax_rate || 0)
  const markup = Number(item.markup ?? '')  // must be explicitly set

  // After-tax price per unit
  let priceAfterTax = basePrice
  if (taxType === 'PIT' && taxRate > 0) {
    priceAfterTax = basePrice / (1 - taxRate / 100)
  }

  // Selling price per unit (after markup)
  const sellPrice = priceAfterTax * (1 + markup / 100)

  // Line totals
  const lineBeforeVAT = sellPrice * qty
  const lineVAT = taxType === 'VAT' ? lineBeforeVAT * taxRate / 100 : 0
  const lineTotal = lineBeforeVAT + lineVAT

  return { basePrice, priceAfterTax, sellPrice, lineBeforeVAT, lineVAT, lineTotal }
}

function QuotationForm({data, supabase, edit, onClose, onSaved}) {
  const genQCode = () => {
    const d = new Date()
    return `KK-BG-${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getFullYear()).slice(2)}-${Math.floor(Math.random()*900+100)}`
  }

  const defaultItem = () => ({
    description: '',
    item_type: 'KOL',      // KOL | Vendor | Service
    source_name: '',       // KOL name or vendor name (read-only ref)
    base_price: 0,         // Giá gốc - NEVER changes
    unit: 'Video',
    qty: 1,
    tax_type: 'PIT',       // PIT or VAT
    tax_rate: 10,          // 0/5/8/10
    markup: '',            // REQUIRED - empty string forces user to fill
    note: '',
  })

  const [form, setForm] = useState({
    quote_code: edit?.quote_code || genQCode(),
    client_name: edit?.client_name || '',
    brand_name: edit?.brand_name || '',
    campaign_name: edit?.campaign_name || '',
    service_type: edit?.service_type || 'KOL/KOC',
    project_id: edit?.project_id || '',
    prepared_by: edit?.prepared_by || 'Tô Nguyễn Đăng Khoa',
    valid_days: edit?.valid_days || 30,
    items: edit?.items?.length ? edit.items : [defaultItem()],
    discount: edit?.discount || 0,
    notes: edit?.notes || 'Báo giá có hiệu lực trong vòng 30 ngày kể từ ngày phát hành.\nMọi thay đổi cần được xác nhận bằng văn bản.',
    status: edit?.status || 'Draft',
  })
  const [saving, setSaving] = useState(false)
  const [markupError, setMarkupError] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Compute totals
  const itemCalcs = form.items.map(calcItem)
  const subtotalBeforeVAT = itemCalcs.reduce((a, c) => a + c.lineBeforeVAT, 0)
  const totalVAT = itemCalcs.reduce((a, c) => a + c.lineVAT, 0)
  const discountAmt = subtotalBeforeVAT * Number(form.discount || 0) / 100
  const grandTotal = subtotalBeforeVAT - discountAmt + totalVAT

  // Update item field
  function updItem(i, k, v) {
    const arr = [...form.items]
    // If changing item_type, reset tax defaults
    if (k === 'item_type') {
      arr[i] = {
        ...arr[i],
        item_type: v,
        tax_type: v === 'KOL' ? 'PIT' : 'VAT',
        tax_rate: v === 'KOL' ? 10 : 8,
        source_name: '',
        base_price: 0,
      }
    } else if (k === 'source_name') {
      // Auto-fill base price from KOL/Vendor DB
      if (arr[i].item_type === 'KOL') {
        const kol = data.kols.find(k => k.name === v || k.real_name === v)
        if (kol) {
          arr[i] = { ...arr[i], source_name: v, base_price: kol.rate || 0 }
        } else {
          arr[i] = { ...arr[i], source_name: v }
        }
      } else if (arr[i].item_type === 'Vendor') {
        const vendor = data.vendors.find(vd => vd.name === v)
        if (vendor) {
          arr[i] = { ...arr[i], source_name: v, base_price: 0 }
        } else {
          arr[i] = { ...arr[i], source_name: v }
        }
      } else {
        arr[i] = { ...arr[i], source_name: v }
      }
    } else {
      arr[i] = { ...arr[i], [k]: v }
    }
    set('items', arr)
  }

  function addItem() { set('items', [...form.items, defaultItem()]) }
  function delItem(i) { set('items', form.items.filter((_, j) => j !== i)) }

  async function handleSubmit(e) {
    e.preventDefault()
    // Validate markup required on all items
    const missing = form.items.some(item => item.markup === '' || item.markup === null || item.markup === undefined)
    if (missing) {
      setMarkupError(true)
      alert('⚠️ Markup % là bắt buộc cho tất cả hạng mục. Vui lòng điền đầy đủ (kể cả 0%).')
      return
    }
    setMarkupError(false)
    setSaving(true)

    const payload = {
      quote_code: form.quote_code,
      client_name: form.client_name,
      brand_name: form.brand_name,
      campaign_name: form.campaign_name,
      service_type: form.service_type,
      project_id: form.project_id || null,
      client_id: data.clients.find(c => c.name === form.client_name)?.id || null,
      prepared_by: form.prepared_by,
      valid_days: Number(form.valid_days || 30),
      items: form.items,
      subtotal: subtotalBeforeVAT,
      discount: Number(form.discount || 0),
      vat_rate: 0, // VAT per-item now
      total: grandTotal,
      notes: form.notes,
      status: form.status,
    }

    let error
    if (edit) {
      ({ error } = await supabase.from('quotations').update(payload).eq('id', edit.id))
    } else {
      ({ error } = await supabase.from('quotations').insert([payload]))
    }
    if (error) { alert('Lỗi: ' + error.message); setSaving(false); return }
    setSaving(false); onSaved(); onClose()
  }

  const INP_S = {
    width: '100%', padding: '7px 10px',
    border: '1.5px solid rgba(26,86,219,0.12)', borderRadius: 7,
    fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: '#fff', color: '#0F172A', outline: 'none', boxSizing: 'border-box'
  }
  const LABEL = { fontSize: 10, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:1000,maxWidth:'98vw',maxHeight:'94vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.18)'}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:'#0F172A'}}>{edit ? 'Sửa báo giá' : 'Tạo báo giá mới'}</div>
            <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>Giá gốc KOL/NCC được bảo vệ — không thay đổi khi quote thay đổi</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Meta info */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
            {[['Mã báo giá *','quote_code'],['Người lập','prepared_by'],['Hiệu lực (ngày)','valid_days']].map(([l,k])=>(
              <div key={k}>
                <label style={LABEL}>{l}</label>
                <input value={form[k]} onChange={e=>set(k,e.target.value)} style={INP_S} required={k==='quote_code'}/>
              </div>
            ))}
            <div>
              <label style={LABEL}>Trạng thái</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)} style={INP_S}>
                <option>Draft</option><option>Sent</option><option>Accepted</option><option>Rejected</option><option>Expired</option>
              </select>
            </div>
            <div>
              <label style={LABEL}>Chiết khấu (%)</label>
              <input type="number" min={0} max={100} value={form.discount} onChange={e=>set('discount',Number(e.target.value))} style={INP_S}/>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:16}}>
            <div>
              <label style={LABEL}>Client *</label>
              <input value={form.client_name} onChange={e=>set('client_name',e.target.value)} list="q-cl" style={INP_S} required/>
              <datalist id="q-cl">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
            </div>
            <div>
              <label style={LABEL}>Brand/Nhãn hàng</label>
              <input value={form.brand_name} onChange={e=>set('brand_name',e.target.value)} style={INP_S}/>
            </div>
            <div>
              <label style={LABEL}>Tên Campaign</label>
              <input value={form.campaign_name} onChange={e=>set('campaign_name',e.target.value)} style={INP_S}/>
            </div>
            <div>
              <label style={LABEL}>Link với Project (PO)</label>
              <select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={INP_S}>
                <option value="">— Chọn project —</option>
                {data.projects.map(p=><option key={p.id} value={p.id}>{p.project_code} — {p.campaign}</option>)}
              </select>
            </div>
          </div>

          {/* Line items table */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:800,color:'#0F172A',marginBottom:10,paddingBottom:6,borderBottom:'2px solid rgba(26,86,219,0.1)',textTransform:'uppercase',letterSpacing:'0.06em',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span>Hạng mục & Định giá</span>
              <div style={{fontSize:10,color:'#DC2626',fontWeight:600,textTransform:'none',letterSpacing:0}}>⚠️ Markup % BẮT BUỘC cho tất cả hạng mục (điền 0 nếu không mark up)</div>
            </div>

            {/* Table header */}
            <div style={{display:'grid',gridTemplateColumns:'110px 1fr 60px 80px 110px 90px 70px 80px 100px 110px 110px 36px',gap:4,marginBottom:4}}>
              {['Loại','Mô tả / Nguồn','ĐV','SL','Giá gốc (locked)','Loại thuế','Thuế%','Giá sau thuế','Markup% *','Giá bán','VAT amount',''].map(h=>(
                <div key={h} style={{fontSize:9,fontWeight:800,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.04em',padding:'4px 6px',background:'rgba(248,250,255,0.9)',borderRadius:5,textAlign:h.includes('Giá')||h.includes('VAT')||h.includes('SL')||h.includes('Thuế%')||h.includes('Markup')?'right':'left'}}>{h}</div>
              ))}
            </div>

            {form.items.map((item, i) => {
              const calc = calcItem(item)
              const missingMarkup = markupError && (item.markup === '' || item.markup === null || item.markup === undefined)
              const rowBg = i % 2 === 0 ? '#fff' : '#F8FAFF'
              return (
                <div key={i} style={{display:'grid',gridTemplateColumns:'110px 1fr 60px 80px 110px 90px 70px 80px 100px 110px 110px 36px',gap:4,marginBottom:5,padding:'6px 0',background:rowBg,borderRadius:8,border:missingMarkup?'1.5px solid #DC2626':'1px solid rgba(26,86,219,0.06)'}}>

                  {/* Loại: KOL / Vendor / Service */}
                  <select value={item.item_type} onChange={e=>updItem(i,'item_type',e.target.value)}
                    style={{...INP_S,fontSize:11,padding:'6px 7px',background:item.item_type==='KOL'?'rgba(26,86,219,0.06)':item.item_type==='Vendor'?'rgba(5,150,105,0.06)':'rgba(124,58,237,0.06)'}}>
                    <option>KOL</option><option>Vendor</option><option>Service</option>
                  </select>

                  {/* Mô tả / Nguồn */}
                  <div style={{display:'flex',flexDirection:'column',gap:3}}>
                    {item.item_type==='KOL' ? (
                      <>
                        <input value={item.source_name} onChange={e=>updItem(i,'source_name',e.target.value)}
                          list={`kol-list-${i}`} style={{...INP_S,fontSize:11,padding:'4px 7px'}} placeholder="Tên KOL..."/>
                        <datalist id={`kol-list-${i}`}>{data.kols.map(k=><option key={k.id} value={k.name}/>)}</datalist>
                        <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                          style={{...INP_S,fontSize:10,padding:'3px 7px',color:'#94A3B8'}} placeholder="Nội dung công việc..."/>
                      </>
                    ) : item.item_type==='Vendor' ? (
                      <>
                        <input value={item.source_name} onChange={e=>updItem(i,'source_name',e.target.value)}
                          list={`vd-list-${i}`} style={{...INP_S,fontSize:11,padding:'4px 7px'}} placeholder="Tên NCC..."/>
                        <datalist id={`vd-list-${i}`}>{data.vendors.map(v=><option key={v.id} value={v.name}/>)}</datalist>
                        <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                          style={{...INP_S,fontSize:10,padding:'3px 7px',color:'#94A3B8'}} placeholder="Mô tả dịch vụ..."/>
                      </>
                    ) : (
                      <input value={item.description} onChange={e=>updItem(i,'description',e.target.value)}
                        style={{...INP_S,fontSize:11,padding:'6px 7px'}} placeholder="Mô tả dịch vụ..."/>
                    )}
                  </div>

                  {/* ĐV */}
                  <select value={item.unit} onChange={e=>updItem(i,'unit',e.target.value)} style={{...INP_S,fontSize:10,padding:'6px 4px'}}>
                    <option>Video</option><option>Post</option><option>Story</option><option>Live</option>
                    <option>Campaign</option><option>Gói</option><option>Tháng</option><option>Người</option>
                  </select>

                  {/* SL */}
                  <input type="number" min={1} value={item.qty} onChange={e=>updItem(i,'qty',Number(e.target.value))}
                    style={{...INP_S,fontSize:11,padding:'6px 7px',textAlign:'right'}}/>

                  {/* Giá gốc - LOCKED */}
                  <div style={{position:'relative'}}>
                    <input type="number" value={item.base_price} onChange={e=>updItem(i,'base_price',Number(e.target.value))}
                      style={{...INP_S,fontSize:11,padding:'6px 7px',textAlign:'right',
                        background: item.item_type==='KOL'&&item.source_name?'rgba(5,150,105,0.06)':'#fff',
                        borderColor: item.item_type==='KOL'&&item.source_name?'rgba(5,150,105,0.3)':'rgba(26,86,219,0.12)',
                      }}/>
                    {item.item_type==='KOL'&&item.source_name&&<div style={{position:'absolute',right:5,top:2,fontSize:8,color:'#059669',fontWeight:700}}>🔒</div>}
                  </div>

                  {/* Loại thuế */}
                  <select value={item.tax_type} onChange={e=>updItem(i,'tax_type',e.target.value)}
                    style={{...INP_S,fontSize:11,padding:'6px 4px',
                      background:item.tax_type==='PIT'?'rgba(217,119,6,0.07)':'rgba(26,86,219,0.06)',
                      color:item.tax_type==='PIT'?'#92400E':'#1A56DB',fontWeight:600}}>
                    <option value="PIT">PIT (CTV)</option>
                    <option value="VAT">VAT (Cty)</option>
                  </select>

                  {/* Thuế suất */}
                  <select value={item.tax_rate} onChange={e=>updItem(i,'tax_rate',Number(e.target.value))}
                    style={{...INP_S,fontSize:11,padding:'6px 4px',textAlign:'right'}}>
                    {TAX_RATES.map(r=><option key={r} value={r}>{r}%</option>)}
                  </select>

                  {/* Giá sau thuế (computed, readonly) */}
                  <div style={{padding:'6px 7px',fontSize:11,fontWeight:600,color:'#475569',textAlign:'right',
                    background:'rgba(248,250,252,0.8)',borderRadius:7,border:'1px solid rgba(26,86,219,0.08)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {cfmt(Math.round(calc.priceAfterTax))}
                  </div>

                  {/* Markup % - REQUIRED */}
                  <div style={{position:'relative'}}>
                    <input type="number" min={0} max={500}
                      value={item.markup}
                      onChange={e=>updItem(i,'markup',e.target.value===''?'':Number(e.target.value))}
                      placeholder="0"
                      style={{...INP_S,fontSize:12,padding:'6px 7px',textAlign:'right',fontWeight:700,
                        borderColor:missingMarkup?'#DC2626':item.markup!==''?'rgba(5,150,105,0.4)':'rgba(26,86,219,0.12)',
                        background:missingMarkup?'rgba(220,38,38,0.05)':item.markup!==''?'rgba(5,150,105,0.05)':'#fff',
                      }}/>
                    <div style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',fontSize:10,color:'#94A3B8',pointerEvents:'none'}}>%</div>
                  </div>

                  {/* Giá bán (computed) */}
                  <div style={{padding:'6px 7px',fontSize:12,fontWeight:800,color:'#1A56DB',textAlign:'right',
                    background:'rgba(26,86,219,0.06)',borderRadius:7,border:'1px solid rgba(26,86,219,0.15)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {item.markup!==''?cfmt(Math.round(calc.lineBeforeVAT)):'—'}
                  </div>

                  {/* VAT amount */}
                  <div style={{padding:'6px 7px',fontSize:11,fontWeight:600,
                    color:item.tax_type==='VAT'&&item.tax_rate>0?'#7C3AED':'#94A3B8',textAlign:'right',
                    background:item.tax_type==='VAT'&&item.tax_rate>0?'rgba(124,58,237,0.06)':'rgba(248,250,252,0.5)',
                    borderRadius:7,border:'1px solid rgba(26,86,219,0.06)',
                    display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    {item.tax_type==='VAT'&&item.tax_rate>0&&item.markup!==''?cfmt(Math.round(calc.lineVAT)):'—'}
                  </div>

                  {/* Delete */}
                  <button type="button" onClick={()=>delItem(i)}
                    style={{background:'none',border:'none',cursor:'pointer',color:'#DC2626',fontSize:18,lineHeight:1,alignSelf:'center',justifySelf:'center'}}>×</button>
                </div>
              )
            })}

            <button type="button" onClick={addItem}
              style={{marginTop:6,padding:'7px 16px',borderRadius:8,border:'1.5px dashed rgba(26,86,219,0.3)',background:'transparent',color:'#1A56DB',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              + Thêm hạng mục
            </button>
          </div>

          {/* Summary box */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16,marginBottom:16}}>
            <div>
              <label style={LABEL}>Điều kiện & Ghi chú</label>
              <textarea value={form.notes} onChange={e=>set('notes',e.target.value)}
                style={{...INP_S,minHeight:100}}/>
            </div>

            {/* Totals - 3 rows clean */}
            <div style={{background:'rgba(15,23,42,0.03)',borderRadius:14,padding:'18px 20px',border:'1px solid rgba(26,86,219,0.12)'}}>
              <div style={{fontSize:11,fontWeight:800,color:'#0F172A',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>Tổng kết</div>

              {/* Line items summary */}
              {form.items.map((item,i)=>{
                const c=calcItem(item)
                if(item.markup===''||!item.description&&!item.source_name) return null
                return <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:11}}>
                  <span style={{color:'#475569',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.source_name||item.description||`Hạng mục ${i+1}`}</span>
                  <span style={{fontWeight:600,color:'#0F172A'}}>{cfmt(Math.round(c.lineBeforeVAT))}</span>
                </div>
              })}

              <div style={{height:1,background:'rgba(26,86,219,0.1)',margin:'12px 0'}}/>

              {/* 3 main rows */}
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#475569',fontWeight:500}}>Tổng tiền trước thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#0F172A'}}>{cfmt(Math.round(subtotalBeforeVAT))} VND</span>
              </div>

              {form.discount>0&&(
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#D97706',fontWeight:500}}>Chiết khấu ({form.discount}%)</span>
                  <span style={{fontSize:13,fontWeight:700,color:'#D97706'}}>- {cfmt(Math.round(discountAmt))} VND</span>
                </div>
              )}

              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#7C3AED',fontWeight:500}}>Thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#7C3AED'}}>{cfmt(Math.round(totalVAT))} VND</span>
              </div>

              <div style={{height:2,background:'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99,margin:'12px 0'}}/>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:900,color:'#0F172A'}}>Tổng tiền sau thuế VAT</span>
                <span style={{fontSize:18,fontWeight:900,color:'#1A56DB'}}>{cfmt(Math.round(grandTotal))} VND</span>
              </div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:5,fontStyle:'italic',textAlign:'right'}}>
                {numWords(Math.round(grandTotal))}
              </div>

              {/* PIT note */}
              {form.items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)&&(
                <div style={{marginTop:10,padding:'8px 10px',background:'rgba(217,119,6,0.08)',borderRadius:8,border:'1px solid rgba(217,119,6,0.2)',fontSize:10,color:'#92400E'}}>
                  💡 Thuế TNCN (PIT) đã được gross-up vào giá bán. K&K sẽ khấu trừ và nộp thay cho CTV.
                </div>
              )}
            </div>
          </div>

          {markupError&&(
            <div style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.3)',borderRadius:10,padding:'12px 16px',marginBottom:14,fontSize:12,color:'#DC2626',fontWeight:600}}>
              ⚠️ Vui lòng điền Markup % cho tất cả hạng mục (kể cả 0% nếu không mark up)
            </div>
          )}

          <div style={{display:'flex',justifyContent:'flex-end',gap:10,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'9px 20px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'9px 24px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 4px 16px rgba(26,86,219,0.25)'}}>
              {saving?'Đang lưu...':'Lưu báo giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function QuotationPreview({quote:q, onClose, onStatusChange}) {
  const items = q.items || []
  const itemCalcs = items.map(calcItem)
  const subtotalBeforeVAT = itemCalcs.reduce((a,c)=>a+c.lineBeforeVAT,0)
  const totalVAT = itemCalcs.reduce((a,c)=>a+c.lineVAT,0)
  const discountAmt = subtotalBeforeVAT * Number(q.discount||0)/100
  const grandTotal = subtotalBeforeVAT - discountAmt + totalVAT
  const today = new Date()
  const validUntil = new Date(q.created_at||today)
  validUntil.setDate(validUntil.getDate()+(q.valid_days||30))

  function printQuote() {
    const w = window.open('','_blank')
    const itemRows = items.map((item,i)=>{
      const c = calcItem(item)
      const name = item.source_name||item.description||`Hạng mục ${i+1}`
      const desc = item.source_name&&item.description ? item.description : ''
      const taxLabel = item.tax_type==='PIT'
        ? `Gross-up PIT ${item.tax_rate}%`
        : item.tax_rate>0 ? `VAT ${item.tax_rate}%` : 'Không thuế'
      return `<tr>
        <td style="text-align:center;color:#94A3B8">${i+1}</td>
        <td><strong>${name}</strong>${desc?`<br><span style="font-size:10px;color:#94A3B8">${desc}</span>`:''}</td>
        <td style="text-align:center">${item.unit}</td>
        <td style="text-align:right">${item.qty}</td>
        <td style="text-align:right">${cfmt(Math.round(Number(item.base_price||0)))}</td>
        <td style="text-align:center;font-size:10px;color:${item.tax_type==='PIT'?'#92400E':'#6D28D9'}">${taxLabel}</td>
        <td style="text-align:right">${item.markup!==''?item.markup+'%':'—'}</td>
        <td style="text-align:right;font-weight:700;color:#1A56DB">${cfmt(Math.round(c.lineBeforeVAT))}</td>
        <td style="text-align:right;color:#6D28D9">${item.tax_type==='VAT'&&item.tax_rate>0?cfmt(Math.round(c.lineVAT)):'—'}</td>
        <td style="text-align:right;font-weight:800">${cfmt(Math.round(c.lineTotal))}</td>
      </tr>`
    }).join('')

    w.document.write(`<html><head><title>Báo giá ${q.quote_code}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;font-size:12px;color:#0F172A;padding:28px 36px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #1A56DB}
      .logo{font-size:22px;font-weight:900;color:#1A56DB}.logo span{color:#06B6D4}
      .co{font-size:10px;color:#475569;text-align:right;line-height:1.7}
      h1{text-align:center;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin:16px 0 4px}
      .qnum{text-align:center;color:#94A3B8;font-size:11px;margin-bottom:18px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
      .box{background:#F8FAFF;border-radius:7px;padding:12px 14px;border:1px solid #E2E8F0}
      .box h3{font-size:9px;font-weight:700;color:#1A56DB;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
      .row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
      .row .v{font-weight:600}
      table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px}
      thead{background:#0F172A}
      th{padding:8px 8px;color:#fff;font-size:9px;text-align:left;letter-spacing:.04em;font-weight:700}
      td{padding:8px 8px;border-bottom:1px solid #E2E8F0;vertical-align:top}
      tr:nth-child(even) td{background:#F8FAFF}
      .totals{display:flex;justify-content:flex-end;margin-bottom:18px}
      .tbox{width:340px;background:#F8FAFF;border-radius:8px;padding:16px;border:1px solid #E2E8F0}
      .trow{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;align-items:center}
      .trow.grand{font-size:16px;font-weight:900;color:#1A56DB;border-top:2px solid #1A56DB;padding-top:10px;margin-top:4px}
      .trow.vat{color:#6D28D9;font-weight:600}
      .trow.disc{color:#D97706}
      .words{font-size:10px;color:#94A3B8;font-style:italic;margin-top:5px;text-align:right}
      .pit-note{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:9px 12px;font-size:10px;color:#92400E;margin-top:8px}
      .notes{background:#FFFBEB;border:1px solid #FCD34D;border-radius:7px;padding:12px;margin-bottom:20px;font-size:11px;color:#92400E;line-height:1.7}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:28px}
      .sigbox{text-align:center;padding-top:12px;border-top:1px dashed #CBD5E1}
      .footer{margin-top:24px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:10px;color:#94A3B8;text-align:center;line-height:1.8}
      @media print{body{padding:14px 18px}@page{margin:.8cm}}
    </style></head><body>
    <div class="hdr">
      <div><div class="logo">K&K <span>advertising</span></div><div style="font-size:10px;color:#94A3B8;margin-top:2px">Creative & KOL Marketing Agency</div></div>
      <div class="co">CÔNG TY TNHH QUẢNG CÁO K&K<br>737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM<br>MST: 0317776715 | ĐT: 0938 223 668<br>Email: contact@weareknk.com</div>
    </div>
    <h1>BÁO GIÁ DỊCH VỤ</h1>
    <div class="qnum">Số: ${q.quote_code}</div>
    <div class="meta">
      <div class="box"><h3>Thông tin khách hàng</h3>
        <div class="row"><span>Client:</span><span class="v">${q.client_name||'—'}</span></div>
        <div class="row"><span>Brand/Nhãn hàng:</span><span class="v">${q.brand_name||'—'}</span></div>
        <div class="row"><span>Campaign:</span><span class="v">${q.campaign_name||'—'}</span></div>
        <div class="row"><span>Loại dịch vụ:</span><span class="v">${q.service_type||'—'}</span></div>
      </div>
      <div class="box"><h3>Thông tin báo giá</h3>
        <div class="row"><span>Mã báo giá:</span><span class="v">${q.quote_code}</span></div>
        <div class="row"><span>Ngày lập:</span><span class="v">${new Date(q.created_at||today).toLocaleDateString('vi-VN')}</span></div>
        <div class="row"><span>Hiệu lực đến:</span><span class="v">${validUntil.toLocaleDateString('vi-VN')}</span></div>
        <div class="row"><span>Người lập:</span><span class="v">${q.prepared_by||'—'}</span></div>
      </div>
    </div>
    <table>
      <thead><tr>
        <th style="width:30px">STT</th>
        <th>Mô tả dịch vụ</th>
        <th style="width:50px;text-align:center">ĐV</th>
        <th style="width:35px;text-align:right">SL</th>
        <th style="width:90px;text-align:right">Giá gốc</th>
        <th style="width:90px;text-align:center">Thuế</th>
        <th style="width:55px;text-align:right">Markup</th>
        <th style="width:100px;text-align:right">Giá bán</th>
        <th style="width:80px;text-align:right">VAT</th>
        <th style="width:105px;text-align:right">Thành tiền</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="totals"><div class="tbox">
      <div class="trow"><span>Tổng tiền trước thuế VAT:</span><span style="font-weight:700">${cfmt(Math.round(subtotalBeforeVAT))} VND</span></div>
      ${q.discount>0?`<div class="trow disc"><span>Chiết khấu (${q.discount}%):</span><span>- ${cfmt(Math.round(discountAmt))} VND</span></div>`:''}
      <div class="trow vat"><span>Thuế VAT:</span><span>${cfmt(Math.round(totalVAT))} VND</span></div>
      <div class="trow grand"><span>TỔNG TIỀN SAU THUẾ VAT:</span><span>${cfmt(Math.round(grandTotal))} VND</span></div>
      <div class="words">Bằng chữ: ${numWords(Math.round(grandTotal))}</div>
      ${items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)?`<div class="pit-note">💡 Thuế TNCN (PIT) đã được gross-up vào giá bán. K&K khấu trừ và nộp thay cho CTV theo quy định.</div>`:''}
    </div></div>
    ${q.notes?`<div class="notes"><strong>📋 Điều kiện & Ghi chú:</strong><br>${q.notes.replace(/\n/g,'<br>')}</div>`:''}
    <div class="sig">
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên A</div><div style="font-size:11px;color:#475569;margin-top:3px">${q.client_name||'Client'}</div><br><br><br><div style="font-size:10px;color:#94A3B8">(Ký, ghi rõ họ tên)</div></div>
      <div class="sigbox"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">Đại diện Bên B</div><div style="font-size:11px;color:#475569;margin-top:3px">CÔNG TY TNHH QUẢNG CÁO K&K</div><br><br><br><div style="font-size:12px;font-weight:700">TÔ NGUYỄN ĐĂNG KHOA</div><div style="font-size:10px;color:#94A3B8">Giám Đốc</div></div>
    </div>
    <div class="footer">K&K Advertising | 737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM | MST: 0317776715 | ĐT: 0938 223 668 | contact@weareknk.com</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(),600)
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:860,maxWidth:'97vw',maxHeight:'93vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.18)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Preview: {q.quote_code}</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={printQuote} style={{padding:'8px 18px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>🖨️ In / Export PDF</button>
            <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
          </div>
        </div>

        {/* Preview content */}
        <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.12)',borderRadius:14,padding:'24px 28px',fontFamily:'Arial,sans-serif',fontSize:12,color:'#0F172A'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,paddingBottom:14,borderBottom:'3px solid #1A56DB'}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:'#1A56DB'}}>K&K <span style={{color:'#06B6D4'}}>advertising</span></div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:2}}>Creative & KOL Marketing Agency</div>
            </div>
            <div style={{fontSize:10,color:'#475569',textAlign:'right',lineHeight:1.7}}>
              CÔNG TY TNHH QUẢNG CÁO K&K<br/>737/7 Kha Vạn Cân, P. Linh Xuân, TP.HCM<br/>MST: 0317776715 | 0938 223 668
            </div>
          </div>
          <div style={{textAlign:'center',marginBottom:18}}>
            <div style={{fontSize:18,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.05em'}}>BÁO GIÁ DỊCH VỤ</div>
            <div style={{fontSize:11,color:'#94A3B8',marginTop:4}}>Số: {q.quote_code}</div>
          </div>

          {/* Items table preview */}
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:16,fontSize:11}}>
            <thead style={{background:'#0F172A'}}>
              <tr>{['STT','Mô tả','ĐV','SL','Giá gốc','Thuế','Markup','Giá bán','VAT','Thành tiền'].map(h=>(
                <th key={h} style={{padding:'7px 8px',color:'#fff',fontSize:9,textAlign:['Giá gốc','Markup','Giá bán','VAT','Thành tiền','SL'].includes(h)?'right':'left',letterSpacing:'0.04em'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {items.map((item,i)=>{
                const c=calcItem(item)
                return <tr key={i} style={{borderBottom:'1px solid #E2E8F0',background:i%2===0?'#fff':'#F8FAFF'}}>
                  <td style={{padding:'7px 8px',textAlign:'center',color:'#94A3B8'}}>{i+1}</td>
                  <td style={{padding:'7px 8px'}}>
                    <div style={{fontWeight:600}}>{item.source_name||item.description||'—'}</div>
                    {item.source_name&&item.description&&<div style={{fontSize:10,color:'#94A3B8'}}>{item.description}</div>}
                    <div style={{fontSize:9,color:item.tax_type==='PIT'?'#D97706':'#7C3AED',marginTop:2,fontWeight:600}}>{item.item_type}</div>
                  </td>
                  <td style={{padding:'7px 8px'}}>{item.unit}</td>
                  <td style={{padding:'7px 8px',textAlign:'right'}}>{item.qty}</td>
                  <td style={{padding:'7px 8px',textAlign:'right'}}>{cfmt(Math.round(Number(item.base_price||0)))}</td>
                  <td style={{padding:'7px 8px',textAlign:'center',fontSize:9,color:item.tax_type==='PIT'?'#92400E':'#6D28D9'}}>{item.tax_type} {item.tax_rate}%</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:700,color:'#059669'}}>{item.markup!==''?item.markup+'%':'—'}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:700,color:'#1A56DB'}}>{cfmt(Math.round(c.lineBeforeVAT))}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',color:'#7C3AED'}}>{item.tax_type==='VAT'&&item.tax_rate>0?cfmt(Math.round(c.lineVAT)):'—'}</td>
                  <td style={{padding:'7px 8px',textAlign:'right',fontWeight:800}}>{cfmt(Math.round(c.lineTotal))}</td>
                </tr>
              })}
            </tbody>
          </table>

          {/* 3-row totals */}
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
            <div style={{width:360,background:'#F8FAFF',borderRadius:10,padding:'16px 18px',border:'1px solid #E2E8F0'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#475569',fontWeight:500}}>Tổng tiền trước thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#0F172A'}}>{cfmt(Math.round(subtotalBeforeVAT))} VND</span>
              </div>
              {q.discount>0&&(
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#D97706',fontWeight:500}}>Chiết khấu ({q.discount}%)</span>
                  <span style={{fontSize:13,fontWeight:700,color:'#D97706'}}>- {cfmt(Math.round(discountAmt))} VND</span>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <span style={{fontSize:13,color:'#7C3AED',fontWeight:500}}>Thuế VAT</span>
                <span style={{fontSize:14,fontWeight:800,color:'#7C3AED'}}>{cfmt(Math.round(totalVAT))} VND</span>
              </div>
              <div style={{height:2,background:'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99,margin:'10px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:14,fontWeight:900,color:'#0F172A'}}>Tổng tiền sau thuế VAT</span>
                <span style={{fontSize:18,fontWeight:900,color:'#1A56DB'}}>{cfmt(Math.round(grandTotal))} VND</span>
              </div>
              <div style={{fontSize:10,color:'#94A3B8',marginTop:5,fontStyle:'italic',textAlign:'right'}}>{numWords(Math.round(grandTotal))}</div>
              {items.some(it=>it.tax_type==='PIT'&&it.tax_rate>0)&&(
                <div style={{marginTop:10,padding:'8px 10px',background:'rgba(217,119,6,0.08)',borderRadius:7,border:'1px solid rgba(217,119,6,0.2)',fontSize:10,color:'#92400E'}}>
                  💡 Thuế TNCN (PIT) đã gross-up vào giá bán. K&K khấu trừ nộp thay.
                </div>
              )}
            </div>
          </div>

          {q.notes&&<div style={{background:'#FFFBEB',border:'1px solid #FCD34D',borderRadius:8,padding:'12px 14px',fontSize:11,color:'#92400E',lineHeight:1.7,marginBottom:12}}>
            <strong>📋 Điều kiện & Ghi chú:</strong><br/>
            {q.notes.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}
          </div>}
        </div>

        <div style={{display:'flex',justifyContent:'space-between',marginTop:16,alignItems:'center'}}>
          <div style={{display:'flex',gap:6}}>
            {['Draft','Sent','Accepted','Rejected'].map(s=>(
              <button key={s} onClick={()=>onStatusChange(s)}
                style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${q.status===s?'#1A56DB':'rgba(26,86,219,0.15)'}`,background:q.status===s?'rgba(26,86,219,0.1)':'transparent',color:q.status===s?'#1A56DB':'#475569',cursor:'pointer',fontSize:11,fontWeight:q.status===s?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{padding:'7px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Đóng</button>
        </div>
      </div>
    </div>
  )
}


// ════════════════════════════════════════════════════════════
// PROJECT WORKFLOW MODULE — K&K Agency OS
// 10-Stage flexible workflow with approvals, tasks, KPI tracking
// ════════════════════════════════════════════════════════════

const STAGES = [
  { id:'LEAD',           label:'Lead',           icon:'🎯', color:'#94A3B8', desc:'Khách hàng tiềm năng' },
  { id:'BRIEF',          label:'Brief',          icon:'📋', color:'#3B82F6', desc:'Tiếp nhận brief từ client' },
  { id:'PROPOSAL',       label:'Proposal',       icon:'💡', color:'#8B5CF6', desc:'Lên ý tưởng, đề xuất' },
  { id:'PRICING',        label:'Pricing',        icon:'💰', color:'#F59E0B', desc:'Định giá, P&L' },
  { id:'CONTRACT',       label:'Contract',       icon:'📝', color:'#06B6D4', desc:'Ký hợp đồng' },
  { id:'PRE_PRODUCTION', label:'Pre-Production', icon:'⚙️', color:'#6366F1', desc:'Chuẩn bị sản xuất' },
  { id:'EXECUTION',      label:'Execution',      icon:'🚀', color:'#10B981', desc:'Triển khai' },
  { id:'REPORTING',      label:'Reporting',      icon:'📊', color:'#0891B2', desc:'Báo cáo kết quả' },
  { id:'PAYMENT',        label:'Payment',        icon:'💳', color:'#059669', desc:'Thanh toán' },
  { id:'CLOSED',         label:'Closed',         icon:'✅', color:'#1A56DB', desc:'Hoàn tất' },
]

// Tasks mặc định theo từng stage
const STAGE_TASKS = {
  LEAD: [
    { title:'Qualify lead', role:'AM', priority:'High', kpi_weight:3 },
    { title:'Ghi nhận thông tin client', role:'AM', priority:'Normal', kpi_weight:1 },
    { title:'Đưa vào Deal Pipeline', role:'AM', priority:'Normal', kpi_weight:1 },
  ],
  BRIEF: [
    { title:'Nhận brief từ client', role:'AM', priority:'High', kpi_weight:3 },
    { title:'Phân tích brief & objectives', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Họp nội bộ kick-off', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Clarify brief với client', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
  PROPOSAL: [
    { title:'Nghiên cứu thị trường & đối thủ', role:'Creative', priority:'Normal', kpi_weight:2 },
    { title:'Lên concept & ý tưởng', role:'Creative', priority:'High', kpi_weight:3 },
    { title:'Build proposal deck', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Internal review proposal', role:'Director', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Present proposal cho client', role:'AM', priority:'High', kpi_weight:3 },
  ],
  PRICING: [
    { title:'Lập danh sách KOL/resources', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Tính chi phí & P&L', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Finance duyệt P&L', role:'Finance', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Director duyệt pricing', role:'Director', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Tạo báo giá', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Gửi báo giá cho client', role:'AM', priority:'High', kpi_weight:2 },
  ],
  CONTRACT: [
    { title:'AM order hợp đồng', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Admin soạn hợp đồng', role:'Admin', priority:'High', kpi_weight:3 },
    { title:'Legal review hợp đồng', role:'Director', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Gửi hợp đồng cho client ký', role:'AM', priority:'High', kpi_weight:2 },
    { title:'Nhận lại hợp đồng đã ký', role:'Admin', priority:'High', kpi_weight:2 },
    { title:'Lưu trữ hợp đồng', role:'Admin', priority:'Normal', kpi_weight:1 },
  ],
  PRE_PRODUCTION: [
    { title:'Assign KOL/team cho dự án', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Ký HĐ CTV với KOL', role:'Admin', priority:'High', kpi_weight:2 },
    { title:'Briefing KOL & team', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Duyệt kịch bản/concept', role:'PM', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Finance duyệt chi phí phát sinh', role:'Finance', priority:'High', kpi_weight:2, requires_approval:true },
    { title:'Chuẩn bị tài liệu & assets', role:'Creative', priority:'Normal', kpi_weight:2 },
    { title:'Setup tracking links', role:'Performance', priority:'Normal', kpi_weight:2 },
  ],
  EXECUTION: [
    { title:'KOL đăng content đúng lịch', role:'KOL Executive', priority:'High', kpi_weight:3 },
    { title:'Monitor & seeding', role:'Performance', priority:'High', kpi_weight:3 },
    { title:'Daily check-in với KOL', role:'KOL Executive', priority:'Normal', kpi_weight:2 },
    { title:'Report tiến độ hàng ngày', role:'PM', priority:'Normal', kpi_weight:2 },
    { title:'Xử lý phát sinh', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Thu thập air links', role:'KOL Executive', priority:'High', kpi_weight:3 },
  ],
  REPORTING: [
    { title:'Thu thập số liệu & kết quả', role:'Performance', priority:'High', kpi_weight:3 },
    { title:'Phân tích KPIs campaign', role:'PM', priority:'High', kpi_weight:3 },
    { title:'Tạo Biên bản nghiệm thu (BBNT)', role:'Admin', priority:'High', kpi_weight:3 },
    { title:'Client duyệt BBNT', role:'AM', priority:'High', kpi_weight:3, requires_approval:true },
    { title:'Build báo cáo tổng kết', role:'PM', priority:'High', kpi_weight:2 },
    { title:'Present kết quả cho client', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
  PAYMENT: [
    { title:'Gửi hóa đơn VAT cho client', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Follow up công nợ', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Xác nhận thanh toán', role:'Finance', priority:'High', kpi_weight:2 },
    { title:'Thanh toán cho KOL/NCC', role:'Finance', priority:'High', kpi_weight:3 },
    { title:'Đối soát P&L thực tế', role:'Finance', priority:'High', kpi_weight:3 },
  ],
  CLOSED: [
    { title:'Lưu trữ hồ sơ dự án', role:'Admin', priority:'Normal', kpi_weight:1 },
    { title:'Cập nhật KPI team', role:'Director', priority:'Normal', kpi_weight:2 },
    { title:'Post-mortem review', role:'PM', priority:'Normal', kpi_weight:2 },
    { title:'Client feedback & satisfaction', role:'AM', priority:'Normal', kpi_weight:2 },
  ],
}

const PRIORITY_COLOR = { Urgent:'#DC2626', High:'#F59E0B', Normal:'#1A56DB', Low:'#94A3B8' }
const TASK_STATUS_COLOR = { Todo:'#94A3B8', 'In Progress':'#1A56DB', Review:'#F59E0B', Done:'#059669', Blocked:'#DC2626' }
const APPROVAL_ROLES = { Finance:'#059669', Director:'#1A56DB', Admin:'#7C3AED', AM:'#F59E0B', PM:'#06B6D4' }

// ── NOTIFICATION HELPER ──────────────────────────────────
async function sendNotification(supabase, {recipient_email, recipient_name, type, title, message, data={}, send_email=false}) {
  await supabase.from('notifications').insert([{
    recipient_email, recipient_name, type, title, message, data, send_email, email_sent: false
  }])
}

// ══════════════════════════════════════════════════════════
// WORKFLOW PAGE — Project list với stages
export default Quotations
