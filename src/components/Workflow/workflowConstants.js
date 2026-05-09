// K&K Agency OS — Workflow Constants

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

export async function sendNotification(supabase, {recipient_email, recipient_name, type, title, message, data={}, send_email=false}) {
  await supabase.from('notifications').insert([{
    recipient_email, recipient_name, type, title, message, data, send_email, email_sent: false
  }])
}

export { STAGES, STAGE_TASKS, PRIORITY_COLOR, TASK_STATUS_COLOR, APPROVAL_ROLES }
