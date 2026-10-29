/**
 * Gerador de Código Pix (EMV BR Code Padrão Banco Central)
 * Gera Payload Copia e Cola e permite renderizar QR Code 100% escaneável por aplicativos de banco.
 */

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function calculateCRC16(payload: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(
  pixKey: string,
  merchantName: string = 'RAON TECNOLOGIA',
  merchantCity: string = 'SALVADOR',
  amount: number = 29.90,
  txid: string = '***'
): string {
  // Limpeza de caracteres especiais para manter estrita compatibilidade EMV
  const cleanKey = pixKey.trim();
  const cleanName = merchantName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 25);
  const cleanCity = merchantCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 15);
  const formattedAmount = amount.toFixed(2);

  // 00 - Payload Format Indicator
  const pfi = formatField('00', '01');

  // 26 - Merchant Account Information (Banco Central do Brasil)
  const gui = formatField('00', 'br.gov.bcb.pix');
  const keyField = formatField('01', cleanKey);
  const mai = formatField('26', `${gui}${keyField}`);

  // 52 - Merchant Category Code
  const mcc = formatField('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  const curr = formatField('53', '986');

  // 54 - Transaction Amount
  const amt = formatField('54', formattedAmount);

  // 58 - Country Code
  const ctry = formatField('58', 'BR');

  // 59 - Merchant Name
  const name = formatField('59', cleanName);

  // 60 - Merchant City
  const city = formatField('60', cleanCity);

  // 62 - Additional Data Field Template (txid)
  const cleanTxid = txid ? txid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***' : '***';
  const addField = formatField('62', formatField('05', cleanTxid));

  // 63 - CRC16 checksum
  const rawPayload = `${pfi}${mai}${mcc}${curr}${amt}${ctry}${name}${city}${addField}6304`;
  const checksum = calculateCRC16(rawPayload);

  return `${rawPayload}${checksum}`;
}

export interface PixKeyOption {
  id: string;
  label: string;
  key: string;
  display: string;
  type: 'telefone' | 'email';
  isDefault?: boolean;
}

export const KNOWN_RAON_PIX_KEYS: PixKeyOption[] = [
  {
    id: 'tel_75',
    label: 'Telefone (75) 98864-4742 (Principal / WhatsApp)',
    key: '+5575988644742',
    display: '(75) 98864-4742',
    type: 'telefone',
    isDefault: true,
  },
  {
    id: 'email_agencia',
    label: 'E-mail agenciaraon@gmail.com',
    key: 'agenciaraon@gmail.com',
    display: 'agenciaraon@gmail.com',
    type: 'email',
  },
  {
    id: 'email_somos',
    label: 'E-mail somosraon@gmail.com',
    key: 'somosraon@gmail.com',
    display: 'somosraon@gmail.com',
    type: 'email',
  },
  {
    id: 'tel_71',
    label: 'Telefone (71) 98303-2979',
    key: '+5571983032979',
    display: '(71) 98303-2979',
    type: 'telefone',
  },
];
