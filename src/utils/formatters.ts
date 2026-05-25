export function formatCurrency(amount: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, style: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  if (style === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return d.toLocaleDateString('es-AR');
  }
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: style === 'long' ? 'long' : '2-digit',
    year: 'numeric',
  });
}

export function formatPhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: '#F59E0B',
    in_progress: '#3B82F6',
    completed: '#10B981',
    cancelled: '#EF4444',
    draft: '#94A3B8',
    sent: '#3B82F6',
    accepted: '#10B981',
    rejected: '#EF4444',
  };
  return map[status] || '#94A3B8';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En proceso',
    completed: 'Completado',
    cancelled: 'Cancelado',
    draft: 'Borrador',
    sent: 'Enviado',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
  };
  return map[status] || status;
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    urgent: '#DC2626',
  };
  return map[priority] || '#94A3B8';
}
