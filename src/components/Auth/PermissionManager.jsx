import { useState, useEffect } from 'react'
import { B } from '../../theme.js'
import { MODULES } from './LoginScreen.jsx'
// ── PERMISSION MANAGER (CEO only) ────────────────────────
function PermissionManager({account, supabase, onClose}) {
  const [perms, setPerms] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(()=>{loadPerms()},[])

  async function loadPerms() {
    const {data} = await supabase.from('permissions').select('*').eq('team_account_id', account.id)
    const map = {}
    MODULES.forEach(m => {
      const p = data?.find(d=>d.module===m.id)
      map[m.id] = {
        can_view: p?.can_view||false,
        can_create: p?.can_create||false,
        can_edit: p?.can_edit||false,
        can_delete: p?.can_delete||false,
      }
    })
    setPerms(map)
  }

  function toggle(module, perm) {
    setPerms(prev=>({...prev,[module]:{...prev[module],[perm]:!prev[module]?.[perm]}}))
  }

  function setAll(module, val) {
    setPerms(prev=>({...prev,[module]:{can_view:val,can_create:val,can_edit:val,can_delete:val}}))
  }

  function setViewOnly(module) {
    setPerms(prev=>({...prev,[module]:{can_view:true,can_create:false,can_edit:false,can_delete:false}}))
  }

  async function save() {
    setSaving(true)
    for(const [module, p] of Object.entries(perms)) {
      await supabase.from('permissions').upsert({
        team_account_id: account.id,
        module, ...p
      }, {onConflict: 'team_account_id,module'})
    }
    setSaving(false); setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  const grps = [...new Set(MODULES.map(m=>m.grp))]
  const permCols = ['can_view','can_create','can_edit','can_delete']
  const permLabels = {can_view:'Xem',can_create:'Tạo',can_edit:'Sửa',can_delete:'Xóa'}

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000,backdropFilter:'blur(4px)'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:'#fff',borderRadius:20,padding:'24px 28px',width:700,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:14,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'#0F172A'}}>Phân quyền — {account.name}</div>
            <div style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{account.email} · {account.role}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#94A3B8'}}>×</button>
        </div>

        {grps.map(grp=>(
          <div key={grp} style={{marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:800,color:'#94A3B8',letterSpacing:'0.1em',marginBottom:8,textTransform:'uppercase'}}>{grp}</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'left',padding:'5px 8px',borderBottom:'1px solid rgba(26,86,219,0.1)'}}>Module</th>
                  {permCols.map(p=><th key={p} style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'center',padding:'5px 8px',width:70,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>{permLabels[p]}</th>)}
                  <th style={{fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'center',padding:'5px 8px',width:120,borderBottom:'1px solid rgba(26,86,219,0.1)'}}>Nhanh</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.filter(m=>m.grp===grp).map(m=>(
                  <tr key={m.id} style={{borderBottom:'1px solid rgba(26,86,219,0.04)'}}>
                    <td style={{padding:'8px 8px',fontSize:12.5,fontWeight:500,color:'#0F172A'}}>
                      <span style={{marginRight:8,opacity:0.6}}>{m.icon}</span>{m.label}
                    </td>
                    {permCols.map(p=>(
                      <td key={p} style={{textAlign:'center',padding:'8px'}}>
                        <input type="checkbox" checked={perms[m.id]?.[p]||false}
                          onChange={()=>toggle(m.id,p)}
                          style={{width:16,height:16,cursor:'pointer',accentColor:'#1A56DB'}}
                        />
                      </td>
                    ))}
                    <td style={{textAlign:'center',padding:'8px'}}>
                      <div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <button onClick={()=>setAll(m.id,true)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(5,150,105,0.3)',background:'rgba(5,150,105,0.08)',color:'#059669',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Tất cả</button>
                        <button onClick={()=>setViewOnly(m.id)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(26,86,219,0.3)',background:'rgba(26,86,219,0.08)',color:'#1A56DB',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Chỉ xem</button>
                        <button onClick={()=>setAll(m.id,false)} style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.08)',color:'#DC2626',cursor:'pointer',fontSize:10,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Khoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16,paddingTop:14,borderTop:'1px solid rgba(26,86,219,0.1)'}}>
          <button onClick={onClose} style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid rgba(26,86,219,0.1)',background:'transparent',color:'#475569',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Đóng</button>
          <button onClick={save} disabled={saving} style={{padding:'8px 22px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#1A56DB,#06B6D4)',color:'#fff',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:'0 3px 12px rgba(26,86,219,0.25)'}}>
            {saving?'Đang lưu...':(saved?'✓ Đã lưu!':'Lưu phân quyền')}
          </button>
        </div>
      </div>
    </div>
  )
}

export { PermissionManager }
