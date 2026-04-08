import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const DEMO_DOCTORS = [
  {
    id: "cuid_sarah",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@dentai.com",
    phone: "+1 (555) 123-4567",
    speciality: "General Dentistry",
    bio: "Dr. Sarah Johnson has over 12 years of experience in restorative and cosmetic dentistry. She graduated with honors from NYU College of Dentistry.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    gender: "FEMALE",
    isActive: true,
  },
  {
    id: "cuid_michael",
    name: "Dr. Michael Chen",
    email: "michael.chen@dentai.com",
    phone: "+1 (555) 987-6543",
    speciality: "Orthodontics",
    bio: "Dr. Michael Chen specializes in modern orthodontic treatments, including Invisalign and clear braces. He is passionate about creating beautiful smiles.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    gender: "MALE",
    isActive: true,
  },
  {
    id: "cuid_emily",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@dentai.com",
    phone: "+1 (555) 456-7890",
    speciality: "Pediatric Dentistry",
    bio: "Dr. Emily Rodriguez loves working with children and focuses on making dental visits fun and stress-free for her young patients.",
    imageUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    gender: "FEMALE",
    isActive: true,
  },
];

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Missing DATABASE_URL. Add it to .env.local first.");
    process.exit(1);
  }

  if (!process.argv.includes("--yes")) {
    console.error(
      "Refusing to run without confirmation. Re-run with: npm run demo:reset -- --yes"
    );
    process.exit(1);
  }

  const sql = neon(dbUrl);

  // Keep users intact, but reset mutable demo data.
  await sql.query("DELETE FROM appointments");

  const demoEmails = DEMO_DOCTORS.map((doctor) => `'${doctor.email}'`).join(", ");
  await sql.query(`DELETE FROM doctors WHERE email NOT IN (${demoEmails})`);

  for (const doctor of DEMO_DOCTORS) {
    await sql.query(
      `INSERT INTO doctors (
        id, name, email, phone, speciality, bio, "imageUrl", gender, "isActive", "createdAt", "updatedAt"
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        speciality = EXCLUDED.speciality,
        bio = EXCLUDED.bio,
        "imageUrl" = EXCLUDED."imageUrl",
        gender = EXCLUDED.gender,
        "isActive" = EXCLUDED."isActive",
        "updatedAt" = NOW()`,
      [
        doctor.id,
        doctor.name,
        doctor.email,
        doctor.phone,
        doctor.speciality,
        doctor.bio,
        doctor.imageUrl,
        doctor.gender,
        doctor.isActive,
      ]
    );
  }

  const [doctorCount] = await sql.query(
    'SELECT COUNT(*)::int AS count FROM doctors WHERE "isActive" = true'
  );
  const [appointmentCount] = await sql.query(
    "SELECT COUNT(*)::int AS count FROM appointments"
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        activeDoctors: doctorCount.count,
        appointments: appointmentCount.count,
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error("Demo reset failed:", error);
  process.exit(1);
});
