import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { AVATAR_COLORS, getInitials, simpleHash } from '../Auth/LoginScreen.jsx'
import { PermissionManager } from '../Auth/PermissionManager.jsx'
// ── TEAM PAGE (nâng cấp với accounts + permissions) ──────
function TeamPage({data, supabase, reload, log, currentUser}) {
  const [accounts, setAccounts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editPerms, setEditPerms] = useState(null)
  const [editAcc, setEditAcc] = useState(null)

  useEffect(()=>{ loadAccounts() },[])

  async function loadAccounts() {
    const {data:accs} = await supabase.from('team_accounts')
      .select('*, team(*), permissions(*)').order('created_at',{ascending:false})
    setAccounts(accs||[])
  }

  async function deactivate(id) {
    if(!confirm('Khoá tài khoản này?')) return
    await supabase.from('team_accounts').update({is_active:false}).eq('id',id)
    loadAccounts()
  }

  async function activate(id) {
    await supabase.from('team_accounts').update({is_active:true}).eq('id',id)
    loadAccounts()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:900,color:'#0F172A'}}>Team & Accounts</h2>
        {currentUser?.isMaster && <button onClick={()=>setShowAdd(true)} style={{padding:'7px 16px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>+ Thêm thành viên</button>}
      </div>

      {/* Capacity cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14,marginBottom:20}}>
        {data.team.map((m,i)=>{
          const active = data.projects.filter(p=>p.pm===m.name&&p.status==='Active').length
          const util = m.max_projects?Math.round(active/m.max_projects*100):0
          const col = AVATAR_COLORS[i%AVATAR_COLORS.length]
          const init = getInitials(m.name)
          const acc = accounts.find(a=>a.team_id===m.id)
          return (
            <div key={m.id} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${col},${col}88)`}}/>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:m.avatar_color||col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0,boxShadow:`0 4px 12px ${col}40`}}>
                  {m.avatar_initials||init}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:13.5,color:'#0F172A'}}>{m.name}</div>
                  <div style={{fontSize:11,color:'#94A3B8',marginTop:1}}>{m.role}</div>
                  {acc&&<div style={{fontSize:10,color:acc.is_active?'#059669':'#DC2626',fontWeight:600,marginTop:2}}>{acc.is_active?'● Online account':'● Bị khoá'}</div>}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:11}}>
                <span style={{color:'#475569'}}>Projects: <strong style={{color:'#0F172A'}}>{active}/{m.max_projects||5}</strong></span>
                <span style={{fontWeight:800,color:util>=80?'#DC2626':util>=60?'#D97706':'#059669'}}>{util}%</span>
              </div>
              <div style={{height:6,background:'rgba(26,86,219,0.08)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:util+'%',background:util>=80?'#DC2626':'linear-gradient(90deg,#1A56DB,#06B6D4)',borderRadius:99}}/>
              </div>
              {currentUser?.isMaster && (
                <div style={{display:'flex',gap:6,marginTop:12}}>
                  {acc ? (
                    <>
                      <button onClick={()=>setEditPerms(acc)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Phân quyền</button>
                      {acc.is_active
                        ? <button onClick={()=>deactivate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.06)',color:'#DC2626',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                        : <button onClick={()=>activate(acc.id)} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(5,150,105,0.2)',background:'rgba(5,150,105,0.06)',color:'#059669',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Mở</button>
                      }
                    </>
                  ) : (
                    <button onClick={()=>setShowAdd(m)} style={{flex:1,padding:'5px 0',borderRadius:7,border:'1.5px dashed rgba(26,86,219,0.3)',background:'transparent',color:'#94A3B8',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Tạo tài khoản</button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Accounts table */}
      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(26,86,219,0.1)',borderRadius:16,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              {['Thành viên','Email','SĐT','Role','Lần cuối đăng nhập','Trạng thái','Quyền truy cập',''].map(h=>(
                <th key={h} style={{padding:'10px 14px',fontSize:10,fontWeight:800,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.1)',textAlign:'left',background:'rgba(248,250,255,0.8)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map(a=>{
              const modCount = a.permissions?.filter(p=>p.can_view).length||0
              return (
                <tr key={a.id}>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:a.avatar_color||'#1A56DB',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0}}>
                        {a.avatar_initials||getInitials(a.team?.name||a.email)}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:12.5,color:'#0F172A'}}>{a.team?.name||'—'}</div>
                        <div style={{fontSize:10.5,color:'#94A3B8'}}>{a.team?.role||'Staff'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#475569'}}>{a.email}</td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#475569'}}>{a.phone||'—'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}><span style={{background:'rgba(26,86,219,0.08)',color:'#1A56DB',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:600}}>{a.team?.role||'Staff'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11,color:'#94A3B8',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>{a.last_login?new Date(a.last_login).toLocaleDateString('vi-VN'):'Chưa đăng nhập'}</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}><span style={{background:a.is_active?'rgba(5,150,105,0.1)':'rgba(220,38,38,0.1)',color:a.is_active?'#059669':'#DC2626',padding:'2px 9px',borderRadius:6,fontSize:10.5,fontWeight:700}}>{a.is_active?'Active':'Khoá'}</span></td>
                  <td style={{padding:'11px 14px',fontSize:11.5,borderBottom:'1px solid rgba(26,86,219,0.06)',color:'#1A56DB',fontWeight:600}}>{modCount}/{MODULES.length} modules</td>
                  <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(26,86,219,0.06)'}}>
                    {currentUser?.isMaster && (
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>setEditPerms(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.2)',background:'rgba(26,86,219,0.06)',color:'#1A56DB',cursor:'pointer',fontSize:10.5,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔐 Quyền</button>
                        <button onClick={()=>setEditAcc(a)} style={{padding:'4px 10px',borderRadius:7,border:'1px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:10.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Edit</button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {!accounts.length&&<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'#94A3B8',fontSize:12}}>Chưa có tài khoản nào</td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd && <AddAccountForm supabase={supabase} teamMembers={data.team} preselected={typeof showAdd==='object'?showAdd:null} onClose={()=>setShowAdd(false)} onSaved={()=>{loadAccounts();reload();log('Thêm account')}}/>}
      {editPerms && <PermissionManager account={{...editPerms,name:editPerms.team?.name||editPerms.email,role:editPerms.team?.role}} supabase={supabase} onClose={()=>setEditPerms(null)}/>}
      {editAcc && <EditAccountForm account={editAcc} supabase={supabase} onClose={()=>setEditAcc(null)} onSaved={()=>{loadAccounts();log('Cập nhật account')}}/>}
    </div>
  )
}

// ── ADD ACCOUNT FORM ─────────────────────────────────────
function AddAccountForm({supabase, teamMembers, preselected, onClose, onSaved}) {
  const [form, setForm] = useState({
    team_id: preselected?.id||'',
    name: preselected?.name||'',
    role: preselected?.role||'Account Manager',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    avatar_color: AVATAR_COLORS[Math.floor(Math.random()*AVATAR_COLORS.length)],
    max_projects: 5,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))

  async function handleSubmit(e) {
    e.preventDefault()
    if(form.password !== form.confirm_password) { setError('Mật khẩu không khớp!'); return }
    if(form.password.length < 6) { setError('Mật khẩu ít nhất 6 ký tự!'); return }
    setSaving(true); setError('')

    // Create or get team member
    let teamId = form.team_id
    if(!teamId && form.name) {
      const {data:newMember,error:teamErr} = await supabase.from('team').insert([{
        name:form.name, role:form.role, email:form.email, phone:form.phone,
        max_projects:Number(form.max_projects||5),
        avatar_color:form.avatar_color,
        avatar_initials:getInitials(form.name)
      }]).select().single()
      if(teamErr){setError('Lỗi tạo thành viên: '+teamErr.message);setSaving(false);return}
      teamId = newMember.id
    }

    const {error:accErr} = await supabase.from('team_accounts').insert([{
      team_id: teamId,
      email: form.email.toLowerCase(),
      phone: form.phone,
      password_hash: simpleHash(form.password),
      avatar_color: form.avatar_color,
      avatar_initials: getInitials(form.name),
      is_active: true
    }])
    if(accErr){setError('Lỗi tạo tài khoản: '+accErr.message);setSaving(false);return}
    setSaving(false); onSaved(); onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:520,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Thêm thành viên & tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Avatar preview */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(26,86,219,0.04)',borderRadius:12,border:'1px solid rgba(26,86,219,0.1)'}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:form.avatar_color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${form.avatar_color}50`,flexShrink:0}}>
              {getInitials(form.name||'?')}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#475569',marginBottom:8}}>Màu Avatar</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>set('avatar_color',c)} style={{width:22,height:22,borderRadius:'50%',background:c,cursor:'pointer',border:form.avatar_color===c?'3px solid #0F172A':'3px solid transparent',transition:'border 0.1s'}}/>
                ))}
              </div>
            </div>
          </div>

          {!preselected && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#475569',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>Thành viên hiện có</div>
              <select value={form.team_id} onChange={e=>{const m=teamMembers.find(t=>t.id===e.target.value);set('team_id',e.target.value);if(m){set('name',m.name);set('role',m.role)}}} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none'}}>
                <option value="">— Tạo thành viên mới —</option>
                {teamMembers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}

          {!form.team_id && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:4}}>
              {[['Họ và tên *','name','text',''],['Role','role','text','']].map(([l,k,t,ph])=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}} required={k==='name'}/>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[['Email *','email','email'],['Số điện thoại','phone','tel'],['Mật khẩu *','password','password'],['Xác nhận mật khẩu *','confirm_password','password']].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',color:'#0F172A',outline:'none',boxSizing:'border-box'}} required={['email','password','confirm_password'].includes(k)}/>
              </div>
            ))}
          </div>

          {error&&<div style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#DC2626',marginBottom:16,fontWeight:500}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {saving?'Đang tạo...':'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── EDIT ACCOUNT FORM ────────────────────────────────────
function EditAccountForm({account, supabase, onClose, onSaved}) {
  const [color, setColor] = useState(account.avatar_color||'#1A56DB')
  const [phone, setPhone] = useState(account.phone||'')
  const [newPwd, setNewPwd] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const upd = {avatar_color:color, phone, avatar_initials:getInitials(account.team?.name||account.email)}
    if(newPwd.length>=6) upd.password_hash = simpleHash(newPwd)
    await supabase.from('team_accounts').update(upd).eq('id',account.id)
    if(account.team_id) {
      await supabase.from('team').update({avatar_color:color,avatar_initials:getInitials(account.team?.name||''),phone}).eq('id',account.team_id)
    }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:420,maxWidth:'95vw',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <span style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Chỉnh sửa tài khoản</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>
        <form onSubmit={save}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,padding:'16px',background:'rgba(26,86,219,0.04)',borderRadius:12}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,boxShadow:`0 4px 16px ${color}50`,flexShrink:0}}>
              {account.avatar_initials||getInitials(account.team?.name||account.email)}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:'#0F172A'}}>{account.team?.name||account.email}</div>
              <div style={{fontSize:11,color:'#94A3B8',marginBottom:8}}>{account.email}</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {AVATAR_COLORS.map(c=>(
                  <div key={c} onClick={()=>setColor(c)} style={{width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border:color===c?'3px solid #0F172A':'3px solid transparent'}}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Số điện thoại</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Đổi mật khẩu mới (để trống nếu không đổi)</label>
            <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} type="password" placeholder="Mật khẩu mới (≥6 ký tự)" style={{width:'100%',padding:'9px 12px',border:'1.5px solid rgba(26,86,219,0.1)',borderRadius:9,fontSize:12.5,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
            <button type="button" onClick={onClose} style={{padding:'7px 16px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Huỷ</button>
            <button type="submit" disabled={saving} style={{padding:'7px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {saving?'Đang lưu...':'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



// ════════════════════════════════════════════════════════════
// IMPORT ENGINE + QUOTATION MODULE — K&K Agency OS
// ════════════════════════════════════════════════════════════

export default TeamPage
