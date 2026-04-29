import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Industry from './models/Industry.js';
import Tool from './models/Tool.js';

dotenv.config({ path: './.env' }); // Make sure to load from root

const MOCK_INDUSTRIES = [
  { name: "Legal", icon: "⚖️", description: "Contract review & clause generation" },
  { name: "HR", icon: "👥", description: "Job descriptions & resume screening" },
  { name: "E-commerce", icon: "🛍️", description: "Product descriptions & ad copy" },
];

const seedData = async () => {
  try {
    await connectDB();
    
    await Industry.deleteMany();
    await Tool.deleteMany();

    const createdIndustries = await Industry.insertMany(MOCK_INDUSTRIES);

    const legalIndustry = createdIndustries.find(i => i.name === "Legal")._id;
    const hrIndustry = createdIndustries.find(i => i.name === "HR")._id;

    const MOCK_TOOLS = [
      {
        name: "Contract Reviewer",
        slug: "contract-reviewer",
        description: "Analyzes contracts for risks.",
        industryId: legalIndustry,
        provider: "OpenAI GPT-4o",
        fields: [
          { name: "contractFile", label: "Upload Contract PDF", type: "file", required: false },
          { name: "contractText", label: "Contract Text", type: "textarea", required: true }
        ]
      },
      {
        name: "Resume Screener",
        slug: "resume-screener",
        description: "Extracts skills from resumes.",
        industryId: hrIndustry,
        provider: "Claude 3.5 Sonnet",
        fields: [
          { name: "resumeText", label: "Resume Text", type: "textarea", required: true }
        ]
      }
    ];

    await Tool.insertMany(MOCK_TOOLS);
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
