export const modalities = [
  'רייקי',
  'דיקור סיני',
  'NLP',
  'טיפול רגשי',
  'עיסוי רפואי',
  'הומאופתיה',
  'נטורופתיה',
  'רפלקסולוגיה',
  'פלדנקרייז',
  'שיאצו',
];

export const issues = [
  'חרדה',
  'דיכאון',
  'כאב כרוני',
  'פוריות',
  'זוגיות',
  'טראומה',
  'שינה',
  'מתח',
  'גב ושרירים',
  'קשיי ריכוז',
];

export const populations = [
  'ילדים',
  'נוער',
  'מבוגרים',
  'הורים',
  'זוגות',
  'קשישים',
];

export const languages = [
  'עברית',
  'אנגלית',
  'רוסית',
  'ערבית',
  'צרפתית',
  'אמהרית',
];

export const mockTherapists = [
  {
    id: '1',
    name: 'ד"ר רחל כהן',
    title: 'פסיכולוגית קלינית ומטפלת NLP',
    modalities: ['NLP', 'טיפול רגשי'],
    issues: ['חרדה', 'דיכאון', 'טראומה'],
    location: 'תל אביב',
    remote: true,
    verified: true,
    licensed: true,
    bio: 'בעלת ניסיון של 15 שנה בטיפול נפשי. מתמחה בטיפול בחרדות ודיכאון באמצעות שילוב של גישות טיפוליות.',
    languages: ['עברית', 'אנגלית'],
    priceRange: '₪300-500',
  },
  {
    id: '2',
    name: 'יוסי לוי',
    title: 'מטפל ברייקי ודיקור סיני',
    modalities: ['רייקי', 'דיקור סיני'],
    issues: ['כאב כרוני', 'מתח', 'גב ושרירים'],
    location: 'ירושלים',
    remote: false,
    verified: true,
    licensed: false,
    bio: 'מטפל מוסמך עם התמחות בטיפול בכאב כרוני ומתח. שילוב של רפואה סינית מסורתית וטכניקות אנרגטיות.',
    languages: ['עברית'],
    priceRange: '₪250-400',
  },
  {
    id: '3',
    name: 'מיכל אברהם',
    title: 'נטורופטית ומומחית פוריות',
    modalities: ['נטורופתיה', 'הומאופתיה'],
    issues: ['פוריות', 'שינה', 'מתח'],
    location: 'חיפה',
    remote: true,
    verified: true,
    licensed: false,
    bio: 'מתמחה בליווי זוגות במסע הפוריות. גישה הוליסטית המשלבת תזונה, צמחי מרפא והומאופתיה.',
    languages: ['עברית', 'אנגלית', 'רוסית'],
    priceRange: '₪350-450',
  },
];

export const mockLeads = [
  {
    id: '1',
    name: 'שרה ישראלי',
    date: '2024-12-25',
    message: 'מעוניינת בטיפול לחרדה',
    status: 'new',
    phone: '050-1234567',
    email: 'sarah@example.com',
  },
  {
    id: '2',
    name: 'דוד מזרחי',
    date: '2024-12-24',
    message: 'סובל מכאבי גב כרוניים',
    status: 'contacted',
    phone: '052-9876543',
    email: 'david@example.com',
  },
];

export const mockServiceRequests = [
  {
    id: '1',
    therapistName: 'ד"ר רחל כהן',
    type: 'ביטוח אחריות מקצועית',
    status: 'pending',
    assignedPartner: '',
    createdAt: '2024-12-20',
  },
  {
    id: '2',
    therapistName: 'יוסי לוי',
    type: 'פנסיה וקרן השתלמות',
    status: 'inProgress',
    assignedPartner: 'הפניקס',
    createdAt: '2024-12-18',
  },
];

export const mockCredentials = [
  {
    id: '1',
    therapistName: 'ד"ר רחל כהן',
    documentType: 'תואר דוקטור בפסיכולוגיה',
    issuer: 'אוניברסיטת תל אביב',
    status: 'verified',
  },
  {
    id: '2',
    therapistName: 'מיכל אברהם',
    documentType: 'תעודת נטורופת מוסמכת',
    issuer: 'המכללה למדעי הבריאות',
    status: 'pending',
  },
];
