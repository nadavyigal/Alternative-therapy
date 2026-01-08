/**
 * Database Seed Script for TherapistOS
 *
 * Seeds initial data:
 * - Treatment modalities (methods)
 * - Issues/conditions treated
 * - Optional: Sample therapist for testing
 *
 * Usage: pnpm tsx scripts/seed.ts
 */

// Load environment variables BEFORE anything else
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: resolve(__dirname, "../.env.local"), override: true });

// Verify the database URL is loaded
if (!process.env.POSTGRES_URL) {
  console.error("❌ POSTGRES_URL not found in environment!");
  console.error("Make sure .env.local exists with POSTGRES_URL");
  process.exit(1);
}

console.log("✅ Database URL loaded from environment");

// Treatment Modalities (Hebrew names)
const MODALITIES = [
  { nameHe: "דיקור סיני", nameEn: "Acupuncture", slug: "acupuncture" },
  { nameHe: "נטורופתיה", nameEn: "Naturopathy", slug: "naturopathy" },
  { nameHe: "הומאופתיה", nameEn: "Homeopathy", slug: "homeopathy" },
  { nameHe: "רפלקסולוגיה", nameEn: "Reflexology", slug: "reflexology" },
  { nameHe: "שיאצו", nameEn: "Shiatsu", slug: "shiatsu" },
  { nameHe: "עיסוי טיפולי", nameEn: "Therapeutic Massage", slug: "therapeutic-massage" },
  { nameHe: "צמחי מרפא", nameEn: "Herbal Medicine", slug: "herbal-medicine" },
  { nameHe: "ריפוי רגשי", nameEn: "Emotional Healing", slug: "emotional-healing" },
  { nameHe: "קינסיולוגיה", nameEn: "Kinesiology", slug: "kinesiology" },
  { nameHe: "רייקי", nameEn: "Reiki", slug: "reiki" },
  { nameHe: "אוסטאופתיה", nameEn: "Osteopathy", slug: "osteopathy" },
  { nameHe: "כירופרקטיקה", nameEn: "Chiropractic", slug: "chiropractic" },
  { nameHe: "יוגה טיפולית", nameEn: "Therapeutic Yoga", slug: "therapeutic-yoga" },
  { nameHe: "מדיטציה", nameEn: "Meditation", slug: "meditation" },
  { nameHe: "תזונה טבעית", nameEn: "Natural Nutrition", slug: "natural-nutrition" },
  { nameHe: "ארומתרפיה", nameEn: "Aromatherapy", slug: "aromatherapy" },
  { nameHe: "פרחי באך", nameEn: "Bach Flowers", slug: "bach-flowers" },
  { nameHe: "CBT", nameEn: "Cognitive Behavioral Therapy", slug: "cbt" },
  { nameHe: "היפנוזה", nameEn: "Hypnotherapy", slug: "hypnotherapy" },
  { nameHe: "טיפול בביופידבק", nameEn: "Biofeedback", slug: "biofeedback" },
  { nameHe: "צ'י קונג", nameEn: "Qigong", slug: "qigong" },
  { nameHe: "אוסטופתיה קרניו-סקרלית", nameEn: "Craniosacral Osteopathy", slug: "craniosacral" },
  { nameHe: "פלדנקרייז", nameEn: "Feldenkrais", slug: "feldenkrais" },
  { nameHe: "אלכסנדר טכניק", nameEn: "Alexander Technique", slug: "alexander-technique" },
  { nameHe: "ריפוי באמצעות תנועה", nameEn: "Movement Therapy", slug: "movement-therapy" },
];

// Issues/Conditions Treated (Hebrew names)
const ISSUES = [
  { nameHe: "כאבי גב", nameEn: "Back Pain", slug: "back-pain" },
  { nameHe: "כאבי ראש ומיגרנות", nameEn: "Headaches & Migraines", slug: "headaches-migraines" },
  { nameHe: "חרדה ולחץ", nameEn: "Anxiety & Stress", slug: "anxiety-stress" },
  { nameHe: "דיכאון", nameEn: "Depression", slug: "depression" },
  { nameHe: "נדודי שינה", nameEn: "Insomnia", slug: "insomnia" },
  { nameHe: "בעיות עיכול", nameEn: "Digestive Issues", slug: "digestive-issues" },
  { nameHe: "אלרגיות", nameEn: "Allergies", slug: "allergies" },
  { nameHe: "פריון ובעיות הורמונליות", nameEn: "Fertility & Hormones", slug: "fertility-hormones" },
  { nameHe: "כאבים כרוניים", nameEn: "Chronic Pain", slug: "chronic-pain" },
  { nameHe: "פיברומיאלגיה", nameEn: "Fibromyalgia", slug: "fibromyalgia" },
  { nameHe: "פגיעות ספורט", nameEn: "Sports Injuries", slug: "sports-injuries" },
  { nameHe: "תסמונת המעי הרגיז", nameEn: "IBS", slug: "ibs" },
  { nameHe: "עייפות כרונית", nameEn: "Chronic Fatigue", slug: "chronic-fatigue" },
  { nameHe: "הפרעות אכילה", nameEn: "Eating Disorders", slug: "eating-disorders" },
  { nameHe: "ADHD", nameEn: "ADHD", slug: "adhd" },
  { nameHe: "אוטיזם", nameEn: "Autism", slug: "autism" },
  { nameHe: "שיקום מפציעות", nameEn: "Injury Rehabilitation", slug: "injury-rehab" },
  { nameHe: "הפרעות שינה", nameEn: "Sleep Disorders", slug: "sleep-disorders" },
  { nameHe: "יחסי זוגיות", nameEn: "Relationship Issues", slug: "relationships" },
  { nameHe: "התמכרויות", nameEn: "Addictions", slug: "addictions" },
  { nameHe: "טראומה ו-PTSD", nameEn: "Trauma & PTSD", slug: "trauma-ptsd" },
  { nameHe: "פחדים ופוביות", nameEn: "Fears & Phobias", slug: "fears-phobias" },
  { nameHe: "ניהול משקל", nameEn: "Weight Management", slug: "weight-management" },
  { nameHe: "בעיות עור", nameEn: "Skin Issues", slug: "skin-issues" },
  { nameHe: "ליווי הריון ולידה", nameEn: "Pregnancy & Birth Support", slug: "pregnancy-birth" },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  // Dynamic import to ensure env vars are loaded first
  const { db } = await import("../src/lib/db");
  const { modality, issue, user, therapistProfile, therapistModality, therapistIssue } = await import("../src/lib/schema");
  const { eq } = await import("drizzle-orm");

  try {
    // 1. Seed Modalities
    console.log("📋 Seeding modalities...");
    let modalitiesAdded = 0;

    for (const mod of MODALITIES) {
      const existing = await db.select().from(modality).where(eq(modality.slug, mod.slug)).limit(1);

      if (existing.length === 0) {
        await db.insert(modality).values({
          nameHe: mod.nameHe,
          nameEn: mod.nameEn,
          slug: mod.slug,
          source: "system",
        });
        modalitiesAdded++;
      }
    }
    console.log(`✅ Added ${modalitiesAdded} modalities (${MODALITIES.length - modalitiesAdded} already existed)\n`);

    // 2. Seed Issues
    console.log("📋 Seeding issues/conditions...");
    let issuesAdded = 0;

    for (const iss of ISSUES) {
      const existing = await db.select().from(issue).where(eq(issue.slug, iss.slug)).limit(1);

      if (existing.length === 0) {
        await db.insert(issue).values({
          nameHe: iss.nameHe,
          nameEn: iss.nameEn,
          slug: iss.slug,
        });
        issuesAdded++;
      }
    }
    console.log(`✅ Added ${issuesAdded} issues (${ISSUES.length - issuesAdded} already existed)\n`);

    // 3. Optional: Create a test therapist (uncomment if needed)
    console.log("👤 Checking for test therapist...");
    const testEmail = "test-therapist@therapistos.local";
    const existingUser = await db.select().from(user).where(eq(user.email, testEmail)).limit(1);

    if (existingUser.length === 0) {
      console.log("Creating test therapist account...");

      // Note: In production, use Better Auth's signup API to create users
      // This is just for development/testing
      const [newUser] = await db.insert(user).values({
        id: `test_${Date.now()}`,
        name: "ד״ר שרה לוי",
        email: testEmail,
        emailVerified: true,
        role: "therapist",
        phone: "+972-52-123-4567",
        phoneVerified: true,
        locale: "he",
      }).returning();

      const [profile] = await db.insert(therapistProfile).values({
        userId: newUser.id,
        displayName: "ד״ר שרה לוי",
        slug: "dr-sarah-levi",
        bio: "מטפלת בעלת ניסיון של 15 שנה בטיפולים אלטרנטיביים. מתמחה בשילוב של דיקור סיני ונטורופתיה לטיפול בכאבים כרוניים וחרדה.",
        city: "תל אביב",
        startedTreatingYear: 2008,
        offersOnline: true,
        offersInPerson: true,
        availableDays: ["sun", "mon", "tue", "wed", "thu"],
        priceMin: 300,
        priceMax: 500,
        languages: ["עברית", "אנגלית"],
        whatsappPhone: "+972-52-123-4567",
        contactEmail: testEmail,
        published: true,
      }).returning();

      // Add some modalities and issues to the test therapist
      const acupuncture = await db.select().from(modality).where(eq(modality.slug, "acupuncture")).limit(1);
      const naturopathy = await db.select().from(modality).where(eq(modality.slug, "naturopathy")).limit(1);

      if (acupuncture[0]) {
        await db.insert(therapistModality).values({
          therapistProfileId: profile.id,
          modalityId: acupuncture[0].id,
        });
      }

      if (naturopathy[0]) {
        await db.insert(therapistModality).values({
          therapistProfileId: profile.id,
          modalityId: naturopathy[0].id,
        });
      }

      const backPain = await db.select().from(issue).where(eq(issue.slug, "back-pain")).limit(1);
      const anxiety = await db.select().from(issue).where(eq(issue.slug, "anxiety-stress")).limit(1);

      if (backPain[0]) {
        await db.insert(therapistIssue).values({
          therapistProfileId: profile.id,
          issueId: backPain[0].id,
        });
      }

      if (anxiety[0]) {
        await db.insert(therapistIssue).values({
          therapistProfileId: profile.id,
          issueId: anxiety[0].id,
        });
      }

      console.log(`✅ Test therapist created!`);
      console.log(`   Email: ${testEmail}`);
      console.log(`   Profile: http://localhost:3000/t/dr-sarah-levi`);
      console.log(`   Note: This is for development only. Use proper signup in production.\n`);
    } else {
      console.log(`ℹ️  Test therapist already exists\n`);
    }

    console.log("✨ Database seeding completed successfully!\n");
    console.log("Summary:");
    console.log(`   - Modalities: ${MODALITIES.length} total`);
    console.log(`   - Issues: ${ISSUES.length} total`);
    console.log(`   - Test therapist: ${existingUser.length === 0 ? 'Created' : 'Already exists'}`);
    console.log("\n🚀 You can now start the development server with: pnpm dev\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("✅ Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
