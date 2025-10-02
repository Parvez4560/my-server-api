// seeders/subTypesSeeder.js

const PersonalSubType = require('../models/PersonalSubType');
const AgentSubType = require('../models/AgentSubType');
const MerchantType = require('../models/MerchantSubType');

/**
 * Generate a unique 5-digit numeric ID
 * @param {Model} model - MongoDB model to check uniqueness against
 * @returns {string} - unique 5-digit ID
 */
async function generateUniqueCustomId(model) {
  let isUnique = false;
  let customId = '';
  
  while (!isUnique) {
    customId = '';
    const chars = '0123456789';
    for (let i = 0; i < 5; i++) {
      customId += chars[Math.floor(Math.random() * chars.length)];
    }

    // Check if this ID already exists in the collection
    const existing = await model.findOne({ customId });
    if (!existing) {
      isUnique = true;
    }
  }

  return customId;
}

async function seedSubTypes() {
  try {
    // ---------------- Personal SubTypes ----------------
    const personalSubTypes = ['General Consumer', 'Student', 'Senior Citizen'];
    for (const name of personalSubTypes) {
      const customId = await generateUniqueCustomId(PersonalSubType);
      await PersonalSubType.updateOne(
        { name },
        { $set: { name, status: 'active', customId } },
        { upsert: true }
      );
    }

    // ---------------- Agent SubTypes ----------------
    const agentSubTypes = ['Super Agent', 'Mini Agent'];
    for (const name of agentSubTypes) {
      const customId = await generateUniqueCustomId(AgentSubType);
      await AgentSubType.updateOne(
        { name },
        { $set: { name, status: 'active', customId } },
        { upsert: true }
      );
    }

    // ---------------- Merchant SubTypes ----------------
    const merchantSubTypes = [
      'E-commerce',
      'Retail',
      'Restaurant & Hotel',
      'Travel',
      'Utility',
      'Education',
      'Clinic & Hospital',
      'Donation & Charity',
      'Finance & Insurance'
    ];
    for (const name of merchantSubTypes) {
      const customId = await generateUniqueCustomId(MerchantType);
      await MerchantType.updateOne(
        { name },
        { $set: { name, status: 'active', customId } },
        { upsert: true }
      );
    }

    console.log('✅ Default sub-types with unique 5-digit custom IDs seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding sub-types:', error);
  }
}

module.exports = seedSubTypes;