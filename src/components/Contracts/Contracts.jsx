import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { cfmt, cfmtS, toWords, fmtDate, genCode, CModal, CBadge, CBtn, CFG, CRow2, CRow3, CSec, CMFoot } from './contractHelpers.js'
const KNK = {
  name:'CÔNG TY TNHH QUẢNG CÁO K&K',address:'737/7 Kha Vạn Cân, Phường Linh Xuân, TP. Hồ Chí Minh',
  taxCode:'0317776715',rep:'TÔ NGUYỄN ĐĂNG KHOA',repTitle:'Giám Đốc',
  bankAccount:'116002937563',bankName:'VIETINBANK',bankBranch:'HCM',
  phone:'0938 223 668',email:'contact@weareknk.com',
}
// ── Clauses HĐ Dịch vụ ───────────────────────────────────
function clausesHDDV(partyA, partyB, form, kolList, fee, vat, total) {
  return `
<h3>ĐIỀU 1. ĐỊNH NGHĨA</h3>
<p>Nếu không có những sự kiện vượt ra ngoài giới hạn kiểm soát hợp lý, những Điều, Khoản và từ ngữ bên dưới, bất cứ khi nào được sử dụng trong Hợp Đồng, Phụ lục Hợp Đồng (nếu có) nếu không thay đổi, được định nghĩa như sau:</p>
<ol>
<li><em>"Bên"</em> có nghĩa là Bên A hay Bên B;</li>
<li><em>"Các Bên"</em> có nghĩa là cả hai Bên, Bên A và Bên B;</li>
<li><em>"Bên Thứ ba"</em> có nghĩa là không phải là Các Bên;</li>
<li><em>"Sự kiện bất khả kháng"</em> có nghĩa là sự kiện xảy ra một cách khách quan không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết và trong khả năng cho phép, chẳng hạn như: chiến tranh, bạo loạn, đình công, hỏa hoạn, thiên tai, lũ lụt, dịch bệnh, cách ly do kiểm dịch;</li>
<li><em>"Phạm vi công việc"</em> có nghĩa là những công việc mà Bên có nghĩa vụ phải thực hiện cho đến khi Hợp Đồng này chấm dứt;</li>
<li><em>"Thông tin"</em> có nghĩa là tất cả các thông tin, tài liệu có thể đọc được, nghe được, thấy được, thể hiện hoặc lưu trữ dưới các hình thức: văn bản, tệp (file), thư điện tử (email), hình ảnh,... hoặc bằng các hình thức khác mà Các Bên có được trong quá trình thực hiện Hợp Đồng.</li>
</ol>

<h3>ĐIỀU 2. ĐỐI TƯỢNG CỦA HỢP ĐỒNG</h3>
<p>1. Bên A đồng ý giao và Bên B đồng ý nhận thực hiện dịch vụ theo yêu cầu của Bên A với nội dung cụ thể như sau:</p>
<p>a) Bên B cung cấp người nổi tiếng/ người có tầm ảnh hưởng – KOLs/Influencers (sau đây gọi chung là "Nhân sự") thực hiện quay và sản xuất nội dung (sau đây gọi chung là "Sản phẩm") theo chủ đề và yêu cầu của Bên A và đăng tải lên tài khoản TikTok của Nhân sự.</p>
<p>2. Thời gian thực hiện công việc: Bắt đầu từ ${form.start_date||'ngày ký'} đến khi thực hiện nghiệm thu.</p>
<p>3. Báo giá chỉ có hiệu lực trong thời hạn từ 15 đến 30 ngày kể từ ngày ký kết Hợp Đồng.</p>
<p>4. Phạm vi công việc cụ thể: Nhân sự của Bên B thực hiện quay và hoàn thiện Sản phẩm theo nội dung đã thỏa thuận. Số lần chỉnh sửa tối đa là hai (02) lần/Sản phẩm.</p>

<h3>ĐIỀU 3. GIÁ TRỊ HỢP ĐỒNG VÀ TIẾN ĐỘ THANH TOÁN</h3>
<p><strong>1. Giá trị Hợp Đồng:</strong></p>
<p>&nbsp;&nbsp;&nbsp;a) Phí dịch vụ: ${cfmt(fee)} VNĐ</p>
<p>&nbsp;&nbsp;&nbsp;b) Thuế GTGT (${form.vat_rate||8}%): ${cfmt(Number(fee)*Number(form.vat_rate||8)/100)} VNĐ</p>
<p>&nbsp;&nbsp;&nbsp;c) Tổng giá trị Hợp Đồng: <strong>${cfmt(total)} VNĐ</strong></p>
<p>&nbsp;&nbsp;&nbsp;<em>Bằng chữ: ${toWords(total)}</em></p>
<p><strong>2. Tiến độ thanh toán:</strong> ${form.payment_terms||'Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày làm việc sau khi Bên B hoàn tất toàn bộ công việc và Bên A đã nhận đầy đủ chứng từ hợp lệ bao gồm: Hợp đồng, Biên bản nghiệm thu và Hoá đơn GTGT hợp lệ.'}</p>
<p><em>(Lưu ý: trong vòng 02 ngày làm việc tính từ khi Bên B gửi Biên Bản Nghiệm Thu nhưng chưa nhận được sự phản hồi từ Bên A, thì mặc định Biên Bản Nghiệm Thu này được thanh lý.)</em></p>

<h3>ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ BÊN B</h3>
<p><strong>1. Quyền của Bên B:</strong> Được nhận thanh toán đầy đủ và đúng hạn; Từ chối thực hiện khi Bên A chậm giao tài liệu hoặc không thanh toán đúng hạn; Được quyền xóa hoặc ẩn bài đăng nếu phát hiện vi phạm pháp luật sau khi thông báo bằng văn bản.</p>
<p><strong>2. Nghĩa vụ của Bên B:</strong> Đảm bảo thực hiện đúng và đầy đủ nội dung Điều 2; Tuyệt đối bảo mật thông tin trong vòng 02 năm kể từ ngày ký; Đảm bảo lưu trữ Sản phẩm đã đăng tải ở chế độ công khai tối thiểu 06 tháng.</p>

<h3>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ BÊN A</h3>
<p><strong>1. Quyền của Bên A:</strong> Yêu cầu Bên B thực hiện đúng nội dung và thời gian; Yêu cầu chỉnh sửa Sản phẩm theo quy định; Đơn phương chấm dứt Hợp Đồng nếu Bên B vi phạm sau khi đã gửi thông báo ít nhất 02 lần.</p>
<p><strong>2. Nghĩa vụ của Bên A:</strong> Thanh toán đầy đủ và đúng hạn (lãi chậm thanh toán 0.05%/ngày); Cam kết tính hợp pháp của thông tin cung cấp; Không tự ý làm việc trực tiếp với KOL/KOC do Bên B cung cấp trong thời hạn hợp đồng; Cung cấp feedback trong vòng 24-48 giờ.</p>

<h3>ĐIỀU 6. QUYỀN SỞ HỮU TRÍ TUỆ</h3>
<p>Bên B đảm bảo tính nguyên gốc, tính sáng tạo và tính hợp pháp của các tài sản sở hữu trí tuệ sử dụng trong Sản phẩm. Các Bên cam kết tôn trọng và thực hiện đầy đủ các nghĩa vụ về quyền sở hữu trí tuệ.</p>

<h3>ĐIỀU 7. BỒI THƯỜNG THIỆT HẠI VÀ PHẠT VI PHẠM</h3>
<p>1. Bên vi phạm phải bồi thường tất cả tổn thất phát sinh từ hành vi vi phạm.</p>
<p>2. Mọi trường hợp vi phạm đều phải chịu mức phạt 8% trên phần giá trị Hợp Đồng bị vi phạm.</p>
<p>3. Trong trường hợp Bên A muốn chạy quảng cáo trên các video của nhân sự do Bên B quản lý thì bắt buộc phải thông qua Bên B; nếu vi phạm thì Bên A sẽ bồi thường 200% giá trị hợp đồng.</p>

<h3>ĐIỀU 8. CHỐNG HỐI LỘ</h3>
<p>Bên A không được trao cho nhân viên của Bên B các lợi ích bằng tiền hoặc hiện vật dưới bất kỳ hình thức nào mà không được sự đồng ý của Bên B. Vi phạm chịu phạt 8% giá trị Hợp đồng hoặc 200% giá trị hối lộ và bồi thường 20% giá trị Hợp đồng.</p>

<h3>ĐIỀU 9. CHẤM DỨT HỢP ĐỒNG</h3>
<p>Hợp Đồng chấm dứt khi: Các Bên hoàn thành đầy đủ nghĩa vụ; Một trong Các Bên bị phá sản; Các Bên thỏa thuận chấm dứt trước thời hạn (thông báo trước 15 ngày); Một Bên đơn phương chấm dứt do bên kia vi phạm không khắc phục trong 10 ngày; Sự kiện bất khả kháng kéo dài quá 30 ngày.</p>

<h3>ĐIỀU 10. GIẢI QUYẾT TRANH CHẤP</h3>
<p>Trong quá trình thực hiện Hợp Đồng, nếu có phát sinh tranh chấp thì Các Bên sẽ giải quyết bằng thương lượng, hòa giải. Trường hợp không giải quyết được trong vòng 30 ngày, một trong Các Bên có quyền yêu cầu Tòa án có thẩm quyền giải quyết. Bên thua kiện chịu mọi chi phí phát sinh.</p>

<h3>ĐIỀU 11. ĐIỀU KHOẢN CHUNG</h3>
<p>1. Hợp Đồng có hiệu lực kể từ ngày ký và tự động thanh lý sau khi Các Bên hoàn thành đầy đủ nghĩa vụ.</p>
<p>2. Mọi sửa đổi, bổ sung Hợp Đồng phải thực hiện bằng Phụ lục Hợp Đồng.</p>
<p>3. Hợp Đồng được lập thành 02 bản có giá trị giống như nhau, Bên A giữ 01 bản và Bên B giữ 01 bản.</p>
`
}

// ── Clauses HĐ CTV ───────────────────────────────────────
function clausesHDCTV(form, fee, tax, netFee) {
  return `
<h3>ĐIỀU 1. ĐỊNH NGHĨA</h3>
<p>Các từ ngữ trong Hợp Đồng được định nghĩa như sau: <em>"Bên"</em> là Bên A hay Bên B; <em>"Các Bên"</em> là cả hai Bên; <em>"Bên Thứ ba"</em> là không phải Các Bên; <em>"Sự kiện bất khả kháng"</em> là những sự kiện khách quan không thể lường trước và không thể khắc phục; <em>"Phạm vi công việc"</em> là những công việc Bên B phải thực hiện; <em>"Biên tập"</em> là việc điều chỉnh, thêm, bớt nội dung video; <em>"Ngày làm việc"</em> là các ngày từ Thứ 2 đến Thứ 6.</p>

<h3>ĐIỀU 2. ĐỐI TƯỢNG HỢP ĐỒNG</h3>
<p>a) Bên A giao và Bên B đồng ý thực hiện: <strong>${form.scope_of_work||'1 video TikTok review sản phẩm theo định hướng của khách hàng'}</strong></p>
<p>b) Thời gian thực hiện: từ ${form.start_date||'ngày ký'} đến khi thực hiện nghiệm thu.</p>
<p>c) Kênh đăng tải: <strong>${form.channels||'Theo thỏa thuận'}</strong></p>
<p>d) Thời hạn Hợp Đồng: kể từ ngày ký cho đến khi các Bên hoàn thành toàn bộ nghĩa vụ.</p>

<h3>ĐIỀU 3. THÙ LAO VÀ THANH TOÁN</h3>
<p>1. Thù lao gốc: <strong>${cfmt(fee)} VNĐ</strong></p>
<p>2. Khấu trừ thuế TNCN (${form.vat_rate||10}%): ${cfmt(Number(fee)*Number(form.vat_rate||10)/100)} VNĐ</p>
<p>3. <strong>Thù lao thực nhận (đã khấu trừ thuế TNCN): ${cfmt(netFee)} VNĐ</strong></p>
<p>&nbsp;&nbsp;&nbsp;<em>Bằng chữ: ${toWords(netFee)}</em></p>
<p>4. Phương thức: Chuyển khoản.</p>
<p>5. Tiến độ: ${form.payment_terms||'100% trong vòng 15 ngày làm việc kể từ ngày hoàn thành công việc và ký Biên bản nghiệm thu.'}</p>

<h3>ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</h3>
<p><strong>1. Quyền của Bên A:</strong> Điều chỉnh phạm vi và thời gian thực hiện; Yêu cầu điều chỉnh thể hiện của Bên B; Chấm dứt và miễn nghĩa vụ thanh toán nếu Bên B không thực hiện đúng; Sử dụng video, hình ảnh của Bên B để quảng bá; Là chủ sở hữu hợp pháp đối với tất cả sản phẩm Bên B tạo ra.</p>
<p><strong>2. Nghĩa vụ của Bên A:</strong> Thông báo lịch làm việc; Phối hợp từ giai đoạn chuẩn bị đến hoàn thành; Thanh toán đúng hạn và đầy đủ.</p>

<h3>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</h3>
<p><strong>1. Quyền của Bên B:</strong> Nhận đầy đủ thù lao; Được thông báo khi có thay đổi thời gian.</p>
<p><strong>2. Nghĩa vụ của Bên B:</strong> Thực hiện đầy đủ công việc; Đảm bảo chất lượng kỹ thuật; Không tạo dư luận xấu ảnh hưởng đến nhãn hàng; Cam kết giữ bài đăng công khai vĩnh viễn (vi phạm đền bù 200% giá trị tương ứng); Bảo mật toàn bộ thông tin Hợp Đồng.</p>

<h3>ĐIỀU 6. BỒI THƯỜNG THIỆT HẠI VÀ PHẠT VI PHẠM</h3>
<p>1. Mọi vi phạm phải bồi thường tổn thất và chịu phạt 8% giá trị phần nghĩa vụ bị vi phạm.</p>
<p>2. Nếu Bên B không hoàn thành đúng thời hạn hoặc không đúng chất lượng, ngoài việc thực hiện phần còn lại, Bên B phải chịu phạt 200% giá trị phần Hợp Đồng bị vi phạm.</p>

<h3>ĐIỀU 7. CHẤM DỨT HỢP ĐỒNG</h3>
<p>Hợp Đồng chấm dứt khi: Các Bên hoàn thành nghĩa vụ; Các Bên thỏa thuận chấm dứt trước thời hạn (thông báo trước 30 ngày làm việc); Một Bên đơn phương chấm dứt do vi phạm (thông báo trước 15 ngày).</p>

<h3>ĐIỀU 8. ĐIỀU KHOẢN CHUNG</h3>
<p>1. Hợp Đồng có hiệu lực kể từ ngày ký và được thanh lý sau khi hoàn thành toàn bộ nghĩa vụ.</p>
<p>2. Mọi sửa đổi, bổ sung phải được hai Bên thống nhất bằng văn bản.</p>
<p>3. Tranh chấp giải quyết bằng thương lượng; nếu không được, một Bên có quyền yêu cầu Tòa án tại TP. Hồ Chí Minh giải quyết.</p>
<p>4. Hợp Đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi Bên giữ 01 bản.</p>
`
}

// ══════════════════════════════════════════════════════════
// CONTRACTS PAGE
// ══════════════════════════════════════════════════════════
function Contracts({data, supabase, reload, log}) {
  const [tab, setTab] = useState('client')
  const [contracts, setContracts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadContracts() }, [tab])

  async function loadContracts() {
    setLoading(true)
    const {data:rows,error} = await supabase.from('contracts').select('*').eq('contract_type',tab).order('created_at',{ascending:false})
    if(error) console.error(error)
    setContracts(rows||[])
    setLoading(false)
  }

  const filtered = contracts.filter(c =>
    !filter ||
    (c.contract_code||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_a_name||'').toLowerCase().includes(filter.toLowerCase()) ||
    (c.party_b_name||'').toLowerCase().includes(filter.toLowerCase())
  )

  const TH={padding:'10px 14px',fontSize:10,fontWeight:800,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}
  const TD={padding:'10px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)',verticalAlign:'middle'}

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:CB.navy}}>Hợp đồng</h2>
        <CBtn primary onClick={()=>{setEditItem(null);setShowForm(true)}}>+ Tạo hợp đồng</CBtn>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:16,background:'rgba(255,255,255,0.7)',padding:4,borderRadius:10,width:'fit-content',border:'1px solid rgba(26,86,219,0.1)'}}>
        {[['client','🏢  HĐ Dịch vụ (Client)'],['kol','👤  HĐ Cộng tác viên (KOL)']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:'7px 18px',borderRadius:8,border:'none',background:tab===key?CB.grad:'transparent',color:tab===key?'#fff':CB.textSec,cursor:'pointer',fontSize:12,fontWeight:tab===key?700:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          ['Tổng HĐ', contracts.length],
          ['Draft', contracts.filter(c=>c.status==='Draft').length],
          ['Đã ký', contracts.filter(c=>c.status==='Signed').length],
          ['Tổng giá trị', cfmtS(contracts.reduce((a,c)=>a+Number(c.total_with_vat||0),0))+' VND']
        ].map(([l,v])=>(
          <div key={l} style={{background:'rgba(255,255,255,0.9)',borderRadius:12,padding:'12px 16px',border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{fontSize:10,fontWeight:700,color:CB.textTer,textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
            <div style={{fontSize:20,fontWeight:900,color:CB.primary,marginTop:5}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:14}}>
        <input placeholder="🔍  Tìm theo số HĐ, tên client, KOL..." value={filter} onChange={e=>setFilter(e.target.value)} style={{...CINP_S,maxWidth:380}}/>
      </div>

      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
          <thead>
            <tr>
              {['Số HĐ','Bên đối tác','Dự án','Giá trị (VND)','Ngày ký','Trạng thái',''].map(h=>(
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:CB.textTer}}>Đang tải...</td></tr>}
            {!loading && filtered.map(c=>(
              <tr key={c.id}>
                <td style={{...TD,fontWeight:800,color:CB.primary,fontSize:12}}>{c.contract_code}</td>
                <td style={{...TD,fontWeight:600}}>{tab==='client'?c.party_a_name:c.party_b_name}</td>
                <td style={{...TD,fontSize:11,color:CB.textSec}}>{data.projects.find(p=>p.id===c.project_id)?.campaign||'—'}</td>
                <td style={{...TD,fontWeight:700}}>{cfmt(c.total_with_vat)}</td>
                <td style={{...TD,fontSize:11,color:CB.textTer}}>{c.sign_date||'—'}</td>
                <td style={TD}><CBadge text={c.status}/></td>
                <td style={{...TD,display:'flex',gap:6}}>
                  <CBtn sm onClick={()=>setViewItem({contract:c,type:tab})}>Xem</CBtn>
                  <CBtn sm onClick={()=>{setEditItem(c);setShowForm(true)}}>Sửa</CBtn>
                </td>
              </tr>
            ))}
            {!loading && !filtered.length && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:CB.textTer,fontSize:12}}>Chưa có hợp đồng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && tab==='client' && (
        <ContractClientForm
          data={data} supabase={supabase} edit={editItem}
          onClose={()=>{setShowForm(false);setEditItem(null)}}
          onSaved={()=>{loadContracts();reload();log('Lưu HĐ client')}}
        />
      )}
      {showForm && tab==='kol' && (
        <ContractKOLForm
          data={data} supabase={supabase} edit={editItem}
          onClose={()=>{setShowForm(false);setEditItem(null)}}
          onSaved={()=>{loadContracts();reload();log('Lưu HĐ KOL')}}
        />
      )}
      {viewItem && (
        <ContractPreview
          contract={viewItem.contract} type={viewItem.type}
          onClose={()=>setViewItem(null)}
        />
      )}
    </div>
  )
}

// ── HĐ Client Form ────────────────────────────────────────
function ContractClientForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || genCode('HDDV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    sign_location: edit?.sign_location || 'Văn phòng Công Ty TNHH Quảng cáo K&K',
    project_id: edit?.project_id || '',
    party_a_name: edit?.party_a_name || '',
    party_a_tax: edit?.party_a_tax || '',
    party_a_address: edit?.party_a_address || '',
    party_a_rep: edit?.party_a_rep || '',
    party_a_title: edit?.party_a_title || 'Giám Đốc',
    party_a_bank_account: edit?.party_a_bank_account || '',
    party_a_bank_name: edit?.party_a_bank_name || '',
    service_type: edit?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || '',
    kol_list: edit?.kol_list || [],
    total_fee: edit?.total_fee || 0,
    vat_rate: edit?.vat_rate || 8,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || 'Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày làm việc sau khi Bên B hoàn tất toàn bộ công việc và Bên A đã nhận đầy đủ chứng từ hợp lệ bao gồm: Hợp đồng, Biên bản nghiệm thu và Hoá đơn GTGT hợp lệ.',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    const vat = Number(form.total_fee||0) * Number(form.vat_rate||8) / 100
    set('total_with_vat', Number(form.total_fee||0) + vat)
  }, [form.total_fee, form.vat_rate])

  useEffect(()=>{
    const total = form.kol_list.reduce((a,k)=>a+Number(k.fee||0),0)
    if(total > 0) set('total_fee', total)
  }, [form.kol_list])

  function fillClient(name) {
    const c = data.clients.find(cl => cl.name?.toLowerCase()===name?.toLowerCase())
    if(c) {
      setForm(p=>({...p,
        party_a_name: c.name||p.party_a_name,
        party_a_tax: c.tax_code||p.party_a_tax,
        party_a_address: c.address||p.party_a_address,
        party_a_rep: c.legal_rep||p.party_a_rep,
        party_a_title: c.legal_rep_title||p.party_a_title,
        party_a_bank_account: c.bank_account||p.party_a_bank_account,
        party_a_bank_name: c.bank_name||p.party_a_bank_name,
      }))
    }
  }

  const addKol = () => set('kol_list',[...form.kol_list,{name:'',tiktok:'',work:'Sản xuất 1 video theo yêu cầu của nhãn hàng',fee:0}])
  const updKol = (i,k,v) => { const a=[...form.kol_list]; a[i]={...a[i],[k]:v}; set('kol_list',a) }
  const delKol = (i) => set('kol_list', form.kol_list.filter((_,j)=>j!==i))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      contract_code: form.contract_code, contract_type: 'client',
      project_id: form.project_id||null,
      party_a_name: form.party_a_name, party_a_tax: form.party_a_tax,
      party_a_address: form.party_a_address, party_a_rep: form.party_a_rep,
      party_a_title: form.party_a_title, party_a_bank_account: form.party_a_bank_account,
      party_a_bank_name: form.party_a_bank_name,
      party_b_name: KNK.name, party_b_tax: KNK.taxCode,
      party_b_address: KNK.address, party_b_rep: KNK.rep,
      party_b_title: KNK.repTitle, party_b_bank_account: KNK.bankAccount,
      party_b_bank_name: KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch,
      service_type: form.service_type, scope_of_work: form.scope_of_work,
      kol_list: form.kol_list, total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||8), total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms, start_date: form.start_date||null,
      sign_date: form.sign_date||null, sign_location: form.sign_location,
      status: form.status, notes: form.notes, created_by: 'User'
    }
    let error
    if(edit) { ({error} = await supabase.from('contracts').update(payload).eq('id',edit.id)) }
    else { ({error} = await supabase.from('contracts').insert([payload])) }
    if(error) { alert('Lỗi: '+error.message); setSaving(false); return }
    // Auto-save client
    if(!edit && form.party_a_name) {
      const exists = data.clients.find(c=>c.tax_code===form.party_a_tax||c.name===form.party_a_name)
      if(!exists) {
        await supabase.from('clients').insert([{
          name:form.party_a_name, tax_code:form.party_a_tax,
          address:form.party_a_address, legal_rep:form.party_a_rep,
          legal_rep_title:form.party_a_title, bank_account:form.party_a_bank_account,
          bank_name:form.party_a_bank_name, since:new Date().toLocaleDateString('vi-VN')
        }])
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Dịch vụ':'Tạo HĐ Dịch vụ — Bên A: Client | Bên B: K&K'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Thông tin hợp đồng">
          <CRow3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Dự án liên quan"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={CINP_S}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign}</option>)}</select></CFG>
            <CFG label="Loại dịch vụ"><select value={form.service_type} onChange={e=>set('service_type',e.target.value)} style={CINP_S}><option>KOL/KOC</option><option>Performance</option><option>Creative</option><option>Event</option><option>PR</option></select></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên A — Khách hàng">
          <div style={{marginBottom:10,background:'rgba(26,86,219,0.06)',borderRadius:8,padding:'8px 12px',fontSize:11,color:CB.primary,fontWeight:500}}>💡 Nhập tên client để auto-fill từ database</div>
          <CFG label="Tên công ty / Brand" required>
            <input value={form.party_a_name} onChange={e=>{set('party_a_name',e.target.value);fillClient(e.target.value)}} list="cl-hddv" style={CINP_S} required/>
            <datalist id="cl-hddv">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
          </CFG>
          <CRow3>
            <CFG label="Mã số thuế"><input value={form.party_a_tax} onChange={e=>set('party_a_tax',e.target.value)} style={CINP_S} placeholder="VD: 0317761797"/></CFG>
            <CFG label="Người đại diện"><input value={form.party_a_rep} onChange={e=>set('party_a_rep',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Chức vụ"><input value={form.party_a_title} onChange={e=>set('party_a_title',e.target.value)} style={CINP_S}/></CFG>
          </CRow3>
          <CFG label="Địa chỉ"><input value={form.party_a_address} onChange={e=>set('party_a_address',e.target.value)} style={CINP_S}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_a_bank_account} onChange={e=>set('party_a_bank_account',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_a_bank_name} onChange={e=>set('party_a_bank_name',e.target.value)} style={CINP_S}/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên B — K&K Advertising (cố định)">
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',fontSize:12,color:CB.textSec,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep} — {KNK.repTitle}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName} CN/PGD: {KNK.bankBranch}</div>
              <div style={{gridColumn:'span 2'}}><strong>Địa chỉ:</strong> {KNK.address}</div>
            </div>
          </div>
        </CSec>

        <CSec title="Danh sách KOL/KOC thực hiện">
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:10}}>
            <thead>
              <tr>
                {['STT','Họ và tên','Link TikTok','Nội dung công việc','Chi phí (VND)',''].map(h=>(
                  <th key={h} style={{padding:'7px 8px',fontSize:10,fontWeight:700,color:CB.textTer,borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.kol_list.map((k,i)=>(
                <tr key={i}>
                  <td style={{padding:'5px 6px',fontSize:11,color:CB.textTer,textAlign:'center'}}>{i+1}</td>
                  <td style={{padding:'5px 4px'}}><input value={k.name} onChange={e=>updKol(i,'name',e.target.value)} list="kol-hddv" style={{...CINP_S,padding:'5px 8px',fontSize:12}}/><datalist id="kol-hddv">{data.kols.map(k=><option key={k.id} value={k.name}/>)}</datalist></td>
                  <td style={{padding:'5px 4px'}}><input value={k.tiktok} onChange={e=>updKol(i,'tiktok',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}} placeholder="@username"/></td>
                  <td style={{padding:'5px 4px'}}><input value={k.work} onChange={e=>updKol(i,'work',e.target.value)} style={{...CINP_S,padding:'5px 8px',fontSize:12}}/></td>
                  <td style={{padding:'5px 4px'}}><input type="number" value={k.fee} onChange={e=>updKol(i,'fee',Number(e.target.value))} style={{...CINP_S,padding:'5px 8px',fontSize:12,width:110}}/></td>
                  <td style={{padding:'5px 4px'}}><button type="button" onClick={()=>delKol(i)} style={{background:'none',border:'none',cursor:'pointer',color:CB.danger,fontSize:18,lineHeight:1}}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <CBtn sm onClick={addKol}>+ Thêm KOL</CBtn>
        </CSec>

        <CSec title="Giá trị hợp đồng">
          <CRow3>
            <CFG label="Phí dịch vụ (VND)">
              <input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} style={CINP_S}/>
            </CFG>
            <CFG label="Thuế GTGT (%)">
              <input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/>
            </CFG>
            <CFG label="Tổng giá trị (VND)">
              <div style={{padding:'9px 12px',background:'rgba(26,86,219,0.06)',borderRadius:8,fontSize:15,fontWeight:800,color:CB.primary,border:'1px solid rgba(26,86,219,0.15)'}}>{cfmt(form.total_with_vat)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </CRow3>
          <CFG label="Điều khoản thanh toán">
            <textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP_S,minHeight:70}}/>
          </CFG>
        </CSec>

        <CFG label="Ngày bắt đầu thực hiện">
          <input type="date" value={form.start_date} onChange={e=>set('start_date',e.target.value)} style={{...CINP_S,maxWidth:200}}/>
        </CFG>

        <CMFoot onClose={onClose} label={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── HĐ KOL Form ───────────────────────────────────────────
function ContractKOLForm({data, supabase, edit, onClose, onSaved}) {
  const [form, setForm] = useState({
    contract_code: edit?.contract_code || genCode('HDCTV'),
    sign_date: edit?.sign_date || new Date().toISOString().slice(0,10),
    project_id: edit?.project_id || '',
    party_b_name: edit?.party_b_name || '',
    party_b_tax: edit?.party_b_tax || '',
    party_b_address: edit?.party_b_address || '',
    party_b_bank_account: edit?.party_b_bank_account || '',
    party_b_bank_name: edit?.party_b_bank_name || '',
    party_b_cccd: edit?.party_b_cccd || '',
    service_type: edit?.service_type || 'KOL/KOC',
    scope_of_work: edit?.scope_of_work || '1 video TikTok review sản phẩm theo định hướng của khách hàng',
    channels: edit?.channels || '',
    total_fee: edit?.total_fee || 0,
    vat_rate: edit?.vat_rate || 10,
    total_with_vat: edit?.total_with_vat || 0,
    payment_terms: edit?.payment_terms || 'Bên A sẽ thanh toán 100% cho Bên B trong vòng 15 ngày làm việc kể từ ngày Bên B hoàn thành toàn bộ công việc và Bên A nhận được Biên bản nghiệm thu hai Bên ký kết.',
    start_date: edit?.start_date || '',
    status: edit?.status || 'Draft',
    notes: edit?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    const afterTax = Number(form.total_fee||0) * (1 - Number(form.vat_rate||10)/100)
    set('total_with_vat', Math.round(afterTax))
  }, [form.total_fee, form.vat_rate])

  function fillKOL(name) {
    const k = data.kols.find(kl => kl.name?.toLowerCase()===name?.toLowerCase() || kl.real_name?.toLowerCase()===name?.toLowerCase())
    if(k) {
      setForm(p=>({...p,
        party_b_name: k.real_name||k.name||p.party_b_name,
        party_b_tax: k.personal_tax_code||p.party_b_tax,
        party_b_address: k.address||p.party_b_address,
        party_b_bank_account: k.bank_account||p.party_b_bank_account,
        party_b_bank_name: k.bank_name||p.party_b_bank_name,
        party_b_cccd: k.cccd||p.party_b_cccd,
        channels: k.platform||p.channels,
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      contract_code: form.contract_code, contract_type: 'kol',
      project_id: form.project_id||null,
      party_a_name: KNK.name, party_a_tax: KNK.taxCode,
      party_a_address: KNK.address, party_a_rep: KNK.rep,
      party_a_title: KNK.repTitle, party_a_bank_account: KNK.bankAccount,
      party_a_bank_name: KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch,
      party_b_name: form.party_b_name, party_b_tax: form.party_b_tax,
      party_b_address: form.party_b_address, party_b_rep: form.party_b_name,
      party_b_bank_account: form.party_b_bank_account,
      party_b_bank_name: form.party_b_bank_name,
      party_b_cccd: form.party_b_cccd,
      service_type: form.service_type, scope_of_work: form.scope_of_work,
      kol_list: [], total_fee: Number(form.total_fee||0),
      vat_rate: Number(form.vat_rate||10), total_with_vat: Number(form.total_with_vat||0),
      payment_terms: form.payment_terms, start_date: form.start_date||null,
      sign_date: form.sign_date||null,
      sign_location: 'Văn phòng Công Ty TNHH Quảng cáo K&K',
      status: form.status, notes: form.notes, created_by: 'User'
    }
    let error
    if(edit) { ({error} = await supabase.from('contracts').update(payload).eq('id',edit.id)) }
    else { ({error} = await supabase.from('contracts').insert([payload])) }
    if(error) { alert('Lỗi: '+error.message); setSaving(false); return }
    if(!edit && form.party_b_name) {
      const exists = data.kols.find(k=>k.cccd===form.party_b_cccd||k.name===form.party_b_name)
      if(!exists) {
        await supabase.from('kols').insert([{
          name:form.party_b_name, real_name:form.party_b_name,
          cccd:form.party_b_cccd, personal_tax_code:form.party_b_tax,
          address:form.party_b_address, bank_account:form.party_b_bank_account,
          bank_name:form.party_b_bank_name, platform:form.channels, available:true
        }])
      }
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <CModal title={edit?'Sửa HĐ Cộng tác viên':'Tạo HĐ Cộng tác viên — Bên A: K&K | Bên B: KOL'} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <CSec title="Bên A — K&K Advertising (cố định)">
          <div style={{background:'rgba(26,86,219,0.05)',borderRadius:10,padding:'12px 16px',fontSize:12,color:CB.textSec,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><strong>Công ty:</strong> {KNK.name}</div>
              <div><strong>MST:</strong> {KNK.taxCode}</div>
              <div><strong>Đại diện:</strong> {KNK.rep} — {KNK.repTitle}</div>
              <div><strong>STK:</strong> {KNK.bankAccount} — {KNK.bankName} CN: {KNK.bankBranch}</div>
            </div>
          </div>
        </CSec>

        <CSec title="Thông tin hợp đồng">
          <CRow3>
            <CFG label="Số hợp đồng" required><input value={form.contract_code} onChange={e=>set('contract_code',e.target.value)} style={CINP_S} required/></CFG>
            <CFG label="Ngày ký"><input type="date" value={form.sign_date} onChange={e=>set('sign_date',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Trạng thái"><select value={form.status} onChange={e=>set('status',e.target.value)} style={CINP_S}><option>Draft</option><option>Sent</option><option>Signed</option><option>Completed</option><option>Cancelled</option></select></CFG>
          </CRow3>
          <CRow2>
            <CFG label="Dự án"><select value={form.project_id} onChange={e=>set('project_id',e.target.value)} style={CINP_S}><option value="">— Chọn dự án —</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.campaign}</option>)}</select></CFG>
            <CFG label="Kênh đăng tải"><input value={form.channels} onChange={e=>set('channels',e.target.value)} style={CINP_S} placeholder="@tiktok_username"/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Bên B — KOL / Cộng tác viên">
          <div style={{marginBottom:10,background:'rgba(26,86,219,0.06)',borderRadius:8,padding:'8px 12px',fontSize:11,color:CB.primary,fontWeight:500}}>💡 Nhập tên KOL để auto-fill từ database</div>
          <CRow2>
            <CFG label="Họ và tên thật" required>
              <input value={form.party_b_name} onChange={e=>{set('party_b_name',e.target.value);fillKOL(e.target.value)}} list="kol-ctv" style={CINP_S} required/>
              <datalist id="kol-ctv">{data.kols.map(k=><option key={k.id} value={k.real_name||k.name}/>)}</datalist>
            </CFG>
            <CFG label="CCCD"><input value={form.party_b_cccd} onChange={e=>set('party_b_cccd',e.target.value)} style={CINP_S} placeholder="Số CCCD"/></CFG>
          </CRow2>
          <CFG label="Địa chỉ thường trú"><input value={form.party_b_address} onChange={e=>set('party_b_address',e.target.value)} style={CINP_S}/></CFG>
          <CRow2>
            <CFG label="Số tài khoản"><input value={form.party_b_bank_account} onChange={e=>set('party_b_bank_account',e.target.value)} style={CINP_S}/></CFG>
            <CFG label="Ngân hàng"><input value={form.party_b_bank_name} onChange={e=>set('party_b_bank_name',e.target.value)} style={CINP_S}/></CFG>
          </CRow2>
        </CSec>

        <CSec title="Phạm vi công việc">
          <CFG label="Nội dung công việc"><textarea value={form.scope_of_work} onChange={e=>set('scope_of_work',e.target.value)} style={{...CINP_S,minHeight:80}}/></CFG>
        </CSec>

        <CSec title="Thù lao">
          <CRow3>
            <CFG label="Thù lao gốc (VND)"><input type="number" value={form.total_fee} onChange={e=>set('total_fee',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Thuế TNCN (%)"><input type="number" value={form.vat_rate} onChange={e=>set('vat_rate',Number(e.target.value))} style={CINP_S}/></CFG>
            <CFG label="Thù lao thực nhận">
              <div style={{padding:'9px 12px',background:'rgba(5,150,105,0.08)',borderRadius:8,fontSize:15,fontWeight:800,color:'#059669',border:'1px solid rgba(5,150,105,0.2)'}}>{cfmt(form.total_with_vat)}</div>
              <div style={{fontSize:10,color:CB.textTer,marginTop:3,fontStyle:'italic'}}>{toWords(form.total_with_vat)}</div>
            </CFG>
          </CRow3>
          <CFG label="Điều khoản thanh toán"><textarea value={form.payment_terms} onChange={e=>set('payment_terms',e.target.value)} style={{...CINP_S,minHeight:60}}/></CFG>
        </CSec>

        <CMFoot onClose={onClose} label={saving?'Đang lưu...':'Lưu hợp đồng'} onDelete={edit?async()=>{await supabase.from('contracts').delete().eq('id',edit.id);onSaved();onClose()}:null}/>
      </form>
    </CModal>
  )
}

// ── Contract Preview + Print ──────────────────────────────
function ContractPreview({contract:c, type, onClose}) {
  const isClient = type==='client'
  const pA = isClient
    ? {name:c.party_a_name,tax:c.party_a_tax,address:c.party_a_address,rep:c.party_a_rep,title:c.party_a_title,bank:c.party_a_bank_account,bankName:c.party_a_bank_name}
    : {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch}
  const pB = isClient
    ? {name:KNK.name,tax:KNK.taxCode,address:KNK.address,rep:KNK.rep,title:KNK.repTitle,bank:KNK.bankAccount,bankName:KNK.bankName+' Chi nhánh/PGD: '+KNK.bankBranch}
    : {name:c.party_b_name,cccd:c.party_b_cccd,tax:c.party_b_tax,address:c.party_b_address,bank:c.party_b_bank_account,bankName:c.party_b_bank_name}

  const kolList = c.kol_list||[]
  const fee = Number(c.total_fee||0)
  const vat = isClient ? fee*Number(c.vat_rate||8)/100 : 0
  const total = Number(c.total_with_vat||0)

  function printDoc() {
    const w = window.open('','_blank')
    const kolTable = isClient && kolList.length ? `
      <table><thead><tr><th>STT</th><th>Họ và tên</th><th>Link TikTok</th><th>Nội dung công việc</th><th>Chi phí</th></tr></thead>
      <tbody>
        ${kolList.map((k,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${k.name}</td><td>${k.tiktok}</td><td>${k.work}</td><td style="text-align:right">${cfmt(k.fee)}</td></tr>`).join('')}
        <tr><td colspan="4" style="text-align:right;font-weight:700">TOTAL</td><td style="text-align:right;font-weight:700">${cfmt(fee)}</td></tr>
        <tr><td colspan="4" style="text-align:right">VAT (${c.vat_rate}%)</td><td style="text-align:right">${cfmt(vat)}</td></tr>
        <tr style="background:#f0f0f0"><td colspan="4" style="text-align:right;font-weight:700">TOTAL + VAT</td><td style="text-align:right;font-weight:700">${cfmt(total)}</td></tr>
      </tbody></table>` : ''

    const clauses = isClient
      ? clausesHDDV(pA, pB, c, kolList, fee, vat, total)
      : clausesHDCTV(c, fee, fee*Number(c.vat_rate||10)/100, total)

    w.document.write(`<html><head><title>${c.contract_code}</title>
    <style>
      body{font-family:'Times New Roman',serif;font-size:13px;margin:40px 50px;color:#000;line-height:1.7}
      h1{text-align:center;font-size:17px;text-transform:uppercase;margin:10px 0 4px;font-weight:bold}
      h2{text-align:center;font-size:13px;margin:0 0 16px;font-weight:normal}
      h3{font-size:13px;font-weight:bold;margin:16px 0 6px;text-transform:uppercase}
      p{margin:5px 0;text-align:justify}
      ol,ul{margin:4px 0;padding-left:24px}
      li{margin:3px 0}
      table{width:100%;border-collapse:collapse;margin:10px 0}
      th,td{border:1px solid #000;padding:5px 8px;font-size:12px}
      th{background:#f0f0f0;font-weight:bold;text-align:center}
      .logo{font-size:20px;font-weight:900;color:#1A56DB;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px}
      .parties{margin:12px 0}
      .party-name{font-weight:bold;text-transform:uppercase;margin:10px 0 4px}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;text-align:center}
      .footer{font-size:11px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:8px}
      @media print{body{margin:20px 25px}}
    </style></head><body>
    <div class="logo">K&K advertising</div>
    <h1>${isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN'}</h1>
    <h2>Số: ${c.contract_code}</h2>
    <p>Hôm nay, <strong>${fmtDate(c.sign_date)}</strong>, tại ${c.sign_location||'Văn phòng Công Ty TNHH Quảng cáo K&K'},<br>Chúng tôi gồm:</p>
    <div class="parties">
      <div class="party-name">BÊN A: ${pA.name}</div>
      ${pA.tax?`<p>Mã số thuế: ${pA.tax}</p>`:''}
      <p>Đại diện: <strong>${pA.rep}</strong> &nbsp; Chức danh: ${pA.title}</p>
      <p>Địa chỉ: ${pA.address}</p>
      ${pA.bank?`<p>Số tài khoản: ${pA.bank} &nbsp; Ngân hàng: ${pA.bankName}</p>`:''}
      <p><em>(Sau đây gọi là "Bên A")</em></p>
      <p>Và</p>
      <div class="party-name">BÊN B: ${pB.name}</div>
      ${pB.cccd?`<p>CCCD: ${pB.cccd}</p>`:''}
      ${pB.tax?`<p>Mã số thuế: ${pB.tax}</p>`:''}
      <p>Địa chỉ: ${pB.address}</p>
      ${isClient?`<p>Đại diện: <strong>${pB.rep}</strong> &nbsp; Chức danh: ${pB.title}</p>`:''}
      ${pB.bank?`<p>Số tài khoản: ${pB.bank} &nbsp; Ngân hàng: ${pB.bankName}</p>`:''}
      <p><em>(Sau đây gọi là "Bên B")</em></p>
    </div>
    ${kolTable}
    ${clauses}
    <div class="sig">
      <div><p><strong>Đại diện Bên A</strong></p><p>${pA.title}</p><br><br><br><p><strong>${pA.rep}</strong></p></div>
      <div><p><strong>${isClient?'Đại diện Bên B':'Bên B'}</strong></p><p>${isClient?pB.title:'(Ký và ghi rõ họ tên)'}</p><br><br><br><p><strong>${isClient?pB.rep:pB.name}</strong></p></div>
    </div>
    <div class="footer">A: ${KNK.address} &nbsp;|&nbsp; P: ${KNK.phone} &nbsp;|&nbsp; E: ${KNK.email}</div>
    </body></html>`)
    w.document.close()
    setTimeout(()=>w.print(), 600)
  }

  return (
    <CModal title={`Preview: ${c.contract_code}`} onClose={onClose} wide>
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'center'}}>
        <CBtn primary onClick={printDoc}>🖨️ In / Export PDF</CBtn>
        <CBadge text={c.status}/>
        <span style={{fontSize:11,color:CB.textTer}}>Tạo lúc {new Date(c.created_at).toLocaleDateString('vi-VN')}</span>
      </div>
      <div style={{background:'#fff',border:'2px solid rgba(26,86,219,0.15)',borderRadius:14,padding:'28px 32px',fontFamily:'Times New Roman,serif',fontSize:13,lineHeight:1.7,color:'#000',maxHeight:'60vh',overflowY:'auto'}}>
        <div style={{fontSize:20,fontWeight:900,color:CB.primary,borderBottom:'2px solid #000',paddingBottom:8,marginBottom:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>K&K <span style={{color:CB.accent}}>advertising</span></div>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,textTransform:'uppercase'}}>{isClient?'HỢP ĐỒNG DỊCH VỤ':'HỢP ĐỒNG CỘNG TÁC VIÊN'}</div>
          <div style={{fontSize:13,color:'#666'}}>Số: {c.contract_code}</div>
        </div>
        <p>Hôm nay, <strong>{fmtDate(c.sign_date)}</strong>, tại {c.sign_location||'Văn phòng Công Ty TNHH Quảng cáo K&K'}</p>
        <p style={{marginBottom:8}}>Chúng tôi gồm:</p>
        <div style={{marginBottom:10}}>
          <div style={{fontWeight:700,textTransform:'uppercase',marginBottom:4}}>BÊN A: {pA.name}</div>
          {pA.tax&&<div>Mã số thuế: {pA.tax}</div>}
          <div>Đại diện: <strong>{pA.rep}</strong> — {pA.title}</div>
          <div>Địa chỉ: {pA.address}</div>
          {pA.bank&&<div>STK: {pA.bank} — {pA.bankName}</div>}
          <div style={{fontSize:12,color:'#666',marginTop:2}}>(Sau đây gọi là "Bên A")</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:700,textTransform:'uppercase',marginBottom:4}}>BÊN B: {pB.name}</div>
          {pB.cccd&&<div>CCCD: {pB.cccd}</div>}
          {pB.tax&&<div>Mã số thuế: {pB.tax}</div>}
          <div>Địa chỉ: {pB.address}</div>
          {isClient&&<div>Đại diện: <strong>{pB.rep}</strong> — {pB.title}</div>}
          {pB.bank&&<div>STK: {pB.bank} — {pB.bankName}</div>}
          <div style={{fontSize:12,color:'#666',marginTop:2}}>(Sau đây gọi là "Bên B")</div>
        </div>
        {isClient&&kolList.length>0&&(
          <div style={{margin:'12px 0'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:'#f0f0f0'}}>{['STT','Tên KOL','Link TikTok','Nội dung','Chi phí'].map(h=><th key={h} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>
                {kolList.map((k,i)=><tr key={i}><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'center'}}>{i+1}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.name}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.tiktok}</td><td style={{border:'1px solid #ccc',padding:'4px 8px'}}>{k.work}</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right'}}>{cfmt(k.fee)}</td></tr>)}
                <tr style={{background:'#f0f0f0'}}><td colSpan={4} style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>TOTAL + VAT ({c.vat_rate}%)</td><td style={{border:'1px solid #ccc',padding:'4px 8px',textAlign:'right',fontWeight:700}}>{cfmt(total)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{marginTop:12,padding:'10px 14px',background:'#f8f9fa',borderRadius:8,fontSize:12}}>
          <div><strong>Giá trị HĐ:</strong> {cfmt(total)} VNĐ</div>
          <div style={{fontStyle:'italic',marginTop:2}}>Bằng chữ: {toWords(total)}</div>
          <div style={{marginTop:6}}><strong>Thanh toán:</strong> {c.payment_terms}</div>
        </div>
        <div style={{background:'rgba(26,86,219,0.04)',borderRadius:8,padding:'10px 12px',marginTop:12,fontSize:11.5,color:CB.textSec}}>
          <em>Hợp đồng bao gồm đầy đủ Điều 1–{isClient?'11':'8'} với điều khoản pháp lý chuẩn K&K. Nhấn "In / Export PDF" để xem toàn bộ nội dung.</em>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,marginTop:28,textAlign:'center'}}>
          <div><div style={{fontWeight:700}}>Đại diện Bên A</div><div style={{fontSize:12,color:'#666'}}>{pA.title}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{pA.rep}</div></div>
          <div><div style={{fontWeight:700}}>{isClient?'Đại diện Bên B':'Bên B'}</div><div style={{fontSize:12,color:'#666'}}>{isClient?pB.title:'(Ký và ghi rõ họ tên)'}</div><div style={{height:45}}/><div style={{fontWeight:700}}>{isClient?pB.rep:pB.name}</div></div>
        </div>
      </div>
      <div style={{textAlign:'right',marginTop:14}}><CBtn onClick={onClose}>Đóng</CBtn></div>
    </CModal>
  )
}

// ══════════════════════════════════════════════════════════
// BBNT PAGE
export default Contracts
