import { useState } from 'react'
import { B } from '../../theme.js'
import { cfmt, cfmtS } from '../Contracts/contractHelpers.js'
// ── IMPORT BUTTON COMPONENT ──────────────────────────────
function ImportBtn({module, data, supabase, reload, log}) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button onClick={()=>setShow(true)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        📥 Import Excel
      </button>
      {show && <ImportModal module={module} data={data} supabase={supabase} reload={reload} log={log} onClose={()=>setShow(false)}/>}
    </>
  )
}

// ── IMPORT MODAL ─────────────────────────────────────────
function ImportModal({module, data, supabase, reload, log, onClose}) {
  const [step, setStep] = useState('upload') // upload | preview | duplicates | done
  const [rows, setRows] = useState([])
  const [headers, setHeaders] = useState([])
  const [duplicates, setDuplicates] = useState([])
  const [dupIdx, setDupIdx] = useState(0)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const MODULE_CONFIG = {
    kols: {
      label: 'KOL/KOC', sheet: 'KOL_KOC',
      keyField: 'Số CCCD *', softKey: 'Tên nghệ danh *',
      mapper: (row) => ({
        name: row['Tên nghệ danh *']||'', real_name: row['Tên thật *']||'',
        gender: row['Giới tính']||'', location: row['Tỉnh/Thành phố']||'',
        city: row['Tỉnh/Thành phố']||'', age_range: row['Độ tuổi']||'',
        cccd: row['Số CCCD *']||'', personal_tax_code: row['MST Cá nhân']||'',
        contact: row['Email']||'', phone: row['Số điện thoại']||'',
        platform: row['Platform chính']||'TikTok', tier: row['Tier']||'Micro',
        niche: row['Niche/Category']||'',
        followers: Number(row['Followers TikTok']||0),
        engagement: Number(row['Engagement TikTok%']||0),
        rate: Number(row['Giá TikTok 1 video (VND)']||0),
        avg_views: Number(row['Avg Views/video']||0),
        reliability: Number(row['Reliability (1-5)']||5),
        available: row['Trạng thái']==='Available',
        bank_account: row['Số tài khoản']||'',
        bank_name: row['Ngân hàng']||'',
        bank_holder: row['Chủ tài khoản']||'',
        address: row['Tỉnh/Thành phố']||'',
        social_links: {
          tiktok: row['Link TikTok']||'',
          instagram: row['Link Instagram']||'',
          youtube: row['Link YouTube']||'',
          facebook: row['Link Facebook']||'',
        },
        platform_pricing: {
          tiktok: Number(row['Giá TikTok 1 video (VND)']||0),
          instagram: Number(row['Giá Instagram 1 post (VND)']||0),
          youtube: Number(row['Giá YouTube 1 video (VND)']||0),
          facebook: Number(row['Giá Facebook 1 post (VND)']||0),
        },
        audience_gender: row['Audience Giới tính chính']||'',
        audience_age: row['Audience Độ tuổi chính']||'',
        audience_location: row['Audience Địa điểm chính']||'',
        avatar_url: row['Link ảnh đại diện']||'',
        cccd_front_url: row['Link CCCD mặt trước']||'',
        cccd_back_url: row['Link CCCD mặt sau']||'',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const cccd = row['Số CCCD *']
        if(!cccd) return null
        const {data:d} = await sb.from('kols').select('id,name,cccd').eq('cccd', cccd)
        return d?.length ? d[0] : null
      }
    },
    clients: {
      label: 'Clients', sheet: 'Clients',
      keyField: 'MST (Mã số thuế) *', softKey: 'Tên Brand/Công ty *',
      mapper: (row) => ({
        name: row['Tên Brand/Công ty *']||'',
        company_type: row['Loại công ty']||'',
        industry: row['Ngành chính']||'',
        industry_sub: row['Ngành phụ']||'',
        size: row['Quy mô']||'SME',
        tax_code: row['MST (Mã số thuế) *']||'',
        address: row['Địa chỉ pháp lý']||'',
        billing_address: row['Địa chỉ xuất hóa đơn']||'',
        legal_rep: row['Người đại diện pháp lý']||'',
        legal_rep_title: row['Chức vụ đại diện']||'',
        bank_account: row['Số tài khoản']||'',
        bank_name: row['Ngân hàng']||'',
        bank_branch: row['Chi nhánh ngân hàng']||'',
        email: row['Email liên hệ *']||'',
        phone: row['SĐT liên hệ']||'',
        contact: row['Contact người phụ trách']||'',
        website: row['Website']||'',
        payment_term: Number(row['Hạn thanh toán (ngày)']||30),
        credit_limit: Number(row['Hạn tín dụng (VND)']||0),
        since: row['Ngày bắt đầu hợp tác']||'',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const tax = row['MST (Mã số thuế) *']
        if(!tax) return null
        const {data:d} = await sb.from('clients').select('id,name,tax_code').eq('tax_code', tax)
        return d?.length ? d[0] : null
      }
    },
    projects: {
      label: 'Dự án', sheet: 'Projects',
      keyField: 'Project Code *', softKey: 'Tên Campaign *',
      mapper: (row) => ({
        project_code: row['Project Code *']||'',
        campaign: row['Tên Campaign *']||'',
        client: row['Client *']||'',
        service: row['Loại dịch vụ']||'KOL/KOC',
        campaign_type: row['Loại Campaign']||'',
        product_name: row['Tên sản phẩm']||'',
        brief: row['Mô tả Brief']||'',
        pm: row['PM phụ trách']||'',
        kols: row['Danh sách KOL (cách dấu phẩy)'] ? row['Danh sách KOL (cách dấu phẩy)'].split(',').map(s=>s.trim()) : [],
        budget_plan: Number(row['Budget Plan (VND)']||0),
        actual_cost: Number(row['Actual Cost (VND)']||0),
        revenue: Number(row['Revenue (VND)']||0),
        start_date: row['Ngày bắt đầu']||null,
        end_date: row['Deadline']||null,
        status: row['Trạng thái']||'Active',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const code = row['Project Code *']
        if(!code) return null
        const {data:d} = await sb.from('projects').select('id,campaign,project_code').eq('project_code', code)
        return d?.length ? d[0] : null
      }
    },
    invoices: {
      label: 'Hóa đơn', sheet: 'Invoices',
      keyField: 'Mã hóa đơn *', softKey: 'Client *',
      mapper: (row) => ({
        invoice_code: row['Mã hóa đơn *']||'',
        client: row['Client *']||'',
        project: row['Tên dự án']||'',
        amount: Number(row['Tổng tiền (VND) *']||0),
        paid: Number(row['Đã thanh toán (VND)']||0),
        due_date: row['Hạn thanh toán']||null,
        status: row['Trạng thái']||'Unpaid',
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const code = row['Mã hóa đơn *']
        if(!code) return null
        const {data:d} = await sb.from('invoices').select('id,client,invoice_code').eq('invoice_code', code)
        return d?.length ? d[0] : null
      }
    },
    deals: {
      label: 'Deal Pipeline', sheet: 'Deals_Pipeline',
      keyField: 'Client/Prospect *', softKey: 'Client/Prospect *',
      mapper: (row) => ({
        client: row['Client/Prospect *']||'',
        service: row['Loại dịch vụ']||'KOL/KOC',
        value: Number(row['Giá trị deal (VND)']||0),
        stage: row['Stage']||'Lead',
        pm: row['PM phụ trách']||'',
        deal_date: row['Ngày tạo']||new Date().toLocaleDateString('vi-VN'),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async () => null
    },
    vendors: {
      label: 'Vendors', sheet: 'Vendors',
      keyField: 'Tên Vendor/Công ty *', softKey: 'Tên Vendor/Công ty *',
      mapper: (row) => ({
        name: row['Tên Vendor/Công ty *']||'',
        type: row['Loại dịch vụ']||'Other',
        contact: row['Liên hệ']||'',
        rating: Number(row['Rating (1-5)']||5),
        total_spent: Number(row['Tổng đã chi (VND)']||0),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const name = row['Tên Vendor/Công ty *']
        if(!name) return null
        const {data:d} = await sb.from('vendors').select('id,name').ilike('name', name)
        return d?.length ? d[0] : null
      }
    },
    team: {
      label: 'Team', sheet: 'Team',
      keyField: 'Email *', softKey: 'Họ và tên *',
      mapper: (row) => ({
        name: row['Họ và tên *']||'',
        role: row['Role/Chức danh *']||'Account Manager',
        email: row['Email *']||'',
        phone: row['Số điện thoại']||'',
        max_projects: Number(row['Max Projects']||5),
        notes: row['Ghi chú']||'',
      }),
      checkDup: async (row, sb) => {
        const email = row['Email *']
        if(!email) return null
        const {data:d} = await sb.from('team').select('id,name,email').eq('email', email)
        return d?.length ? d[0] : null
      }
    },
  }

  const config = MODULE_CONFIG[module]

  // Parse CSV (we'll use SheetJS from CDN in browser)
  function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Simple CSV/text parse fallback
          // In browser with SheetJS this would be proper Excel parse
          const text = e.target.result
          const lines = text.split('\n').filter(l=>l.trim())
          if(!lines.length) { reject('File trống'); return }
          const hdrs = lines[0].split('\t').map(h=>h.trim().replace(/^"|"$/g,''))
          const data = lines.slice(1).map(line => {
            const vals = line.split('\t').map(v=>v.trim().replace(/^"|"$/g,''))
            const obj = {}
            hdrs.forEach((h,i) => { obj[h] = vals[i]||'' })
            return obj
          }).filter(row => Object.values(row).some(v=>v))
          resolve({headers: hdrs, rows: data})
        } catch(err) { reject(err.message) }
      }
      reader.onerror = () => reject('Không đọc được file')
      // Try as text first (for TSV/CSV export from Excel)
      reader.readAsText(file)
    })
  }

  async function handleFile(file) {
    if(!file) return
    try {
      // Use SheetJS if available (loaded via CDN)
      let parsedRows = [], parsedHeaders = []
      if(window.XLSX) {
        const buf = await file.arrayBuffer()
        const wb = window.XLSX.read(buf, {type:'array'})
        // Find the right sheet
        const sheetName = wb.SheetNames.find(n=>n===config.sheet) || wb.SheetNames[1]
        const ws = wb.Sheets[sheetName]
        const json = window.XLSX.utils.sheet_to_json(ws, {header:1, defval:''})
        // Find header row (row 5 in template = index 4)
        const headerRowIdx = json.findIndex(row => row.some(cell=>String(cell||'').includes('*')||String(cell||'').includes('Tên')))
        if(headerRowIdx < 0) { alert('Không tìm thấy hàng header. Dùng đúng file template K&K.'); return }
        parsedHeaders = json[headerRowIdx].map(h=>String(h||'').trim())
        parsedRows = json.slice(headerRowIdx+1)
          .filter(row => row.some(cell=>cell!==''))
          .map(row => {
            const obj = {}
            parsedHeaders.forEach((h,i) => { obj[h] = String(row[i]||'').trim() })
            return obj
          })
          .filter(row => Object.values(row).some(v=>v))
      } else {
        alert('⚠️ Vui lòng chờ thư viện Excel load xong rồi thử lại (F5 trang)')
        return
      }
      setHeaders(parsedHeaders)
      setRows(parsedRows)
      setStep('preview')
    } catch(err) {
      alert('Lỗi đọc file: '+err)
    }
  }

  async function startImport() {
    setImporting(true)
    const dups = []
    for(const row of rows) {
      const existing = await config.checkDup(row, supabase)
      if(existing) dups.push({row, existing, action:'skip'})
    }
    if(dups.length > 0) {
      setDuplicates(dups); setDupIdx(0); setImporting(false); setStep('duplicates')
    } else {
      await doImport(rows, [])
    }
  }

  async function doImport(allRows, dupDecisions) {
    setImporting(true)
    let imported=0, skipped=0, updated=0, errors=[]
    const table = module==='deals'?'deals': module==='team'?'team': module

    for(const row of allRows) {
      const dupDec = dupDecisions.find(d=>d.row===row)
      if(dupDec) {
        if(dupDec.action==='skip') { skipped++; continue }
        if(dupDec.action==='update') {
          const {error} = await supabase.from(table).update(config.mapper(row)).eq('id', dupDec.existing.id)
          if(error) errors.push(error.message)
          else updated++
          continue
        }
      }
      // Check if it's a dup we haven't decided on
      const existing = await config.checkDup(row, supabase)
      if(existing && !dupDec) { skipped++; continue }

      const {error} = await supabase.from(table).insert([config.mapper(row)])
      if(error) errors.push(`${row[config.softKey]}: ${error.message}`)
      else imported++
    }

    await supabase.from('import_logs').insert([{
      module, filename: 'import.xlsx', total_rows: allRows.length,
      imported, skipped, updated, errors, imported_by: 'User'
    }])
    await reload()
    log(`Import ${config.label}: ${imported} thêm, ${updated} cập nhật, ${skipped} bỏ qua`)
    setResult({imported, skipped, updated, errors})
    setImporting(false)
    setStep('done')
  }

  function handleDupDecision(action) {
    const updated = [...duplicates]
    updated[dupIdx].action = action
    setDuplicates(updated)
    if(dupIdx < duplicates.length-1) {
      setDupIdx(dupIdx+1)
    } else {
      // All decided - do import
      const dupRows = duplicates.map(d=>d.row)
      const allRows = rows
      doImport(allRows, updated)
    }
  }

  const curDup = duplicates[dupIdx]
  const configData = MODULE_CONFIG[module]

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget&&step!=='duplicates')onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'28px 32px',width:700,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.2)'}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,paddingBottom:16,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:'#0F172A'}}>📥 Import {configData?.label}</div>
            <div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>Dùng file template K&K — Sheet: {configData?.sheet}</div>
          </div>
          {step!=='duplicates'&&<button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>}
        </div>

        {/* Steps indicator */}
        <div style={{display:'flex',gap:0,marginBottom:24}}>
          {[['upload','1. Upload'],['preview','2. Preview'],['duplicates','3. Duplicates'],['done','4. Done']].map(([s,l],i)=>{
            const steps=['upload','preview','duplicates','done']
            const cur=steps.indexOf(step), idx=steps.indexOf(s)
            const active=cur===idx, done2=cur>idx
            return <div key={s} style={{flex:1,textAlign:'center',padding:'8px 4px',fontSize:10.5,fontWeight:active||done2?700:500,color:active?'#1A56DB':done2?'#059669':'#94A3B8',background:active?'rgba(26,86,219,0.08)':done2?'rgba(5,150,105,0.06)':'transparent',borderBottom:`2px solid ${active?'#1A56DB':done2?'#059669':'#E2E8F0'}`,transition:'all 0.2s'}}>
              {done2?'✓ ':''}{l}
            </div>
          })}
        </div>

        {/* STEP 1: Upload */}
        {step==='upload'&&(
          <div>
            <div
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}}
              style={{border:`2px dashed ${dragOver?'#1A56DB':'rgba(26,86,219,0.25)'}`,borderRadius:16,padding:'48px 32px',textAlign:'center',background:dragOver?'rgba(26,86,219,0.04)':'rgba(248,250,255,0.8)',transition:'all 0.2s',cursor:'pointer'}}
              onClick={()=>document.getElementById('file-input-'+module).click()}
            >
              <div style={{fontSize:40,marginBottom:12}}>📊</div>
              <div style={{fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:6}}>Kéo thả file Excel vào đây</div>
              <div style={{fontSize:12,color:'#94A3B8',marginBottom:16}}>hoặc click để chọn file (.xlsx)</div>
              <div style={{display:'inline-block',padding:'8px 20px',borderRadius:9,background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',fontSize:12,fontWeight:700}}>Chọn file</div>
            </div>
            <input id={'file-input-'+module} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>

            <div style={{marginTop:20,padding:'14px 16px',background:'rgba(26,86,219,0.04)',borderRadius:12,border:'1px solid rgba(26,86,219,0.1)'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1A56DB',marginBottom:8}}>📋 Chưa có template? Download tại đây:</div>
              <div style={{fontSize:11,color:'#475569'}}>Dùng file <strong>KK_Import_Templates.xlsx</strong> đã được cung cấp → Điền vào sheet <strong>{configData?.sheet}</strong> → Upload lại file này</div>
            </div>
          </div>
        )}

        {/* STEP 2: Preview */}
        {step==='preview'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:700,color:'#0F172A'}}>Tìm thấy <span style={{color:'#1A56DB'}}>{rows.length} records</span> để import</div>
              <button onClick={()=>setStep('upload')} style={{padding:'5px 12px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>← Chọn lại file</button>
            </div>
            <div style={{overflowX:'auto',maxHeight:340,border:'1px solid rgba(26,86,219,0.1)',borderRadius:10}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                <thead>
                  <tr>{headers.slice(0,8).map(h=><th key={h} style={{padding:'8px 10px',fontSize:10,fontWeight:700,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.9)',whiteSpace:'nowrap',textTransform:'uppercase'}}>{h.replace(' *','')}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0,10).map((row,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid rgba(26,86,219,0.05)',background:i%2===0?'#fff':'rgba(240,244,255,0.5)'}}>
                      {headers.slice(0,8).map(h=><td key={h} style={{padding:'7px 10px',fontSize:11,color:'#0F172A',maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row[h]||'—'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length>10&&<div style={{fontSize:11,color:'#94A3B8',marginTop:8,textAlign:'center'}}>...và {rows.length-10} records khác</div>}
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
              <button onClick={()=>setStep('upload')} style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
              <button onClick={startImport} disabled={importing} style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                {importing?'Đang kiểm tra...':'Tiếp tục →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Duplicates */}
        {step==='duplicates'&&curDup&&(
          <div>
            <div style={{background:'rgba(217,119,6,0.08)',border:'1px solid rgba(217,119,6,0.3)',borderRadius:12,padding:'16px 20px',marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:800,color:'#92400E',marginBottom:4}}>
                ⚠️ Phát hiện trùng lặp ({dupIdx+1}/{duplicates.length})
              </div>
              <div style={{fontSize:12,color:'#92400E'}}>Record này đã tồn tại trong database. Bạn muốn làm gì?</div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div style={{background:'rgba(26,86,219,0.04)',borderRadius:12,padding:'16px',border:'1px solid rgba(26,86,219,0.15)'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#1A56DB',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>📥 Data mới (từ Excel)</div>
                {Object.entries(curDup.row).slice(0,8).map(([k,v])=>v?(
                  <div key={k} style={{fontSize:11,marginBottom:4,display:'flex',gap:8}}>
                    <span style={{color:'#94A3B8',minWidth:120,flexShrink:0}}>{k.replace(' *','')}:</span>
                    <span style={{color:'#0F172A',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
                  </div>
                ):null)}
              </div>
              <div style={{background:'rgba(5,150,105,0.04)',borderRadius:12,padding:'16px',border:'1px solid rgba(5,150,105,0.15)'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#059669',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>✅ Data hiện tại (trong DB)</div>
                {Object.entries(curDup.existing).map(([k,v])=>v&&k!=='id'?(
                  <div key={k} style={{fontSize:11,marginBottom:4,display:'flex',gap:8}}>
                    <span style={{color:'#94A3B8',minWidth:80,flexShrink:0}}>{k}:</span>
                    <span style={{color:'#0F172A',fontWeight:500}}>{String(v)}</span>
                  </div>
                ):null)}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
              <button onClick={()=>handleDupDecision('update')} style={{padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                🔄 Update<br/><span style={{fontSize:10,fontWeight:500,opacity:0.8}}>Cập nhật bằng data mới</span>
              </button>
              <button onClick={()=>handleDupDecision('skip')} style={{padding:'12px',borderRadius:10,border:'1.5px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.05)',color:'#1A56DB',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                ⏭️ Bỏ qua<br/><span style={{fontSize:10,fontWeight:500}}>Giữ nguyên data cũ</span>
              </button>
              <button onClick={()=>{
                const updated=[...duplicates].map(d=>({...d,action:'skip'}))
                doImport(rows,updated)
              }} style={{padding:'12px',borderRadius:10,border:'1.5px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.05)',color:'#DC2626',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:'center'}}>
                ⏩ Skip tất cả<br/><span style={{fontSize:10,fontWeight:500}}>Bỏ qua mọi record trùng</span>
              </button>
            </div>

            <div style={{marginTop:16,padding:'10px 14px',background:'rgba(248,250,255,0.8)',borderRadius:8,border:'1px solid rgba(26,86,219,0.08)'}}>
              <div style={{display:'flex',gap:4}}>
                {duplicates.map((d,i)=>(
                  <div key={i} style={{width:12,height:12,borderRadius:3,background:i<dupIdx?'#059669':i===dupIdx?'#1A56DB':'#E2E8F0',display:'inline-block',marginRight:4}}/>
                ))}
              </div>
              <div style={{fontSize:11,color:'#94A3B8',marginTop:6}}>
                Còn lại {duplicates.length-dupIdx} records cần xử lý
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Done */}
        {step==='done'&&result&&(
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:48,marginBottom:16}}>🎉</div>
            <div style={{fontSize:18,fontWeight:900,color:'#0F172A',marginBottom:8}}>Import hoàn tất!</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,margin:'24px 0',textAlign:'left'}}>
              {[['✅ Đã thêm mới',result.imported,'#059669','rgba(5,150,105,0.08)'],
                ['🔄 Đã cập nhật',result.updated,'#1A56DB','rgba(26,86,219,0.08)'],
                ['⏭️ Đã bỏ qua',result.skipped,'#D97706','rgba(217,119,6,0.08)']].map(([l,v,c,bg])=>(
                <div key={l} style={{background:bg,borderRadius:12,padding:'16px',border:`1px solid ${c}25`}}>
                  <div style={{fontSize:11,color:c,fontWeight:700,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:28,fontWeight:900,color:'#0F172A'}}>{v}</div>
                </div>
              ))}
            </div>
            {result.errors?.length>0&&(
              <div style={{background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:10,padding:'12px 16px',marginBottom:16,textAlign:'left'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#DC2626',marginBottom:6}}>⚠️ {result.errors.length} lỗi:</div>
                {result.errors.slice(0,5).map((e,i)=><div key={i} style={{fontSize:11,color:'#DC2626',marginBottom:2}}>{e}</div>)}
              </div>
            )}
            <button onClick={onClose} style={{padding:'10px 28px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Đóng & Xem kết quả
            </button>
          </div>
        )}

        {importing&&step!=='done'&&(
          <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.85)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:20,flexDirection:'column',gap:12}}>
            <div style={{width:40,height:40,border:'4px solid rgba(26,86,219,0.2)',borderTop:'4px solid #1A56DB',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
            <div style={{fontSize:13,fontWeight:600,color:'#1A56DB'}}>Đang import...</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// QUOTATION MODULE — Báo giá
export { ImportBtn }
