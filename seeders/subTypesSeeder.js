// seeders/subTypesSeeder.js
const PersonalSubType = require('../models/PersonalSubType');
const AgentSubType = require('../models/AgentSubType');
const MerchantType = require('../models/MerchantType');

async function seedSubTypes() {
  try {
    // ---------------- Personal SubTypes ----------------
    const personalSubTypes = ['General Consumer', 'Student', 'Senior Citizen'];
    for (const name of personalSubTypes) {
      await PersonalSubType.updateOne(
        { name },
        { $set: { name, status: 'active' } },
        { upsert: true }
      );
    }

    // ---------------- Agent SubTypes ----------------
    const agentSubTypes = ['Super Agent', 'Mini Agent'];
    for (const name of agentSubTypes) {
      await AgentSubType.updateOne(
        { name },
        { $set: { name, status: 'active' } },
        { upsert: true }
      );
    }

    // ---------------- Merchant SubTypes ----------------
    const merchantSubTypes = ['E-commerce', 'Shop', 'NGO', 'Education'];
    for (const name of merchantSubTypes) {
      await MerchantType.updateOne(
        { name },
        { $set: { name, status: 'active' } },
        { upsert: true }
      );
    }

    console.log('✅ Default sub-types seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding sub-types:', error);
  }
}

module.exports = seedSubTypes;