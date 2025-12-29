const OTP_TTL_MS = 5 * 60 * 1000;

type OtpRecord = {
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

function formatIsraeliNumber(localDigits: string) {
  const area = localDigits.slice(0, 2);
  const part1 = localDigits.slice(2, 5);
  const part2 = localDigits.slice(5, 9);

  return `+972-${area}-${part1}-${part2}`;
}

export function normalizeIsraeliPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  let localDigits = digits;

  if (localDigits.startsWith("972")) {
    localDigits = localDigits.slice(3);
  }

  if (localDigits.startsWith("0")) {
    localDigits = localDigits.slice(1);
  }

  if (localDigits.length !== 9) {
    throw new Error("INVALID_PHONE");
  }

  return formatIsraeliNumber(localDigits);
}

function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string) {
  const normalizedPhone = normalizeIsraeliPhone(phone);
  const code = generateOtpCode();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpStore.set(normalizedPhone, { code, expiresAt });

  return {
    phone: normalizedPhone,
    code,
    expiresAt: new Date(expiresAt),
  };
}

export async function verifyOtp(phone: string, code: string) {
  const normalizedPhone = normalizeIsraeliPhone(phone);
  const record = otpStore.get(normalizedPhone);

  if (!record) {
    return false;
  }

  if (record.expiresAt < Date.now()) {
    otpStore.delete(normalizedPhone);
    return false;
  }

  if (record.code !== code) {
    return false;
  }

  otpStore.delete(normalizedPhone);
  return true;
}
