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
export { STAGES, STAGE_TASKS, PRIORITY_COLOR, TASK_STATUS_COLOR, APPROVAL_ROLES }
async function sendNotification(supabase, {recipient_email, recipient_name, type, title, message, data={}, send_email=false}) {
  await supabase.from('notifications').insert([{
    recipient_email, recipient_name, type, title, message, data, send_email, email_sent: false
  }])
}
export { sendNotification }
