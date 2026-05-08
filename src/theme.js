import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// K&K Advertising — Futuristic Light Theme
const B = {
  // Core brand
  primary: '#1A56DB',
  primaryGlow: 'rgba(26,86,219,0.15)',
  accent: '#06B6D4',
  accentGlow: 'rgba(6,182,212,0.15)',
  navy: '#0F172A',
  // Gradients
  gradPrimary: 'linear-gradient(135deg, #1A56DB 0%, #06B6D4 100%)',
  gradSoft: 'linear-gradient(135deg, rgba(26,86,219,0.08) 0%, rgba(6,182,212,0.08) 100%)',
  gradCard: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
  // Neutrals
  bg: '#F0F4FF',
  bgMesh: 'radial-gradient(ellipse at 20% 20%, rgba(26,86,219,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #F0F4FF',
  white: '#FFFFFF',
  surface: 'rgba(255,255,255,0.8)',
  border: 'rgba(26,86,219,0.1)',
  borderStrong: 'rgba(26,86,219,0.2)',
  // Text
  text: '#0F172A',
  textSec: '#475569',
  textTer: '#94A3B8',
  // Status
  success: '#059669',
  successBg: 'rgba(5,150,105,0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.08)',
  danger: '#DC2626',
  dangerBg: 'rgba(220,38,38,0.08)',
  info: '#1A56DB',
  infoBg: 'rgba(26,86,219,0.08)',
}

const STATUS = {
  Active: B.success, Completed: B.primary, 'On Hold': B.warning,
  Cancelled: B.danger, Pitching: B.textTer, Lead: B.textTer,
  Negotiation: B.info, Won: B.success, Lost: B.danger,
  Paid: B.success, Unpaid: B.warning, Partial: B.info,
  Overdue: B.danger, Pending: B.warning, Approved: B.success,
  Rejected: B.danger, Active2: B.success, Booked: B.warning,
  Accepted: B.success
}

const PALETTE = ['#1A56DB','#059669','#DC2626','#D97706','#7C3AED','#0891B2']
export { B, STATUS, PALETTE }
