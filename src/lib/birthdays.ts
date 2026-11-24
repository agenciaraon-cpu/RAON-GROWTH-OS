import { Client } from '../types';

export interface BirthdayClientInfo {
  client: Client;
  day: number;
  month: number;
  year: number;
  formattedDate: string; // DD/MM/AAAA
  formattedDayMonth: string; // DD/MM
  ageTurning: number;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
  daysUntil: number;
}

/**
 * Formata YYYY-MM-DD para DD/MM/AAAA
 */
export function formatBirthDateBR(birthDate?: string): string {
  if (!birthDate) return '';
  const parts = birthDate.split('-');
  if (parts.length !== 3) return birthDate;
  const [y, m, d] = parts;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
}

/**
 * Formata CPF 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Formata telefone celular brasileiro (DD) 9XXXX-XXXX
 */
export function formatPhoneBR(value: string): string {
  const r = value.replace(/\D/g, '').slice(0, 11);
  if (r.length > 6) {
    return `(${r.substring(0, 2)}) ${r.substring(2, r.length === 11 ? 7 : 6)}-${r.substring(r.length === 11 ? 7 : 6)}`;
  } else if (r.length > 2) {
    return `(${r.substring(0, 2)}) ${r.substring(2)}`;
  } else if (r.length > 0) {
    return `(${r}`;
  }
  return '';
}

/**
 * Verifica se a query de busca corresponde à data de nascimento do cliente
 * Aceita DD/MM/AAAA, DD/MM, DD-MM, YYYY-MM-DD ou apenas números (ex: "2311")
 */
export function matchesBirthDateQuery(birthDate: string | undefined, query: string): boolean {
  if (!birthDate || !query.trim()) return false;
  const q = query.trim().toLowerCase();
  const formattedBR = formatBirthDateBR(birthDate); // DD/MM/YYYY
  const dayMonth = formattedBR.slice(0, 5); // DD/MM

  if (formattedBR.includes(q) || dayMonth.includes(q) || birthDate.includes(q)) {
    return true;
  }

  const qDigits = q.replace(/\D/g, '');
  if (qDigits.length >= 2) {
    const brDigits = formattedBR.replace(/\D/g, ''); // DDMMYYYY
    if (brDigits.includes(qDigits)) return true;
  }

  return false;
}

/**
 * Calcula se um cliente faz aniversário hoje, nesta semana ou neste mês.
 */
export function analyzeClientBirthday(client: Client, referenceDate: Date = new Date()): BirthdayClientInfo | null {
  if (!client.birthDate) return null;
  const parts = client.birthDate.split('-');
  if (parts.length !== 3) return null;

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10); // 1-12
  const birthDay = parseInt(parts[2], 10); // 1-31

  if (!birthYear || !birthMonth || !birthDay) return null;

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const isToday = birthMonth === currentMonth && birthDay === currentDay;
  const isThisMonth = birthMonth === currentMonth;

  // Semana atual (Domingo a Sábado)
  const dayOfWeek = today.getDay(); // 0 = Dom .. 6 = Sáb
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Verifica aniversário no ano atual (e também ano anterior/próximo se semana cruzar virada de ano)
  let isThisWeek = false;
  for (const yr of [currentYear - 1, currentYear, currentYear + 1]) {
    const candidate = new Date(yr, birthMonth - 1, birthDay);
    if (candidate >= startOfWeek && candidate <= endOfWeek) {
      isThisWeek = true;
      break;
    }
  }

  // Dias até o próximo aniversário
  let nextBday = new Date(currentYear, birthMonth - 1, birthDay);
  if (nextBday < today) {
    nextBday = new Date(currentYear + 1, birthMonth - 1, birthDay);
  }
  const daysUntil = Math.round((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    client,
    day: birthDay,
    month: birthMonth,
    year: birthYear,
    formattedDate: formatBirthDateBR(client.birthDate),
    formattedDayMonth: `${String(birthDay).padStart(2, '0')}/${String(birthMonth).padStart(2, '0')}`,
    ageTurning: currentYear - birthYear,
    isToday,
    isThisWeek,
    isThisMonth,
    daysUntil,
  };
}

export function categorizeBirthdays(clients: Client[], referenceDate: Date = new Date()) {
  const all = clients
    .map(c => analyzeClientBirthday(c, referenceDate))
    .filter((item): item is BirthdayClientInfo => item !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const today = all.filter(b => b.isToday);
  const week = all.filter(b => b.isThisWeek);
  const month = all.filter(b => b.isThisMonth).sort((a, b) => a.day - b.day);

  return { all, today, week, month };
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
