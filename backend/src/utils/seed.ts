import { pool } from '../config/database';
import { initializeDatabase } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await initializeDatabase();

    // Seed vendors
    const vendors = [
      {
        name: 'Tech Solutions Inc',
        email: 'sales@techsolutions.com',
        phone: '+1-555-0101',
        contact_person: 'John Smith',
        address: '123 Tech Street, San Francisco, CA 94105',
      },
      {
        name: 'Global Electronics Ltd',
        email: 'info@globalelectronics.com',
        phone: '+1-555-0202',
        contact_person: 'Sarah Johnson',
        address: '456 Innovation Ave, Austin, TX 78701',
      },
      {
        name: 'Enterprise Hardware Co',
        email: 'contact@enterprisehw.com',
        phone: '+1-555-0303',
        contact_person: 'Mike Williams',
        address: '789 Business Blvd, New York, NY 10001',
      },
      {
        name: 'Premium Office Supplies',
        email: 'sales@premiumoffice.com',
        phone: '+1-555-0404',
        contact_person: 'Emily Davis',
        address: '321 Commerce Road, Seattle, WA 98101',
      },
    ];

    for (const vendor of vendors) {
      await pool.query(
        `INSERT INTO vendors (name, email, phone, contact_person, address)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [vendor.name, vendor.email, vendor.phone, vendor.contact_person, vendor.address]
      );
    }

    console.log(`✅ Seeded ${vendors.length} vendors`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Create RFPs via the API');
    console.log('3. Send RFPs to the seeded vendors');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
