import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { cfmt, cfmtS, toWords, fmtDate, CModal, CBadge, CBtn, CFG, CRow2, CRow3, CSec, CMFoot } from './contractHelpers.js'
const KNK = {
  name:'CÔNG TY TNHH QUẢNG CÁO K&K',address:'737/7 Kha Vạn Cân, Phường Linh Xuân, TP. Hồ Chí Minh',
  taxCode:'0317776715',rep:'TÔ NGUYỄN ĐĂNG KHOA',repTitle:'Giám Đốc',
  bankAccount:'116002937563',bankName:'VIETINBANK',bankBranch:'HCM',
  phone:'0938 223 668',email:'contact@weareknk.com',
}
// ══════════════════════════════════════════════════════════
function AcceptanceReports({data, supabase, reload, log}) {
  const [reports, setReports] = useState([])
  const [contracts, setContracts] = useState([])
  const [tab, setTab] = useState('client')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ loadData() },[tab])

  async function loadData() {
    setLoading(true)
    const [{data:rpts},{data:cnts}] = await Promise.all([
      supabase.from('acceptance_reports').select('*').order('created_at',{ascending:false}),
      supabase.from('contracts').select('*').eq('contract_type',tab)
    ])
    setReports(rpts||[])
    setContracts(cnts||[])
    setLoading(false)
  }

  const filtered = reports.filter(r => contracts.some(c=>c.id===r.contract_id))
  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:CB.navy}}>Biên bản nghiệm thu</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo BBNT</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:'1px solid rgba(26,86,219,0.1)'}}>
        {[['client','🏢  BBNT Client'],['kol','👤  BBNT KOL/CTV']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':CB.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
          <thead><tr>{['Số BBNT','HĐ tham chiếu','Giá trị NT','Còn lại','Ngày ký','Trạng thái',''].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading&&filtered.map(r=>{
              const ct=contracts.find(c=>c.id===r.contract_id)
              return <tr key={r.id}>
                <td style={{...TD,fontWeight:800,color:CB.primary}}>{r.report_code}</td>
                <td style={{...TD,fontWeight:600}}>{ct?.contract_code||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{cfmt(r.accepted_value)}</td>
                <td style={{...TD,fontWeight:700,color:Number(r.remaining_amount)>0?CB.warning:CB.success}}>{cfmt(r.remaining_amount)}</td>
                <td style={{...TD,fontSize:11,color:CB.textTer}}>{r.sign_date||'—'}</td>
                <td style={TD}><CBadge text={r.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem({report:r,contract:ct,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(r);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            })}
            {!loading&&!filtered.length&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:CB.textTer,fontSize:12}}>Chưa có biên bản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm&&<BBNTForm contracts={contracts} data={data} supabase={supabase} edit={editItem} type={tab} onClose={()=>{setShowForm(false);setEditItem(null)}} onSaved={()=>{loadData();reload();log('Lưu BBNT')}}/>}
      {viewItem&&<BBNTPreview report={viewItem.report} contract={viewItem.contract} type={viewItem.type} onClose={()=>setViewItem(null)}/>}
    </div>
  )
}

function BBNTForm({contracts, data, supabase, edit, type, onClose, onSaved}) {
  const [form, setForm] = useState({
    report_code: edit?.report_code || genCode('BBNT'),
    contract_id: edit?.contract_id || '',
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    actual_start_date: edit?.actual_start_date || '',
    actual_end_date: edit?.actual_end_date || new Date().toISOString().slice(0,10),
    deliverables: edit?.deliverables || [],
    contract_value: edit?.contract_value || 0,
    accepted_value: edit?.accepted_value || 0,
    paid_amount: edit?.paid_amount || 0,
    remaining_amount: edit?.remaining_amount || 0,
    payment_deadline: edit?.payment_deadline || (type==='kol'?15:30),
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const selectedContract = contracts.find(c=>c.id===form.contract_id)

  useEffect(()=>{
    if(selectedContract) {
      const kols = selectedContract.kol_list||[]
      set('contract_value', selectedContract.total_with_vat||0)
      set('accepted_value', selectedContract.total_with_vat||0)
      set('actual_start_date', selectedContract.start_date||'')
      set('deliverables', kols.length>0
        ? kols.map((k,i)=>({stt:i+1,name:k.name,link:'',result:'Hoàn thành 100%'}))
        : [{stt:1,name:selectedContract.party_b_name||'',link:'',result:'Hoàn thành 100%'}]
      )
    }
  },[form.contract_id])

  useEffect(()=>{
    set('remaining_amount', Math.max(0, Number(form.accepted_value||0)-Number(form.paid_amount||0)))
  },[form.accepted_value, form.paid_amount])

  const updD=(i,k,v)=>{const a=[...form.deliverables];a[i]={...a[i],[k]:v};set('deliverables',a)}
  const addD=()=>set('deliverables',[...form.deliverables,{stt:form.deliverables.length+1,name:'',link:'',result:'Hoàn thành 100%'}])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload={
      report_code:form.report_code, contract_id:form.contract_id||null,
      project_id:selectedContract?.project_id||null,
      sign_date:form.sign_date||null, actual_start_date:form.actual_start_date||null,
      actual_end_date:form.actual_end_date||null, deliverables:form.deliverables,
      contract_value:Number(form.contract_value||0), accepted_value:Number(form.accepted_value||0),
      paid_amount:Number(form.paid_amount||0), remaining_amount:Number(form.remaining_amount||0),
      payment_deadline:Number(form.payment_deadline||30), status:form.status, notes:form.notes
    }
    let error
    if(edit){({error}=await supabase.from('acceptance_reports').update(payload).eq('id',edit.id))}
    else{({error}=await supabase.from('acceptance_reports').insert([payload]))}
    if(error){alert('Lỗi: '+error.message);return}
    onSaved();onClose()
  }

  return (
    <CModal title={edit?'Sửa BBNT':'Tạo biên bản nghiệm thu'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Thông tin biên bản">
          <CRow3>
            <CFG label="Số BBNT" required><input value={form.report_code} onChange={e=>set('report_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="HĐ tham chiếu" required>
              <select value={form.contract_id} onChange={e=>set('contract_id',e.target.value)} style={CINP_S} required>
                <option value="">— Chọn hợp đồng —</option>
                {contracts.map(c=><option key={c.id} value={c.id}>{c.contract_code} — {type==='client'?c.party_a_name:c.party_b_name}</option>)}
              </select>
            </CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Ngày ký BBNT"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Thời gian thực hiện">
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="date" value={form.actual_start_date} onChange={e=>set('actual_start_date',e.target.value)} style={{...CINP_S,flex:1}}/>
                <span style={{color:CB.textTer,fontSize:12,flexShrink:0}}>→</span>
                <input type="date" value={form.actual_end_date} onChange={e=>set('actual_end_date',e.target.value)} style={{...CINP_S,flex:1}}/>
              </div>
            </CFG>
          </CRow2>
        </CSec>

        {selectedContract&&(
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid rgba(26,86,219,0.1)',fontSize:12}}>
            <strong>{selectedContract.contract_code}</strong> — {type==='client'?selectedContract.party_a_name:selectedContract.party_b_name} — <span style={{color:CB.primary,fontWeight:700}}>{cfmt(selectedContract.total_with_vat)} VND</span>
          </div>
        )}

        <CSec title="Kết quả nghiệm thu">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead><tr>{['STT','Tên / Kênh','Link video/air','Kết quả',''].map(h=><th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
            <tbody>
              {form.deliverables.map((d,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 4px',fontSize:11,textAlign:'center',color:CB.textTer}}>{i+1}</td>
                  <td style={{padding:'5px 4px'}}><input value={d.name} onChange={e=>updD(i,'name',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="Tên KOL / kênh"/></td>
                  <td style={{padding:'5px 4px'}}><input value={d.link} onChange={e=>updD(i,'link',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="https://tiktok.com/@..."/></td>
                  <td style={{padding:'5px 4px'}}><input value={d.result} onChange={e=>updD(i,'result',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}}/></td>
                  <td><button type="button" onClick={()=>set('deliverables',form.deliverables.filter((_,j)=>j!==i))} style={{background:'none',border:'none',cursor:'pointer',color:CB.danger,fontSize:18,lineHeight:1}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addD}>+ Thêm dòng</CBtn>
        </CSec>

        <CSec title="Điều khoản thanh toán">
          <CRow2>
            <CFG label="Giá trị theo HĐ (VND)"><input type="number" value={form.contract_value} onChange={e=>set('contract_value',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Giá trị nghiệm thu (VND)"><input type="number" value={form.accepted_value} onChange={e=>set('accepted_value',Number(e.target.value))} style={CINP_S}/></CFG>
          </CRow2>
          <CRow3>
            <CFG label="Đã thanh toán (VND)"><input type="number" value={form.paid_amount} onChange={e=>set('paid_amount',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Còn phải thanh toán">
              <div style={{padding:'9px 12px',background:Number(form.remaining_amount)>0?'rgba(217,119,6,0.08)':'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:Number(form.remaining_amount)>0?CB.warning:CB.success,border:`1px solid ${Number(form.remaining_amount)>0?CB.warning:CB.success}30`}}>{cfmt(form.remaining_amount)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.remaining_amount)}</div>
            </CFG>
            <CFG label="TT trong (ngày làm việc)"><input type="number" value={form.payment_deadline} onChange={e=>set('payment_deadline',Number(e.target.value))} style={CINP_S}/></CFG>
          </CRow3>
        </CSec>

        <CFG label="Ghi chú"><textarea value={form.notes} onChange={e=>set('notes',e.target.value)} style={{...CINP_S,minHeight:60}}/></CFG>

        <CMFoot onClose={onClose} label="Lưu BBNT" onDelete={edit?async()=>{await supabase.from('acceptance_reports').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

function BBNTPreview({report:r, contract:c, type, onClose}) {
  const isClient = type==='client'
  const pA = isClient
    ? {name:c?.party_a_name,tax:c?.party_a_tax,address:c?.party_a_address,rep:c?.party_a_rep,title:c?.party_a_title,bank:c?.party_a_bank_account,bankName:c?.party_a_bank_name}
    : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName}
  const pB = isClient
    ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName}
    : {name:c?.party_b_name,cccd:c?.party_b_cccd,address:c?.party_b_address,bank:c?.party_b_bank_account,bankName:c?.party_b_bank_name}
  const dels = r.deliverables||[]

  function printBBNT() {
    const w=window.open('','_blank')
    const delTable = dels.length ? `
      <table><thead><tr><th>STT</th><th>Tên / Kênh</th><th>Link Air</th><th>Kết quả</th></tr></thead>
      <tbody>${dels.map((d,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${d.name}</td><td>${d.link}</td><td>${d.result}</td></tr>`).join('')}
      </tbody></table>` : ''

    w.document.write(`<html><head><title>${r.report_code}</title>
    <style>body{font-family:'Times New Roman',serif;font-size:13px;margin:40px 50px;color:#000;line-height:1.7}h1{text-align:center;font-size:17px;font-weight:bold;text-transform:uppercase;margin:10px 0 4px}h2{text-align:center;font-size:13px;margin:0 0 12px;font-style:italic}h3{font-size:13px;font-weight:bold;margin:14px 0 6px;text-transform:uppercase}p{margin:5px 0;text-align:justify}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #000;padding:5px 8px;font-size:12px}th{background:#f0f0f0;font-weight:bold;text-align:center}.logo{font-size:20px;font-weight:900;color:#1A56DB;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px}.sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}.footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}@media print{body{margin:20px 25px}}</style>
    </head><body>
    <div class="logo">K&K advertising</div>
    <h1>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</h1>
    <h2>Hợp Đồng số: ${c?.contract_code||'—'}</h2>
    <p><em>Căn cứ Hợp đồng số: ${c?.contract_code||'—'} ngày ${fmtDate(c?.sign_date)} giữa ${pA.name} và ${pB.name};</em></p>
    <p><em>Căn cứ vào kết quả thực hiện Hợp Đồng,</em></p>
    <p>Hôm nay, <strong>${fmtDate(r.sign_date)}</strong>, chúng tôi gồm:</p>
    <p><strong>BÊN A: ${pA.name}</strong></p>
    ${pA.tax?`<p>Mã số thuế: ${pA.tax}</p>`:''}
    <p>Đại diện: <strong>${pA.rep}</strong> — Chức danh: ${pA.title}</p>
    <p>Địa chỉ: ${pA.address}</p>
    ${pA.bank?`<p>STK: ${pA.bank} — Ngân hàng: ${pA.bankName}</p>`:''}
    <p><em>(Sau đây gọi là "Bên A")</em></p>
    <p><strong>BÊN B: ${pB.name}</strong></p>
    ${pB.cccd?`<p>CCCD: ${pB.cccd}</p>`:''}
    ${pB.tax?`<p>Mã số thuế: ${pB.tax}</p>`:''}
    <p>Địa chỉ: ${pB.address}</p>
    ${isClient?`<p>Đại diện: <strong>${pB.rep}</strong> — Chức danh: ${pB.title}</p>`:''}
    ${pB.bank?`<p>STK: ${pB.bank} — Ngân hàng: ${pB.bankName}</p>`:''}
    <p><em>(Sau đây gọi là "Bên B")</em></p>
    <h3>ĐIỀU 1. ĐIỀU KHOẢN NGHIỆM THU</h3>
    <p>Bên ${isClient?'B':'A'} đã hoàn thành dịch vụ theo thỏa thuận tại Hợp Đồng và yêu cầu của Bên ${isClient?'A':'B'}.</p>
    <p>Thời gian thực hiện thực tế: ${fmtDate(r.actual_start_date)} đến ${fmtDate(r.actual_end_date)}</p>
    ${delTable}
    <h3>ĐIỀU 2. ĐIỀU KHOẢN THANH TOÁN</h3>
    <p>- Phí dịch vụ theo Hợp đồng đã ký: <strong>${cfmt(r.contract_value)} đồng</strong></p>
    <p>- Giá trị nghiệm thu: <strong>${cfmt(r.accepted_value)} đồng</strong></p>
    <p>- Giá trị thực tế Bên A đã thanh toán: <strong>${cfmt(r.paid_amount)} đồng</strong></p>
    <p>- Giá trị Bên A còn phải thanh toán: <strong>${cfmt(r.remaining_amount)} đồng</strong></p>
    <p><em>Bằng chữ: ${toWords(r.remaining_amount)}</em></p>
    <p>Tiến độ thanh toán: 100% trong vòng ${r.payment_deadline} ngày làm việc sau khi ký BBNT.</p>
    ${r.notes?`<p><em>Lưu ý: ${r.notes}</em></p>`:''}
    <p><em>(Lưu ý: trong vòng 02 ngày làm việc tính từ khi Bên B gửi Biên Bản Nghiệm Thu nhưng chưa nhận được sự phản hồi từ Bên A, thì mặc định Biên Bản Nghiệm Thu này được thanh lý.)</em></p>
    <h3>ĐIỀU 3. ĐIỀU KHOẢN CHUNG</h3>
    <p>1. Biên Bản có hiệu lực kể từ ngày ký, hai Bên thống nhất nghiệm thu và không có bất cứ tranh chấp, khiếu nại nào.</p>
    <p>2. Hợp Đồng tự động thanh lý ngay sau Bên A hoàn tất việc thanh toán cho Bên B.</p>
    <p>3. Biên bản được lập thành 02 bản có giá trị pháp lý như nhau, mỗi Bên giữ 01 bản.</p>
    <div class="sig">
      <div><p><strong>ĐẠI DIỆN BÊN A</strong></p><p>${pA.title}</p><br><br><br><p><strong>${pA.rep}</strong></p></div>
      <div><p><strong>${isClient?'ĐẠI DIỆN BÊN B':'BÊN B'}</strong></p><p>${isClient?pB.title:'(Ký ghi rõ họ, tên)'}</p><br><br><br><p><strong>${isClient?pB.rep:pB.name}</strong></p></div>
    </div>
    <div class="footer">A: ${KNK.address} | P: ${KNK.phone} | E: ${KNK.email}</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(),600)
  }

  return (
    <CModal title={`Preview BBNT: ${r.report_code}`} onClose={onClose} wide>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <CBtn primary onClick={printBBNT}>🖨️ In / Export PDF</CBtn>
        <CBadge text={r.status}/>
      </div>
      <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.15)',borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman,serif',fontSize:13,lineHeight:1.7,color:'#000',maxHeight:'60vh',overflowY:'auto'}}>
        <div style={{fontSize:20,fontWeight:900,color:CB.primary,borderBottom:'2px solid #000',paddingBottom:8,marginBottom:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>K&K <span style={{color:CB.accent}}>advertising</span></div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,textTransform:'uppercase'}}>BIÊN BẢN NGHIỆM THU VÀ THANH LÝ</div>
          <div style={{fontSize:13,fontStyle:'italic',color:'#666'}}>Hợp Đồng số: {c?.contract_code||'—'}</div>
        </div>
        <p><em>Căn cứ HĐ số: {c?.contract_code} ngày {fmtDate(c?.sign_date)}</em></p>
        <p>Hôm nay, <strong>{fmtDate(r.sign_date)}</strong>, chúng tôi gồm:</p>
        <div style={{marginBottom:8}}><strong>BÊN A:</strong> {pA.name} — ĐD: {pA.rep}</div>
        <div style={{marginBottom:12}}><strong>BÊN B:</strong> {pB.name}{pB.cccd?` — CCCD: ${pB.cccd}`:''}</div>
        {dels.length>0&&(
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,margin:'10px 0'}}>
            <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên/Kênh','Link Air','Kết quả'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
            <tbody>{dels.map((d,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',fontSize:11}}>{d.link}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{d.result}</td></tr>)}</tbody>
          </table>
        )}
        <div style={{background:'#f8f9fa',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:12}}>
          <div>Giá trị HĐ: <strong>{cfmt(r.contract_value)} VND</strong></div>
          <div>Giá trị NT: <strong>{cfmt(r.accepted_value)} VND</strong></div>
          <div>Đã thanh toán: <strong>{cfmt(r.paid_amount)} VND</strong></div>
          <div>Còn lại: <strong style={{color:Number(r.remaining_amount)>0?CB.warning:CB.success}}>{cfmt(r.remaining_amount)} VND</strong></div>
          <div style={{fontStyle:'italic',marginTop:4}}>Bằng chữ: {toWords(r.remaining_amount)}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:28,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>ĐẠI DIỆN BÊN A</div><div style={{fontSize:12,color:'#666'}}>{pA.title}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{pA.rep}</div></div>
          <div><div style={{fontWeight:700}}>{isClient?'ĐẠI DIỆN BÊN B':'BÊN B'}</div><div style={{fontSize:12,color:'#666'}}>{isClient?pB.title:'(Ký ghi rõ họ tên)'}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{isClient?pB.rep:pB.name}</div></div>
        </div>
      </div>
      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}



// ════════════════════════════════════════════════════════════
// AUTH + PERMISSIONS MODULE — K&K Agency OS
// ════════════════════════════════════════════════════════════

const MODULES = [
  {id:'dashboard',label:'Dashboard',icon:'⬡',grp:'OVERVIEW'},
  {id:'pipeline',label:'Deal Pipeline',icon:'◈',grp:'OVERVIEW'},
  {id:'projects',label:'Dự án',icon:'◉',grp:'OPERATIONS'},
  {id:'pricing',label:'Pricing Engine',icon:'◎',grp:'OPERATIONS'},
  {id:'invoices',label:'Hóa đơn',icon:'▤',grp:'OPERATIONS'},
  {id:'approval',label:'Approvals',icon:'✦',grp:'OPERATIONS'},
  {id:'contracts',label:'Hợp đồng',icon:'📋',grp:'LEGAL'},
  {id:'bbnt',label:'Biên bản NT',icon:'✅',grp:'LEGAL'},
  {id:'clients',label:'Clients',icon:'◑',grp:'DATA'},
  {id:'kols',label:'KOL / KOC',icon:'◐',grp:'DATA'},
  {id:'vendors',label:'Vendors',icon:'◫',grp:'DATA'},
  {id:'team',label:'Team',icon:'◒',grp:'DATA'},
  {id:'reports',label:'Analytics',icon:'▨',grp:'INSIGHTS'},
]

const AVATAR_COLORS = [
  '#1A56DB','#059669','#DC2626','#D97706','#7C3AED',
  '#0891B2','#DB2777','#16A34A','#EA580C','#6366F1'
]

export default AcceptanceReports
