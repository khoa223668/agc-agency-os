export // Simple hash for password (client-side only — not for production security)
function simpleHash(str) {
  let hash = 0
  for(let i=0;i<str.length;i++){hash=((hash<<5)-hash)+str.charCodeAt(i);hash|=0}
  return Math.abs(hash).toString(36)
}

function getInitials(name) {
  return (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
}

export { simpleHash, getInitials }
