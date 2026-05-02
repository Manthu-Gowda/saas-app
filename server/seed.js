// cSpell:disable
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Industry from './models/Industry.js';
import Tool from './models/Tool.js';
import User from './models/User.js';

dotenv.config();

const INDUSTRIES = [
  { name: 'Legal', slug: 'legal', icon: '⚖️', description: 'Contract review, clause generation & legal document analysis', color: '#6c47ff', sortOrder: 1 },
  { name: 'HR', slug: 'hr', icon: '👥', description: 'Job descriptions, resume screening & performance reviews', color: '#3b82f6', sortOrder: 2 },
  { name: 'E-commerce', slug: 'ecommerce', icon: '🛍️', description: 'Product descriptions, ad copy & email campaigns', color: '#10b981', sortOrder: 3 },
  { name: 'Real Estate', slug: 'real-estate', icon: '🏠', description: 'Property listings, client follow-ups & market reports', color: '#f59e0b', sortOrder: 4 },
  { name: 'Finance', slug: 'finance', icon: '💰', description: 'Financial report summaries, invoices & risk assessments', color: '#ef4444', sortOrder: 5 },
  { name: 'Marketing', slug: 'marketing', icon: '📢', description: 'Blog posts, social media content & email sequences', color: '#ec4899', sortOrder: 6 },
  { name: 'Accounting & Tax Related', slug: 'accounting-tax', icon: '🧮', description: 'Tax summaries, GST reports, compliance checks & financial statements', color: '#14b8a6', sortOrder: 7 },
  { name: 'Automotive', slug: 'automotive', icon: '🚗', description: 'Vehicle inspection reports, service reminders & dealership content', color: '#f97316', sortOrder: 8 },
  { name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔐', description: 'Incident reports, security policies, vulnerability assessments & awareness', color: '#8b5cf6', sortOrder: 9 },
  { name: 'Healthcare', slug: 'healthcare', icon: '🏥', description: 'Patient summaries, medical reports, discharge notes & health content', color: '#06b6d4', sortOrder: 10 },
  { name: 'Retail', slug: 'retail', icon: '🏪', description: 'Promotions, loyalty emails, product copy & customer communications', color: '#f43f5e', sortOrder: 11 },
  { name: 'Logistics & Supply Chain', slug: 'logistics', icon: '🚚', description: 'Shipment updates, supplier communications & supply chain reports', color: '#78716c', sortOrder: 12 },
  { name: 'Agriculture', slug: 'agriculture', icon: '🌾', description: 'Crop reports, farm advisories, grant proposals & agri-business content', color: '#84cc16', sortOrder: 13 },
  { name: 'Software Development / IT', slug: 'software-it', icon: '💻', description: 'Code reviews, technical docs, bug reports & developer communications', color: '#6366f1', sortOrder: 14 },
  { name: 'Automobile / RTO Services', slug: 'automobile-rto', icon: '🚘', description: 'RTO documentation, vehicle transfers, NOC letters & registration guides', color: '#a16207', sortOrder: 15 },
  { name: 'Government & NGO', slug: 'government-ngo', icon: '🏛️', description: 'Grant proposals, policy briefs, public announcements & official letters', color: '#0369a1', sortOrder: 16 },
  { name: 'Marriage / Wedding Industry', slug: 'wedding', icon: '💍', description: 'Invitations, vendor emails, wedding programs & event communication', color: '#db2777', sortOrder: 17 },
  { name: 'Hospitality & Travel', slug: 'hospitality-travel', icon: '✈️', description: 'Hotel welcome letters, travel itineraries, guest communications & reviews', color: '#0891b2', sortOrder: 18 },
  { name: 'Education', slug: 'education', icon: '🎓', description: 'Lesson plans, student reports, educational content & academic writing', color: '#7c3aed', sortOrder: 19 },
  { name: 'Insurance', slug: 'insurance', icon: '🛡️', description: 'Policy summaries, claims reports, insurance proposals & client letters', color: '#059669', sortOrder: 20 },
];

const buildTools = (industries) => {
  const industryBySlug = new Map(industries.map((industry) => [industry.slug, industry]));
  const bySlug = (slug) => {
    const industry = industryBySlug.get(slug);
    if (!industry) throw new Error(`Missing industry in seed data: ${slug}`);
    return industry._id;
  };

  return [
    // ─── LEGAL ────────────────────────────────────────────────────────────────
    {
      name: 'Contract Reviewer',
      slug: 'contract-reviewer',
      icon: '📄',
      description: 'Analyze contracts for risks, key obligations, and red flags.',
      industryId: bySlug('legal'),
      systemPrompt: 'You are a senior legal AI assistant with expertise in contract law. Your job is to analyze contracts and provide clear, actionable insights. Always identify risks, key obligations, and important clauses. Use structured headings with markdown. Be precise and professional.',
      userPromptTemplate: `Analyze the following contract and provide:
1. **Executive Summary** (2-3 sentences)
2. **Key Parties & Obligations**
3. **Important Clauses** (payment, termination, liability, IP, confidentiality)
4. **Red Flags or Unusual Terms**
5. **Overall Risk Assessment** (Low / Medium / High) with reasoning
6. **Recommended Follow-up Questions for a Lawyer**

Contract Text:
{contract_text}`,
      fields: [
        { name: 'contract_text', label: 'Contract Text', type: 'textarea', required: true, placeholder: 'Paste the full contract here...' },
        { name: 'contractFile', label: 'Upload Contract PDF (optional)', type: 'file', required: false },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Legal Clause Generator',
      slug: 'legal-clause-generator',
      icon: '✍️',
      description: 'Draft precise, enforceable legal clauses with plain-English explanations.',
      industryId: bySlug('legal'),
      systemPrompt: 'You are an expert legal drafter specializing in commercial contracts. You produce precise, enforceable legal clauses that are clear and unambiguous. Always include a plain-English explanation after each clause.',
      userPromptTemplate: `Draft a professional legal clause for the following:

Clause type: {clause_type}
Jurisdiction: {jurisdiction}
Context and requirements: {context}
Tone: {tone}

Provide:
1. **The Formal Legal Clause**
2. **Plain-English Explanation** of what it means
3. **Important Caveats** to keep in mind`,
      fields: [
        { name: 'clause_type', label: 'Clause Type', type: 'text', required: true, placeholder: 'e.g. Non-disclosure, Termination, Limitation of liability' },
        { name: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: true, placeholder: 'e.g. India, USA - California, UK' },
        { name: 'context', label: 'Context & Requirements', type: 'textarea', required: true, placeholder: 'Describe the purpose and any specific needs...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Standard commercial', 'Strict / protective', 'Balanced / collaborative', 'Simple / plain language'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Legal Document Summarizer',
      slug: 'legal-doc-summarizer',
      icon: '📋',
      description: 'Translate complex legal documents into clear, accessible summaries.',
      industryId: bySlug('legal'),
      systemPrompt: 'You are a legal analyst who translates complex legal documents into clear, accessible summaries. You preserve all important details while making the content understandable to non-lawyers.',
      userPromptTemplate: `Summarize the following legal document for a {audience} audience.

Focus areas: {focus_areas}

Document:
{document_text}

Provide:
- **Executive Summary**
- **Key Points** (bullet format)
- **Important Dates / Deadlines**
- **Action Items**
- **Areas Requiring Legal Review**`,
      fields: [
        { name: 'document_text', label: 'Document Text', type: 'textarea', required: true, placeholder: 'Paste document content...' },
        { name: 'audience', label: 'Target Audience', type: 'select', required: true, options: ['Executive/C-suite', 'Business team', 'General public', 'Technical team'] },
        { name: 'focus_areas', label: 'Focus Areas (optional)', type: 'text', required: false, placeholder: 'e.g. liability, payment terms, IP rights' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── HR ───────────────────────────────────────────────────────────────────
    {
      name: 'Job Description Writer',
      slug: 'job-description-writer',
      icon: '💼',
      description: 'Write compelling, inclusive job descriptions that attract top talent.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are an experienced HR professional and talent acquisition specialist. You write compelling, inclusive job descriptions that attract qualified candidates. You use benefits-focused language, avoid jargon, and ensure job posts are gender-neutral and accessible.',
      userPromptTemplate: `Write a complete job description for:

Role title: {role_title}
Company name: {company_name}
Work type: {work_type}
Experience level: {experience_level}
Key responsibilities: {responsibilities}
Required skills: {required_skills}
Nice-to-have: {nice_to_have}
Salary range: {salary_range}

Include: Job title, overview paragraph, responsibilities (6-8 bullets), requirements (5-6 must-haves), nice-to-haves (3-4), benefits/perks, and a compelling "Why join us" section. Make it SEO-friendly.`,
      fields: [
        { name: 'role_title', label: 'Role Title', type: 'text', required: true, placeholder: 'e.g. Senior Product Manager' },
        { name: 'company_name', label: 'Company Name', type: 'text', required: false, placeholder: 'Your company name' },
        { name: 'work_type', label: 'Work Type', type: 'select', required: false, options: ['Full-time on-site', 'Full-time remote', 'Hybrid', 'Part-time', 'Contract'] },
        { name: 'experience_level', label: 'Experience Level', type: 'select', required: false, options: ['Entry level (0-2 yrs)', 'Mid-level (2-5 yrs)', 'Senior (5-8 yrs)', 'Lead/Manager (8+ yrs)'] },
        { name: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', required: true, placeholder: 'List the main responsibilities...' },
        { name: 'required_skills', label: 'Required Skills', type: 'textarea', required: true, placeholder: 'List must-have skills...' },
        { name: 'nice_to_have', label: 'Nice-to-have Skills', type: 'textarea', required: false, placeholder: 'Optional bonus skills...' },
        { name: 'salary_range', label: 'Salary Range (optional)', type: 'text', required: false, placeholder: 'e.g. $80,000 - $100,000' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Resume Screener',
      slug: 'resume-screener',
      icon: '🔍',
      description: 'Evaluate resumes against job requirements with structured, fair assessments.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are a senior HR recruiter with 15+ years of experience. You evaluate resumes objectively and provide structured, fair assessments. You consider both hard skills and soft skills. You provide actionable hiring recommendations.',
      userPromptTemplate: `Evaluate this candidate's resume against the job requirements:

JOB REQUIREMENTS:
{job_requirements}

CANDIDATE RESUME:
{resume_text}

Provide:
1. **Overall Match Score** (0-100) with justification
2. **Top 3 Strengths** for this role
3. **Top 3 Gaps or Concerns**
4. **Key Interview Questions** to ask
5. **Hiring Recommendation:** Strong Yes / Yes / Maybe / No
6. **Suggested Next Step**`,
      fields: [
        { name: 'resume_text', label: 'Resume / CV Text', type: 'textarea', required: true, placeholder: 'Paste the candidate\'s resume here...' },
        { name: 'job_requirements', label: 'Job Requirements or Description', type: 'textarea', required: true, placeholder: 'Paste the job description or list of requirements...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Interview Question Generator',
      slug: 'interview-question-generator',
      icon: '❓',
      description: 'Generate targeted, insightful interview questions using STAR methodology.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are an expert in talent assessment and behavioral interviewing. You create targeted, insightful interview questions that reveal a candidate\'s true capabilities, problem-solving skills, and cultural fit. You use the STAR method for behavioral questions.',
      userPromptTemplate: `Generate a comprehensive interview question set for:

Role: {role}
Level: {level}
Key skills to assess: {skills}
Company values: {values}

Provide 12 questions organized as:
- **3 Technical/Skills Questions** (with what a strong answer looks like)
- **3 Behavioral Questions** (STAR format prompts)
- **2 Situational/Problem-solving Questions**
- **2 Culture-fit and Values Questions**
- **2 Motivation and Career Goal Questions**`,
      fields: [
        { name: 'role', label: 'Role Title', type: 'text', required: true, placeholder: 'e.g. Software Engineer, Marketing Manager' },
        { name: 'level', label: 'Seniority Level', type: 'select', required: true, options: ['Junior', 'Mid-level', 'Senior', 'Team Lead', 'Manager', 'Director'] },
        { name: 'skills', label: 'Key Skills / Competencies to Assess', type: 'textarea', required: true, placeholder: 'List the main skills you want to evaluate...' },
        { name: 'values', label: 'Company Values (optional)', type: 'text', required: false, placeholder: 'e.g. ownership, transparency, customer obsession' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Performance Review Writer',
      slug: 'performance-review-writer',
      icon: '⭐',
      description: 'Write constructive, balanced performance reviews that motivate employees.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are an HR coach specializing in performance management. You help managers write constructive, balanced, and professional performance reviews that motivate employees and provide clear development paths.',
      userPromptTemplate: `Write a professional performance review for:

Employee role: {role}
Review period: {period}
Performance level: {performance_level}
Key achievements: {achievements}
Areas for improvement: {improvements}
Goals for next period: {goals}

Write in a professional yet empathetic tone. Include: overall performance summary, achievements recognition, development areas (constructive framing), goals for next period, and final recommendation.`,
      fields: [
        { name: 'role', label: 'Employee Role', type: 'text', required: true, placeholder: 'e.g. Senior Developer' },
        { name: 'period', label: 'Review Period', type: 'text', required: true, placeholder: 'e.g. Q3 2025, Annual 2025' },
        { name: 'performance_level', label: 'Performance Level', type: 'select', required: true, options: ['Exceeds expectations', 'Meets expectations', 'Partially meets', 'Needs improvement'] },
        { name: 'achievements', label: 'Key Achievements', type: 'textarea', required: true, placeholder: 'List major accomplishments this period...' },
        { name: 'improvements', label: 'Areas for Improvement', type: 'textarea', required: true, placeholder: 'Areas where growth is needed...' },
        { name: 'goals', label: 'Goals for Next Period', type: 'textarea', required: true, placeholder: 'What should they aim to achieve next?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },

    // ─── E-COMMERCE ───────────────────────────────────────────────────────────
    {
      name: 'Product Description Writer',
      slug: 'product-description-writer',
      icon: '🛒',
      description: 'Write high-converting, SEO-optimized product descriptions that sell.',
      industryId: bySlug('ecommerce'),
      systemPrompt: 'You are a conversion copywriter specializing in e-commerce. You write product descriptions that sell by focusing on benefits over features, addressing customer pain points, and creating desire. Your copy is SEO-optimized, scannable, and persuasive.',
      userPromptTemplate: `Write a high-converting product description for:

Product name: {product_name}
Product category: {category}
Key features: {features}
Target audience: {audience}
Price point: {price}
Unique selling proposition: {usp}
Brand tone: {tone}

Provide:
1. **SEO-optimized headline** (under 60 chars)
2. **Hook paragraph** (2-3 sentences, leads with biggest benefit)
3. **5 benefit-focused bullet points** (not feature lists)
4. **Short story or use-case paragraph**
5. **Closing CTA**
6. **Meta description** (under 160 chars)`,
      fields: [
        { name: 'product_name', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g. Wireless Noise-Cancelling Headphones' },
        { name: 'category', label: 'Product Category', type: 'text', required: false, placeholder: 'e.g. Electronics, Clothing, Beauty' },
        { name: 'features', label: 'Key Features & Specifications', type: 'textarea', required: true, placeholder: 'List the main features...' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. Remote workers, fitness enthusiasts' },
        { name: 'price', label: 'Price', type: 'text', required: false, placeholder: 'e.g. $49.99' },
        { name: 'usp', label: 'What Makes It Unique?', type: 'textarea', required: false, placeholder: 'Your product\'s unique selling points...' },
        { name: 'tone', label: 'Brand Tone', type: 'select', required: false, options: ['Professional', 'Playful / Fun', 'Premium / Luxury', 'Friendly / Conversational', 'Bold / Energetic'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Ad Copy Generator',
      slug: 'ad-copy-generator',
      icon: '📣',
      description: 'Generate platform-specific ad copy variations for A/B testing.',
      industryId: bySlug('ecommerce'),
      systemPrompt: 'You are a performance marketing expert who writes ad copy that drives clicks and conversions. You understand platform-specific character limits, hooks, and psychological triggers. You write ad variations that can be A/B tested.',
      userPromptTemplate: `Write {num_variations} ad copy variations for:

Product/Offer: {product}
Platform: {platform}
Objective: {objective}
Target audience: {audience}
Key benefit: {benefit}
Special offer/CTA: {offer}
Tone: {tone}

For each variation provide: **Headline**, **Primary text** (within platform limits), **CTA button text**. Label each with its psychological approach (e.g. "Pain-point led", "Social proof", "Curiosity hook").`,
      fields: [
        { name: 'product', label: 'Product or Offer', type: 'text', required: true, placeholder: 'e.g. Productivity App, Summer Sale 30% Off' },
        { name: 'platform', label: 'Ad Platform', type: 'select', required: true, options: ['Facebook / Instagram', 'Google Search', 'Google Display', 'LinkedIn', 'Twitter / X', 'TikTok', 'YouTube'] },
        { name: 'objective', label: 'Campaign Objective', type: 'select', required: false, options: ['Brand awareness', 'Website traffic', 'Lead generation', 'Sales / conversion', 'App installs'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. Small business owners, 25-45' },
        { name: 'benefit', label: 'Key Benefit or Hook', type: 'text', required: true, placeholder: 'e.g. Save 2 hours per day' },
        { name: 'offer', label: 'Special Offer or CTA', type: 'text', required: false, placeholder: 'e.g. 30% off, Free trial, Free shipping' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Urgent', 'Playful', 'Premium', 'Friendly', 'Bold'] },
        { name: 'num_variations', label: 'Number of Variations', type: 'select', required: false, options: ['2', '3', '4', '5'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Customer Review Responder',
      slug: 'customer-review-responder',
      icon: '⭐',
      description: 'Craft professional, empathetic responses to customer reviews.',
      industryId: bySlug('ecommerce'),
      systemPrompt: 'You are a customer experience specialist who crafts professional, empathetic responses to customer reviews. You turn negative reviews into opportunities, amplify positive reviews, and always maintain brand voice. Responses are authentic, not robotic.',
      userPromptTemplate: `Write a response to this customer review:

Review: "{review_text}"
Star rating: {rating}/5
Platform: {platform}
Brand tone: {brand_tone}
Specific issue to address: {specific_issue}

Response should: Be personalized, show empathy, address the main point, resolve or offer next steps if negative, be under 120 words, and end with a positive note.`,
      fields: [
        { name: 'review_text', label: 'Customer Review Text', type: 'textarea', required: true, placeholder: 'Paste the customer review here...' },
        { name: 'rating', label: 'Star Rating', type: 'select', required: true, options: ['1', '2', '3', '4', '5'] },
        { name: 'platform', label: 'Platform', type: 'select', required: false, options: ['Google', 'Amazon', 'Trustpilot', 'App Store', 'Yelp', 'Other'] },
        { name: 'brand_tone', label: 'Brand Tone', type: 'select', required: false, options: ['Friendly / warm', 'Professional', 'Playful', 'Luxury / refined'] },
        { name: 'specific_issue', label: 'Specific Issue to Address (optional)', type: 'text', required: false, placeholder: 'e.g. shipping delay, product defect' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── REAL ESTATE ──────────────────────────────────────────────────────────
    {
      name: 'Property Listing Generator',
      slug: 'property-listing-generator',
      icon: '🏡',
      description: 'Create compelling property listings that generate inquiries and drive viewings.',
      industryId: bySlug('real-estate'),
      systemPrompt: 'You are a real estate copywriter who creates compelling property listings that generate inquiries. You paint vivid pictures with words, highlight lifestyle benefits, and create FOMO. Your listings are accurate, evocative, and optimized for property portals.',
      userPromptTemplate: `Write a compelling property listing for:

Property type: {property_type}
Location: {location}
Size: {size}
Bedrooms/Bathrooms: {bed_bath}
Key features: {features}
Amenities: {amenities}
Asking price: {price}
Target buyer: {target_buyer}
Unique selling points: {usp}

Provide:
1. **Attention-grabbing headline** (under 70 chars)
2. **Opening hook** (2 sentences — sell the lifestyle, not the property)
3. **Property description** (150-200 words with vivid details)
4. **Key highlights** (6-8 bullet points)
5. **Location / neighborhood appeal** paragraph
6. **Urgency-closing statement**`,
      fields: [
        { name: 'property_type', label: 'Property Type', type: 'text', required: true, placeholder: 'e.g. 3BHK apartment, Villa, Office space' },
        { name: 'location', label: 'Location', type: 'text', required: true, placeholder: 'e.g. Downtown Austin, TX' },
        { name: 'size', label: 'Area / Size', type: 'text', required: false, placeholder: 'e.g. 1,200 sq ft' },
        { name: 'bed_bath', label: 'Bedrooms & Bathrooms', type: 'text', required: false, placeholder: 'e.g. 3 bed / 2 bath' },
        { name: 'features', label: 'Key Features', type: 'textarea', required: true, placeholder: 'List the standout features...' },
        { name: 'amenities', label: 'Building / Community Amenities', type: 'textarea', required: false, placeholder: 'e.g. Pool, gym, rooftop...' },
        { name: 'price', label: 'Asking Price', type: 'text', required: false, placeholder: 'e.g. $450,000' },
        { name: 'target_buyer', label: 'Target Buyer', type: 'select', required: false, options: ['First-time homebuyer', 'Investor', 'Growing family', 'Luxury buyer', 'Commercial tenant'] },
        { name: 'usp', label: 'Unique Selling Points', type: 'textarea', required: false, placeholder: 'What makes this property special?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Client Follow-up Email',
      slug: 'real-estate-followup-email',
      icon: '✉️',
      description: 'Write warm, professional follow-up emails that move relationships forward.',
      industryId: bySlug('real-estate'),
      systemPrompt: 'You are a top real estate agent known for your client relationship skills. You write follow-up emails that are warm, professional, timely, and always move the relationship forward. You know the right balance of persistence and patience.',
      userPromptTemplate: `Write a real estate follow-up email:

Context: {context}
Client name: {client_name}
Property/details discussed: {property_details}
Client interest level: {interest_level}
Desired next step: {next_step}
Agent name: {agent_name}

Write a concise (under 200 words), warm, professional email that feels personal — not templated. Include a soft but clear CTA.`,
      fields: [
        { name: 'context', label: 'Follow-up Context', type: 'select', required: true, options: ['After property showing', 'After initial inquiry', 'Post-offer submission', 'After price negotiation', 'Re-engagement (cold lead)', 'Post-closing thank you'] },
        { name: 'client_name', label: 'Client First Name', type: 'text', required: true, placeholder: 'e.g. Sarah' },
        { name: 'property_details', label: 'Property / Meeting Details', type: 'textarea', required: true, placeholder: 'What property did you discuss? Any key details?' },
        { name: 'interest_level', label: 'Client Interest Level', type: 'select', required: false, options: ['Very interested', 'Somewhat interested', 'Undecided', 'Cold / need re-engagement'] },
        { name: 'next_step', label: 'Desired Next Step', type: 'text', required: true, placeholder: 'e.g. Schedule second viewing, Submit offer' },
        { name: 'agent_name', label: 'Your Name', type: 'text', required: false, placeholder: 'Your name' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Market Report Writer',
      slug: 'market-report-writer',
      icon: '📊',
      description: 'Create data-driven real estate market reports with actionable insights.',
      industryId: bySlug('real-estate'),
      systemPrompt: 'You are a real estate market analyst who writes clear, data-driven market reports for clients. You translate market data into actionable insights that help buyers, sellers, and investors make confident decisions.',
      userPromptTemplate: `Write a real estate market report for:

Area: {area}
Property type: {property_type}
Report period: {period}
Market data and observations: {market_data}
Audience: {audience}

Provide:
1. **Market Overview** (current conditions, 2-3 sentences)
2. **Supply and Demand Analysis**
3. **Price Trends and Key Statistics**
4. **Buyer vs. Seller Market Assessment**
5. **3-Month Outlook**
6. **Recommendations** for {audience}`,
      fields: [
        { name: 'area', label: 'Area / City / Neighborhood', type: 'text', required: true, placeholder: 'e.g. Austin, TX — South Congress neighborhood' },
        { name: 'property_type', label: 'Property Type', type: 'select', required: false, options: ['Residential', 'Commercial', 'Luxury', 'Affordable housing', 'Rental market'] },
        { name: 'period', label: 'Report Period', type: 'text', required: true, placeholder: 'e.g. Q3 2025, October 2025' },
        { name: 'market_data', label: 'Market Data & Observations', type: 'textarea', required: true, placeholder: 'Share any data, stats, or market observations you have...' },
        { name: 'audience', label: 'Audience', type: 'select', required: false, options: ['Home buyers', 'Property investors', 'Home sellers', 'Renters', 'Internal team'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── FINANCE ──────────────────────────────────────────────────────────────
    {
      name: 'Financial Report Summarizer',
      slug: 'financial-report-summarizer',
      icon: '📈',
      description: 'Distill complex financial reports into clear, decision-ready summaries.',
      industryId: bySlug('finance'),
      systemPrompt: 'You are a senior financial analyst who distills complex financial reports into clear, decision-ready summaries. You identify what matters most — revenue trends, margin changes, cash position, risk factors — and explain them without jargon.',
      userPromptTemplate: `Summarize this financial report for a {audience} audience:

Document/data:
{report_text}

Period: {period}
Focus areas: {focus_areas}

Provide:
1. **Executive Summary** (3-4 sentences)
2. **Key Financial Metrics** with YoY/QoQ comparison
3. **Top 3 Positive Highlights**
4. **Top 3 Risks or Concerns**
5. **Cash Flow and Liquidity Assessment**
6. **Strategic Implications and Recommended Actions**`,
      fields: [
        { name: 'report_text', label: 'Report Text or Data', type: 'textarea', required: true, placeholder: 'Paste the financial report or data...' },
        { name: 'audience', label: 'Audience', type: 'select', required: true, options: ['Board / C-suite', 'Investors / shareholders', 'Internal finance team', 'Bank / lenders', 'Clients'] },
        { name: 'period', label: 'Reporting Period', type: 'text', required: false, placeholder: 'e.g. Q2 FY2025, FY2024 Annual' },
        { name: 'focus_areas', label: 'Focus Areas (optional)', type: 'text', required: false, placeholder: 'e.g. revenue, EBITDA, working capital' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Invoice & Payment Terms Generator',
      slug: 'invoice-generator',
      icon: '🧾',
      description: 'Generate professional invoices and legally sound payment terms.',
      industryId: bySlug('finance'),
      systemPrompt: 'You are a finance professional who creates clear, professional invoices and payment documentation. You ensure payment terms are legally sound, clearly communicated, and protect the service provider while being fair to clients.',
      userPromptTemplate: `Generate professional invoice content and payment terms for:

Service provider: {provider_name}
Client name: {client_name}
Services rendered: {services}
Total amount: {amount}
Currency: {currency}
Payment terms: {payment_terms}
Late payment clause: {late_payment}

Provide: Itemized invoice table, professional payment terms language, late payment clause, and a professional covering note.`,
      fields: [
        { name: 'provider_name', label: 'Your Business Name', type: 'text', required: true, placeholder: 'Your company name' },
        { name: 'client_name', label: 'Client / Company Name', type: 'text', required: true, placeholder: 'Client name' },
        { name: 'services', label: 'Services / Line Items', type: 'textarea', required: true, placeholder: 'List each service and amount...' },
        { name: 'amount', label: 'Total Amount', type: 'text', required: true, placeholder: 'e.g. $5,000' },
        { name: 'currency', label: 'Currency', type: 'select', required: false, options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'AED'] },
        { name: 'payment_terms', label: 'Payment Terms', type: 'select', required: false, options: ['Immediate', 'Net 15', 'Net 30', 'Net 45', 'Net 60', '50% upfront, 50% on delivery'] },
        { name: 'late_payment', label: 'Late Payment Clause', type: 'text', required: false, placeholder: 'e.g. 1.5% per month after due date' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Risk Assessment Report',
      slug: 'risk-assessment-report',
      icon: '⚠️',
      description: 'Generate structured financial risk assessments with mitigation strategies.',
      industryId: bySlug('finance'),
      systemPrompt: 'You are a risk management professional with expertise in financial risk analysis. You provide structured, objective risk assessments that help organizations understand their exposure and take informed mitigation steps.',
      userPromptTemplate: `Perform a {risk_type} risk assessment for:

Scenario / context: {scenario}
Business type: {business_type}
Time horizon: {time_horizon}
Risk appetite: {risk_appetite}

Provide:
1. **Risk Rating** (Low / Medium / High / Critical) with rationale
2. **Top 5 Risk Factors** with probability and impact scores
3. **Risk Matrix Summary**
4. **Recommended Mitigation Strategies** (at least 5)
5. **Monitoring KPIs** to track these risks`,
      fields: [
        { name: 'scenario', label: 'Business Scenario or Context', type: 'textarea', required: true, placeholder: 'Describe the business situation or decision being assessed...' },
        { name: 'risk_type', label: 'Risk Type', type: 'select', required: true, options: ['Market risk', 'Credit / default risk', 'Operational risk', 'Liquidity risk', 'Regulatory / compliance risk', 'Reputational risk', 'Comprehensive / all risk types'] },
        { name: 'business_type', label: 'Business Type', type: 'text', required: false, placeholder: 'e.g. SaaS startup, Manufacturing company' },
        { name: 'time_horizon', label: 'Time Horizon', type: 'select', required: false, options: ['Short-term (0-6 months)', 'Medium-term (6-18 months)', 'Long-term (18+ months)'] },
        { name: 'risk_appetite', label: 'Risk Appetite', type: 'select', required: false, options: ['Conservative', 'Moderate', 'Aggressive'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── MARKETING ────────────────────────────────────────────────────────────
    {
      name: 'Blog Post Writer',
      slug: 'blog-post-writer',
      icon: '✍️',
      description: 'Write engaging, SEO-optimized blog posts that rank and drive traffic.',
      industryId: bySlug('marketing'),
      systemPrompt: 'You are an expert content marketer and SEO specialist. You write engaging, well-researched blog posts that rank on Google and genuinely help readers. Your writing has a clear structure, uses storytelling, and balances education with entertainment. You integrate keywords naturally.',
      userPromptTemplate: `Write a {length} blog post:

Topic: {topic}
Primary keyword: {keyword}
Secondary keywords: {secondary_keywords}
Target audience: {audience}
Tone: {tone}
Unique angle: {angle}

Structure:
1. **SEO title** (with keyword, under 60 chars)
2. **Meta description** (with keyword, under 155 chars)
3. **Compelling intro** (hook + thesis + preview)
4. {num_sections} main sections with H2 headings
5. Practical examples or data points
6. **Conclusion** with key takeaways
7. **CTA** at end`,
      fields: [
        { name: 'topic', label: 'Blog Post Topic', type: 'text', required: true, placeholder: 'e.g. How to reduce customer churn in SaaS' },
        { name: 'keyword', label: 'Primary SEO Keyword', type: 'text', required: false, placeholder: 'e.g. customer retention strategies' },
        { name: 'secondary_keywords', label: 'Secondary Keywords (optional)', type: 'text', required: false, placeholder: 'Comma-separated secondary keywords' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. SaaS founders, marketing managers' },
        { name: 'length', label: 'Post Length', type: 'select', required: false, options: ['Short (400-600 words)', 'Medium (800-1000 words)', 'Long-form (1500-2000 words)'] },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Educational / informative', 'Conversational / friendly', 'Professional / authoritative', 'Thought leadership', 'Storytelling'] },
        { name: 'angle', label: 'Unique Angle or Hook', type: 'text', required: false, placeholder: 'e.g. contrarian take, data-driven, beginner guide, case study' },
        { name: 'num_sections', label: 'Number of Main Sections', type: 'select', required: false, options: ['3', '4', '5', '6'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Social Media Content Generator',
      slug: 'social-media-generator',
      icon: '📱',
      description: 'Create platform-native posts that drive engagement and build brand presence.',
      industryId: bySlug('marketing'),
      systemPrompt: 'You are a social media strategist who creates platform-native content that drives engagement. You understand each platform\'s culture, algorithms, and best practices. You write posts that feel authentic, not corporate, and always include a reason to engage.',
      userPromptTemplate: `Create {num_posts} social media posts:

Topic / product: {topic}
Platform: {platform}
Goal: {goal}
Brand voice: {brand_voice}
Include hashtags: {include_hashtags}
Include emoji: {include_emoji}

For each post:
- Label the **hook strategy** used
- Write the **full post content**
- Add platform-optimized **hashtags** (if requested)
- Suggest **best posting time**`,
      fields: [
        { name: 'topic', label: 'Topic, Product, or Campaign', type: 'text', required: true, placeholder: 'e.g. New product launch, Industry insight, Company milestone' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['LinkedIn', 'Twitter / X', 'Instagram', 'Facebook', 'Threads', 'YouTube (description)'] },
        { name: 'goal', label: 'Goal', type: 'select', required: false, options: ['Brand awareness', 'Engagement (likes/comments)', 'Drive traffic', 'Lead generation', 'Product launch', 'Thought leadership'] },
        { name: 'brand_voice', label: 'Brand Voice', type: 'select', required: false, options: ['Professional', 'Conversational / casual', 'Witty / humorous', 'Inspirational', 'Educational'] },
        { name: 'include_hashtags', label: 'Include Hashtags?', type: 'select', required: false, options: ['Yes', 'No'] },
        { name: 'include_emoji', label: 'Include Emoji?', type: 'select', required: false, options: ['Yes — moderate', 'Yes — lots', 'No emoji'] },
        { name: 'num_posts', label: 'Number of Posts', type: 'select', required: false, options: ['2', '3', '4', '5'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Email Marketing Sequence',
      slug: 'email-marketing-sequence',
      icon: '📧',
      description: 'Write complete email sequences that nurture leads and drive conversions.',
      industryId: bySlug('marketing'),
      systemPrompt: 'You are an email marketing strategist specializing in lifecycle email campaigns. You write sequences that nurture leads, convert prospects, and retain customers. Every email in your sequences has a single clear purpose and moves the reader toward the next step.',
      userPromptTemplate: `Write a {sequence_type} email sequence:

Product/Service: {product}
Target audience: {audience}
Sequence length: {num_emails} emails
Sending frequency: {frequency}
Main goal: {goal}
Key differentiators: {differentiators}
Final email CTA: {final_cta}

For each email provide:
1. **Day / Trigger** (when to send)
2. **Subject line** + preview text
3. **Full email body**
4. **CTA**
5. **Purpose** of this email in the sequence`,
      fields: [
        { name: 'product', label: 'Product or Service', type: 'text', required: true, placeholder: 'e.g. B2B SaaS tool, Online course, Consulting service' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. Marketing managers, startup founders' },
        { name: 'sequence_type', label: 'Sequence Type', type: 'select', required: true, options: ['Welcome sequence', 'Lead nurture', 'Product launch', 'Onboarding', 'Re-engagement / win-back', 'Post-purchase', 'Upsell / upgrade'] },
        { name: 'num_emails', label: 'Number of Emails', type: 'select', required: false, options: ['3', '4', '5', '6', '7'] },
        { name: 'frequency', label: 'Sending Frequency', type: 'select', required: false, options: ['Daily', 'Every 2 days', 'Every 3 days', 'Weekly'] },
        { name: 'goal', label: 'Primary Goal', type: 'text', required: true, placeholder: 'e.g. trial signup, purchase, book a call' },
        { name: 'differentiators', label: 'Key Differentiators / Value Props', type: 'textarea', required: false, placeholder: 'What makes your product stand out?' },
        { name: 'final_cta', label: 'Final Email CTA', type: 'text', required: false, placeholder: 'e.g. Book a demo, Start free trial' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── ACCOUNTING & TAX ─────────────────────────────────────────────────────
    {
      name: 'Tax Summary Generator',
      slug: 'tax-summary-generator',
      icon: '🧾',
      description: 'Generate clear tax summaries and filing guidance from financial data.',
      industryId: bySlug('accounting-tax'),
      systemPrompt: 'You are a chartered accountant and tax advisor. You produce clear, structured tax summaries that help clients understand their tax position, obligations, and next steps. You explain complex tax concepts in plain language while maintaining accuracy.',
      userPromptTemplate: `Generate a comprehensive tax summary for:

Taxpayer type: {taxpayer_type}
Financial year: {financial_year}
Income details: {income_details}
Deductions claimed: {deductions}
Country / jurisdiction: {jurisdiction}
Special circumstances: {special_notes}

Provide:
1. **Tax Position Overview** (estimated liability/refund)
2. **Income Breakdown** by category
3. **Eligible Deductions Summary**
4. **Key Filing Deadlines & Compliance Checklist**
5. **Tax Saving Recommendations**
6. **Next Steps**`,
      fields: [
        { name: 'taxpayer_type', label: 'Taxpayer Type', type: 'select', required: true, options: ['Individual (Salaried)', 'Individual (Self-employed)', 'Small Business / SME', 'Partnership Firm', 'Private Limited Company', 'Trust / NGO'] },
        { name: 'financial_year', label: 'Financial Year', type: 'text', required: true, placeholder: 'e.g. FY 2024-25, Tax Year 2024' },
        { name: 'income_details', label: 'Income Details', type: 'textarea', required: true, placeholder: 'Describe income sources and approximate amounts...' },
        { name: 'deductions', label: 'Deductions / Exemptions Claimed', type: 'textarea', required: false, placeholder: 'e.g. HRA, 80C, medical, home loan interest...' },
        { name: 'jurisdiction', label: 'Country / State', type: 'text', required: true, placeholder: 'e.g. India, USA - California, UK' },
        { name: 'special_notes', label: 'Special Circumstances (optional)', type: 'textarea', required: false, placeholder: 'e.g. Capital gains, foreign income, arrears...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'GST Invoice & Report Writer',
      slug: 'gst-invoice-report-writer',
      icon: '📑',
      description: 'Generate GST-compliant invoices, credit notes, and filing summaries.',
      industryId: bySlug('accounting-tax'),
      systemPrompt: 'You are a GST compliance expert and accounting professional. You generate precise, GST-compliant invoices, credit notes, and filing reports. You ensure all required fields are present and calculations are accurate.',
      userPromptTemplate: `Generate a GST {document_type} for:

Supplier name & GSTIN: {supplier_info}
Recipient name & GSTIN: {recipient_info}
Line items and amounts: {line_items}
GST rates applicable: {gst_rates}
Place of supply: {place_of_supply}
Invoice / reference date: {doc_date}

Provide: Complete formatted {document_type} with IGST/CGST/SGST breakdown, HSN/SAC codes section, total tax calculation, and a compliance checklist.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Tax Invoice', 'Credit Note', 'Debit Note', 'GST Filing Summary (GSTR-1)', 'GST Filing Summary (GSTR-3B)'] },
        { name: 'supplier_info', label: 'Supplier Name & GSTIN', type: 'text', required: true, placeholder: 'e.g. ABC Pvt Ltd, 29ABCDE1234F1Z5' },
        { name: 'recipient_info', label: 'Recipient Name & GSTIN', type: 'text', required: true, placeholder: 'e.g. XYZ Corp, 27XYZGH5678K2Z1' },
        { name: 'line_items', label: 'Line Items & Amounts', type: 'textarea', required: true, placeholder: 'List each item/service, quantity, rate, and amount...' },
        { name: 'gst_rates', label: 'GST Rate(s)', type: 'select', required: true, options: ['0%', '5%', '12%', '18%', '28%', 'Mixed rates'] },
        { name: 'place_of_supply', label: 'Place of Supply (State)', type: 'text', required: true, placeholder: 'e.g. Maharashtra, Karnataka' },
        { name: 'doc_date', label: 'Document Date', type: 'text', required: true, placeholder: 'e.g. 01 April 2025' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Compliance & Audit Checklist',
      slug: 'compliance-audit-checklist',
      icon: '✅',
      description: 'Generate comprehensive compliance and audit checklists for any business type.',
      industryId: bySlug('accounting-tax'),
      systemPrompt: 'You are a seasoned auditor and compliance officer. You produce thorough, actionable compliance and audit checklists that help businesses stay compliant, avoid penalties, and prepare for audits. You organize by category and priority.',
      userPromptTemplate: `Generate a {checklist_type} checklist for:

Business type: {business_type}
Jurisdiction: {jurisdiction}
Applicable regulations: {regulations}
Audit period: {period}
Specific areas of concern: {concerns}

Provide a categorized checklist with:
1. **Critical / High Priority items** (non-negotiable compliance)
2. **Regulatory Filings & Deadlines**
3. **Documentation Requirements**
4. **Internal Controls Verification**
5. **Penalties for Non-compliance** (where applicable)
6. **Recommended Actions Before Audit**`,
      fields: [
        { name: 'checklist_type', label: 'Checklist Type', type: 'select', required: true, options: ['Annual Tax Compliance', 'GST Audit', 'Statutory Audit', 'Internal Audit', 'ROC Compliance', 'Payroll Compliance'] },
        { name: 'business_type', label: 'Business Type', type: 'text', required: true, placeholder: 'e.g. Private Limited Company, LLP, Proprietorship' },
        { name: 'jurisdiction', label: 'Country / State', type: 'text', required: true, placeholder: 'e.g. India, UK, USA' },
        { name: 'regulations', label: 'Applicable Regulations', type: 'text', required: false, placeholder: 'e.g. Companies Act 2013, GST Act, Income Tax Act' },
        { name: 'period', label: 'Audit / Compliance Period', type: 'text', required: true, placeholder: 'e.g. FY 2024-25' },
        { name: 'concerns', label: 'Specific Areas of Concern', type: 'textarea', required: false, placeholder: 'Any known gaps or focus areas...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── AUTOMOTIVE ───────────────────────────────────────────────────────────
    {
      name: 'Vehicle Inspection Report',
      slug: 'vehicle-inspection-report',
      icon: '🔧',
      description: 'Generate detailed, professional vehicle inspection reports for dealers and mechanics.',
      industryId: bySlug('automotive'),
      systemPrompt: 'You are an automotive technician and vehicle inspection specialist. You produce clear, detailed, and professional vehicle inspection reports that help customers understand their vehicle\'s condition and required maintenance. You are objective, thorough, and safety-focused.',
      userPromptTemplate: `Generate a vehicle inspection report for:

Vehicle details: {vehicle_details}
Current mileage/odometer: {mileage}
Inspection type: {inspection_type}
Findings and observations: {findings}
Customer name: {customer_name}
Inspection date: {inspection_date}

Provide:
1. **Vehicle Summary**
2. **Inspection Results by Category** (Engine, Brakes, Tyres, Electrical, Body, Safety)
3. **Condition Rating** (Good / Fair / Needs Attention / Critical) per category
4. **Immediate Safety Concerns** (if any)
5. **Recommended Repairs** with estimated priority
6. **Next Service Due** recommendation`,
      fields: [
        { name: 'vehicle_details', label: 'Vehicle Make, Model & Year', type: 'text', required: true, placeholder: 'e.g. 2020 Maruti Suzuki Swift, White' },
        { name: 'mileage', label: 'Current Mileage / Odometer', type: 'text', required: true, placeholder: 'e.g. 45,000 km' },
        { name: 'inspection_type', label: 'Inspection Type', type: 'select', required: true, options: ['Pre-purchase inspection', 'Periodic service check', 'Post-accident assessment', 'Annual roadworthiness', 'Pre-sale inspection'] },
        { name: 'findings', label: 'Technician Findings & Observations', type: 'textarea', required: true, placeholder: 'Describe what was found during inspection...' },
        { name: 'customer_name', label: 'Customer Name', type: 'text', required: false, placeholder: 'Vehicle owner name' },
        { name: 'inspection_date', label: 'Inspection Date', type: 'text', required: false, placeholder: 'e.g. 01 May 2025' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Car Service Reminder & Communication',
      slug: 'car-service-reminder',
      icon: '📅',
      description: 'Write personalized service reminders and customer follow-up communications.',
      industryId: bySlug('automotive'),
      systemPrompt: 'You are an automotive service advisor who writes personalized, professional customer communications. You balance technical accuracy with customer-friendly language, always making service needs clear and the booking process easy.',
      userPromptTemplate: `Write a {communication_type} for:

Customer name: {customer_name}
Vehicle: {vehicle}
Last service date/mileage: {last_service}
Service due: {service_due}
Dealership / workshop name: {dealer_name}
Special offer or note: {offer}

Write a warm, professional message that: clearly states what service is due, creates appropriate urgency, and includes an easy call-to-action. Keep it under 150 words.`,
      fields: [
        { name: 'communication_type', label: 'Communication Type', type: 'select', required: true, options: ['Service due SMS / WhatsApp', 'Service reminder email', 'Post-service thank you email', 'Insurance renewal reminder', 'Recall / safety notice'] },
        { name: 'customer_name', label: 'Customer Name', type: 'text', required: true, placeholder: 'e.g. Mr. Ravi Sharma' },
        { name: 'vehicle', label: 'Vehicle Details', type: 'text', required: true, placeholder: 'e.g. Hyundai Creta - MH12AB1234' },
        { name: 'last_service', label: 'Last Service Info', type: 'text', required: false, placeholder: 'e.g. 6 months ago / 40,000 km' },
        { name: 'service_due', label: 'Service / Action Due', type: 'text', required: true, placeholder: 'e.g. 45,000 km service, tyre rotation, insurance renewal' },
        { name: 'dealer_name', label: 'Dealership / Workshop Name', type: 'text', required: false, placeholder: 'Your business name' },
        { name: 'offer', label: 'Special Offer / Note (optional)', type: 'text', required: false, placeholder: 'e.g. 10% off labour, free pickup & drop' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Used Car Listing Generator',
      slug: 'used-car-listing-generator',
      icon: '🚗',
      description: 'Create compelling used car listings that attract serious buyers.',
      industryId: bySlug('automotive'),
      systemPrompt: 'You are an automotive sales copywriter who creates compelling, accurate used car listings. You highlight the key selling points, build buyer confidence, and present vehicle condition honestly while making the car sound attractive.',
      userPromptTemplate: `Create a used car listing for:

Vehicle: {vehicle_details}
Year: {year}
Mileage: {mileage}
Condition: {condition}
Service history: {service_history}
Key features: {features}
Asking price: {price}
Reason for selling: {reason}
Contact / location: {contact}

Provide:
1. **Eye-catching headline**
2. **Compelling description** (150-200 words)
3. **Key specs bullet list**
4. **What's included / extras**
5. **Seller's note** (builds trust)`,
      fields: [
        { name: 'vehicle_details', label: 'Make, Model, Variant & Color', type: 'text', required: true, placeholder: 'e.g. 2019 Honda City ZX, Pearl White' },
        { name: 'year', label: 'Year of Manufacture', type: 'text', required: true, placeholder: 'e.g. 2019' },
        { name: 'mileage', label: 'Mileage / Odometer', type: 'text', required: true, placeholder: 'e.g. 38,000 km' },
        { name: 'condition', label: 'Condition', type: 'select', required: true, options: ['Excellent — like new', 'Very good — minor wear', 'Good — normal wear', 'Fair — visible wear', 'Needs work'] },
        { name: 'service_history', label: 'Service History', type: 'select', required: false, options: ['Full dealer service history', 'Partial service records', 'Recently serviced', 'No records available'] },
        { name: 'features', label: 'Key Features & Modifications', type: 'textarea', required: true, placeholder: 'List standout features...' },
        { name: 'price', label: 'Asking Price', type: 'text', required: true, placeholder: 'e.g. ₹7,50,000 / $12,000' },
        { name: 'reason', label: 'Reason for Selling (optional)', type: 'text', required: false, placeholder: 'e.g. Upgrading to SUV' },
        { name: 'contact', label: 'Contact / Location Info', type: 'text', required: false, placeholder: 'City name or contact details' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── CYBERSECURITY ────────────────────────────────────────────────────────
    {
      name: 'Incident Response Report',
      slug: 'incident-response-report',
      icon: '🚨',
      description: 'Generate structured cybersecurity incident reports with root cause and remediation.',
      industryId: bySlug('cybersecurity'),
      systemPrompt: 'You are a cybersecurity incident response specialist. You produce clear, structured incident reports that document what happened, the impact, root cause, and remediation steps. Your reports are suitable for executive, technical, and regulatory audiences.',
      userPromptTemplate: `Generate a cybersecurity incident report for:

Incident type: {incident_type}
Date/time of detection: {detection_time}
Affected systems: {affected_systems}
Incident description: {description}
Impact assessment: {impact}
Actions taken so far: {actions_taken}
Report audience: {audience}

Provide:
1. **Executive Summary**
2. **Incident Timeline**
3. **Technical Details & Attack Vector**
4. **Impact Assessment** (data, operations, financial, reputational)
5. **Root Cause Analysis**
6. **Immediate Containment Actions**
7. **Remediation & Recovery Plan**
8. **Lessons Learned & Preventive Measures**
9. **Regulatory Notification Requirements** (if applicable)`,
      fields: [
        { name: 'incident_type', label: 'Incident Type', type: 'select', required: true, options: ['Data breach / data leak', 'Ransomware attack', 'Phishing / social engineering', 'DDoS attack', 'Unauthorized access', 'Malware infection', 'Insider threat', 'Third-party / supply chain compromise'] },
        { name: 'detection_time', label: 'Date & Time of Detection', type: 'text', required: true, placeholder: 'e.g. 2025-05-10 at 14:32 IST' },
        { name: 'affected_systems', label: 'Affected Systems / Assets', type: 'textarea', required: true, placeholder: 'List affected servers, applications, data sets...' },
        { name: 'description', label: 'Incident Description', type: 'textarea', required: true, placeholder: 'Describe what happened in as much detail as known...' },
        { name: 'impact', label: 'Impact Assessment', type: 'textarea', required: true, placeholder: 'Business impact, data exposure, number of users affected...' },
        { name: 'actions_taken', label: 'Actions Already Taken', type: 'textarea', required: false, placeholder: 'Containment, isolation, patches applied so far...' },
        { name: 'audience', label: 'Report Audience', type: 'select', required: false, options: ['Executive / Board', 'Technical team', 'Regulatory body / CERT', 'Legal & compliance', 'Clients / customers'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Security Policy Generator',
      slug: 'security-policy-generator',
      icon: '📋',
      description: 'Draft comprehensive security policies tailored to your organization.',
      industryId: bySlug('cybersecurity'),
      systemPrompt: 'You are a cybersecurity policy expert and CISO advisor. You draft clear, comprehensive security policies that are practical to implement, aligned with industry standards (ISO 27001, NIST, SOC2), and written in accessible language for both technical and non-technical staff.',
      userPromptTemplate: `Draft a {policy_type} policy for:

Organization type: {org_type}
Organization size: {org_size}
Industry / regulatory environment: {industry}
Key assets to protect: {assets}
Existing frameworks: {frameworks}
Special requirements: {requirements}

Provide a complete policy document with:
1. **Policy Statement & Purpose**
2. **Scope**
3. **Roles & Responsibilities**
4. **Policy Rules** (detailed, actionable)
5. **Compliance & Enforcement**
6. **Review Schedule**
7. **Related Policies & References**`,
      fields: [
        { name: 'policy_type', label: 'Policy Type', type: 'select', required: true, options: ['Acceptable Use Policy', 'Password & Authentication Policy', 'Data Classification Policy', 'Remote Work & BYOD Policy', 'Incident Response Policy', 'Third-party / Vendor Security Policy', 'Data Retention & Disposal Policy', 'Access Control Policy'] },
        { name: 'org_type', label: 'Organization Type', type: 'text', required: true, placeholder: 'e.g. Fintech startup, Healthcare provider, Government agency' },
        { name: 'org_size', label: 'Organization Size', type: 'select', required: false, options: ['1-50 employees', '51-250 employees', '251-1000 employees', '1000+ employees'] },
        { name: 'industry', label: 'Industry & Regulatory Context', type: 'text', required: false, placeholder: 'e.g. HIPAA, PCI-DSS, GDPR, RBI guidelines' },
        { name: 'assets', label: 'Key Assets to Protect', type: 'textarea', required: false, placeholder: 'e.g. customer PII, financial data, intellectual property' },
        { name: 'frameworks', label: 'Existing Frameworks / Standards', type: 'text', required: false, placeholder: 'e.g. ISO 27001, NIST CSF, SOC 2' },
        { name: 'requirements', label: 'Special Requirements (optional)', type: 'textarea', required: false, placeholder: 'Any unique org requirements or exceptions...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Security Awareness Training Content',
      slug: 'security-awareness-content',
      icon: '🎓',
      description: 'Create engaging cybersecurity awareness training material for employees.',
      industryId: bySlug('cybersecurity'),
      systemPrompt: 'You are a cybersecurity trainer and educator who creates engaging awareness content that employees actually read and remember. You use real-world examples, clear explanations, and practical tips. You avoid jargon and focus on behavior change.',
      userPromptTemplate: `Create security awareness training content on:

Topic: {topic}
Target audience: {audience}
Format: {format}
Organization type: {org_type}
Recent threat context: {threat_context}
Tone: {tone}

Include:
1. **Why This Matters** (relatable scenario or recent example)
2. **Key Concepts** (explained simply)
3. **Real-world Attack Examples**
4. **What To Do** (clear, actionable steps)
5. **What NOT To Do** (common mistakes)
6. **Quick Reference Checklist**
7. **Quiz Questions** (3-5 multiple choice)`,
      fields: [
        { name: 'topic', label: 'Training Topic', type: 'select', required: true, options: ['Phishing & Social Engineering', 'Password Best Practices', 'Safe Remote Working', 'Mobile Device Security', 'Data Handling & Classification', 'Physical Security', 'Ransomware Prevention', 'Safe Web Browsing'] },
        { name: 'audience', label: 'Target Audience', type: 'select', required: true, options: ['All employees (general)', 'Technical/IT staff', 'Finance & accounting team', 'Executives & managers', 'New hires / onboarding', 'Remote workers'] },
        { name: 'format', label: 'Content Format', type: 'select', required: true, options: ['Training module / guide', 'Email newsletter', 'Quick tip cards (5 bullet points)', 'Awareness poster text', 'Short video script'] },
        { name: 'org_type', label: 'Organization Type', type: 'text', required: false, placeholder: 'e.g. Bank, Hospital, Software company' },
        { name: 'threat_context', label: 'Recent Threat or Incident Context', type: 'textarea', required: false, placeholder: 'Any recent incidents or threats to reference...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Professional & formal', 'Friendly & conversational', 'Urgent & direct', 'Storytelling / scenario-based'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── HEALTHCARE ───────────────────────────────────────────────────────────
    {
      name: 'Patient Discharge Summary',
      slug: 'patient-discharge-summary',
      icon: '🏥',
      description: 'Generate clear, complete patient discharge summaries for clinical records.',
      industryId: bySlug('healthcare'),
      systemPrompt: 'You are a clinical documentation specialist with expertise in medical record writing. You produce accurate, comprehensive discharge summaries that meet clinical standards, include all critical information, and are clear for both clinical and non-clinical audiences.',
      userPromptTemplate: `Generate a patient discharge summary for:

Patient details (anonymized): {patient_details}
Admission date & diagnosis: {admission_info}
Treatment provided: {treatment}
Procedures performed: {procedures}
Medications at discharge: {medications}
Follow-up instructions: {followup}
Attending physician: {physician}

Provide a structured discharge summary with:
1. **Patient & Admission Overview**
2. **Principal Diagnosis & Secondary Diagnoses**
3. **Treatment Summary**
4. **Procedures Performed**
5. **Discharge Condition**
6. **Discharge Medications** (name, dose, frequency, duration)
7. **Follow-up Appointments & Instructions**
8. **Activity & Diet Restrictions**
9. **Warning Signs — When to Seek Immediate Care**`,
      fields: [
        { name: 'patient_details', label: 'Patient Details (anonymized)', type: 'text', required: true, placeholder: 'Age, gender, e.g. 45-year-old male' },
        { name: 'admission_info', label: 'Admission Date & Presenting Diagnosis', type: 'textarea', required: true, placeholder: 'Admission date and reason/diagnosis...' },
        { name: 'treatment', label: 'Treatment Provided', type: 'textarea', required: true, placeholder: 'Medications given, therapies, interventions...' },
        { name: 'procedures', label: 'Procedures Performed', type: 'textarea', required: false, placeholder: 'Surgeries, lab tests, imaging, etc...' },
        { name: 'medications', label: 'Discharge Medications', type: 'textarea', required: true, placeholder: 'Drug name, dose, frequency, duration for each...' },
        { name: 'followup', label: 'Follow-up Instructions', type: 'textarea', required: true, placeholder: 'Next appointment, care instructions, restrictions...' },
        { name: 'physician', label: 'Attending Physician / Department', type: 'text', required: false, placeholder: 'Dr. Name, Department' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Medical Report Simplifier',
      slug: 'medical-report-simplifier',
      icon: '🔬',
      description: 'Translate complex medical reports into clear, patient-friendly language.',
      industryId: bySlug('healthcare'),
      systemPrompt: 'You are a patient education specialist who translates complex medical reports and findings into clear, reassuring, and accurate patient-friendly language. You never provide diagnoses or replace doctor advice, but you help patients understand what they have been told.',
      userPromptTemplate: `Simplify this medical report/result for a patient:

Report type: {report_type}
Medical content: {medical_content}
Patient background: {patient_background}
Questions patient may have: {patient_questions}

Provide:
1. **What This Report Shows** (in plain language)
2. **Key Findings Explained** (term by term if needed)
3. **What the Numbers/Values Mean** (normal vs. flagged)
4. **What This Could Mean for You** (general, not diagnostic)
5. **Questions to Ask Your Doctor**
6. **Important Disclaimer** (encourage following doctor's advice)`,
      fields: [
        { name: 'report_type', label: 'Report Type', type: 'select', required: true, options: ['Blood test / CBC report', 'Radiology report (X-ray, MRI, CT)', 'Pathology / biopsy report', 'ECG / echocardiogram report', 'Prescription / medication plan', 'Other clinical report'] },
        { name: 'medical_content', label: 'Medical Report Content', type: 'textarea', required: true, placeholder: 'Paste the medical report text here...' },
        { name: 'patient_background', label: 'Patient Background (optional)', type: 'text', required: false, placeholder: 'e.g. 60-year-old diabetic, no prior heart issues' },
        { name: 'patient_questions', label: 'Patient\'s Main Concerns', type: 'textarea', required: false, placeholder: 'What is the patient most worried about or confused by?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Health & Wellness Content Writer',
      slug: 'health-wellness-content',
      icon: '💊',
      description: 'Write accurate, engaging health content for patients and wellness audiences.',
      industryId: bySlug('healthcare'),
      systemPrompt: 'You are a medical writer and health content specialist. You produce accurate, evidence-based health and wellness content that is engaging, accessible, and responsible. You always include appropriate disclaimers and encourage professional medical consultation.',
      userPromptTemplate: `Write health/wellness content on:

Topic: {topic}
Content type: {content_type}
Target audience: {audience}
Key messages to convey: {key_messages}
Tone: {tone}
Word count: {word_count}

Provide the full content with:
- Clear, jargon-free language
- Evidence-based information
- Practical, actionable tips
- Appropriate medical disclaimer
- CTA (consult a doctor / book appointment)`,
      fields: [
        { name: 'topic', label: 'Health Topic', type: 'text', required: true, placeholder: 'e.g. Managing Type 2 Diabetes, Postpartum recovery, Hypertension diet' },
        { name: 'content_type', label: 'Content Type', type: 'select', required: true, options: ['Patient education leaflet', 'Blog article', 'Social media post', 'FAQ sheet', 'Email newsletter', 'Wellness tips card'] },
        { name: 'audience', label: 'Target Audience', type: 'select', required: true, options: ['General public', 'Patients with a specific condition', 'Senior citizens', 'Parents / caregivers', 'Fitness enthusiasts', 'Healthcare professionals'] },
        { name: 'key_messages', label: 'Key Messages to Include', type: 'textarea', required: false, placeholder: 'Key points, facts, or calls to action you want covered...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Reassuring & supportive', 'Educational & informative', 'Motivational', 'Clinical & precise'] },
        { name: 'word_count', label: 'Approximate Length', type: 'select', required: false, options: ['Short (150-250 words)', 'Medium (400-600 words)', 'Long (800-1200 words)'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── RETAIL ───────────────────────────────────────────────────────────────
    {
      name: 'Promotional Offer Copy',
      slug: 'promotional-offer-copy',
      icon: '🏷️',
      description: 'Write compelling promotional content for in-store and digital retail campaigns.',
      industryId: bySlug('retail'),
      systemPrompt: 'You are a retail marketing copywriter specializing in promotional campaigns. You create urgency, communicate value clearly, and drive foot traffic and online conversions. You understand retail psychology and write copy that converts browsers into buyers.',
      userPromptTemplate: `Write promotional copy for:

Promotion type: {promo_type}
Product(s) / category: {products}
Discount or offer: {offer_details}
Target customer: {target_customer}
Duration: {duration}
Channel: {channel}
Brand tone: {brand_tone}

Provide:
1. **Main Headline** (punchy, benefit-led)
2. **Subheadline** (offer clarity)
3. **Body Copy** (100-150 words max)
4. **Urgency Line** (creates FOMO)
5. **CTA** (clear action)
6. **3 Social Media Caption Variations** (short)`,
      fields: [
        { name: 'promo_type', label: 'Promotion Type', type: 'select', required: true, options: ['Weekend sale', 'Festival / seasonal sale', 'Flash sale', 'Buy 1 Get 1', 'New arrival launch', 'Clearance sale', 'Member exclusive offer', 'Grand opening'] },
        { name: 'products', label: 'Products / Category', type: 'text', required: true, placeholder: 'e.g. Men\'s footwear, Electronics, Grocery essentials' },
        { name: 'offer_details', label: 'Offer / Discount Details', type: 'text', required: true, placeholder: 'e.g. Up to 50% off, Free gift with purchase above ₹1000' },
        { name: 'target_customer', label: 'Target Customer', type: 'text', required: false, placeholder: 'e.g. Young professionals, families, students' },
        { name: 'duration', label: 'Promotion Duration', type: 'text', required: false, placeholder: 'e.g. This weekend only, 5-7 May 2025' },
        { name: 'channel', label: 'Channel', type: 'select', required: false, options: ['In-store signage', 'Email newsletter', 'WhatsApp / SMS', 'Social media', 'Website banner', 'All channels'] },
        { name: 'brand_tone', label: 'Brand Tone', type: 'select', required: false, options: ['Energetic / bold', 'Friendly / warm', 'Premium / aspirational', 'Budget-friendly / value', 'Festive / celebratory'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Customer Loyalty Email',
      slug: 'customer-loyalty-email',
      icon: '🎁',
      description: 'Write personalized loyalty program emails that retain and reward customers.',
      industryId: bySlug('retail'),
      systemPrompt: 'You are a retail CRM and loyalty marketing specialist. You write personalized emails that make customers feel valued, communicate their loyalty benefits clearly, and drive repeat purchases. Your emails feel personal, not automated.',
      userPromptTemplate: `Write a loyalty program email:

Email purpose: {email_purpose}
Customer name: {customer_name}
Points / tier status: {loyalty_status}
Reward or offer available: {reward}
Store / brand name: {brand_name}
Expiry or urgency: {expiry}

Write a warm, personalized email (under 200 words) that makes the customer feel valued and creates a reason to return. Include subject line, preview text, email body, and CTA.`,
      fields: [
        { name: 'email_purpose', label: 'Email Purpose', type: 'select', required: true, options: ['Points earned notification', 'Reward ready to redeem', 'Tier upgrade congratulations', 'Birthday / anniversary reward', 'Points expiry reminder', 'Welcome to loyalty program', 'Win-back lapsed member'] },
        { name: 'customer_name', label: 'Customer First Name', type: 'text', required: true, placeholder: 'e.g. Priya' },
        { name: 'loyalty_status', label: 'Points or Tier Status', type: 'text', required: false, placeholder: 'e.g. 2,450 points | Gold member' },
        { name: 'reward', label: 'Reward or Offer', type: 'text', required: true, placeholder: 'e.g. ₹500 off your next purchase, Free delivery' },
        { name: 'brand_name', label: 'Store / Brand Name', type: 'text', required: true, placeholder: 'Your store name' },
        { name: 'expiry', label: 'Expiry or Urgency (optional)', type: 'text', required: false, placeholder: 'e.g. Valid until 31 May 2025' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },

    // ─── LOGISTICS & SUPPLY CHAIN ─────────────────────────────────────────────
    {
      name: 'Shipment Status Update',
      slug: 'shipment-status-update',
      icon: '📦',
      description: 'Generate professional shipment and delivery update communications.',
      industryId: bySlug('logistics'),
      systemPrompt: 'You are a logistics communications specialist. You produce clear, professional shipment and delivery updates that keep customers and stakeholders informed, manage expectations, and maintain trust even in case of delays.',
      userPromptTemplate: `Generate a {update_type} for:

Order / shipment reference: {reference}
Customer / recipient name: {recipient}
Origin: {origin}
Destination: {destination}
Current status: {current_status}
Estimated delivery: {eta}
Delay or issue (if any): {issue}
Company name: {company}

Provide a professional update covering: current status, location, reason for delay (if applicable), revised ETA, and next steps. Tone should match the situation — positive for on-time, empathetic for delays.`,
      fields: [
        { name: 'update_type', label: 'Update Type', type: 'select', required: true, options: ['Order confirmed / dispatched', 'In transit update', 'Out for delivery', 'Delivery successful', 'Delay notification', 'Exception / issue alert', 'Return / pickup scheduled'] },
        { name: 'reference', label: 'Order / AWB Reference', type: 'text', required: true, placeholder: 'e.g. ORD-20250501-7823' },
        { name: 'recipient', label: 'Customer / Recipient Name', type: 'text', required: true, placeholder: 'Customer name' },
        { name: 'origin', label: 'Origin Location', type: 'text', required: false, placeholder: 'e.g. Mumbai Warehouse' },
        { name: 'destination', label: 'Destination', type: 'text', required: true, placeholder: 'e.g. Bengaluru — 560001' },
        { name: 'current_status', label: 'Current Status', type: 'textarea', required: true, placeholder: 'Where is the shipment now? What\'s happening?' },
        { name: 'eta', label: 'Expected Delivery Date / Time', type: 'text', required: false, placeholder: 'e.g. 3 May 2025 by 6 PM' },
        { name: 'issue', label: 'Delay / Exception Details (if any)', type: 'textarea', required: false, placeholder: 'Describe any delay reason...' },
        { name: 'company', label: 'Company / Courier Name', type: 'text', required: false, placeholder: 'Your company name' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Supplier Communication Writer',
      slug: 'supplier-communication-writer',
      icon: '🤝',
      description: 'Draft professional supplier and vendor communications for supply chain operations.',
      industryId: bySlug('logistics'),
      systemPrompt: 'You are a supply chain procurement professional. You draft clear, professional communications with suppliers and vendors that are firm yet collaborative, protect your organization\'s interests, and maintain long-term relationships.',
      userPromptTemplate: `Write a supplier communication:

Communication type: {comm_type}
Your company: {your_company}
Supplier / vendor: {supplier}
Product / service involved: {product}
Key details: {details}
Tone required: {tone}

Write a professional, concise communication that clearly states the purpose, necessary details, and expected response or action. Include subject line for email format.`,
      fields: [
        { name: 'comm_type', label: 'Communication Type', type: 'select', required: true, options: ['Purchase order', 'RFQ (Request for Quote)', 'Delivery delay complaint', 'Quality issue notice', 'Contract renewal discussion', 'Price renegotiation', 'Supplier onboarding welcome', 'Termination / end of contract notice'] },
        { name: 'your_company', label: 'Your Company Name', type: 'text', required: true, placeholder: 'Your organization name' },
        { name: 'supplier', label: 'Supplier / Vendor Name', type: 'text', required: true, placeholder: 'Supplier company name' },
        { name: 'product', label: 'Product / Service', type: 'text', required: true, placeholder: 'e.g. Raw materials, packaging, logistics service' },
        { name: 'details', label: 'Key Details & Context', type: 'textarea', required: true, placeholder: 'Quantities, dates, prices, issues, or specific requirements...' },
        { name: 'tone', label: 'Required Tone', type: 'select', required: false, options: ['Formal & firm', 'Collaborative & professional', 'Urgent', 'Diplomatic / problem-solving', 'Friendly partner tone'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Supply Chain Risk Report',
      slug: 'supply-chain-risk-report',
      icon: '⚠️',
      description: 'Generate supply chain risk assessments and mitigation plans.',
      industryId: bySlug('logistics'),
      systemPrompt: 'You are a supply chain risk management consultant. You produce structured, actionable risk assessments that identify vulnerabilities in supply chains, quantify potential impacts, and provide practical mitigation strategies.',
      userPromptTemplate: `Generate a supply chain risk assessment for:

Industry / product type: {industry}
Supply chain scope: {scope}
Key risks identified: {risks}
Geographic exposure: {geography}
Current mitigation in place: {current_mitigation}
Assessment period: {period}

Provide:
1. **Risk Summary Dashboard** (top 5 risks rated by likelihood & impact)
2. **Detailed Risk Analysis** per risk
3. **Supplier Concentration Risk** evaluation
4. **Geographic & Geopolitical Risk**
5. **Mitigation Strategies** (immediate & long-term)
6. **KPIs to Monitor**
7. **Business Continuity Recommendations**`,
      fields: [
        { name: 'industry', label: 'Industry / Product Type', type: 'text', required: true, placeholder: 'e.g. Electronics manufacturing, FMCG, Pharmaceuticals' },
        { name: 'scope', label: 'Supply Chain Scope', type: 'textarea', required: true, placeholder: 'Describe your supply chain — key suppliers, regions, stages...' },
        { name: 'risks', label: 'Key Risks Identified', type: 'textarea', required: true, placeholder: 'List known or potential risks...' },
        { name: 'geography', label: 'Geographic Exposure', type: 'text', required: false, placeholder: 'e.g. Heavily dependent on China for raw materials' },
        { name: 'current_mitigation', label: 'Current Mitigation Measures', type: 'textarea', required: false, placeholder: 'What is already in place...' },
        { name: 'period', label: 'Assessment Period', type: 'text', required: false, placeholder: 'e.g. Q2 2025, FY 2025-26' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── AGRICULTURE ──────────────────────────────────────────────────────────
    {
      name: 'Crop Report Writer',
      slug: 'crop-report-writer',
      icon: '🌾',
      description: 'Generate detailed crop analysis reports and farming season summaries.',
      industryId: bySlug('agriculture'),
      systemPrompt: 'You are an agricultural scientist and farm management expert. You write clear, data-driven crop reports that help farmers and agribusinesses understand crop health, yield estimates, and improvement opportunities. You balance scientific accuracy with practical farmer-friendly language.',
      userPromptTemplate: `Write a crop report for:

Crop type: {crop_type}
Farm / region: {region}
Growing season: {season}
Observations and data: {observations}
Soil / weather conditions: {conditions}
Issues or challenges: {challenges}
Audience: {audience}

Provide:
1. **Season Overview**
2. **Crop Health Assessment**
3. **Yield Estimate vs. Benchmark**
4. **Key Challenges Encountered** with analysis
5. **Soil & Weather Impact**
6. **Pest & Disease Summary** (if applicable)
7. **Recommendations for Next Season**
8. **Market Outlook** (brief, where relevant)`,
      fields: [
        { name: 'crop_type', label: 'Crop Type', type: 'text', required: true, placeholder: 'e.g. Wheat, Cotton, Tomato, Sugarcane' },
        { name: 'region', label: 'Farm / Region', type: 'text', required: true, placeholder: 'e.g. Vidarbha, Maharashtra / Punjab, India' },
        { name: 'season', label: 'Growing Season', type: 'text', required: true, placeholder: 'e.g. Kharif 2025, Rabi 2024-25' },
        { name: 'observations', label: 'Field Observations & Data', type: 'textarea', required: true, placeholder: 'Describe what you observed — growth stage, yield data, inputs used...' },
        { name: 'conditions', label: 'Soil & Weather Conditions', type: 'textarea', required: false, placeholder: 'Rainfall, temperature, soil health observations...' },
        { name: 'challenges', label: 'Challenges Faced', type: 'textarea', required: false, placeholder: 'Pests, disease, drought, flooding, input shortages...' },
        { name: 'audience', label: 'Report Audience', type: 'select', required: false, options: ['Farmer (practical focus)', 'Agribusiness / corporate', 'Government / extension officer', 'Investor / financier'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Farm Advisory Generator',
      slug: 'farm-advisory-generator',
      icon: '🌱',
      description: 'Generate personalized farming advisories with actionable recommendations.',
      industryId: bySlug('agriculture'),
      systemPrompt: 'You are an agricultural extension officer and farm advisor with expertise in sustainable farming practices. You provide practical, locally relevant, and science-based farming advisories that help farmers improve yield, reduce costs, and farm sustainably.',
      userPromptTemplate: `Generate a farming advisory for:

Crop: {crop}
Farming stage: {stage}
Region and climate: {region}
Current issues or query: {issue}
Farm size: {farm_size}
Farming method: {farming_method}

Provide a clear advisory covering:
1. **Current Stage Overview** and what to expect
2. **Immediate Action Items** (this week)
3. **Crop Nutrition** recommendations
4. **Water Management** guidance
5. **Pest & Disease Watch** for this stage
6. **Weather-based Precautions**
7. **Upcoming Stage Preparation**
8. **Cost-saving Tips**`,
      fields: [
        { name: 'crop', label: 'Crop', type: 'text', required: true, placeholder: 'e.g. Rice, Mango, Potato' },
        { name: 'stage', label: 'Current Growing Stage', type: 'select', required: true, options: ['Land preparation', 'Sowing / transplanting', 'Vegetative growth', 'Flowering', 'Fruiting / pod fill', 'Ripening / maturity', 'Harvest', 'Post-harvest storage'] },
        { name: 'region', label: 'Region & Climate', type: 'text', required: true, placeholder: 'e.g. Coastal Karnataka, semi-arid climate' },
        { name: 'issue', label: 'Current Issue or Question', type: 'textarea', required: true, placeholder: 'What specific problem or question does the farmer have?' },
        { name: 'farm_size', label: 'Farm Size (optional)', type: 'text', required: false, placeholder: 'e.g. 2 acres, 10 hectares' },
        { name: 'farming_method', label: 'Farming Method', type: 'select', required: false, options: ['Conventional / traditional', 'Organic', 'Integrated farming', 'Hydroponic / protected cultivation', 'Drip irrigation-based'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },

    // ─── SOFTWARE DEVELOPMENT / IT ────────────────────────────────────────────
    {
      name: 'Code Review Feedback Generator',
      slug: 'code-review-feedback',
      icon: '👨‍💻',
      description: 'Generate structured, constructive code review feedback for any codebase.',
      industryId: bySlug('software-it'),
      systemPrompt: 'You are a senior software engineer and code reviewer with expertise across multiple languages and paradigms. You provide structured, constructive code review feedback that identifies issues, explains the why, and suggests improvements. You are thorough but respectful, and your reviews help developers grow.',
      userPromptTemplate: `Review this code and provide structured feedback:

Language / framework: {language}
Code snippet:
{code}

Context / purpose: {context}
Review focus: {focus}
Developer level: {dev_level}

Provide:
1. **Overall Assessment** (quality rating with brief rationale)
2. **Critical Issues** (bugs, security vulnerabilities, must-fix)
3. **Code Quality Feedback** (readability, maintainability, naming)
4. **Performance Considerations**
5. **Best Practice Violations** with suggestions
6. **Positive Highlights** (what was done well)
7. **Refactored Code Snippets** (for key improvements)
8. **Summary & Priority Actions**`,
      fields: [
        { name: 'language', label: 'Language / Framework', type: 'text', required: true, placeholder: 'e.g. TypeScript / React, Python / Django, Java / Spring Boot' },
        { name: 'code', label: 'Code to Review', type: 'textarea', required: true, placeholder: 'Paste your code here...' },
        { name: 'context', label: 'Code Purpose / Context', type: 'textarea', required: false, placeholder: 'What does this code do? Any relevant context...' },
        { name: 'focus', label: 'Review Focus', type: 'select', required: false, options: ['General full review', 'Security-focused', 'Performance optimization', 'Readability & maintainability', 'API design', 'Database queries', 'Error handling'] },
        { name: 'dev_level', label: 'Developer Experience Level', type: 'select', required: false, options: ['Junior developer', 'Mid-level developer', 'Senior developer', 'Unknown'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Technical Documentation Writer',
      slug: 'technical-documentation-writer',
      icon: '📖',
      description: 'Write clear, comprehensive technical documentation for APIs, systems, and software.',
      industryId: bySlug('software-it'),
      systemPrompt: 'You are a technical writer specializing in software documentation. You produce clear, accurate, and developer-friendly documentation that reduces support load and improves adoption. You know when to use code examples, diagrams descriptions, and plain language.',
      userPromptTemplate: `Write technical documentation for:

Documentation type: {doc_type}
Subject: {subject}
Audience: {audience}
Technical details / context: {technical_details}
Code examples to include: {code_examples}
Tone: {tone}

Produce complete documentation including:
1. **Overview / Purpose**
2. **Prerequisites** (if applicable)
3. **Step-by-step instructions or Reference details**
4. **Code Examples** with comments
5. **Parameters / Options table** (where applicable)
6. **Error messages & troubleshooting**
7. **Related resources / See also**`,
      fields: [
        { name: 'doc_type', label: 'Documentation Type', type: 'select', required: true, options: ['API reference', 'Getting started guide', 'Integration tutorial', 'Architecture overview', 'README file', 'Runbook / SOP', 'Release notes', 'Troubleshooting guide'] },
        { name: 'subject', label: 'Subject / Feature', type: 'text', required: true, placeholder: 'e.g. Authentication API, Docker deployment, Webhook setup' },
        { name: 'audience', label: 'Audience', type: 'select', required: true, options: ['External developers / API consumers', 'Internal engineering team', 'DevOps / SRE team', 'Non-technical stakeholders', 'New team members'] },
        { name: 'technical_details', label: 'Technical Details & Context', type: 'textarea', required: true, placeholder: 'Describe the system, API, or process to document...' },
        { name: 'code_examples', label: 'Code Examples (optional)', type: 'textarea', required: false, placeholder: 'Paste relevant code snippets to include as examples...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Concise & developer-focused', 'Detailed & comprehensive', 'Beginner-friendly', 'Enterprise / formal'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Bug Report Generator',
      slug: 'bug-report-generator',
      icon: '🐛',
      description: 'Create detailed, actionable bug reports from raw observations and symptoms.',
      industryId: bySlug('software-it'),
      systemPrompt: 'You are a QA engineer and software test specialist. You transform raw bug observations into clear, structured, reproducible bug reports that development teams can act on immediately. You know what information engineers need to diagnose and fix issues.',
      userPromptTemplate: `Generate a structured bug report from these observations:

Application / feature: {application}
Environment: {environment}
Description of the issue: {description}
Steps to reproduce: {steps}
Expected behavior: {expected}
Actual behavior: {actual}
Frequency: {frequency}
Attachments / logs: {logs}

Format as a complete bug report with:
1. **Bug Title** (clear, searchable)
2. **Severity** (Critical / High / Medium / Low) with justification
3. **Priority** (P1-P4)
4. **Environment Details**
5. **Steps to Reproduce** (numbered, precise)
6. **Expected vs. Actual Result**
7. **Root Cause Hypothesis** (if apparent)
8. **Impact Assessment**
9. **Suggested Fix Direction** (if known)
10. **Labels / Tags** for triaging`,
      fields: [
        { name: 'application', label: 'Application / Feature', type: 'text', required: true, placeholder: 'e.g. User login flow, Payment checkout, API endpoint /users' },
        { name: 'environment', label: 'Environment', type: 'text', required: true, placeholder: 'e.g. Production, Staging, iOS 17 / Chrome 124 / Windows 11' },
        { name: 'description', label: 'Issue Description', type: 'textarea', required: true, placeholder: 'Describe what went wrong in as much detail as you have...' },
        { name: 'steps', label: 'Steps to Reproduce', type: 'textarea', required: false, placeholder: '1. Go to... 2. Click on... 3. See error...' },
        { name: 'expected', label: 'Expected Behavior', type: 'text', required: true, placeholder: 'What should have happened?' },
        { name: 'actual', label: 'Actual Behavior', type: 'text', required: true, placeholder: 'What actually happened?' },
        { name: 'frequency', label: 'How Often Does It Occur?', type: 'select', required: false, options: ['Always (100%)', 'Often (>50%)', 'Sometimes (25-50%)', 'Rarely (<25%)', 'Only once so far'] },
        { name: 'logs', label: 'Error Logs / Stack Trace (optional)', type: 'textarea', required: false, placeholder: 'Paste any relevant logs, error messages, or stack traces...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── AUTOMOBILE / RTO ─────────────────────────────────────────────────────
    {
      name: 'RTO Document Checklist Generator',
      slug: 'rto-document-checklist',
      icon: '📋',
      description: 'Generate complete RTO document checklists for vehicle registration, transfer, and licensing.',
      industryId: bySlug('automobile-rto'),
      systemPrompt: 'You are an RTO (Regional Transport Office) documentation expert with thorough knowledge of Indian motor vehicle regulations and procedures. You produce clear, accurate, and complete document checklists that help individuals and businesses complete RTO processes without confusion or repeated visits.',
      userPromptTemplate: `Generate an RTO document checklist for:

Process type: {process_type}
Vehicle type: {vehicle_type}
State / RTO: {state}
Applicant type: {applicant_type}
Special circumstances: {special_notes}

Provide:
1. **Process Overview** (brief description and timeline)
2. **Complete Document Checklist** (original + copies required)
3. **Form Numbers** to be filled
4. **Applicable Fees** (approximate)
5. **Online vs. Offline Process** guidance
6. **Common Mistakes to Avoid**
7. **Helpline / Portal Reference**`,
      fields: [
        { name: 'process_type', label: 'RTO Process', type: 'select', required: true, options: ['New vehicle registration (private)', 'New vehicle registration (commercial)', 'Vehicle ownership transfer', 'Duplicate RC book', 'Address change in RC', 'NOC for inter-state transfer', 'Fitness certificate renewal', 'Fresh driving license (LLR + DL)', 'Driving license renewal', 'Driving license address change', 'International driving permit', 'Vehicle hypothecation removal', 'Change of vehicle color / modification'] },
        { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', required: true, options: ['Two-wheeler', 'Four-wheeler (private car)', 'Commercial vehicle (LMV)', 'Heavy commercial vehicle', 'Three-wheeler / auto', 'Electric vehicle (EV)', 'Tractor / agricultural vehicle'] },
        { name: 'state', label: 'State / RTO Location', type: 'text', required: true, placeholder: 'e.g. Maharashtra (Pune RTO), Tamil Nadu (Chennai)' },
        { name: 'applicant_type', label: 'Applicant Type', type: 'select', required: false, options: ['Individual', 'Company / firm', 'Minor (via guardian)', 'NRI'] },
        { name: 'special_notes', label: 'Special Circumstances (optional)', type: 'textarea', required: false, placeholder: 'e.g. Inherited vehicle, vehicle from another state, financed vehicle...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Vehicle NOC & Transfer Letter',
      slug: 'vehicle-noc-transfer-letter',
      icon: '📄',
      description: 'Draft vehicle NOC letters, transfer forms, and official vehicle-related correspondence.',
      industryId: bySlug('automobile-rto'),
      systemPrompt: 'You are an RTO documentation specialist and legal drafting expert. You draft precise, legally sound vehicle-related letters and NOC documents that meet RTO requirements and are accepted without modification. Your documents are formal, clear, and include all required details.',
      userPromptTemplate: `Draft a {document_type} for:

Seller / owner details: {seller_details}
Buyer / recipient details: {buyer_details}
Vehicle details: {vehicle_details}
Loan / finance status: {finance_status}
Reason / context: {reason}
Date: {doc_date}

Draft a complete, formal document ready for submission with all required sections, standard legal language, signature lines, and any required declarations.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['No Objection Certificate (NOC) for transfer', 'Vehicle sale / transfer deed', 'Declaration for gift of vehicle', 'Affidavit for lost RC book', 'Hypothecation removal request letter', 'Authorization letter for agent/representative', 'Police report reference letter'] },
        { name: 'seller_details', label: 'Current Owner / Seller Details', type: 'textarea', required: true, placeholder: 'Name, address, contact, Aadhaar/PAN number...' },
        { name: 'buyer_details', label: 'New Owner / Buyer / Recipient Details', type: 'textarea', required: false, placeholder: 'Name, address, contact (if applicable)...' },
        { name: 'vehicle_details', label: 'Vehicle Details', type: 'textarea', required: true, placeholder: 'Make, model, year, registration number, chassis & engine number...' },
        { name: 'finance_status', label: 'Finance / Loan Status', type: 'select', required: false, options: ['No loan — free and clear', 'Loan cleared — NOC from bank obtained', 'Loan active — bank consent required', 'Not applicable'] },
        { name: 'reason', label: 'Reason / Context', type: 'text', required: false, placeholder: 'e.g. Private sale, gift to family member, relocation' },
        { name: 'doc_date', label: 'Document Date', type: 'text', required: false, placeholder: 'e.g. 01 May 2025' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },

    // ─── GOVERNMENT & NGO ─────────────────────────────────────────────────────
    {
      name: 'Grant Proposal Writer',
      slug: 'grant-proposal-writer',
      icon: '📝',
      description: 'Write compelling grant proposals and funding applications for NGOs and government projects.',
      industryId: bySlug('government-ngo'),
      systemPrompt: 'You are a grant writing specialist and nonprofit communications expert. You write compelling, well-structured grant proposals that clearly articulate the need, proposed solution, impact, and organizational credibility. Your proposals win funding by connecting donor priorities to project outcomes.',
      userPromptTemplate: `Write a grant proposal for:

Organization name: {org_name}
Project / program title: {project_title}
Funding source / grant: {funder}
Grant amount requested: {amount}
Project summary: {summary}
Target beneficiaries: {beneficiaries}
Expected outcomes: {outcomes}
Organization track record: {track_record}
Project duration: {duration}

Provide a complete grant proposal with:
1. **Executive Summary** (1 page)
2. **Statement of Need** (evidence-based)
3. **Project Description & Methodology**
4. **Goals, Objectives & Measurable Outcomes**
5. **Implementation Timeline**
6. **Evaluation Plan**
7. **Organizational Capacity & Qualifications**
8. **Budget Overview**
9. **Sustainability Plan**`,
      fields: [
        { name: 'org_name', label: 'Organization Name', type: 'text', required: true, placeholder: 'Your NGO / government body name' },
        { name: 'project_title', label: 'Project / Program Title', type: 'text', required: true, placeholder: 'e.g. Clean Drinking Water for Rural Schools' },
        { name: 'funder', label: 'Funding Source / Grant Name', type: 'text', required: false, placeholder: 'e.g. CSR grant, Government scheme, International foundation' },
        { name: 'amount', label: 'Amount Requested', type: 'text', required: false, placeholder: 'e.g. ₹25,00,000 / $50,000' },
        { name: 'summary', label: 'Project Summary', type: 'textarea', required: true, placeholder: 'What will this project do and why is it needed?' },
        { name: 'beneficiaries', label: 'Target Beneficiaries', type: 'textarea', required: true, placeholder: 'Who will benefit, how many, where...' },
        { name: 'outcomes', label: 'Expected Outcomes & Impact', type: 'textarea', required: true, placeholder: 'Specific, measurable results you aim to achieve...' },
        { name: 'track_record', label: 'Organization Track Record', type: 'textarea', required: false, placeholder: 'Past projects, achievements, credibility...' },
        { name: 'duration', label: 'Project Duration', type: 'text', required: false, placeholder: 'e.g. 18 months (June 2025 - November 2026)' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Policy Brief Generator',
      slug: 'policy-brief-generator',
      icon: '🏛️',
      description: 'Create concise, evidence-based policy briefs for government and advocacy purposes.',
      industryId: bySlug('government-ngo'),
      systemPrompt: 'You are a public policy analyst and government communications specialist. You write concise, evidence-based policy briefs that clearly define the problem, present options, and make actionable recommendations to decision-makers. Your briefs are authoritative, balanced, and accessible.',
      userPromptTemplate: `Write a policy brief on:

Policy topic / issue: {topic}
Target audience: {audience}
Geographic scope: {geography}
Background data / evidence: {evidence}
Current policy landscape: {current_policy}
Stakeholders affected: {stakeholders}
Recommended approach: {recommendation}

Structure:
1. **Executive Summary** (key messages in 3 bullets)
2. **Problem Statement** (with data)
3. **Background & Context**
4. **Current Policy Analysis** (what exists, gaps)
5. **Policy Options** (at least 3, with pros/cons)
6. **Recommended Policy Direction** with rationale
7. **Implementation Considerations**
8. **Expected Impact & Monitoring Indicators**
9. **References / Evidence Base**`,
      fields: [
        { name: 'topic', label: 'Policy Topic / Issue', type: 'text', required: true, placeholder: 'e.g. Urban air quality, School dropout rates, Rural healthcare access' },
        { name: 'audience', label: 'Target Audience', type: 'select', required: true, options: ['Cabinet / ministry officials', 'State government officials', 'Parliament / legislature', 'International organizations', 'NGOs & civil society', 'General public'] },
        { name: 'geography', label: 'Geographic Scope', type: 'text', required: true, placeholder: 'e.g. National (India), State (Maharashtra), District-level' },
        { name: 'evidence', label: 'Data & Evidence', type: 'textarea', required: true, placeholder: 'Statistics, studies, reports, or observations supporting the case...' },
        { name: 'current_policy', label: 'Current Policy Landscape', type: 'textarea', required: false, placeholder: 'Existing schemes, laws, or programs in this area...' },
        { name: 'stakeholders', label: 'Key Stakeholders Affected', type: 'text', required: false, placeholder: 'e.g. Farmers, urban poor, industry bodies, NGOs' },
        { name: 'recommendation', label: 'Your Recommended Approach (optional)', type: 'textarea', required: false, placeholder: 'If you have a preferred solution or direction...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Public Announcement & Official Letter',
      slug: 'public-announcement-writer',
      icon: '📢',
      description: 'Draft official government announcements, circulars, and formal public communications.',
      industryId: bySlug('government-ngo'),
      systemPrompt: 'You are a government communications officer specializing in official correspondence and public announcements. You draft clear, formal, and authoritative documents that meet government communication standards, follow proper protocol, and are accessible to the public.',
      userPromptTemplate: `Draft a {document_type}:

Issuing authority / organization: {issuing_org}
Subject / topic: {subject}
Key message or directive: {message}
Target audience: {audience}
Reference number (if any): {ref_number}
Effective date: {effective_date}
Authorized signatory: {signatory}

Draft a complete, formal document following government communication standards with proper salutation, clear structure, all required sections, and official closing.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Public announcement / notice', 'Government circular / order', 'Official letter to citizens', 'Press release', 'Tender notice', 'Meeting invitation (official)', 'NGO program announcement', 'Award / recognition letter'] },
        { name: 'issuing_org', label: 'Issuing Authority / Organization', type: 'text', required: true, placeholder: 'e.g. District Collector Office, Municipal Corporation, XYZ NGO' },
        { name: 'subject', label: 'Subject / Topic', type: 'text', required: true, placeholder: 'Brief subject line' },
        { name: 'message', label: 'Key Message or Directive', type: 'textarea', required: true, placeholder: 'Main content — what needs to be communicated, instructed, or announced...' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. All residents, Government employees, Contractors' },
        { name: 'ref_number', label: 'Reference Number (optional)', type: 'text', required: false, placeholder: 'e.g. COMM/2025/0501' },
        { name: 'effective_date', label: 'Effective Date', type: 'text', required: false, placeholder: 'e.g. 01 May 2025' },
        { name: 'signatory', label: 'Authorized Signatory Title', type: 'text', required: false, placeholder: 'e.g. District Collector, CEO, President' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── MARRIAGE / WEDDING ───────────────────────────────────────────────────
    {
      name: 'Wedding Invitation Writer',
      slug: 'wedding-invitation-writer',
      icon: '💌',
      description: 'Create beautiful, personalized wedding invitations in various styles and languages.',
      industryId: bySlug('wedding'),
      systemPrompt: 'You are a wedding stationery designer and copywriter with expertise in crafting beautiful, memorable wedding invitations. You match the couple\'s style and tone — from traditional and formal to modern and quirky — and ensure all essential details are elegantly presented.',
      userPromptTemplate: `Write a wedding invitation for:

Couple names: {couple_names}
Wedding date & time: {date_time}
Venue(s): {venue}
Ceremony type / religion: {ceremony_type}
Style preference: {style}
Events to include: {events}
RSVP details: {rsvp}
Special notes: {special_notes}

Provide:
1. **Main Invitation Text** (ready to print)
2. **Digital / WhatsApp Message version**
3. **Short 2-line tagline or quote** for the invite
4. **RSVP Card text**
5. **Save-the-Date message** (optional extra)`,
      fields: [
        { name: 'couple_names', label: 'Couple\'s Names', type: 'text', required: true, placeholder: 'e.g. Priya & Arjun / Sarah & Michael' },
        { name: 'date_time', label: 'Wedding Date & Time', type: 'text', required: true, placeholder: 'e.g. Sunday, 15 June 2025 at 7:00 PM' },
        { name: 'venue', label: 'Venue(s)', type: 'textarea', required: true, placeholder: 'Venue name, address for each event...' },
        { name: 'ceremony_type', label: 'Ceremony Type / Religion', type: 'text', required: false, placeholder: 'e.g. Hindu, Christian, Civil, Destination wedding' },
        { name: 'style', label: 'Invitation Style', type: 'select', required: true, options: ['Traditional / formal', 'Modern & minimalist', 'Romantic & poetic', 'Quirky / fun', 'Royal / grand', 'Destination wedding vibes'] },
        { name: 'events', label: 'Events to Mention', type: 'text', required: false, placeholder: 'e.g. Mehendi, Haldi, Sangeet, Reception, Wedding ceremony' },
        { name: 'rsvp', label: 'RSVP Contact & Deadline', type: 'text', required: false, placeholder: 'e.g. RSVP by 1 June — contact Meena: 9876543210' },
        { name: 'special_notes', label: 'Special Notes / Dress Code', type: 'text', required: false, placeholder: 'e.g. Dress code: Pastel colors, No children event' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Wedding Vendor Email',
      slug: 'wedding-vendor-email',
      icon: '📧',
      description: 'Write professional vendor inquiry, confirmation, and coordination emails for weddings.',
      industryId: bySlug('wedding'),
      systemPrompt: 'You are a professional wedding planner and event coordinator. You draft clear, professional vendor communications that establish expectations, confirm details, and build good working relationships. Your emails are warm yet businesslike and cover all important details.',
      userPromptTemplate: `Write a vendor email for:

Email type: {email_type}
Vendor type: {vendor_type}
Wedding date: {wedding_date}
Venue: {venue}
Couple name: {couple}
Key details: {details}
Budget range: {budget}
Special requirements: {requirements}

Draft a professional email with subject line that: clearly states the purpose, includes all relevant details, asks the right questions or confirms the right information, and ends with a clear next step.`,
      fields: [
        { name: 'email_type', label: 'Email Type', type: 'select', required: true, options: ['Initial inquiry / availability check', 'Quote request', 'Booking confirmation', 'Final brief / details confirmation', 'Day-of coordination instructions', 'Post-event thank you & feedback', 'Cancellation / rescheduling'] },
        { name: 'vendor_type', label: 'Vendor Type', type: 'select', required: true, options: ['Photographer / videographer', 'Caterer', 'Decorator / florist', 'Wedding venue', 'DJ / entertainment', 'Makeup artist', 'Mehendi artist', 'Wedding planner', 'Priest / officiant', 'Transportation'] },
        { name: 'wedding_date', label: 'Wedding Date(s)', type: 'text', required: true, placeholder: 'e.g. 14-15 June 2025' },
        { name: 'venue', label: 'Venue', type: 'text', required: false, placeholder: 'e.g. The Taj, Pune / Outdoor beach venue, Goa' },
        { name: 'couple', label: 'Couple\'s Names', type: 'text', required: false, placeholder: 'e.g. Priya & Arjun' },
        { name: 'details', label: 'Key Details & Requirements', type: 'textarea', required: true, placeholder: 'Guest count, style, specific needs...' },
        { name: 'budget', label: 'Budget Range (optional)', type: 'text', required: false, placeholder: 'e.g. ₹50,000 - ₹80,000' },
        { name: 'requirements', label: 'Special Requirements', type: 'textarea', required: false, placeholder: 'Any specific needs or concerns to address...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Wedding Program & Schedule Creator',
      slug: 'wedding-program-creator',
      icon: '📜',
      description: 'Create detailed wedding day programs, event schedules, and ceremony rundowns.',
      industryId: bySlug('wedding'),
      systemPrompt: 'You are an experienced wedding planner and event coordinator. You create detailed, elegant wedding programs and schedules that guide guests through ceremonies and help the event team coordinate flawlessly. You balance thoroughness with readability.',
      userPromptTemplate: `Create a wedding program / schedule for:

Wedding type: {wedding_type}
Couple names: {couple}
Date & venue: {date_venue}
Events to include: {events}
Approximate timings: {timings}
Special elements: {special_elements}
Audience for this document: {audience}

Provide:
1. **Printed Guest Program** (ceremony order for guests)
2. **Detailed Event Timeline / Runsheet** (for wedding team)
3. **Vendor Callsheet Highlights** (key vendor timings)
4. **Emergency / contingency notes** (brief)`,
      fields: [
        { name: 'wedding_type', label: 'Wedding Type / Ceremony', type: 'text', required: true, placeholder: 'e.g. Hindu wedding, Beach ceremony, Church wedding, Court marriage + reception' },
        { name: 'couple', label: 'Couple Names', type: 'text', required: true, placeholder: 'e.g. Riya & Karthik' },
        { name: 'date_venue', label: 'Date & Venue', type: 'text', required: true, placeholder: 'e.g. 20 June 2025, The Grand Ballroom, Chennai' },
        { name: 'events', label: 'Events & Ceremonies to Include', type: 'textarea', required: true, placeholder: 'List all events/ceremonies in order...' },
        { name: 'timings', label: 'Approximate Timings', type: 'textarea', required: false, placeholder: 'Guest arrival: 6 PM, Ceremony starts: 7 PM, etc...' },
        { name: 'special_elements', label: 'Special Elements', type: 'textarea', required: false, placeholder: 'Live music, surprise performances, cultural rituals, speeches...' },
        { name: 'audience', label: 'Primary Audience', type: 'select', required: false, options: ['Guest-facing program (print-ready)', 'Vendor / team coordination sheet', 'Both guest program + team runsheet'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── HOSPITALITY & TRAVEL ─────────────────────────────────────────────────
    {
      name: 'Travel Itinerary Generator',
      slug: 'travel-itinerary-generator',
      icon: '🗺️',
      description: 'Create detailed, personalized travel itineraries for any destination and travel style.',
      industryId: bySlug('hospitality-travel'),
      systemPrompt: 'You are an expert travel planner and destination specialist. You create detailed, well-paced travel itineraries that balance must-see highlights with hidden gems, account for travel time, and match the traveler\'s budget and interests. You give practical tips, not just listings.',
      userPromptTemplate: `Create a travel itinerary for:

Destination(s): {destination}
Duration: {duration}
Travel dates: {travel_dates}
Travelers: {travelers}
Travel style: {travel_style}
Budget level: {budget}
Interests: {interests}
Special requirements: {requirements}

Provide:
1. **Trip Overview** (highlights, best time, practical tips)
2. **Day-by-Day Itinerary** with timings, activities, restaurants, and travel notes
3. **Accommodation Recommendations** (per budget)
4. **Must-try Food & Experiences**
5. **Getting Around** (transport tips)
6. **Packing Tips** for this specific trip
7. **Budget Estimate** per day
8. **Important Notes** (visas, safety, cultural etiquette)`,
      fields: [
        { name: 'destination', label: 'Destination(s)', type: 'text', required: true, placeholder: 'e.g. Rajasthan, Japan, Paris + Rome, Maldives' },
        { name: 'duration', label: 'Trip Duration', type: 'text', required: true, placeholder: 'e.g. 7 days, 10 nights' },
        { name: 'travel_dates', label: 'Travel Dates (optional)', type: 'text', required: false, placeholder: 'e.g. 10-17 June 2025' },
        { name: 'travelers', label: 'Travelers', type: 'text', required: false, placeholder: 'e.g. Couple, family with 2 kids, solo backpacker, group of 6 friends' },
        { name: 'travel_style', label: 'Travel Style', type: 'select', required: true, options: ['Adventure & outdoor', 'Cultural & historical', 'Relaxation & wellness', 'Foodie & culinary', 'Luxury', 'Budget / backpacker', 'Family-friendly', 'Romantic / honeymoon'] },
        { name: 'budget', label: 'Budget Level', type: 'select', required: false, options: ['Budget / shoestring', 'Mid-range', 'Premium / upper-mid', 'Luxury'] },
        { name: 'interests', label: 'Key Interests', type: 'textarea', required: false, placeholder: 'e.g. temples, street food, hiking, local markets, photography spots...' },
        { name: 'requirements', label: 'Special Requirements (optional)', type: 'text', required: false, placeholder: 'e.g. Vegetarian, mobility-friendly, no-fly preference' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Hotel Guest Communication',
      slug: 'hotel-guest-communication',
      icon: '🏨',
      description: 'Write personalized hotel communications — welcome letters, confirmations, and follow-ups.',
      industryId: bySlug('hospitality-travel'),
      systemPrompt: 'You are a luxury hospitality communications specialist. You craft warm, personalized guest communications that make every guest feel anticipated and valued. Your writing strikes the perfect balance between professional hospitality standards and genuine personal warmth.',
      userPromptTemplate: `Write a hotel guest communication:

Communication type: {comm_type}
Hotel name: {hotel_name}
Guest name: {guest_name}
Stay details: {stay_details}
Special notes / preferences: {preferences}
Hotel highlights to mention: {highlights}
Tone: {tone}

Write a warm, personalized communication (under 250 words) that makes the guest feel welcomed, informed, and excited about their stay. Include subject line if email format.`,
      fields: [
        { name: 'comm_type', label: 'Communication Type', type: 'select', required: true, options: ['Pre-arrival welcome email', 'Check-in day welcome message', 'Welcome letter for room', 'Reservation confirmation', 'Upgrade notification', 'Special occasion greeting (birthday, anniversary)', 'Post-stay thank you & feedback request', 'Service recovery / apology message'] },
        { name: 'hotel_name', label: 'Hotel / Property Name', type: 'text', required: true, placeholder: 'Your hotel or resort name' },
        { name: 'guest_name', label: 'Guest Name', type: 'text', required: true, placeholder: 'e.g. Mr. & Mrs. Kapoor' },
        { name: 'stay_details', label: 'Stay Details', type: 'textarea', required: true, placeholder: 'Check-in/out dates, room type, length of stay...' },
        { name: 'preferences', label: 'Guest Preferences / Special Notes', type: 'textarea', required: false, placeholder: 'e.g. Honeymoon couple, celebrating anniversary, dietary needs, loyalty member' },
        { name: 'highlights', label: 'Hotel Highlights to Mention', type: 'text', required: false, placeholder: 'e.g. spa, infinity pool, complimentary breakfast, local tours' },
        { name: 'tone', label: 'Brand Tone', type: 'select', required: false, options: ['Luxury / refined', 'Warm & friendly', 'Boutique / intimate', 'Fun & energetic (resort vibes)', 'Business hotel / professional'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },

    // ─── EDUCATION ────────────────────────────────────────────────────────────
    {
      name: 'Lesson Plan Generator',
      slug: 'lesson-plan-generator',
      icon: '📚',
      description: 'Generate comprehensive, curriculum-aligned lesson plans for any subject and grade.',
      industryId: bySlug('education'),
      systemPrompt: 'You are an experienced educator and instructional designer. You create comprehensive, engaging lesson plans that align with learning outcomes, use diverse teaching methods, and accommodate different learning styles. Your plans are practical, ready-to-use, and include all necessary components.',
      userPromptTemplate: `Create a lesson plan for:

Subject: {subject}
Topic: {topic}
Grade / level: {grade}
Duration: {duration}
Learning objectives: {objectives}
Available resources: {resources}
Student profile: {student_profile}
Curriculum standard (if any): {curriculum}

Provide a complete lesson plan:
1. **Lesson Overview** (topic, grade, duration, objectives)
2. **Prerequisites / Prior Knowledge**
3. **Materials & Resources Needed**
4. **Warm-up / Engagement Activity** (5-10 min)
5. **Main Instruction** (step-by-step with timing)
6. **Student Activities & Practice**
7. **Discussion Questions**
8. **Assessment / Check for Understanding**
9. **Wrap-up & Summary**
10. **Homework / Extension Activity**
11. **Differentiation Notes** (for advanced / struggling learners)`,
      fields: [
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'e.g. Mathematics, English Literature, Biology, History' },
        { name: 'topic', label: 'Lesson Topic', type: 'text', required: true, placeholder: 'e.g. Introduction to Fractions, The French Revolution, Photosynthesis' },
        { name: 'grade', label: 'Grade / Level', type: 'text', required: true, placeholder: 'e.g. Grade 5, Class 10, Undergraduate Year 1' },
        { name: 'duration', label: 'Lesson Duration', type: 'select', required: true, options: ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'] },
        { name: 'objectives', label: 'Learning Objectives', type: 'textarea', required: true, placeholder: 'What should students know/be able to do after this lesson?' },
        { name: 'resources', label: 'Available Resources', type: 'text', required: false, placeholder: 'e.g. Textbook, whiteboard, projector, lab equipment, internet' },
        { name: 'student_profile', label: 'Student Profile', type: 'text', required: false, placeholder: 'e.g. 30 students, mixed ability, rural school, ESL learners' },
        { name: 'curriculum', label: 'Curriculum Standard (optional)', type: 'text', required: false, placeholder: 'e.g. CBSE, ICSE, Cambridge IGCSE, Common Core' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Student Progress Report Writer',
      slug: 'student-progress-report',
      icon: '📊',
      description: 'Generate personalized, constructive student progress reports and parent communications.',
      industryId: bySlug('education'),
      systemPrompt: 'You are an experienced teacher and educational communicator. You write honest, constructive, and encouraging student progress reports that clearly communicate academic performance, highlight strengths, address areas of growth, and provide actionable guidance for parents and students.',
      userPromptTemplate: `Write a student progress report for:

Student name: {student_name}
Grade / class: {grade}
Subject(s): {subjects}
Reporting period: {period}
Academic performance: {performance}
Strengths observed: {strengths}
Areas needing improvement: {areas_to_improve}
Behavior / attitude: {behavior}
Goals for next term: {goals}
Teacher / school name: {teacher_name}

Provide:
1. **Report Header** (student name, grade, period)
2. **Academic Performance Summary** per subject
3. **Key Strengths** (specific, genuine praise)
4. **Areas for Development** (constructive, specific)
5. **Social & Behavioral Assessment**
6. **Goals for Next Term**
7. **Parent Guidance** (how to support at home)
8. **Teacher's Closing Note**`,
      fields: [
        { name: 'student_name', label: 'Student Name', type: 'text', required: true, placeholder: 'Student\'s first name or full name' },
        { name: 'grade', label: 'Grade / Class', type: 'text', required: true, placeholder: 'e.g. Grade 7, Class IX A' },
        { name: 'subjects', label: 'Subjects Covered', type: 'text', required: true, placeholder: 'e.g. Math, Science, English, Social Studies' },
        { name: 'period', label: 'Reporting Period', type: 'text', required: true, placeholder: 'e.g. Term 1 2025, Q3 April-June 2025' },
        { name: 'performance', label: 'Academic Performance', type: 'textarea', required: true, placeholder: 'Grades, scores, or general description per subject...' },
        { name: 'strengths', label: 'Strengths Observed', type: 'textarea', required: true, placeholder: 'Academic and personal strengths...' },
        { name: 'areas_to_improve', label: 'Areas Needing Improvement', type: 'textarea', required: true, placeholder: 'Specific areas where more work is needed...' },
        { name: 'behavior', label: 'Behavior & Class Participation', type: 'select', required: false, options: ['Excellent — highly engaged', 'Good — generally participates', 'Average — inconsistent', 'Needs improvement — often distracted', 'Concerning — requires intervention'] },
        { name: 'goals', label: 'Goals for Next Term', type: 'textarea', required: false, placeholder: 'Specific targets to work toward...' },
        { name: 'teacher_name', label: 'Teacher / School Name', type: 'text', required: false, placeholder: 'Your name and school' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Educational Content Creator',
      slug: 'educational-content-creator',
      icon: '✏️',
      description: 'Create engaging educational materials — worksheets, quizzes, study guides, and explainers.',
      industryId: bySlug('education'),
      systemPrompt: 'You are an instructional designer and curriculum developer. You create engaging, pedagogically sound educational materials that make complex topics accessible and foster deep understanding. Your content is clear, well-structured, and appropriate for the target age and level.',
      userPromptTemplate: `Create educational content:

Content type: {content_type}
Topic: {topic}
Subject area: {subject}
Grade / age group: {grade}
Learning level: {level}
Special focus: {focus}

Create complete, ready-to-use content that:
- Is age and level appropriate
- Uses clear, engaging language
- Includes variety to maintain attention
- Builds understanding progressively
- Can be used directly in a classroom or online setting`,
      fields: [
        { name: 'content_type', label: 'Content Type', type: 'select', required: true, options: ['Worksheet with exercises', 'Quiz / test questions', 'Study guide / notes summary', 'Explainer / concept guide', 'Flashcard set', 'Case study / scenario', 'Essay prompt with rubric', 'Discussion questions set'] },
        { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'Specific topic to cover' },
        { name: 'subject', label: 'Subject Area', type: 'text', required: true, placeholder: 'e.g. Mathematics, Science, English, History' },
        { name: 'grade', label: 'Grade / Age Group', type: 'text', required: true, placeholder: 'e.g. Grade 8, Ages 14-16, University level' },
        { name: 'level', label: 'Complexity Level', type: 'select', required: false, options: ['Beginner / foundational', 'Intermediate', 'Advanced', 'Mixed ability'] },
        { name: 'focus', label: 'Special Focus (optional)', type: 'text', required: false, placeholder: 'e.g. critical thinking, exam prep, real-world application, visual learners' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Quiz & Exam Paper Generator',
      slug: 'quiz-exam-paper-generator',
      icon: '📝',
      description: 'Create quizzes, test papers, answer keys, and marking schemes for any subject.',
      industryId: bySlug('education'),
      systemPrompt: 'You are an assessment designer and experienced educator. You create fair, well-balanced quizzes and exam papers that align with learning objectives, test different cognitive levels, and include clear answer keys and marking schemes.',
      userPromptTemplate: `Create a quiz or exam paper for:

Subject: {subject}
Topic / unit: {topic}
Grade / level: {grade}
Assessment type: {exam_type}
Total marks: {total_marks}
Duration: {duration}
Question mix: {question_mix}
Difficulty level: {difficulty}
Syllabus / coverage notes: {syllabus}

Provide:
1. **Exam Header** with subject, grade, marks, and duration
2. **Student Instructions**
3. **Section-wise Question Paper** with marks per question
4. **Balanced Question Mix** across recall, understanding, application, and reasoning
5. **Answer Key**
6. **Marking Scheme / Rubric**
7. **Teacher Notes** for moderation or adjustments`,
      fields: [
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'e.g. Mathematics, Science, English, Economics' },
        { name: 'topic', label: 'Topic / Unit', type: 'text', required: true, placeholder: 'e.g. Algebraic expressions, Human digestion, Macbeth Act 1' },
        { name: 'grade', label: 'Grade / Level', type: 'text', required: true, placeholder: 'e.g. Grade 8, Class 10, Undergraduate Year 1' },
        { name: 'exam_type', label: 'Assessment Type', type: 'select', required: true, options: ['Quick quiz', 'Unit test', 'Midterm exam', 'Final exam', 'Entrance practice', 'Online assessment'] },
        { name: 'total_marks', label: 'Total Marks', type: 'text', required: true, placeholder: 'e.g. 20 marks, 50 marks, 100 marks' },
        { name: 'duration', label: 'Duration', type: 'select', required: true, options: ['15 minutes', '30 minutes', '45 minutes', '1 hour', '2 hours', '3 hours'] },
        { name: 'question_mix', label: 'Question Mix', type: 'textarea', required: false, placeholder: 'e.g. 10 MCQs, 5 short answers, 2 long answers, 1 case study' },
        { name: 'difficulty', label: 'Difficulty Level', type: 'select', required: false, options: ['Easy', 'Moderate', 'Challenging', 'Mixed difficulty'] },
        { name: 'syllabus', label: 'Syllabus / Coverage Notes', type: 'textarea', required: false, placeholder: 'Mention chapters, concepts, exclusions, or required standards...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Assignment & Rubric Builder',
      slug: 'assignment-rubric-builder',
      icon: '📌',
      description: 'Design assignments, project briefs, grading rubrics, and submission guidelines.',
      industryId: bySlug('education'),
      systemPrompt: 'You are an instructional designer who creates clear, engaging assignments and transparent grading rubrics. Your assignments are aligned to learning outcomes, age-appropriate, and easy for students and teachers to use.',
      userPromptTemplate: `Create an assignment with grading rubric:

Assignment type: {assignment_type}
Subject: {subject}
Topic: {topic}
Grade / level: {grade}
Learning outcomes: {learning_outcomes}
Submission requirements: {submission_requirements}
Rubric criteria: {rubric_criteria}
Due date / timeline: {timeline}

Provide:
1. **Assignment Title**
2. **Student-facing Brief**
3. **Learning Outcomes**
4. **Step-by-step Task Instructions**
5. **Deliverables & Submission Format**
6. **Grading Rubric Table** with criteria, levels, and marks
7. **Academic Integrity / AI Use Guidance**
8. **Teacher Notes** for feedback and moderation`,
      fields: [
        { name: 'assignment_type', label: 'Assignment Type', type: 'select', required: true, options: ['Essay', 'Project', 'Lab report', 'Case study', 'Presentation', 'Group activity', 'Homework worksheet', 'Research report'] },
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'e.g. Biology, English, Computer Science' },
        { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g. Climate change impacts, Database normalization' },
        { name: 'grade', label: 'Grade / Level', type: 'text', required: true, placeholder: 'e.g. Grade 9, Class XII, College freshman' },
        { name: 'learning_outcomes', label: 'Learning Outcomes', type: 'textarea', required: true, placeholder: 'What should students demonstrate?' },
        { name: 'submission_requirements', label: 'Submission Requirements', type: 'textarea', required: false, placeholder: 'Word count, file format, references, diagrams, group size...' },
        { name: 'rubric_criteria', label: 'Rubric Criteria', type: 'textarea', required: false, placeholder: 'e.g. Understanding, analysis, presentation, originality, citations' },
        { name: 'timeline', label: 'Due Date / Timeline', type: 'text', required: false, placeholder: 'e.g. Due in 2 weeks, submit by 15 May' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },
    {
      name: 'Syllabus & Course Planner',
      slug: 'syllabus-course-planner',
      icon: '🗓️',
      description: 'Build course outlines, weekly plans, learning outcomes, and assessment schedules.',
      industryId: bySlug('education'),
      systemPrompt: 'You are a curriculum planner and academic coordinator. You design coherent syllabi and course plans with logical sequencing, measurable outcomes, assessments, resources, and realistic weekly pacing.',
      userPromptTemplate: `Create a syllabus and course plan:

Course / subject title: {course_title}
Grade / learner level: {level}
Course duration: {duration}
Sessions per week: {sessions_per_week}
Course goals: {goals}
Assessment style: {assessment_style}
Resources available: {resources}
Institution / curriculum requirements: {requirements}

Provide:
1. **Course Overview**
2. **Learning Outcomes**
3. **Weekly / Module-wise Plan**
4. **Teaching Methods**
5. **Assessment Schedule**
6. **Required Resources**
7. **Homework / Practice Plan**
8. **Revision and Exam Preparation Milestones**`,
      fields: [
        { name: 'course_title', label: 'Course / Subject Title', type: 'text', required: true, placeholder: 'e.g. Grade 10 Physics, Intro to Python Programming' },
        { name: 'level', label: 'Grade / Learner Level', type: 'text', required: true, placeholder: 'e.g. Grade 10, Beginner adults, Undergraduate Year 2' },
        { name: 'duration', label: 'Course Duration', type: 'text', required: true, placeholder: 'e.g. 8 weeks, 1 semester, full academic year' },
        { name: 'sessions_per_week', label: 'Sessions Per Week', type: 'text', required: false, placeholder: 'e.g. 3 classes per week, 2 lab sessions' },
        { name: 'goals', label: 'Course Goals', type: 'textarea', required: true, placeholder: 'Describe broad learning goals...' },
        { name: 'assessment_style', label: 'Assessment Style', type: 'select', required: false, options: ['Tests and exams', 'Projects and presentations', 'Continuous assessment', 'Practical / lab-based', 'Mixed assessment'] },
        { name: 'resources', label: 'Resources Available', type: 'textarea', required: false, placeholder: 'Textbooks, LMS, lab, projector, worksheets, software...' },
        { name: 'requirements', label: 'Curriculum Requirements', type: 'textarea', required: false, placeholder: 'Board, university, or institutional requirements...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 6,
    },
    {
      name: 'Parent-Teacher Communication Writer',
      slug: 'parent-teacher-communication',
      icon: '💬',
      description: 'Write clear parent messages for progress updates, meetings, reminders, and concerns.',
      industryId: bySlug('education'),
      systemPrompt: 'You are a thoughtful teacher and school communications specialist. You write parent communications that are clear, respectful, constructive, and action-oriented. You balance honesty with empathy and keep the student at the center.',
      userPromptTemplate: `Write a parent-teacher communication:

Message type: {message_type}
Student name: {student_name}
Grade / class: {grade}
Subject / context: {subject_context}
Main message details: {details}
Desired parent action: {desired_action}
Tone: {tone}
Teacher / school name: {teacher_name}

Provide:
1. **Subject Line** (if email)
2. **Message Body** in a polished, parent-friendly tone
3. **Clear Action Required** if any
4. **Suggested Follow-up** or meeting note
5. **Short SMS / WhatsApp Version**`,
      fields: [
        { name: 'message_type', label: 'Message Type', type: 'select', required: true, options: ['Progress update', 'Behavior concern', 'Appreciation / praise', 'Meeting request', 'Homework reminder', 'Absence follow-up', 'Event / notice', 'Exam preparation note'] },
        { name: 'student_name', label: 'Student Name', type: 'text', required: true, placeholder: 'Student name' },
        { name: 'grade', label: 'Grade / Class', type: 'text', required: true, placeholder: 'e.g. Grade 6B, Class X A' },
        { name: 'subject_context', label: 'Subject / Context', type: 'text', required: false, placeholder: 'e.g. Math performance, classroom participation, annual day' },
        { name: 'details', label: 'Main Message Details', type: 'textarea', required: true, placeholder: 'Describe what needs to be communicated...' },
        { name: 'desired_action', label: 'Desired Parent Action', type: 'textarea', required: false, placeholder: 'e.g. Sign consent form, attend meeting, help with practice...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Warm and supportive', 'Formal and professional', 'Firm but respectful', 'Encouraging and positive', 'Urgent and clear'] },
        { name: 'teacher_name', label: 'Teacher / School Name', type: 'text', required: false, placeholder: 'Your name and school' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 7,
    },
    {
      name: 'Study Notes & Flashcards Generator',
      slug: 'study-notes-flashcards',
      icon: '🧠',
      description: 'Turn lessons or source material into revision notes, flashcards, and practice questions.',
      industryId: bySlug('education'),
      systemPrompt: 'You are a study coach and educational content designer. You transform source material into concise, accurate study notes, flashcards, examples, and revision questions that help students remember and apply concepts.',
      userPromptTemplate: `Create study notes and flashcards:

Subject: {subject}
Topic: {topic}
Grade / level: {grade}
Source material: {source_material}
Focus areas: {focus_areas}
Note style: {note_style}
Number of flashcards: {flashcard_count}

Provide:
1. **Concise Study Notes**
2. **Key Terms and Definitions**
3. **Important Formulas / Rules / Concepts** where relevant
4. **Worked Examples** or explanations
5. **Flashcards** in Q&A format
6. **Quick Revision Quiz**
7. **Common Mistakes to Avoid**`,
      fields: [
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'e.g. Chemistry, History, Accountancy' },
        { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g. Periodic table trends, Mughal Empire, Journal entries' },
        { name: 'grade', label: 'Grade / Level', type: 'text', required: true, placeholder: 'e.g. Grade 8, Class 12, beginner' },
        { name: 'source_material', label: 'Source Material', type: 'textarea', required: false, placeholder: 'Paste lesson text, textbook extract, or notes...' },
        { name: 'focus_areas', label: 'Focus Areas', type: 'textarea', required: false, placeholder: 'Concepts, chapters, formulas, dates, definitions...' },
        { name: 'note_style', label: 'Note Style', type: 'select', required: false, options: ['Exam-focused', 'Conceptual understanding', 'Short revision notes', 'Detailed explanation', 'Memory tricks / mnemonics'] },
        { name: 'flashcard_count', label: 'Number of Flashcards', type: 'select', required: false, options: ['10 flashcards', '15 flashcards', '20 flashcards', '30 flashcards'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 8,
    },

    // ─── INSURANCE ────────────────────────────────────────────────────────────
    {
      name: 'Insurance Policy Summary',
      slug: 'insurance-policy-summary',
      icon: '🛡️',
      description: 'Simplify complex insurance policies into clear, readable client summaries.',
      industryId: bySlug('insurance'),
      systemPrompt: 'You are an insurance specialist and client communications expert. You translate complex insurance policy documents into clear, readable summaries that help clients understand exactly what they are covered for, what is excluded, and what to do in case of a claim. You are accurate, clear, and client-focused.',
      userPromptTemplate: `Create an insurance policy summary for:

Policy type: {policy_type}
Insurer: {insurer}
Policyholder details: {policyholder}
Sum insured / coverage: {coverage}
Premium details: {premium}
Key inclusions: {inclusions}
Key exclusions: {exclusions}
Claim process: {claim_process}
Policy period: {policy_period}

Provide:
1. **Policy at a Glance** (one-page summary)
2. **What You Are Covered For** (clear language)
3. **What Is NOT Covered** (exclusions, plain language)
4. **Sum Insured & Sub-limits**
5. **How to Make a Claim** (step-by-step)
6. **Key Contacts & Helpline**
7. **Important Dates** (renewal, free look period)
8. **Client Action Checklist**`,
      fields: [
        { name: 'policy_type', label: 'Policy Type', type: 'select', required: true, options: ['Health insurance', 'Life insurance (term)', 'Life insurance (endowment/ULIP)', 'Motor insurance (comprehensive)', 'Motor insurance (third party)', 'Home / property insurance', 'Travel insurance', 'Business / commercial insurance', 'Crop / agriculture insurance', 'Cyber insurance'] },
        { name: 'insurer', label: 'Insurance Company', type: 'text', required: false, placeholder: 'e.g. LIC, HDFC ERGO, Star Health, New India Assurance' },
        { name: 'policyholder', label: 'Policyholder Details', type: 'text', required: false, placeholder: 'Name, age, or type of policyholder' },
        { name: 'coverage', label: 'Sum Insured / Coverage Amount', type: 'text', required: true, placeholder: 'e.g. ₹5,00,000 health cover, ₹1 Crore life cover' },
        { name: 'premium', label: 'Premium Details', type: 'text', required: false, placeholder: 'e.g. ₹12,000/year, monthly EMI of ₹2,500' },
        { name: 'inclusions', label: 'Key Inclusions', type: 'textarea', required: true, placeholder: 'What is covered under this policy...' },
        { name: 'exclusions', label: 'Key Exclusions', type: 'textarea', required: false, placeholder: 'What is NOT covered or has waiting periods...' },
        { name: 'claim_process', label: 'Claim Process (if known)', type: 'textarea', required: false, placeholder: 'How to raise a claim, cashless vs. reimbursement...' },
        { name: 'policy_period', label: 'Policy Period', type: 'text', required: false, placeholder: 'e.g. 01 May 2025 to 30 April 2026' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 1,
    },
    {
      name: 'Insurance Claims Report Writer',
      slug: 'insurance-claims-report',
      icon: '📋',
      description: 'Generate structured insurance claim reports and supporting documentation.',
      industryId: bySlug('insurance'),
      systemPrompt: 'You are an insurance claims specialist and documentation expert. You help policyholders and claims officers prepare accurate, complete, and well-documented claim reports that expedite processing and reduce back-and-forth. You know what insurers look for in a strong claim.',
      userPromptTemplate: `Generate an insurance claim report for:

Claim type: {claim_type}
Policy number: {policy_number}
Claimant name: {claimant}
Date of loss / incident: {incident_date}
Description of incident: {incident_description}
Loss / damage details: {loss_details}
Estimated claim amount: {claim_amount}
Documents available: {documents}

Provide:
1. **Claim Summary** (ready for submission)
2. **Incident Description** (chronological, factual)
3. **Loss / Damage Itemization** with estimated values
4. **Supporting Documents Checklist**
5. **Claim Amount Calculation**
6. **Claimant Statement / Declaration**
7. **Next Steps & Timeline Expectations**`,
      fields: [
        { name: 'claim_type', label: 'Claim Type', type: 'select', required: true, options: ['Health insurance claim', 'Motor accident claim', 'Motor theft claim', 'Home / property damage claim', 'Travel insurance claim', 'Life insurance claim', 'Business loss claim', 'Personal accident claim'] },
        { name: 'policy_number', label: 'Policy Number', type: 'text', required: false, placeholder: 'e.g. POL/2024/00123456' },
        { name: 'claimant', label: 'Claimant Name', type: 'text', required: true, placeholder: 'Full name of claimant' },
        { name: 'incident_date', label: 'Date of Loss / Incident', type: 'text', required: true, placeholder: 'e.g. 28 April 2025' },
        { name: 'incident_description', label: 'Incident Description', type: 'textarea', required: true, placeholder: 'Describe exactly what happened, when, where, and how...' },
        { name: 'loss_details', label: 'Loss / Damage Details', type: 'textarea', required: true, placeholder: 'What was damaged or lost? Describe each item or injury...' },
        { name: 'claim_amount', label: 'Estimated Claim Amount', type: 'text', required: false, placeholder: 'e.g. ₹85,000 total' },
        { name: 'documents', label: 'Documents Available', type: 'textarea', required: false, placeholder: 'List any documents you have — bills, FIR, photos, reports...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 2,
    },
    {
      name: 'Insurance Proposal Letter',
      slug: 'insurance-proposal-letter',
      icon: '✉️',
      description: 'Write persuasive insurance proposal letters and coverage recommendation reports.',
      industryId: bySlug('insurance'),
      systemPrompt: 'You are an insurance advisor and sales communication specialist. You craft compelling, transparent, and client-focused insurance proposal letters that clearly explain coverage options, demonstrate value, and help clients make informed decisions. You build trust by being clear about both benefits and limitations.',
      userPromptTemplate: `Write an insurance proposal for:

Proposal type: {proposal_type}
Client name / type: {client}
Insurance type: {insurance_type}
Recommended coverage: {coverage}
Premium details: {premium}
Key benefits to highlight: {benefits}
Comparison (if any): {comparison}
Agent / advisor name: {advisor}

Provide:
1. **Proposal Letter** (professional, personalized opening)
2. **Coverage Summary** in plain language
3. **Why This Policy is Right for You** (personalized rationale)
4. **Coverage Comparison Table** (if applicable)
5. **Premium Payment Options**
6. **Tax Benefits** (where applicable)
7. **Next Steps to Apply**
8. **Closing & Contact Details**`,
      fields: [
        { name: 'proposal_type', label: 'Proposal Type', type: 'select', required: true, options: ['Individual health insurance', 'Group health (employer)', 'Life insurance / term plan', 'Vehicle insurance renewal', 'Business package insurance', 'Senior citizen health plan', 'Family floater plan', 'Top-up / super top-up plan'] },
        { name: 'client', label: 'Client Name / Type', type: 'text', required: true, placeholder: 'e.g. Mr. Arun Mehta, 35 years / ABC Pvt Ltd (50 employees)' },
        { name: 'insurance_type', label: 'Insurance Product', type: 'text', required: true, placeholder: 'e.g. Star Health Family Delite, LIC Tech Term, Bajaj Allianz GCV' },
        { name: 'coverage', label: 'Recommended Coverage Details', type: 'textarea', required: true, placeholder: 'Sum insured, sub-limits, riders, add-ons...' },
        { name: 'premium', label: 'Premium Details', type: 'text', required: true, placeholder: 'e.g. ₹18,500/year or ₹1,600/month' },
        { name: 'benefits', label: 'Key Benefits to Highlight', type: 'textarea', required: true, placeholder: 'Key selling points and differentiators...' },
        { name: 'comparison', label: 'Comparison Details (optional)', type: 'textarea', required: false, placeholder: 'Compare against current plan or competitor offering...' },
        { name: 'advisor', label: 'Advisor / Agent Name', type: 'text', required: false, placeholder: 'Your name and contact' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },

    // ─── LEGAL (additional) ───────────────────────────────────────────────────
    {
      name: 'NDA Generator',
      slug: 'nda-generator',
      icon: '🤐',
      description: 'Draft mutual or one-way non-disclosure agreements tailored to your situation.',
      industryId: bySlug('legal'),
      systemPrompt: 'You are a commercial contracts expert specialising in confidentiality and IP protection. You draft clear, enforceable NDAs that protect the disclosing party while being fair and practical. You tailor each NDA to the specific use case and jurisdiction.',
      userPromptTemplate: `Draft a Non-Disclosure Agreement:

NDA type: {nda_type}
Disclosing party: {disclosing_party}
Receiving party: {receiving_party}
Purpose of disclosure: {purpose}
Jurisdiction: {jurisdiction}
Duration: {duration}
Specific exclusions / carve-outs: {exclusions}

Provide:
1. **Complete NDA Document** (ready to sign)
2. **Plain-English Summary** of key obligations
3. **Key Risks for Each Party**
4. **Optional Clauses** to consider adding`,
      fields: [
        { name: 'nda_type', label: 'NDA Type', type: 'select', required: true, options: ['One-way (unilateral)', 'Mutual (bilateral)', 'Employee NDA', 'Vendor / contractor NDA'] },
        { name: 'disclosing_party', label: 'Disclosing Party', type: 'text', required: true, placeholder: 'Name and type of entity sharing information' },
        { name: 'receiving_party', label: 'Receiving Party', type: 'text', required: true, placeholder: 'Name and type of entity receiving information' },
        { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true, placeholder: 'e.g. Evaluating a potential business partnership, software development project' },
        { name: 'jurisdiction', label: 'Governing Law / Jurisdiction', type: 'text', required: true, placeholder: 'e.g. India (Mumbai courts), England & Wales, Delaware, USA' },
        { name: 'duration', label: 'Confidentiality Duration', type: 'select', required: false, options: ['1 year', '2 years', '3 years', '5 years', 'Indefinite', 'Custom'] },
        { name: 'exclusions', label: 'Specific Exclusions or Notes', type: 'textarea', required: false, placeholder: 'Any specific carve-outs, exceptions, or unusual requirements...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Legal Notice & Demand Letter',
      slug: 'legal-notice-demand-letter',
      icon: '⚠️',
      description: 'Draft formal legal notices and demand letters that compel a response.',
      industryId: bySlug('legal'),
      systemPrompt: 'You are a litigation-experienced lawyer drafting formal legal notices and demand letters. Your notices are authoritative, factually clear, legally sound, and create the right urgency without being inflammatory. They set up a clear paper trail.',
      userPromptTemplate: `Draft a legal notice / demand letter:

Notice type: {notice_type}
Sender details: {sender}
Recipient details: {recipient}
Facts & background: {facts}
Legal basis / violation: {legal_basis}
Demand / relief sought: {demand}
Deadline for response: {deadline}
Jurisdiction: {jurisdiction}

Provide:
1. **Formal Legal Notice** (ready to send / serve)
2. **Key Legal Provisions Cited**
3. **Recommended Mode of Delivery** (registered post, email, etc.)
4. **Next Steps if Ignored**`,
      fields: [
        { name: 'notice_type', label: 'Notice Type', type: 'select', required: true, options: ['Payment / money recovery', 'Contract breach', 'Defamation / libel', 'Property dispute', 'Employment grievance', 'Consumer complaint', 'IP infringement', 'Eviction notice (tenant)'] },
        { name: 'sender', label: 'Sender Details', type: 'textarea', required: true, placeholder: 'Name, address, contact — the party sending the notice' },
        { name: 'recipient', label: 'Recipient Details', type: 'textarea', required: true, placeholder: 'Name, address — the party receiving the notice' },
        { name: 'facts', label: 'Facts & Background', type: 'textarea', required: true, placeholder: 'Chronological facts and events leading to this notice...' },
        { name: 'legal_basis', label: 'Legal Basis / Violation', type: 'textarea', required: true, placeholder: 'What law, contract, or right has been violated?' },
        { name: 'demand', label: 'Demand / Relief Sought', type: 'textarea', required: true, placeholder: 'What exactly are you demanding? (payment, action, cessation...)' },
        { name: 'deadline', label: 'Response Deadline', type: 'text', required: true, placeholder: 'e.g. 15 days from receipt' },
        { name: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: false, placeholder: 'e.g. India — Mumbai, UK — England & Wales' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── HR (additional) ──────────────────────────────────────────────────────
    {
      name: 'Offer Letter & Employment Contract',
      slug: 'offer-letter-employment-contract',
      icon: '🤝',
      description: 'Draft professional offer letters and employment agreements for any role.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are an HR professional and employment law specialist. You draft clear, professional offer letters and employment contracts that protect both employer and employee, set clear expectations, and are written in plain, professional language.',
      userPromptTemplate: `Draft an {document_type} for:

Company name: {company}
Candidate name: {candidate}
Role / position: {role}
Department: {department}
Start date: {start_date}
Compensation: {compensation}
Work arrangement: {work_arrangement}
Probation period: {probation}
Key terms: {key_terms}
Jurisdiction: {jurisdiction}

Provide a complete, professional document with all standard sections and any special terms specified.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Offer letter', 'Employment agreement', 'Internship offer letter', 'Contract / freelance agreement', 'Promotion letter', 'Appointment letter'] },
        { name: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'Your company name' },
        { name: 'candidate', label: 'Candidate / Employee Name', type: 'text', required: true, placeholder: 'Full name' },
        { name: 'role', label: 'Role / Job Title', type: 'text', required: true, placeholder: 'e.g. Senior Software Engineer' },
        { name: 'department', label: 'Department', type: 'text', required: false, placeholder: 'e.g. Engineering, Marketing' },
        { name: 'start_date', label: 'Start Date', type: 'text', required: true, placeholder: 'e.g. 1 June 2025' },
        { name: 'compensation', label: 'Compensation Details', type: 'textarea', required: true, placeholder: 'Salary, bonus, equity, benefits...' },
        { name: 'work_arrangement', label: 'Work Arrangement', type: 'select', required: false, options: ['Full-time on-site', 'Full-time remote', 'Hybrid', 'Part-time', 'Contract / fixed-term'] },
        { name: 'probation', label: 'Probation Period', type: 'select', required: false, options: ['No probation', '1 month', '3 months', '6 months'] },
        { name: 'key_terms', label: 'Key Terms & Special Clauses', type: 'textarea', required: false, placeholder: 'Notice period, non-compete, IP ownership, signing bonus clawback...' },
        { name: 'jurisdiction', label: 'Jurisdiction / Country', type: 'text', required: false, placeholder: 'e.g. India, UK, USA — California' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },
    {
      name: 'HR Policy & Employee Handbook Section',
      slug: 'hr-policy-handbook-section',
      icon: '📘',
      description: 'Draft HR policies and employee handbook sections that are clear and compliant.',
      industryId: bySlug('hr'),
      systemPrompt: 'You are an HR policy specialist with deep knowledge of employment law and best practices. You write clear, fair, and legally sound HR policies and handbook sections that employees can understand and follow. You balance compliance with a positive workplace culture.',
      userPromptTemplate: `Write an HR policy / handbook section on:

Policy topic: {policy_topic}
Company type: {company_type}
Company size: {company_size}
Country / jurisdiction: {jurisdiction}
Specific requirements: {requirements}
Tone: {tone}

Provide a complete policy section with:
1. **Policy Title & Purpose**
2. **Scope** (who it applies to)
3. **Policy Statement**
4. **Detailed Rules / Guidelines**
5. **Employee Responsibilities**
6. **Manager / HR Responsibilities**
7. **Consequences of Non-compliance**
8. **Review Date**`,
      fields: [
        { name: 'policy_topic', label: 'Policy Topic', type: 'select', required: true, options: ['Leave & time off policy', 'Work from home / remote work', 'Anti-harassment & POSH', 'Code of conduct', 'Performance improvement plan (PIP)', 'Expense reimbursement', 'Social media policy', 'Grievance redressal', 'Dress code', 'IT & device usage', 'Confidentiality & NDA', 'Equal opportunity & DEI'] },
        { name: 'company_type', label: 'Company Type', type: 'text', required: false, placeholder: 'e.g. Tech startup, Manufacturing, Retail chain' },
        { name: 'company_size', label: 'Company Size', type: 'select', required: false, options: ['1-50', '51-200', '201-1000', '1000+'] },
        { name: 'jurisdiction', label: 'Country / Jurisdiction', type: 'text', required: true, placeholder: 'e.g. India, UK, USA' },
        { name: 'requirements', label: 'Specific Requirements', type: 'textarea', required: false, placeholder: 'Any specific rules, exceptions, or existing practices to incorporate...' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Formal & legal', 'Friendly & accessible', 'Startup / casual', 'Enterprise / corporate'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 6,
    },

    // ─── E-COMMERCE (additional) ──────────────────────────────────────────────
    {
      name: 'Abandoned Cart Email',
      slug: 'abandoned-cart-email',
      icon: '🛒',
      description: 'Write high-converting abandoned cart recovery emails that bring shoppers back.',
      industryId: bySlug('ecommerce'),
      systemPrompt: 'You are an e-commerce email marketing specialist who writes abandoned cart recovery sequences that bring shoppers back without being pushy. You understand buyer psychology, create the right urgency, and personalise the message around the abandoned items.',
      userPromptTemplate: `Write an abandoned cart recovery email sequence:

Store / brand name: {brand}
Product(s) abandoned: {products}
Price / discount offer: {offer}
Brand tone: {tone}
Sequence length: {sequence_length}

For each email provide: subject line, preview text, body (under 150 words), and CTA. Structure:
- Email 1 (1-2 hours): Gentle reminder
- Email 2 (24 hours): Address objections
- Email 3 (48-72 hours): Final nudge with offer (if applicable)`,
      fields: [
        { name: 'brand', label: 'Store / Brand Name', type: 'text', required: true, placeholder: 'Your store name' },
        { name: 'products', label: 'Abandoned Product(s)', type: 'textarea', required: true, placeholder: 'Product name(s) and key details left in cart...' },
        { name: 'offer', label: 'Recovery Offer (optional)', type: 'text', required: false, placeholder: 'e.g. 10% off, free shipping, no offer' },
        { name: 'tone', label: 'Brand Tone', type: 'select', required: false, options: ['Friendly & warm', 'Playful / fun', 'Premium / luxury', 'Urgent & direct', 'Minimalist'] },
        { name: 'sequence_length', label: 'Emails in Sequence', type: 'select', required: false, options: ['1 email only', '2 emails', '3 emails (full sequence)'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Return & Refund Policy Generator',
      slug: 'return-refund-policy',
      icon: '↩️',
      description: 'Generate clear, customer-friendly return and refund policies for your store.',
      industryId: bySlug('ecommerce'),
      systemPrompt: 'You are an e-commerce operations specialist and legal copywriter. You write return and refund policies that are legally sound, customer-friendly, and reduce support tickets by answering every common question upfront. You balance seller protection with buyer confidence.',
      userPromptTemplate: `Generate a return & refund policy for:

Store / business name: {store_name}
Product type(s): {product_types}
Return window: {return_window}
Refund method: {refund_method}
Conditions for returns: {conditions}
Exceptions (non-returnable items): {exceptions}
Country / platform: {country}

Provide:
1. **Full Return & Refund Policy** (ready to publish)
2. **FAQ Section** (top 5 customer questions)
3. **Short Summary** (50 words for checkout page)`,
      fields: [
        { name: 'store_name', label: 'Store / Business Name', type: 'text', required: true, placeholder: 'Your store name' },
        { name: 'product_types', label: 'Product Types Sold', type: 'text', required: true, placeholder: 'e.g. Clothing, Electronics, Digital products, Food' },
        { name: 'return_window', label: 'Return Window', type: 'select', required: true, options: ['7 days', '10 days', '15 days', '30 days', '60 days', 'No returns'] },
        { name: 'refund_method', label: 'Refund Method', type: 'select', required: true, options: ['Original payment method', 'Store credit only', 'Exchange only', 'Original payment or store credit', 'Cash on collection'] },
        { name: 'conditions', label: 'Return Conditions', type: 'textarea', required: false, placeholder: 'e.g. Unused, original packaging, tags intact, with receipt...' },
        { name: 'exceptions', label: 'Non-returnable Items', type: 'text', required: false, placeholder: 'e.g. Innerwear, digital downloads, perishables, sale items' },
        { name: 'country', label: 'Country / Platform', type: 'text', required: false, placeholder: 'e.g. India (Consumer Protection Act), UK, Amazon seller' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── REAL ESTATE (additional) ─────────────────────────────────────────────
    {
      name: 'Rental Agreement Summary',
      slug: 'rental-agreement-summary',
      icon: '🔑',
      description: 'Summarise rental agreements into plain-language tenant and landlord guides.',
      industryId: bySlug('real-estate'),
      systemPrompt: 'You are a property management specialist and legal communicator. You distil complex rental agreements into clear, plain-language summaries that both tenants and landlords can act on. You highlight rights, obligations, and important dates.',
      userPromptTemplate: `Summarise this rental agreement:

Agreement text / key terms: {agreement_text}
Audience: {audience}
Property type: {property_type}
Rent & deposit amount: {financials}
Lease duration: {duration}

Provide:
1. **Key Terms at a Glance** (table)
2. **Tenant Rights & Obligations**
3. **Landlord Rights & Obligations**
4. **Financial Summary** (rent, deposit, escalation)
5. **Important Dates** (lease start, end, notice period)
6. **Clauses to Pay Special Attention To**
7. **Questions to Clarify Before Signing**`,
      fields: [
        { name: 'agreement_text', label: 'Agreement Text or Key Terms', type: 'textarea', required: true, placeholder: 'Paste the rental agreement or describe the main terms...' },
        { name: 'audience', label: 'Audience', type: 'select', required: true, options: ['Tenant', 'Landlord', 'Property manager', 'Both tenant & landlord'] },
        { name: 'property_type', label: 'Property Type', type: 'select', required: false, options: ['Residential apartment', 'Independent house', 'Commercial office', 'Retail shop', 'Warehouse / industrial', 'Co-working space'] },
        { name: 'financials', label: 'Rent & Deposit Details', type: 'text', required: false, placeholder: 'e.g. ₹25,000/month, 3-month deposit' },
        { name: 'duration', label: 'Lease Duration', type: 'text', required: false, placeholder: 'e.g. 11 months, 3 years with renewal option' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Property Investment Analysis',
      slug: 'property-investment-analysis',
      icon: '📈',
      description: 'Generate structured property investment analyses with ROI and risk assessment.',
      industryId: bySlug('real-estate'),
      systemPrompt: 'You are a real estate investment analyst. You produce structured, objective property investment analyses that help investors evaluate deals. You calculate key metrics, assess risks, and provide clear buy/hold/pass recommendations.',
      userPromptTemplate: `Analyse this property investment:

Property details: {property_details}
Purchase price: {price}
Expected rental income: {rental_income}
Operating costs: {costs}
Financing details: {financing}
Investment goal: {goal}
Market context: {market_context}

Provide:
1. **Investment Summary** (1-paragraph verdict)
2. **Key Metrics** (Gross Yield, Net Yield, Cap Rate, Cash-on-Cash ROI, Payback Period)
3. **Cash Flow Analysis** (monthly/annual)
4. **Risk Assessment** (location, vacancy, interest rate, liquidity)
5. **Comparable Market Data** (based on info provided)
6. **5-Year Projection** (appreciation + rental income)
7. **Recommendation:** Buy / Hold / Pass with rationale`,
      fields: [
        { name: 'property_details', label: 'Property Details', type: 'textarea', required: true, placeholder: 'Type, size, location, age, condition, amenities...' },
        { name: 'price', label: 'Purchase Price', type: 'text', required: true, placeholder: 'e.g. ₹75,00,000 / $300,000' },
        { name: 'rental_income', label: 'Expected Monthly Rental Income', type: 'text', required: true, placeholder: 'e.g. ₹30,000/month' },
        { name: 'costs', label: 'Monthly Operating Costs', type: 'textarea', required: false, placeholder: 'Maintenance, property tax, insurance, society charges, management fee...' },
        { name: 'financing', label: 'Financing Details', type: 'text', required: false, placeholder: 'e.g. 20% down, home loan at 8.5% for 20 years' },
        { name: 'goal', label: 'Investment Goal', type: 'select', required: false, options: ['Rental income (cash flow)', 'Capital appreciation', 'Both income and appreciation', 'Short-term flip', 'Commercial lease'] },
        { name: 'market_context', label: 'Local Market Context', type: 'textarea', required: false, placeholder: 'Any market data, trends, or comparable properties you know of...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── FINANCE (additional) ─────────────────────────────────────────────────
    {
      name: 'Business Loan Application Letter',
      slug: 'business-loan-application',
      icon: '🏦',
      description: 'Write compelling business loan applications and credit request letters.',
      industryId: bySlug('finance'),
      systemPrompt: 'You are a business finance advisor who helps businesses write compelling loan applications and credit request letters. You know exactly what lenders and banks look for: clarity of purpose, repayment capacity, business viability, and management credibility.',
      userPromptTemplate: `Write a business loan application for:

Business name & type: {business_name}
Loan amount: {loan_amount}
Loan purpose: {loan_purpose}
Business financials: {financials}
Collateral available: {collateral}
Repayment plan: {repayment}
Lender / bank name: {lender}

Provide:
1. **Formal Loan Application Letter**
2. **Business Overview Section**
3. **Loan Purpose & Utilisation Plan**
4. **Financial Snapshot** (revenue, profit, existing liabilities)
5. **Repayment Capacity Argument**
6. **Collateral Summary**
7. **Documents Checklist** for submission`,
      fields: [
        { name: 'business_name', label: 'Business Name & Type', type: 'text', required: true, placeholder: 'e.g. ABC Traders Pvt Ltd — FMCG distributor' },
        { name: 'loan_amount', label: 'Loan Amount Required', type: 'text', required: true, placeholder: 'e.g. ₹50,00,000 / $200,000' },
        { name: 'loan_purpose', label: 'Loan Purpose', type: 'select', required: true, options: ['Working capital', 'Equipment / machinery purchase', 'Business expansion', 'Inventory financing', 'Office / property purchase', 'Technology upgrade', 'Export financing', 'Debt consolidation'] },
        { name: 'financials', label: 'Business Financials (brief)', type: 'textarea', required: true, placeholder: 'Annual revenue, profit, years in business, existing loans...' },
        { name: 'collateral', label: 'Collateral Available', type: 'text', required: false, placeholder: 'e.g. Property worth ₹1Cr, machinery, FDs' },
        { name: 'repayment', label: 'Proposed Repayment Plan', type: 'text', required: false, placeholder: 'e.g. 5-year term, monthly EMI of ₹1.2L' },
        { name: 'lender', label: 'Lender / Bank Name', type: 'text', required: false, placeholder: 'e.g. State Bank of India, HDFC Bank' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Budget & Financial Forecast',
      slug: 'budget-financial-forecast',
      icon: '📊',
      description: 'Generate detailed business budgets and financial forecasts with commentary.',
      industryId: bySlug('finance'),
      systemPrompt: 'You are a management accountant and financial planning specialist. You build clear, realistic budgets and financial forecasts with well-reasoned assumptions and actionable commentary. Your forecasts help leadership make confident decisions.',
      userPromptTemplate: `Create a {forecast_type} for:

Business type: {business_type}
Historical data / context: {historical_data}
Revenue assumptions: {revenue_assumptions}
Cost structure: {cost_structure}
Forecast period: {period}
Key growth drivers: {growth_drivers}
Special items to include: {special_items}

Provide:
1. **Executive Summary** (key assumptions and headline numbers)
2. **Revenue Forecast** (broken down by stream)
3. **Cost / Expense Budget** (by category)
4. **P&L Forecast** (monthly for 12 months or quarterly)
5. **Cash Flow Projection**
6. **Key Financial Metrics** (margins, break-even, runway)
7. **Scenario Analysis** (Base / Optimistic / Conservative)
8. **Key Risks & Assumptions**`,
      fields: [
        { name: 'forecast_type', label: 'Document Type', type: 'select', required: true, options: ['Annual operating budget', '3-year financial forecast', 'Startup financial model', 'Project budget', 'Department budget', 'Cash flow forecast'] },
        { name: 'business_type', label: 'Business Type', type: 'text', required: true, placeholder: 'e.g. SaaS startup, Retail chain, Manufacturing SME' },
        { name: 'historical_data', label: 'Historical Data / Context', type: 'textarea', required: false, placeholder: 'Revenue, costs, margins from last 1-2 years...' },
        { name: 'revenue_assumptions', label: 'Revenue Assumptions', type: 'textarea', required: true, placeholder: 'Expected sales, pricing, growth rate, new products/markets...' },
        { name: 'cost_structure', label: 'Cost Structure', type: 'textarea', required: true, placeholder: 'Key costs — salaries, rent, COGS, marketing, etc...' },
        { name: 'period', label: 'Forecast Period', type: 'select', required: true, options: ['Monthly (12 months)', 'Quarterly (12 months)', 'Annual (3 years)', 'Annual (5 years)'] },
        { name: 'growth_drivers', label: 'Key Growth Drivers', type: 'text', required: false, placeholder: 'e.g. New product launch, geographic expansion, headcount addition' },
        { name: 'special_items', label: 'Special Items to Include', type: 'text', required: false, placeholder: 'e.g. Capex, fundraise, loan repayment, one-time costs' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── MARKETING (additional) ───────────────────────────────────────────────
    {
      name: 'Press Release Writer',
      slug: 'press-release-writer',
      icon: '📰',
      description: 'Write newsworthy press releases that get picked up by media outlets.',
      industryId: bySlug('marketing'),
      systemPrompt: 'You are a PR specialist and journalist who writes press releases that editors actually publish. You lead with the news angle, follow the inverted pyramid, include the right quotes, and provide everything a journalist needs to write the story.',
      userPromptTemplate: `Write a press release for:

Announcement type: {announcement_type}
Company / organisation: {company}
Headline news: {news}
Key facts & details: {facts}
Executive quote: {quote}
Background / company boilerplate: {background}
Contact details: {contact}
Release date: {release_date}

Write a complete, journalist-ready press release following the standard format: FOR IMMEDIATE RELEASE / headline / subheadline / dateline / body (inverted pyramid) / boilerplate / ### / contact details.`,
      fields: [
        { name: 'announcement_type', label: 'Announcement Type', type: 'select', required: true, options: ['Product launch', 'Funding / investment round', 'Partnership / collaboration', 'Award / recognition', 'New executive / leadership hire', 'Expansion / new market', 'Milestone achievement', 'Event announcement', 'Crisis / clarification statement'] },
        { name: 'company', label: 'Company / Organisation Name', type: 'text', required: true, placeholder: 'Your company name' },
        { name: 'news', label: 'The Core News / Announcement', type: 'textarea', required: true, placeholder: 'What are you announcing? Key facts in plain language...' },
        { name: 'facts', label: 'Supporting Facts & Details', type: 'textarea', required: true, placeholder: 'Numbers, dates, features, quotes, statistics...' },
        { name: 'quote', label: 'Executive Quote', type: 'textarea', required: false, placeholder: 'Quote from CEO or relevant spokesperson (will be formatted)...' },
        { name: 'background', label: 'Company Boilerplate (About)', type: 'textarea', required: false, placeholder: '2-3 sentence company description for the "About" section...' },
        { name: 'contact', label: 'PR Contact Details', type: 'text', required: false, placeholder: 'Name, email, phone for media enquiries' },
        { name: 'release_date', label: 'Release Date', type: 'text', required: false, placeholder: 'e.g. For Immediate Release / Embargoed until 1 June 2025' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Brand Positioning Statement',
      slug: 'brand-positioning-statement',
      icon: '🎯',
      description: 'Craft a compelling brand positioning statement and messaging framework.',
      industryId: bySlug('marketing'),
      systemPrompt: 'You are a brand strategist and marketing consultant. You develop sharp brand positioning statements and messaging frameworks that give companies a clear, differentiated market position. You help brands articulate their unique value in a way that resonates deeply with their target audience.',
      userPromptTemplate: `Develop a brand positioning strategy for:

Brand / company: {brand}
Industry: {industry}
Target audience: {audience}
Key competitors: {competitors}
Core product / service: {product}
Unique differentiators: {differentiators}
Brand values: {values}
Current perception (if known): {current_perception}

Provide:
1. **Positioning Statement** (classic Geoffrey Moore format)
2. **Tagline Options** (3 variations)
3. **Brand Personality** (5 traits)
4. **Core Message Pillars** (3-4 key messages)
5. **Elevator Pitch** (30-second version)
6. **Target Audience Persona Summary**
7. **Competitive Differentiation Map**
8. **Tone of Voice Guide**`,
      fields: [
        { name: 'brand', label: 'Brand / Company Name', type: 'text', required: true, placeholder: 'Your brand name' },
        { name: 'industry', label: 'Industry / Category', type: 'text', required: true, placeholder: 'e.g. Fintech, Organic food, B2B SaaS, Fashion' },
        { name: 'audience', label: 'Primary Target Audience', type: 'textarea', required: true, placeholder: 'Who is your ideal customer? Demographics, psychographics, pain points...' },
        { name: 'competitors', label: 'Key Competitors', type: 'text', required: false, placeholder: 'Main competitors or alternatives your audience considers' },
        { name: 'product', label: 'Core Product / Service', type: 'textarea', required: true, placeholder: 'What do you sell and what problem does it solve?' },
        { name: 'differentiators', label: 'Unique Differentiators', type: 'textarea', required: true, placeholder: 'What makes you genuinely different from competitors?' },
        { name: 'values', label: 'Brand Values', type: 'text', required: false, placeholder: 'e.g. Transparency, Innovation, Sustainability, Simplicity' },
        { name: 'current_perception', label: 'Current Brand Perception (optional)', type: 'textarea', required: false, placeholder: 'How are you perceived now? Any gaps between reality and desired perception?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── ACCOUNTING & TAX (additional) ────────────────────────────────────────
    {
      name: 'Payroll Summary Generator',
      slug: 'payroll-summary-generator',
      icon: '💳',
      description: 'Generate clear payroll summaries, salary slips, and payroll reconciliation reports.',
      industryId: bySlug('accounting-tax'),
      systemPrompt: 'You are a payroll accountant and HR operations specialist. You produce accurate, clear payroll summaries and salary slips that employees understand and that satisfy statutory requirements. You know payroll components, deductions, and compliance norms.',
      userPromptTemplate: `Generate a {document_type}:

Employee details: {employee}
Pay period: {pay_period}
Gross salary: {gross_salary}
Earnings breakdown: {earnings}
Deductions: {deductions}
Company name: {company}
Jurisdiction: {jurisdiction}

Provide the complete document with all earnings, deductions, employer contributions, net pay, and a clear breakdown table. Include statutory deduction references where applicable.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Salary slip / payslip', 'Monthly payroll summary', 'Annual CTC breakdown', 'Full & final settlement', 'Payroll reconciliation report'] },
        { name: 'employee', label: 'Employee Details', type: 'text', required: true, placeholder: 'Name, ID, designation, department' },
        { name: 'pay_period', label: 'Pay Period', type: 'text', required: true, placeholder: 'e.g. April 2025, FY 2024-25' },
        { name: 'gross_salary', label: 'Gross Monthly Salary', type: 'text', required: true, placeholder: 'e.g. ₹75,000' },
        { name: 'earnings', label: 'Earnings Breakdown', type: 'textarea', required: false, placeholder: 'Basic, HRA, DA, special allowance, overtime, bonus...' },
        { name: 'deductions', label: 'Deductions', type: 'textarea', required: false, placeholder: 'PF, ESI, PT, TDS, advance recovery, leave deductions...' },
        { name: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'Your company name' },
        { name: 'jurisdiction', label: 'Country / State', type: 'text', required: false, placeholder: 'e.g. India — Maharashtra, UK, Singapore' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Financial Statement Writer',
      slug: 'financial-statement-writer',
      icon: '📋',
      description: 'Generate notes, commentary, and narrative for financial statements.',
      industryId: bySlug('accounting-tax'),
      systemPrompt: 'You are a chartered accountant specialising in financial reporting. You write clear, accurate, and GAAP/IFRS-aligned notes and commentary for financial statements that explain the numbers, disclose material information, and meet reporting standards.',
      userPromptTemplate: `Write financial statement {document_section} for:

Company name & type: {company}
Reporting period: {period}
Financial data: {financial_data}
Accounting standards: {standards}
Specific notes required: {notes_required}
Audience: {audience}

Provide well-structured, professional content that accurately reflects the financial position, complies with disclosure requirements, and is written in clear accounting language appropriate for the audience.`,
      fields: [
        { name: 'document_section', label: 'Section / Document', type: 'select', required: true, options: ['Director\'s report', 'Management discussion & analysis (MD&A)', 'Notes to accounts', 'Auditor\'s report narrative', 'Cash flow statement notes', 'Significant accounting policies', 'Going concern assessment'] },
        { name: 'company', label: 'Company Name & Type', type: 'text', required: true, placeholder: 'e.g. ABC Industries Pvt Ltd — manufacturing SME' },
        { name: 'period', label: 'Reporting Period', type: 'text', required: true, placeholder: 'e.g. FY 2024-25 (31 March 2025)' },
        { name: 'financial_data', label: 'Key Financial Data', type: 'textarea', required: true, placeholder: 'Revenue, profit, key balance sheet items, significant transactions...' },
        { name: 'standards', label: 'Accounting Standards', type: 'select', required: false, options: ['Indian GAAP (AS)', 'Ind AS (IFRS-aligned)', 'IFRS', 'US GAAP', 'Not specified'] },
        { name: 'notes_required', label: 'Specific Notes Required', type: 'textarea', required: false, placeholder: 'Any specific disclosures, changes in policy, related-party transactions...' },
        { name: 'audience', label: 'Primary Audience', type: 'select', required: false, options: ['Statutory filing', 'Shareholders / investors', 'Banks & lenders', 'Board of directors'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── AUTOMOTIVE (additional) ──────────────────────────────────────────────
    {
      name: 'Warranty Claim Letter',
      slug: 'warranty-claim-letter',
      icon: '🔧',
      description: 'Draft warranty claim letters and escalation communications for vehicle defects.',
      industryId: bySlug('automotive'),
      systemPrompt: 'You are an automotive consumer rights specialist. You draft precise, well-documented warranty claim letters that clearly state the defect, reference the warranty terms, and compel manufacturers and dealers to take action. You know what to include to make a claim undeniable.',
      userPromptTemplate: `Draft a warranty claim letter for:

Claim to: {recipient}
Vehicle details: {vehicle}
Purchase date & dealer: {purchase_info}
Defect description: {defect}
Repair attempts made: {repair_attempts}
Warranty coverage: {warranty}
Resolution requested: {resolution}
Owner details: {owner}

Write a firm, professional letter with: full complaint, timeline of events, warranty reference, specific resolution demand, and a clear deadline for response.`,
      fields: [
        { name: 'recipient', label: 'Letter Addressed To', type: 'select', required: true, options: ['Authorised dealer / service centre', 'Vehicle manufacturer (OEM)', 'Consumer forum / NCDRC', 'Insurance company'] },
        { name: 'vehicle', label: 'Vehicle Details', type: 'text', required: true, placeholder: 'Make, model, year, registration number, VIN/chassis number' },
        { name: 'purchase_info', label: 'Purchase Date & Dealer', type: 'text', required: true, placeholder: 'Date of purchase and dealer name/location' },
        { name: 'defect', label: 'Defect Description', type: 'textarea', required: true, placeholder: 'Describe the problem in detail — what happens, when, how often...' },
        { name: 'repair_attempts', label: 'Repair Attempts So Far', type: 'textarea', required: false, placeholder: 'Dates visited, work done, job card numbers, outcome...' },
        { name: 'warranty', label: 'Warranty Coverage Reference', type: 'text', required: false, placeholder: 'e.g. 3-year / 1,00,000 km warranty, extended warranty plan' },
        { name: 'resolution', label: 'Resolution Requested', type: 'select', required: true, options: ['Free repair under warranty', 'Replacement of defective part', 'Full vehicle replacement', 'Refund', 'Compensation for downtime/expenses'] },
        { name: 'owner', label: 'Vehicle Owner Details', type: 'textarea', required: true, placeholder: 'Name, address, contact number' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Vehicle Service Package Proposal',
      slug: 'vehicle-service-package-proposal',
      icon: '🛠️',
      description: 'Create compelling annual maintenance contract and service package proposals.',
      industryId: bySlug('automotive'),
      systemPrompt: 'You are an automotive service business development specialist. You create compelling AMC (Annual Maintenance Contract) and service package proposals that clearly communicate value, build trust, and convert vehicle owners into long-term service customers.',
      userPromptTemplate: `Create a vehicle service package proposal for:

Package type: {package_type}
Workshop / dealership: {workshop}
Vehicle make/model: {vehicle}
Package duration: {duration}
Services included: {services}
Package price: {price}
Current market comparison: {comparison}
Customer name: {customer}

Provide:
1. **Proposal Cover Letter** (personalised)
2. **Package Overview** (what's included, clearly laid out)
3. **Services Included Table** with frequency and value
4. **Cost Comparison** (package vs. pay-as-you-go)
5. **Key Benefits Highlighted**
6. **Terms & Conditions** (brief)
7. **CTA** (how to enroll)`,
      fields: [
        { name: 'package_type', label: 'Package Type', type: 'select', required: true, options: ['Annual Maintenance Contract (AMC)', 'Comprehensive service plan', 'Basic service plan', 'Fleet service contract', 'Pre-owned vehicle service package', 'EV maintenance package'] },
        { name: 'workshop', label: 'Workshop / Dealership Name', type: 'text', required: true, placeholder: 'Your business name' },
        { name: 'vehicle', label: 'Vehicle Make & Model', type: 'text', required: true, placeholder: 'e.g. Maruti Swift, Toyota Innova, Fleet of 10 Boleros' },
        { name: 'duration', label: 'Package Duration', type: 'select', required: true, options: ['6 months', '1 year', '2 years', '3 years'] },
        { name: 'services', label: 'Services Included', type: 'textarea', required: true, placeholder: 'List all services covered (oil change, filter, tyres, etc.)...' },
        { name: 'price', label: 'Package Price', type: 'text', required: true, placeholder: 'e.g. ₹12,500/year' },
        { name: 'comparison', label: 'Standard Rate Comparison', type: 'text', required: false, placeholder: 'e.g. Same services would cost ₹19,000 individually' },
        { name: 'customer', label: 'Customer Name', type: 'text', required: false, placeholder: 'Prospective customer\'s name' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── CYBERSECURITY (additional) ───────────────────────────────────────────
    {
      name: 'Penetration Test Report',
      slug: 'pentest-report',
      icon: '🔍',
      description: 'Generate structured penetration test reports with findings and remediation guidance.',
      industryId: bySlug('cybersecurity'),
      systemPrompt: 'You are a senior penetration tester and cybersecurity consultant. You write professional, structured pentest reports that clearly communicate findings to both executive and technical audiences, with accurate risk ratings and actionable remediation guidance.',
      userPromptTemplate: `Generate a penetration test report for:

Target scope: {scope}
Test type: {test_type}
Testing period: {test_period}
Methodology: {methodology}
Findings summary: {findings}
Client organisation: {client}
Tester / team: {tester}

Provide a complete report:
1. **Executive Summary** (non-technical, key risks, overall rating)
2. **Scope & Methodology**
3. **Findings Table** (ID, title, severity, CVSS score)
4. **Detailed Findings** per vulnerability (description, evidence, impact, remediation)
5. **Risk Heatmap Summary**
6. **Remediation Roadmap** (prioritised)
7. **Positive Security Controls Observed**
8. **Conclusion & Retest Recommendation**`,
      fields: [
        { name: 'scope', label: 'Test Scope / Target', type: 'textarea', required: true, placeholder: 'e.g. Web app at app.example.com, internal network 192.168.1.0/24, mobile app' },
        { name: 'test_type', label: 'Test Type', type: 'select', required: true, options: ['External network pentest', 'Internal network pentest', 'Web application pentest', 'Mobile app pentest', 'API security test', 'Social engineering / phishing simulation', 'Red team exercise', 'Cloud infrastructure review'] },
        { name: 'test_period', label: 'Testing Period', type: 'text', required: true, placeholder: 'e.g. 15-19 April 2025' },
        { name: 'methodology', label: 'Methodology Used', type: 'text', required: false, placeholder: 'e.g. OWASP Top 10, PTES, NIST, Black/Grey/White box' },
        { name: 'findings', label: 'Findings Summary', type: 'textarea', required: true, placeholder: 'List each vulnerability found with brief description and severity...' },
        { name: 'client', label: 'Client Organisation', type: 'text', required: true, placeholder: 'Client company name' },
        { name: 'tester', label: 'Tester / Firm Name', type: 'text', required: false, placeholder: 'Your name or firm' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Data Privacy & GDPR Compliance Guide',
      slug: 'gdpr-privacy-compliance-guide',
      icon: '🔒',
      description: 'Generate data privacy compliance guides, DPIA templates, and privacy notices.',
      industryId: bySlug('cybersecurity'),
      systemPrompt: 'You are a data protection officer (DPO) and privacy law specialist. You produce practical, jurisdiction-specific data privacy compliance documents that help organisations comply with GDPR, DPDP Act, CCPA, and other regulations. You translate legal obligations into actionable steps.',
      userPromptTemplate: `Create a data privacy compliance document:

Document type: {doc_type}
Organisation type: {org_type}
Data processed: {data_types}
Processing purposes: {purposes}
Applicable regulation(s): {regulations}
Jurisdiction: {jurisdiction}
Audience: {audience}

Provide a complete, regulation-aligned document with all required sections, clear obligations, practical guidance, and a compliance checklist.`,
      fields: [
        { name: 'doc_type', label: 'Document Type', type: 'select', required: true, options: ['Privacy Policy (website)', 'Data Protection Impact Assessment (DPIA)', 'Privacy Notice for employees', 'Data Processing Agreement (DPA)', 'Cookie Policy', 'Data Breach Response Plan', 'Records of Processing Activities (RoPA)', 'Consent form / opt-in language'] },
        { name: 'org_type', label: 'Organisation Type', type: 'text', required: true, placeholder: 'e.g. E-commerce platform, Healthcare app, B2B SaaS, NGO' },
        { name: 'data_types', label: 'Types of Data Processed', type: 'textarea', required: true, placeholder: 'e.g. Names, emails, health records, payment data, location data...' },
        { name: 'purposes', label: 'Processing Purposes', type: 'textarea', required: true, placeholder: 'Why is the data collected? What is it used for?' },
        { name: 'regulations', label: 'Applicable Regulation(s)', type: 'select', required: true, options: ['GDPR (EU/UK)', 'India DPDP Act 2023', 'CCPA (California)', 'HIPAA (US Healthcare)', 'Multiple regulations', 'Not sure — generate general best practice'] },
        { name: 'jurisdiction', label: 'Primary Jurisdiction', type: 'text', required: false, placeholder: 'e.g. India, EU, USA, Global' },
        { name: 'audience', label: 'Document Audience', type: 'select', required: false, options: ['Website visitors / customers', 'Employees', 'Partners / vendors', 'Regulators', 'Internal compliance team'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── HEALTHCARE (additional) ──────────────────────────────────────────────
    {
      name: 'Doctor Referral Letter',
      slug: 'doctor-referral-letter',
      icon: '👨‍⚕️',
      description: 'Generate professional doctor-to-doctor referral and consultation request letters.',
      industryId: bySlug('healthcare'),
      systemPrompt: 'You are a clinical communication specialist. You produce professional, complete referral letters that give the receiving specialist exactly the information they need to continue patient care efficiently. Your letters are concise, clinically precise, and professionally formatted.',
      userPromptTemplate: `Write a medical referral letter:

Referring doctor: {referring_doctor}
Specialist / recipient: {specialist}
Patient (anonymised): {patient}
Referral reason: {reason}
Relevant history: {history}
Current medications: {medications}
Investigations done: {investigations}
Urgency: {urgency}

Provide:
1. **Formal Referral Letter** (ready to send)
2. **Clinical Summary** section
3. **Specific Questions / Information Requested from Specialist**
4. **Follow-up Instructions**`,
      fields: [
        { name: 'referring_doctor', label: 'Referring Doctor & Facility', type: 'text', required: true, placeholder: 'Dr. Name, Speciality, Hospital/Clinic name' },
        { name: 'specialist', label: 'Referred To (Specialist / Hospital)', type: 'text', required: true, placeholder: 'Dr. Name / Department / Hospital' },
        { name: 'patient', label: 'Patient Details (anonymised)', type: 'text', required: true, placeholder: 'e.g. 52-year-old male, diabetic, hypertensive' },
        { name: 'reason', label: 'Reason for Referral', type: 'textarea', required: true, placeholder: 'Clinical reason / presenting complaint requiring specialist opinion...' },
        { name: 'history', label: 'Relevant Medical History', type: 'textarea', required: true, placeholder: 'Past medical history, surgical history, family history relevant to referral...' },
        { name: 'medications', label: 'Current Medications', type: 'textarea', required: false, placeholder: 'List current drugs, doses, and duration...' },
        { name: 'investigations', label: 'Investigations Already Done', type: 'textarea', required: false, placeholder: 'Lab reports, imaging, biopsies completed and findings...' },
        { name: 'urgency', label: 'Referral Urgency', type: 'select', required: true, options: ['Routine (within 4-6 weeks)', 'Soon (within 1-2 weeks)', 'Urgent (within 48-72 hours)', 'Emergency (same day)'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Hospital / Clinic Communication',
      slug: 'hospital-clinic-communication',
      icon: '🏥',
      description: 'Write professional hospital communications — notices, patient letters, and admin correspondence.',
      industryId: bySlug('healthcare'),
      systemPrompt: 'You are a healthcare communications specialist. You write clear, empathetic, and compliant hospital and clinic communications that reassure patients, maintain professional standards, and meet healthcare regulatory requirements.',
      userPromptTemplate: `Write a healthcare communication:

Communication type: {comm_type}
Hospital / clinic: {facility}
Patient / recipient: {recipient}
Key message: {message}
Appointment / procedure details: {details}
Contact information: {contact}
Tone: {tone}

Provide:
1. **Main Communication** (ready to send)
2. **Short SMS / WhatsApp Version**
3. **Subject line** (if email format)`,
      fields: [
        { name: 'comm_type', label: 'Communication Type', type: 'select', required: true, options: ['Appointment reminder', 'Test results notification', 'Pre-procedure instructions', 'Post-treatment care instructions', 'Bill / payment notice', 'Feedback request', 'Health camp / awareness notice', 'Admission confirmation', 'Discharge follow-up'] },
        { name: 'facility', label: 'Hospital / Clinic Name', type: 'text', required: true, placeholder: 'Your facility name' },
        { name: 'recipient', label: 'Patient / Recipient Name', type: 'text', required: true, placeholder: 'e.g. Mr. Rajesh Kumar / Patient of Dr. Sharma' },
        { name: 'message', label: 'Key Message / Details', type: 'textarea', required: true, placeholder: 'Main information to communicate...' },
        { name: 'details', label: 'Appointment / Procedure Details', type: 'text', required: false, placeholder: 'Date, time, department, special instructions...' },
        { name: 'contact', label: 'Contact / Helpline', type: 'text', required: false, placeholder: 'Phone number, email, or department to contact' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Warm & reassuring', 'Professional & formal', 'Urgent & clear', 'Informational'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── RETAIL (additional) ──────────────────────────────────────────────────
    {
      name: 'Customer Complaint Response',
      slug: 'customer-complaint-response',
      icon: '💬',
      description: 'Write empathetic, solution-focused responses to customer complaints.',
      industryId: bySlug('retail'),
      systemPrompt: 'You are a retail customer experience specialist. You handle complaints in a way that turns unhappy customers into loyal ones. Your responses are empathetic, take responsibility where appropriate, offer clear solutions, and leave the customer feeling heard and valued.',
      userPromptTemplate: `Write a customer complaint response:

Complaint channel: {channel}
Customer name: {customer_name}
Complaint details: {complaint}
What went wrong: {issue}
Resolution offered: {resolution}
Brand tone: {tone}

Write a response that: opens with empathy, acknowledges the specific issue, apologises sincerely, explains what happened (briefly, without excuses), provides a clear resolution, and ends on a positive note. Keep it under 200 words.`,
      fields: [
        { name: 'channel', label: 'Response Channel', type: 'select', required: true, options: ['Email reply', 'In-store verbal script', 'WhatsApp / SMS', 'Social media comment', 'Online review (Google / Amazon)'] },
        { name: 'customer_name', label: 'Customer Name', type: 'text', required: true, placeholder: 'Customer first name' },
        { name: 'complaint', label: 'Customer Complaint Summary', type: 'textarea', required: true, placeholder: 'What is the customer complaining about?' },
        { name: 'issue', label: 'Root Cause / What Actually Happened', type: 'textarea', required: false, placeholder: 'Internal context — what went wrong and why...' },
        { name: 'resolution', label: 'Resolution Being Offered', type: 'text', required: true, placeholder: 'e.g. Full refund, replacement, ₹500 voucher, free exchange' },
        { name: 'tone', label: 'Brand Tone', type: 'select', required: false, options: ['Warm & apologetic', 'Professional & formal', 'Friendly & casual', 'Premium / luxury brand'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Store Newsletter & Announcement',
      slug: 'store-newsletter-announcement',
      icon: '📣',
      description: 'Write engaging store newsletters, new arrival announcements, and event communications.',
      industryId: bySlug('retail'),
      systemPrompt: 'You are a retail content marketer. You write store newsletters and announcements that customers actually open, read, and act on. Your content is warm, exciting, and always gives the reader a reason to visit the store or shop online.',
      userPromptTemplate: `Write a store {content_type}:

Store / brand name: {store_name}
Main announcement: {announcement}
Products / offers to feature: {features}
Target audience: {audience}
Tone: {tone}
CTA: {cta}
Distribution channel: {channel}

Create engaging content that grabs attention, communicates value clearly, and drives action. Include subject line if email format.`,
      fields: [
        { name: 'content_type', label: 'Content Type', type: 'select', required: true, options: ['Monthly newsletter', 'New arrivals announcement', 'Sale announcement', 'Store opening / re-opening', 'Brand story / about us', 'Seasonal / festival message', 'Product spotlight', 'Event / workshop invitation'] },
        { name: 'store_name', label: 'Store / Brand Name', type: 'text', required: true, placeholder: 'Your store name' },
        { name: 'announcement', label: 'Main Announcement / Theme', type: 'textarea', required: true, placeholder: 'What is the primary message you want to share?' },
        { name: 'features', label: 'Products / Offers to Feature', type: 'textarea', required: false, placeholder: 'Specific products, collections, or deals to highlight...' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: false, placeholder: 'e.g. Existing customers, loyalty members, families' },
        { name: 'tone', label: 'Tone', type: 'select', required: false, options: ['Warm & friendly', 'Exciting & energetic', 'Premium & aspirational', 'Festive & celebratory', 'Informational'] },
        { name: 'cta', label: 'Call to Action', type: 'text', required: false, placeholder: 'e.g. Visit us this weekend, Shop now, Book your spot' },
        { name: 'channel', label: 'Distribution Channel', type: 'select', required: false, options: ['Email', 'WhatsApp broadcast', 'SMS', 'Social media caption', 'In-store display / notice'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Visual Merchandising Brief',
      slug: 'visual-merchandising-brief',
      icon: '🏬',
      description: 'Create visual merchandising plans and display briefs for retail store layouts.',
      industryId: bySlug('retail'),
      systemPrompt: 'You are a visual merchandising expert with retail design experience. You create detailed, actionable display briefs that help store teams create compelling product displays, optimise store flow, and maximise sales per square foot.',
      userPromptTemplate: `Create a visual merchandising plan for:

Store type: {store_type}
Display area: {display_area}
Season / campaign: {season}
Key products to feature: {products}
Target customer: {target}
Store size & layout notes: {layout}
Budget level: {budget}

Provide:
1. **Display Concept & Theme**
2. **Zone-by-Zone Layout Plan** (entrance, middle floor, checkout)
3. **Focal Point / Hero Display** instructions
4. **Product Placement Guidelines** (eye level, cross-selling)
5. **Colour & Props Recommendations**
6. **Signage & POS Material Suggestions**
7. **Lighting Notes**
8. **Team Setup Checklist**`,
      fields: [
        { name: 'store_type', label: 'Store Type', type: 'select', required: true, options: ['Fashion / apparel', 'Electronics', 'Grocery / supermarket', 'Pharmacy / health', 'Home décor / furniture', 'Jewellery', 'Sports & fitness', 'Bookstore', 'Multi-brand outlet'] },
        { name: 'display_area', label: 'Display Area / Section', type: 'text', required: true, placeholder: 'e.g. Entrance window, summer collection zone, checkout counter' },
        { name: 'season', label: 'Season / Campaign', type: 'text', required: true, placeholder: 'e.g. Summer 2025, Diwali, Back to School, Valentine\'s Day' },
        { name: 'products', label: 'Key Products to Feature', type: 'textarea', required: true, placeholder: 'Hero products, new arrivals, or sale items to highlight...' },
        { name: 'target', label: 'Target Customer Profile', type: 'text', required: false, placeholder: 'e.g. Young women 18-30, families with kids, premium shoppers' },
        { name: 'layout', label: 'Store Layout Notes', type: 'textarea', required: false, placeholder: 'Approximate dimensions, fixtures available, any constraints...' },
        { name: 'budget', label: 'Display Budget Level', type: 'select', required: false, options: ['Low (use existing fixtures, no new props)', 'Medium (some new props/signage allowed)', 'High (full custom display possible)'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── LOGISTICS (additional) ───────────────────────────────────────────────
    {
      name: 'Customs & Import Documentation Guide',
      slug: 'customs-import-docs-guide',
      icon: '🛃',
      description: 'Generate customs documentation guides and import/export compliance checklists.',
      industryId: bySlug('logistics'),
      systemPrompt: 'You are an international trade and customs compliance specialist. You produce accurate, practical customs documentation guides and compliance checklists that help importers, exporters, and freight companies navigate customs procedures correctly and avoid costly delays.',
      userPromptTemplate: `Generate a customs documentation guide for:

Trade type: {trade_type}
Product / commodity: {product}
Origin country: {origin}
Destination country: {destination}
HS code (if known): {hs_code}
Shipment value: {value}
Special requirements: {requirements}

Provide:
1. **Required Documents Checklist** (with descriptions)
2. **Customs Process Overview** (step-by-step)
3. **Applicable Duties & Taxes** (estimated)
4. **Key Compliance Points** to verify
5. **Common Mistakes That Cause Delays**
6. **Restricted / Prohibited Items** to be aware of
7. **Useful Contacts / Portals**`,
      fields: [
        { name: 'trade_type', label: 'Trade Type', type: 'select', required: true, options: ['Import into India', 'Export from India', 'Import into UK / EU', 'Export to USA', 'Import into UAE / GCC', 'Cross-border e-commerce shipment', 'Re-export / transit shipment'] },
        { name: 'product', label: 'Product / Commodity', type: 'text', required: true, placeholder: 'e.g. Electronic components, Textiles, Pharmaceutical raw materials' },
        { name: 'origin', label: 'Country of Origin', type: 'text', required: true, placeholder: 'e.g. China, Germany, USA' },
        { name: 'destination', label: 'Destination Country', type: 'text', required: true, placeholder: 'e.g. India, United Kingdom, UAE' },
        { name: 'hs_code', label: 'HS / Customs Code (optional)', type: 'text', required: false, placeholder: 'e.g. 8471.30 for laptops' },
        { name: 'value', label: 'Approximate Shipment Value', type: 'text', required: false, placeholder: 'e.g. USD 15,000 CIF' },
        { name: 'requirements', label: 'Special Requirements', type: 'textarea', required: false, placeholder: 'Perishables, hazmat, dual-use goods, FTA preferences...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Warehouse Operations SOP',
      slug: 'warehouse-sop-writer',
      icon: '🏭',
      description: 'Write clear warehouse SOPs, operational procedures, and process guides.',
      industryId: bySlug('logistics'),
      systemPrompt: 'You are a warehouse operations manager and process documentation specialist. You write clear, practical SOPs that warehouse teams can follow without confusion. Your procedures reduce errors, improve efficiency, and ensure safety and compliance.',
      userPromptTemplate: `Write a warehouse SOP for:

Process / operation: {process}
Warehouse type: {warehouse_type}
Team role performing this: {team_role}
Equipment / systems involved: {equipment}
Safety requirements: {safety}
Key performance targets: {kpi}
Special notes: {notes}

Provide:
1. **SOP Title, Scope & Objective**
2. **Prerequisites** (training, PPE, access needed)
3. **Step-by-Step Procedure** (numbered, with decision points)
4. **Quality Checks** at critical steps
5. **Safety Precautions**
6. **Common Errors & How to Avoid Them**
7. **KPIs to Measure Performance**
8. **Exception Handling** (what to do if something goes wrong)
9. **Document Control** (version, review date)`,
      fields: [
        { name: 'process', label: 'Process / Operation', type: 'select', required: true, options: ['Inbound receiving & inspection', 'Put-away & storage', 'Order picking (single / batch)', 'Packing & dispatch', 'Inventory cycle count', 'Returns processing', 'Cold chain / temperature-controlled handling', 'Hazardous materials handling', 'Loading / unloading dock operations'] },
        { name: 'warehouse_type', label: 'Warehouse Type', type: 'select', required: false, options: ['Dry goods / general merchandise', 'Cold storage / FMCG', 'E-commerce fulfilment centre', 'Pharmaceutical / healthcare', 'Automotive parts', 'Raw materials / manufacturing'] },
        { name: 'team_role', label: 'Team Role Performing This', type: 'text', required: false, placeholder: 'e.g. Warehouse associate, Picker-packer, Inbound team' },
        { name: 'equipment', label: 'Equipment / Systems Involved', type: 'text', required: false, placeholder: 'e.g. WMS software, barcode scanners, forklift, conveyor' },
        { name: 'safety', label: 'Key Safety Requirements', type: 'textarea', required: false, placeholder: 'PPE, load limits, restricted zones, safety signage...' },
        { name: 'kpi', label: 'Key Performance Targets', type: 'text', required: false, placeholder: 'e.g. 99.5% accuracy, 50 picks/hour, zero safety incidents' },
        { name: 'notes', label: 'Special Notes / Context', type: 'textarea', required: false, placeholder: 'Any specific compliance, audit, or operational requirements...' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── AGRICULTURE (additional) ─────────────────────────────────────────────
    {
      name: 'Agricultural Loan Application',
      slug: 'agricultural-loan-application',
      icon: '🏦',
      description: 'Write agricultural loan applications for Kisan Credit Card, crop loans, and farm equipment finance.',
      industryId: bySlug('agriculture'),
      systemPrompt: 'You are an agricultural finance specialist and rural banking expert. You help farmers and agribusinesses write clear, compelling loan applications that meet bank and NABARD requirements. You know what agricultural lenders need to see to approve credit.',
      userPromptTemplate: `Write an agricultural loan application for:

Loan type: {loan_type}
Applicant details: {applicant}
Farm details: {farm_details}
Crop / purpose: {crop_purpose}
Loan amount requested: {amount}
Repayment plan: {repayment}
Collateral: {collateral}
Bank / institution: {bank}

Provide:
1. **Formal Loan Application Letter**
2. **Farm Profile Summary**
3. **Loan Purpose & Utilisation Plan**
4. **Repayment Capacity Justification** (income estimate)
5. **Collateral Summary**
6. **Documents Checklist** for the bank`,
      fields: [
        { name: 'loan_type', label: 'Loan Type', type: 'select', required: true, options: ['Crop loan / Kisan Credit Card (KCC)', 'Farm equipment / tractor loan', 'Irrigation / water infrastructure', 'Horticulture / plantation loan', 'Warehouse / storage facility', 'Agri-business / processing unit', 'Animal husbandry / fisheries', 'MSME agri-enterprise loan'] },
        { name: 'applicant', label: 'Applicant Details', type: 'textarea', required: true, placeholder: 'Name, age, address, land holding, farming experience...' },
        { name: 'farm_details', label: 'Farm Details', type: 'textarea', required: true, placeholder: 'Area, location, land ownership/lease, soil type, irrigation...' },
        { name: 'crop_purpose', label: 'Crop / Loan Purpose', type: 'textarea', required: true, placeholder: 'What crops are grown / what will the loan fund specifically?' },
        { name: 'amount', label: 'Loan Amount Required', type: 'text', required: true, placeholder: 'e.g. ₹3,00,000' },
        { name: 'repayment', label: 'Proposed Repayment Plan', type: 'text', required: false, placeholder: 'e.g. Post-harvest lump sum in November, 3-year EMI plan' },
        { name: 'collateral', label: 'Collateral / Security Offered', type: 'text', required: false, placeholder: 'e.g. Agricultural land, hypothecation of equipment' },
        { name: 'bank', label: 'Bank / Institution', type: 'text', required: false, placeholder: 'e.g. State Bank of India, NABARD, Regional Rural Bank' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Crop Insurance Claim Writer',
      slug: 'crop-insurance-claim',
      icon: '🌧️',
      description: 'Write structured crop insurance claim letters with loss assessment details.',
      industryId: bySlug('agriculture'),
      systemPrompt: 'You are an agricultural insurance specialist. You help farmers write clear, well-documented crop insurance claims that include all required information, reference the correct scheme, and maximise the chance of timely settlement.',
      userPromptTemplate: `Write a crop insurance claim for:

Scheme: {scheme}
Farmer details: {farmer}
Policy details: {policy}
Crop and area: {crop}
Cause of loss: {cause}
Loss assessment: {loss_details}
Date of damage: {damage_date}
Bank / insurance office: {recipient}

Provide:
1. **Formal Claim Letter** (ready to submit)
2. **Loss Assessment Summary**
3. **Supporting Documents Checklist**
4. **Follow-up Timeline** (typical PMFBY / scheme process)`,
      fields: [
        { name: 'scheme', label: 'Insurance Scheme', type: 'select', required: true, options: ['PMFBY (Pradhan Mantri Fasal Bima Yojana)', 'RWBCIS (Restructured Weather Based)', 'State government scheme', 'Private crop insurance policy', 'Other'] },
        { name: 'farmer', label: 'Farmer Details', type: 'textarea', required: true, placeholder: 'Name, address, mobile, Aadhaar, bank account...' },
        { name: 'policy', label: 'Policy / Application Details', type: 'text', required: false, placeholder: 'Policy number, season, sum insured...' },
        { name: 'crop', label: 'Crop Type & Area', type: 'text', required: true, placeholder: 'e.g. Cotton — 2.5 acres, Paddy — 1 hectare' },
        { name: 'cause', label: 'Cause of Crop Loss', type: 'select', required: true, options: ['Drought / insufficient rainfall', 'Flood / excess rainfall', 'Hailstorm', 'Cyclone / high winds', 'Pest & disease outbreak', 'Cold wave / frost', 'Fire', 'Other natural calamity'] },
        { name: 'loss_details', label: 'Loss Assessment Details', type: 'textarea', required: true, placeholder: 'Estimated % loss, yield before/after, visible damage description...' },
        { name: 'damage_date', label: 'Date of Damage', type: 'text', required: true, placeholder: 'e.g. 15 September 2025' },
        { name: 'recipient', label: 'Bank / Insurance Office', type: 'text', required: false, placeholder: 'Bank branch name or insurance company office' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Market Price & Commodity Report',
      slug: 'agri-market-price-report',
      icon: '📊',
      description: 'Generate commodity price analysis reports and market outlook summaries for farmers.',
      industryId: bySlug('agriculture'),
      systemPrompt: 'You are an agricultural market analyst. You produce clear, practical commodity and market reports that help farmers and agribusinesses make informed selling decisions. You translate market data into plain-language advice and strategic recommendations.',
      userPromptTemplate: `Generate an agricultural market report for:

Commodity: {commodity}
Market / APMC: {market}
Current prices: {prices}
Season context: {season}
Demand drivers: {demand_drivers}
Supply situation: {supply}
Audience: {audience}

Provide:
1. **Market Summary** (current price & 1-week trend)
2. **Price Comparison** (local mandi vs. MSP vs. state average)
3. **Demand & Supply Analysis**
4. **Key Price Drivers This Week**
5. **3-4 Week Outlook**
6. **Farmer Recommendations** (sell now / store / forward contract)
7. **Nearby Alternative Markets** to consider`,
      fields: [
        { name: 'commodity', label: 'Commodity / Crop', type: 'text', required: true, placeholder: 'e.g. Soybean, Onion, Cotton, Tomato, Wheat' },
        { name: 'market', label: 'Market / APMC Name', type: 'text', required: true, placeholder: 'e.g. Pune APMC, Lasalgaon, APMC Bangalore' },
        { name: 'prices', label: 'Current Price Data', type: 'textarea', required: true, placeholder: 'Today\'s rates, last week\'s rates, MSP if applicable...' },
        { name: 'season', label: 'Season / Harvest Context', type: 'text', required: false, placeholder: 'e.g. Post-harvest Kharif, peak arrival season, off-season' },
        { name: 'demand_drivers', label: 'Known Demand Drivers', type: 'textarea', required: false, placeholder: 'Festive demand, export orders, processing industry demand...' },
        { name: 'supply', label: 'Supply Situation', type: 'textarea', required: false, placeholder: 'Arrival volumes, cold storage stocks, crop damage reports...' },
        { name: 'audience', label: 'Audience', type: 'select', required: false, options: ['Individual farmer', 'Farmer producer organisation (FPO)', 'Trader / commission agent', 'Agri-business / processor', 'Government extension officer'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── SOFTWARE DEV / IT (additional) ──────────────────────────────────────
    {
      name: 'Sprint & Project Status Report',
      slug: 'sprint-project-status-report',
      icon: '📋',
      description: 'Generate sprint summaries, project status reports, and engineering update emails.',
      industryId: bySlug('software-it'),
      systemPrompt: 'You are a technical project manager and engineering communicator. You write clear, honest project status reports that keep stakeholders informed, highlight blockers, celebrate wins, and always end with clear next steps. You translate technical progress into business-readable language.',
      userPromptTemplate: `Write a {report_type}:

Project / sprint name: {project}
Period covered: {period}
Team: {team}
Planned work: {planned}
Completed work: {completed}
In progress: {in_progress}
Blockers / risks: {blockers}
Next period goals: {next_goals}
Audience: {audience}

Provide a clear, professional update with: overall status RAG indicator, progress summary, key achievements, blockers and mitigation, metrics (velocity / burn-down if relevant), and a crisp next-steps section.`,
      fields: [
        { name: 'report_type', label: 'Report Type', type: 'select', required: true, options: ['Sprint retrospective + next sprint plan', 'Weekly engineering update', 'Monthly project status report', 'Executive project dashboard update', 'Product launch readiness report', 'Post-mortem / incident review'] },
        { name: 'project', label: 'Project / Sprint Name', type: 'text', required: true, placeholder: 'e.g. Sprint 23 — Payments v2, Q2 Platform Migration' },
        { name: 'period', label: 'Period Covered', type: 'text', required: true, placeholder: 'e.g. 5-19 May 2025, Week 20' },
        { name: 'team', label: 'Team', type: 'text', required: false, placeholder: 'Team name and approximate size' },
        { name: 'planned', label: 'Planned Work / Goals', type: 'textarea', required: true, placeholder: 'What was committed for this period?' },
        { name: 'completed', label: 'Completed Work', type: 'textarea', required: true, placeholder: 'What was actually delivered / completed?' },
        { name: 'in_progress', label: 'Work In Progress', type: 'textarea', required: false, placeholder: 'Items started but not yet done...' },
        { name: 'blockers', label: 'Blockers & Risks', type: 'textarea', required: false, placeholder: 'What is slowing things down? Dependencies, risks...' },
        { name: 'next_goals', label: 'Next Period Goals', type: 'textarea', required: true, placeholder: 'What is the team committing to next?' },
        { name: 'audience', label: 'Report Audience', type: 'select', required: false, options: ['Engineering team (internal)', 'Product & tech leadership', 'Executive / C-suite', 'Client / external stakeholder'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'IT Incident Postmortem Report',
      slug: 'it-incident-postmortem',
      icon: '🔴',
      description: 'Write blameless IT postmortem reports with root cause analysis and action items.',
      industryId: bySlug('software-it'),
      systemPrompt: 'You are an SRE and incident management specialist. You facilitate blameless postmortems that identify root causes, document timelines accurately, and produce clear action items that prevent recurrence. Your reports build trust and improve system reliability.',
      userPromptTemplate: `Write an IT incident postmortem for:

Incident title: {incident_title}
Severity: {severity}
Date & duration: {date_duration}
Systems affected: {systems}
User / business impact: {impact}
Timeline of events: {timeline}
Root cause(s): {root_cause}
Immediate fix applied: {fix}
Contributing factors: {contributing_factors}

Produce a complete blameless postmortem with:
1. **Incident Summary** (severity, duration, impact)
2. **Detection & Response Timeline**
3. **Root Cause Analysis** (5-whys or fishbone)
4. **Contributing Factors**
5. **What Went Well**
6. **What Could Be Improved**
7. **Action Items** (owner, deadline per item)
8. **Metrics** (MTTD, MTTR)
9. **Communication Log Summary**`,
      fields: [
        { name: 'incident_title', label: 'Incident Title', type: 'text', required: true, placeholder: 'e.g. Payment service outage — 19 May 2025' },
        { name: 'severity', label: 'Severity / Priority Level', type: 'select', required: true, options: ['SEV-1 (Critical — complete outage)', 'SEV-2 (High — major feature down)', 'SEV-3 (Medium — partial degradation)', 'SEV-4 (Low — minor issue)'] },
        { name: 'date_duration', label: 'Date & Duration', type: 'text', required: true, placeholder: 'e.g. 19 May 2025, 14:32–17:05 IST (2h 33m)' },
        { name: 'systems', label: 'Systems / Services Affected', type: 'textarea', required: true, placeholder: 'Which services, APIs, or infrastructure components were affected?' },
        { name: 'impact', label: 'User & Business Impact', type: 'textarea', required: true, placeholder: 'Users affected, revenue impact, SLA breach, reputational impact...' },
        { name: 'timeline', label: 'Chronological Timeline', type: 'textarea', required: true, placeholder: 'Time: event (e.g. 14:32 — alerts fired, 14:45 — team paged, 15:10 — root cause identified...)' },
        { name: 'root_cause', label: 'Root Cause(s)', type: 'textarea', required: true, placeholder: 'What fundamentally caused the incident?' },
        { name: 'fix', label: 'Immediate Fix Applied', type: 'textarea', required: true, placeholder: 'What was done to resolve the incident?' },
        { name: 'contributing_factors', label: 'Contributing Factors', type: 'textarea', required: false, placeholder: 'Missing monitoring, lack of runbook, deployment without testing, etc.' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── AUTOMOBILE / RTO (additional) ────────────────────────────────────────
    {
      name: 'Traffic Challan Response Letter',
      slug: 'traffic-challan-response',
      icon: '🚦',
      description: 'Draft formal responses to traffic challans, fines, and RTO show-cause notices.',
      industryId: bySlug('automobile-rto'),
      systemPrompt: 'You are an RTO legal advisor and traffic law specialist. You draft precise, respectful, and legally sound responses to traffic challans and RTO notices that clearly state the facts, reference applicable rules, and seek fair resolution.',
      userPromptTemplate: `Draft a response to a traffic challan / notice:

Notice type: {notice_type}
Issuing authority: {authority}
Vehicle details: {vehicle}
Challan / notice details: {challan_details}
Owner / driver response: {response_basis}
Date of alleged offence: {offence_date}
Supporting documents available: {documents}

Provide:
1. **Formal Response Letter** (to the RTO/traffic authority)
2. **Facts Stated** clearly
3. **Legal / Rule Reference** (where applicable)
4. **Supporting Arguments**
5. **Relief Requested**
6. **Documents to Attach**`,
      fields: [
        { name: 'notice_type', label: 'Notice / Challan Type', type: 'select', required: true, options: ['Traffic challan (e-challan)', 'Rash driving notice', 'Overloading challan', 'Fitness certificate violation', 'RTO show-cause notice', 'Permit violation', 'Insurance/PUC violation notice', 'RC renewal / tax default notice'] },
        { name: 'authority', label: 'Issuing Authority', type: 'text', required: true, placeholder: 'e.g. Traffic Police, Regional Transport Officer (RTO), Motor Vehicle Inspector' },
        { name: 'vehicle', label: 'Vehicle Details', type: 'text', required: true, placeholder: 'Registration number, make/model' },
        { name: 'challan_details', label: 'Challan / Notice Details', type: 'textarea', required: true, placeholder: 'Challan number, offence alleged, amount, section violated...' },
        { name: 'response_basis', label: 'Basis for Your Response', type: 'textarea', required: true, placeholder: 'Were the facts incorrect? Was the vehicle not present? Technical error? Genuine defence?' },
        { name: 'offence_date', label: 'Date of Alleged Offence', type: 'text', required: false, placeholder: 'e.g. 10 April 2025' },
        { name: 'documents', label: 'Supporting Documents Available', type: 'text', required: false, placeholder: 'e.g. Insurance copy, RC, GPS records, photos, court paper' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Vehicle Loan Closure & Hypothecation Removal',
      slug: 'vehicle-loan-closure-letter',
      icon: '🏦',
      description: 'Draft loan closure confirmation requests and hypothecation removal letters for vehicles.',
      industryId: bySlug('automobile-rto'),
      systemPrompt: 'You are an automotive finance and RTO documentation specialist. You draft clear, professional letters for vehicle loan closures and hypothecation removal processes that banks, financiers, and RTOs accept without issue. You include all legally required information.',
      userPromptTemplate: `Draft a {document_type}:

Loan account details: {loan_details}
Vehicle details: {vehicle}
Owner details: {owner}
Financer / bank: {financer}
Loan closure details: {closure_info}
RTO jurisdiction: {rto}
Request or action needed: {request}

Produce a complete, formal letter with all required details, proper format, and clear request for action.`,
      fields: [
        { name: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Loan closure confirmation request (to bank)', 'NOC request from financer', 'Hypothecation removal application (to RTO)', 'Form 35 (hypothecation cancellation) cover letter', 'Financer NOC follow-up letter', 'RC book correction application (post-hypothecation removal)'] },
        { name: 'loan_details', label: 'Loan Account Details', type: 'text', required: true, placeholder: 'Loan account number, bank name, original loan amount' },
        { name: 'vehicle', label: 'Vehicle Details', type: 'text', required: true, placeholder: 'Registration number, make/model, chassis & engine number' },
        { name: 'owner', label: 'Vehicle Owner Details', type: 'textarea', required: true, placeholder: 'Name, address, contact, Aadhaar/PAN' },
        { name: 'financer', label: 'Financer / Bank Details', type: 'text', required: true, placeholder: 'Bank/NBFC name, branch, contact' },
        { name: 'closure_info', label: 'Loan Closure Details', type: 'text', required: false, placeholder: 'e.g. Final EMI paid on 15 April 2025, Loan closed in full' },
        { name: 'rto', label: 'RTO Jurisdiction', type: 'text', required: false, placeholder: 'e.g. RTO Mumbai (MH-01), RTO Bengaluru South (KA-41)' },
        { name: 'request', label: 'Specific Request / Action Needed', type: 'textarea', required: true, placeholder: 'What exactly do you need the recipient to do?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Driving Licence Application Guide',
      slug: 'driving-licence-guide',
      icon: '🪪',
      description: 'Generate step-by-step driving licence application guides for learner and permanent licences.',
      industryId: bySlug('automobile-rto'),
      systemPrompt: 'You are an RTO process expert. You produce clear, step-by-step driving licence application guides that cover the exact documents, tests, fees, and portal procedures for any state or licence category. You save applicants time and repeated RTO visits.',
      userPromptTemplate: `Generate a driving licence application guide for:

Licence type: {licence_type}
Vehicle category: {vehicle_category}
State / RTO: {state}
Applicant type: {applicant_type}
Age / special notes: {age_notes}

Provide:
1. **Eligibility Criteria**
2. **Documents Required** (original + attested copies)
3. **Step-by-Step Application Process** (online Sarathi portal + offline)
4. **Tests Involved** (written / driving test — what to expect)
5. **Fees Breakdown**
6. **Timeline** (from application to licence receipt)
7. **Common Rejection Reasons** to avoid
8. **Useful Links & Helpline Numbers**`,
      fields: [
        { name: 'licence_type', label: 'Licence Type', type: 'select', required: true, options: ['Learner\'s Licence (LLR) — new applicant', 'Permanent Driving Licence (DL) — first time', 'DL Renewal', 'Adding a new vehicle class to existing DL', 'Duplicate DL (lost/damaged)', 'International Driving Permit (IDP)', 'Commercial vehicle licence (LMV-TR)', 'Heavy Motor Vehicle (HMV) licence'] },
        { name: 'vehicle_category', label: 'Vehicle Category', type: 'select', required: true, options: ['Two-wheeler (Motorcycle / Scooter)', 'Four-wheeler (Private car / LMV)', 'Both two and four-wheeler', 'Commercial vehicle (transport)', 'Heavy commercial vehicle', 'All categories'] },
        { name: 'state', label: 'State / RTO', type: 'text', required: true, placeholder: 'e.g. Maharashtra, Karnataka (Bengaluru), Delhi, Tamil Nadu' },
        { name: 'applicant_type', label: 'Applicant Type', type: 'select', required: false, options: ['First-time applicant (18+)', 'Applicant with prior licence from another state', 'Applicant with international licence', 'Minor (MCWOG — 16-18 years, restricted)'] },
        { name: 'age_notes', label: 'Age / Special Notes', type: 'text', required: false, placeholder: 'e.g. 17 years old, NRI returning to India, senior citizen' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── GOVERNMENT & NGO (additional) ────────────────────────────────────────
    {
      name: 'RTI Application Writer',
      slug: 'rti-application-writer',
      icon: '📜',
      description: 'Draft precise RTI (Right to Information) applications to get the information you need.',
      industryId: bySlug('government-ngo'),
      systemPrompt: 'You are an RTI expert and public information law specialist. You draft precise, legally correct RTI applications that clearly request specific information, reference the correct provisions, and are formatted to maximise the chance of a complete, timely response.',
      userPromptTemplate: `Draft an RTI application:

Information sought: {information_sought}
Public Authority / department: {department}
Applicant details: {applicant}
Purpose (brief, optional): {purpose}
Time period of information: {time_period}
Specific documents requested: {documents}
State / jurisdiction: {jurisdiction}

Provide:
1. **RTI Application** (ready to submit — formatted per RTI Act 2005)
2. **Specific Questions** numbered and clearly worded
3. **Document Requests** listed separately
4. **Filing Instructions** (online portal / physical submission)
5. **What to Do If Denied or Partially Responded To**`,
      fields: [
        { name: 'information_sought', label: 'Information / Topic', type: 'textarea', required: true, placeholder: 'What information do you want to obtain?' },
        { name: 'department', label: 'Public Authority / Department', type: 'text', required: true, placeholder: 'e.g. Municipal Corporation of Greater Mumbai, NHAI, Income Tax Department' },
        { name: 'applicant', label: 'Applicant Details', type: 'text', required: true, placeholder: 'Name, address — RTI requires Indian citizen identification' },
        { name: 'purpose', label: 'Brief Purpose (optional)', type: 'text', required: false, placeholder: 'RTI does not require stating purpose, but can help if provided' },
        { name: 'time_period', label: 'Time Period of Information', type: 'text', required: false, placeholder: 'e.g. 1 April 2022 to 31 March 2025' },
        { name: 'documents', label: 'Specific Documents Requested', type: 'textarea', required: false, placeholder: 'Any specific files, registers, minutes, approvals, reports...' },
        { name: 'jurisdiction', label: 'State / Jurisdiction', type: 'text', required: true, placeholder: 'e.g. Maharashtra, Central (Union of India), Karnataka' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'NGO Annual Report Generator',
      slug: 'ngo-annual-report',
      icon: '📊',
      description: 'Create compelling NGO annual reports that inspire donors and demonstrate impact.',
      industryId: bySlug('government-ngo'),
      systemPrompt: 'You are an NGO communications specialist and impact reporting expert. You write compelling annual reports that tell the story of impact, build donor trust, meet FCRA / regulatory transparency requirements, and inspire continued and new funding.',
      userPromptTemplate: `Generate an NGO annual report for:

Organisation name: {org_name}
Reporting year: {year}
Mission statement: {mission}
Programmes run: {programmes}
Beneficiaries reached: {beneficiaries}
Key outcomes & impact data: {impact}
Financial summary: {financials}
Challenges faced: {challenges}
Goals for next year: {next_year_goals}
Key donors / partners: {donors}

Provide:
1. **Chairman / ED's Message**
2. **Organisation Overview & Mission**
3. **Year at a Glance** (key stats in visual format)
4. **Programme Highlights** (story + data per programme)
5. **Impact Stories** (1-2 beneficiary narratives)
6. **Financial Summary** (income, expenditure, utilisation)
7. **Acknowledgements** (donors, partners, volunteers)
8. **Goals for the Year Ahead**
9. **Call to Action** (donate, partner, volunteer)`,
      fields: [
        { name: 'org_name', label: 'Organisation Name', type: 'text', required: true, placeholder: 'Your NGO / Trust name' },
        { name: 'year', label: 'Reporting Year', type: 'text', required: true, placeholder: 'e.g. FY 2024-25 (April 2024 – March 2025)' },
        { name: 'mission', label: 'Mission Statement', type: 'textarea', required: true, placeholder: 'Your organisation\'s mission and vision...' },
        { name: 'programmes', label: 'Programmes Run', type: 'textarea', required: true, placeholder: 'List and briefly describe each programme...' },
        { name: 'beneficiaries', label: 'Beneficiaries Reached', type: 'text', required: true, placeholder: 'Total numbers and key demographics' },
        { name: 'impact', label: 'Key Outcomes & Impact Data', type: 'textarea', required: true, placeholder: 'Quantitative and qualitative outcomes per programme...' },
        { name: 'financials', label: 'Financial Summary', type: 'textarea', required: true, placeholder: 'Total income, expenditure, % utilisation, sources of funds...' },
        { name: 'challenges', label: 'Challenges Faced', type: 'textarea', required: false, placeholder: 'Honest reflection on difficulties and how they were addressed...' },
        { name: 'next_year_goals', label: 'Goals for Next Year', type: 'textarea', required: false, placeholder: 'Targets, new programmes, expansion plans...' },
        { name: 'donors', label: 'Key Donors & Partners', type: 'text', required: false, placeholder: 'Major funders and partners to acknowledge' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── WEDDING (additional) ─────────────────────────────────────────────────
    {
      name: 'Wedding Budget Planner',
      slug: 'wedding-budget-planner',
      icon: '💰',
      description: 'Create detailed wedding budgets with category breakdowns and cost-saving tips.',
      industryId: bySlug('wedding'),
      systemPrompt: 'You are a professional wedding planner and financial advisor for events. You create detailed, realistic wedding budgets that help couples allocate funds wisely, identify savings opportunities, and avoid common budget traps. You are practical, thorough, and empathetic.',
      userPromptTemplate: `Create a wedding budget plan for:

Total budget: {total_budget}
Wedding type: {wedding_type}
Guest count: {guests}
Location: {location}
Events included: {events}
Priority areas: {priorities}
Cost-saving areas: {savings_areas}

Provide:
1. **Budget Summary Table** (% and amount per category)
2. **Category Breakdown** (detailed line items per category)
3. **Estimated Total vs. Budget** comparison
4. **Cost-Saving Tips** for specific categories
5. **Contingency Reserve** recommendation (10-15%)
6. **Payment Timeline** (when to pay vendors)
7. **Budget Tracking Tips**`,
      fields: [
        { name: 'total_budget', label: 'Total Wedding Budget', type: 'text', required: true, placeholder: 'e.g. ₹10,00,000 / $15,000' },
        { name: 'wedding_type', label: 'Wedding Type', type: 'select', required: true, options: ['Intimate / small wedding (under 50)', 'Medium wedding (50-150)', 'Large wedding (150-300)', 'Grand wedding (300+)', 'Destination wedding', 'Court marriage + small celebration'] },
        { name: 'guests', label: 'Expected Guest Count', type: 'text', required: true, placeholder: 'e.g. 150 guests total across all events' },
        { name: 'location', label: 'Location / City', type: 'text', required: true, placeholder: 'e.g. Mumbai, Goa (destination), Delhi NCR' },
        { name: 'events', label: 'Events to Budget For', type: 'text', required: true, placeholder: 'e.g. Mehendi, Sangeet, Wedding ceremony, Reception' },
        { name: 'priorities', label: 'Priority Splurge Areas', type: 'text', required: false, placeholder: 'Where should the most money go? e.g. Photography, food, décor' },
        { name: 'savings_areas', label: 'Areas to Save On', type: 'text', required: false, placeholder: 'Where is the couple happy to cut costs?' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Wedding Thank You Notes',
      slug: 'wedding-thank-you-notes',
      icon: '💌',
      description: 'Write personalised wedding thank you notes and acknowledgement messages.',
      industryId: bySlug('wedding'),
      systemPrompt: 'You are a wedding stationery and etiquette specialist. You write warm, genuine thank you notes that make recipients feel truly appreciated. Each note feels personal and specific, not like a template mass-produced by a robot.',
      userPromptTemplate: `Write wedding thank you notes for:

Couple names: {couple}
Recipient type: {recipient_type}
Specific gift or gesture: {gift_gesture}
Personal memory or note: {personal_note}
Tone / style: {style}
Number of variations: {variations}

Write {variations} personalised thank you note variation(s) that feel warm and authentic. Include a short version for card format and a longer version for email or letter format.`,
      fields: [
        { name: 'couple', label: 'Couple Names', type: 'text', required: true, placeholder: 'e.g. Priya & Arjun' },
        { name: 'recipient_type', label: 'Recipient Type', type: 'select', required: true, options: ['Wedding guest (gift)', 'Vendor / supplier', 'Parents of couple', 'Bridal party / best man / bridesmaid', 'Colleague or work acquaintance', 'Distant relative', 'Friend who travelled far'] },
        { name: 'gift_gesture', label: 'Specific Gift or Gesture to Mention', type: 'text', required: false, placeholder: 'e.g. Cash gift of ₹5,000, silver cutlery set, helped with decorations' },
        { name: 'personal_note', label: 'Personal Memory or Note (optional)', type: 'text', required: false, placeholder: 'A specific moment with this person, or something unique about them...' },
        { name: 'style', label: 'Style', type: 'select', required: false, options: ['Warm & heartfelt', 'Formal & traditional', 'Playful & fun', 'Religious / spiritual'] },
        { name: 'variations', label: 'Number of Variations', type: 'select', required: false, options: ['1', '2', '3', '5'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── HOSPITALITY & TRAVEL (additional) ───────────────────────────────────
    {
      name: 'Guest Review Response',
      slug: 'guest-review-response',
      icon: '⭐',
      description: 'Write professional, brand-appropriate responses to hotel and restaurant reviews.',
      industryId: bySlug('hospitality-travel'),
      systemPrompt: 'You are a hospitality reputation management specialist. You craft responses to guest reviews that thank positive reviewers authentically, address negative reviews with empathy and professionalism, and always protect the brand. You know that review responses are read by future guests as much as the original reviewer.',
      userPromptTemplate: `Write a review response for:

Property name: {property}
Review platform: {platform}
Star rating: {rating}
Guest review text: {review}
Guest name: {guest_name}
Specific issue to address: {issue}
Resolution offered (if any): {resolution}
Brand tone: {tone}

Write a response (under 150 words) that is authentic, addresses the key points, thanks the guest, and ends with an invitation to return.`,
      fields: [
        { name: 'property', label: 'Property Name', type: 'text', required: true, placeholder: 'Hotel / resort / restaurant name' },
        { name: 'platform', label: 'Review Platform', type: 'select', required: true, options: ['TripAdvisor', 'Google Reviews', 'Booking.com', 'Expedia', 'Zomato', 'Swiggy', 'MakeMyTrip', 'Airbnb', 'Other'] },
        { name: 'rating', label: 'Guest Rating', type: 'select', required: true, options: ['5 stars (positive)', '4 stars (mostly positive)', '3 stars (mixed)', '2 stars (negative)', '1 star (very negative)'] },
        { name: 'review', label: 'Guest Review Text', type: 'textarea', required: true, placeholder: 'Paste the guest review here...' },
        { name: 'guest_name', label: 'Guest Name / Handle', type: 'text', required: false, placeholder: 'Reviewer\'s name or username' },
        { name: 'issue', label: 'Main Issue to Address', type: 'text', required: false, placeholder: 'Specific complaint or concern raised...' },
        { name: 'resolution', label: 'Resolution Offered (if applicable)', type: 'text', required: false, placeholder: 'e.g. Refund offered, issue fixed, invited back with discount' },
        { name: 'tone', label: 'Brand Tone', type: 'select', required: false, options: ['Luxury / refined', 'Warm & friendly', 'Professional', 'Boutique / personal'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 3,
    },
    {
      name: 'Tour Package Description',
      slug: 'tour-package-description',
      icon: '🗺️',
      description: 'Write compelling tour package descriptions that sell destinations and experiences.',
      industryId: bySlug('hospitality-travel'),
      systemPrompt: 'You are a travel copywriter and destination marketing specialist. You write tour package descriptions that sell the experience, not just the itinerary. You create wanderlust, communicate value, and give travellers confidence to book. Your descriptions are vivid, accurate, and benefit-focused.',
      userPromptTemplate: `Write a tour package description for:

Package name: {package_name}
Destination(s): {destinations}
Duration: {duration}
Inclusions: {inclusions}
Exclusions: {exclusions}
Target traveller: {target}
Price: {price}
Unique highlights: {highlights}
Travel style: {travel_style}

Provide:
1. **Attention-grabbing headline**
2. **Package Overview** (150-200 words — sell the experience)
3. **Day-wise Highlights** (brief summary)
4. **What's Included** (checklist)
5. **What's Not Included**
6. **Price & Starting From** line
7. **Why Book This Package** (3 key reasons)
8. **Booking CTA**`,
      fields: [
        { name: 'package_name', label: 'Package Name', type: 'text', required: true, placeholder: 'e.g. Kerala Backwaters Escape, Golden Triangle 7N/8D' },
        { name: 'destinations', label: 'Destinations Covered', type: 'text', required: true, placeholder: 'e.g. Kochi, Alleppey, Munnar' },
        { name: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'e.g. 6 nights / 7 days' },
        { name: 'inclusions', label: 'What\'s Included', type: 'textarea', required: true, placeholder: 'Hotel, meals, transport, tours, guides, permits...' },
        { name: 'exclusions', label: 'What\'s NOT Included', type: 'text', required: false, placeholder: 'e.g. Flights, visa, personal expenses, travel insurance' },
        { name: 'target', label: 'Target Traveller', type: 'select', required: false, options: ['Couple / romantic', 'Family with kids', 'Solo traveller', 'Group of friends', 'Senior citizens', 'Honeymoon', 'Corporate / MICE group'] },
        { name: 'price', label: 'Price / Starting From', type: 'text', required: false, placeholder: 'e.g. Starting from ₹18,500 per person (twin sharing)' },
        { name: 'highlights', label: 'Unique Highlights', type: 'textarea', required: false, placeholder: 'What makes this package special or different?' },
        { name: 'travel_style', label: 'Travel Style', type: 'select', required: false, options: ['Budget / value', 'Standard / comfortable', 'Premium / deluxe', 'Luxury', 'Adventure / active', 'Cultural & heritage'] },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Visa & Travel Document Guide',
      slug: 'visa-travel-document-guide',
      icon: '🛂',
      description: 'Generate visa application guides and travel document checklists for any destination.',
      industryId: bySlug('hospitality-travel'),
      systemPrompt: 'You are an international travel documentation specialist. You produce accurate, step-by-step visa guides and travel document checklists that help travellers apply confidently. You note important caveats, common refusal reasons, and latest requirements.',
      userPromptTemplate: `Generate a visa and travel document guide for:

Traveller nationality: {nationality}
Destination country: {destination}
Travel purpose: {purpose}
Duration of stay: {duration}
Visa type: {visa_type}
Special circumstances: {special}

Provide:
1. **Visa Requirement Overview** (visa required / visa-free / e-visa)
2. **Documents Required** (complete checklist)
3. **Application Process** (step-by-step)
4. **Fees & Processing Time**
5. **Important Notes & Common Rejection Reasons**
6. **Other Travel Documents to Carry**
7. **Emergency Contacts** (embassy, consulate)
8. **Pro Tips for a Successful Application**`,
      fields: [
        { name: 'nationality', label: 'Traveller Nationality / Passport', type: 'text', required: true, placeholder: 'e.g. Indian passport holder, British citizen' },
        { name: 'destination', label: 'Destination Country', type: 'text', required: true, placeholder: 'e.g. Thailand, USA, Schengen (Europe), UAE' },
        { name: 'purpose', label: 'Travel Purpose', type: 'select', required: true, options: ['Tourism / holiday', 'Business visit', 'Medical treatment', 'Education / student visa', 'Family visit', 'Work / employment', 'Transit'] },
        { name: 'duration', label: 'Intended Duration of Stay', type: 'text', required: false, placeholder: 'e.g. 10 days, 3 months, 1 year' },
        { name: 'visa_type', label: 'Visa Type (if known)', type: 'text', required: false, placeholder: 'e.g. Tourist visa, e-visa, visa on arrival, B1/B2, Schengen' },
        { name: 'special', label: 'Special Circumstances', type: 'text', required: false, placeholder: 'e.g. Minor travelling alone, multiple entry needed, previously refused' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },

    // ─── INSURANCE (additional) ───────────────────────────────────────────────
    {
      name: 'Premium Renewal Reminder',
      slug: 'insurance-renewal-reminder',
      icon: '🔔',
      description: 'Write persuasive insurance renewal reminders that retain policyholders.',
      industryId: bySlug('insurance'),
      systemPrompt: 'You are an insurance retention specialist. You write personalised, compelling renewal reminders that communicate the value of continued coverage, create appropriate urgency, and make renewing easy. You know why policyholders lapse and address those objections proactively.',
      userPromptTemplate: `Write an insurance renewal reminder:

Communication type: {comm_type}
Policyholder name: {policyholder}
Policy type: {policy_type}
Current premium: {premium}
Renewal date: {renewal_date}
No-claim bonus or benefits earned: {ncb_benefits}
Special renewal offer: {offer}
Insurer / agent name: {sender}

Write a personalised, value-focused reminder (under 200 words) that: highlights what coverage means to this person, mentions benefits earned, communicates renewal deadline with urgency, and makes it easy to act. Include subject line if email.`,
      fields: [
        { name: 'comm_type', label: 'Communication Type', type: 'select', required: true, options: ['First reminder (60 days before)', 'Second reminder (30 days before)', 'Urgent reminder (7 days before)', 'Last day reminder', 'Lapse grace period alert', 'Post-lapse win-back message'] },
        { name: 'policyholder', label: 'Policyholder Name', type: 'text', required: true, placeholder: 'e.g. Mr. Suresh Iyer' },
        { name: 'policy_type', label: 'Policy Type', type: 'text', required: true, placeholder: 'e.g. Family Health Insurance, Car Insurance' },
        { name: 'premium', label: 'Renewal Premium', type: 'text', required: true, placeholder: 'e.g. ₹12,450 / year' },
        { name: 'renewal_date', label: 'Renewal Due Date', type: 'text', required: true, placeholder: 'e.g. 31 May 2025' },
        { name: 'ncb_benefits', label: 'No-Claim Bonus / Benefits Earned', type: 'text', required: false, placeholder: 'e.g. 35% NCB, 2 claim-free years, free health check-up earned' },
        { name: 'offer', label: 'Special Renewal Offer (optional)', type: 'text', required: false, placeholder: 'e.g. 5% loyalty discount, free add-on cover if renewed before 25 May' },
        { name: 'sender', label: 'Insurer / Agent Name', type: 'text', required: false, placeholder: 'Company or agent name' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 4,
    },
    {
      name: 'Insurance Comparison Report',
      slug: 'insurance-comparison-report',
      icon: '⚖️',
      description: 'Generate side-by-side insurance plan comparison reports for informed client decisions.',
      industryId: bySlug('insurance'),
      systemPrompt: 'You are an independent insurance advisor. You produce clear, objective insurance comparison reports that help clients understand the real differences between plans — not just the premium — and make the choice that best fits their needs and budget.',
      userPromptTemplate: `Generate an insurance comparison report for:

Client profile: {client}
Insurance category: {category}
Plans to compare: {plans}
Key features to compare: {features}
Client priorities: {priorities}
Budget range: {budget}

Provide:
1. **Comparison Summary Table** (key features side by side)
2. **Detailed Feature Analysis** per parameter
3. **Coverage Depth Comparison** (inclusions and sub-limits)
4. **Exclusions Comparison** (what each plan misses)
5. **Price vs. Value Analysis**
6. **Claim Settlement Ratio** (insurer reputation)
7. **Best For** (which plan suits which need)
8. **Advisor Recommendation** with clear rationale`,
      fields: [
        { name: 'client', label: 'Client Profile', type: 'text', required: true, placeholder: 'e.g. 38-year-old, family of 4, non-smoker, medium risk appetite' },
        { name: 'category', label: 'Insurance Category', type: 'select', required: true, options: ['Health insurance', 'Term life insurance', 'Motor insurance', 'Home insurance', 'Travel insurance', 'Business insurance'] },
        { name: 'plans', label: 'Plans / Products to Compare', type: 'textarea', required: true, placeholder: 'Plan 1: name, insurer, premium, coverage\nPlan 2: ...\nPlan 3: ...' },
        { name: 'features', label: 'Key Features to Compare', type: 'textarea', required: false, placeholder: 'e.g. Sum insured, room rent limit, pre-existing disease waiting period, network hospitals, NCB, IDV...' },
        { name: 'priorities', label: 'Client Priorities', type: 'textarea', required: false, placeholder: 'What matters most to this client? e.g. Low premium, broad cover, cashless network, maternity cover' },
        { name: 'budget', label: 'Budget Range', type: 'text', required: false, placeholder: 'e.g. ₹10,000–₹20,000/year' },
      ],
      planRequired: 'FREE',
      outputFormat: 'markdown',
      sortOrder: 5,
    },
  ];
};

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...');

    const industrySlugs = INDUSTRIES.map((industry) => industry.slug);
    await Industry.bulkWrite(
      INDUSTRIES.map(({ slug, ...industry }) => ({
        updateOne: {
          filter: { slug },
          update: {
            $set: industry,
            $setOnInsert: { slug },
          },
          upsert: true,
        },
      }))
    );

    const industries = await Industry.find({ slug: { $in: industrySlugs } });
    console.log(`✅ Synced ${industries.length} industries`);

    const toolData = buildTools(industries);
    await Tool.bulkWrite(
      toolData.map(({ slug, ...tool }) => ({
        updateOne: {
          filter: { slug },
          update: {
            $set: tool,
            $setOnInsert: { slug },
          },
          upsert: true,
        },
      }))
    );
    console.log(`✅ Synced ${toolData.length} tools`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'Admin@123',
        role: 'ADMIN',
        status: 'active',
        planTier: 'BUSINESS',
        runsTotal: 99999,
      });
      console.log('✅ Created admin user: admin@admin.com / Admin@123');
    }

    // Create demo customer
    const demoExists = await User.findOne({ email: 'demo@zynapse.com' });
    if (!demoExists) {
      const legalIndustry = industries.find((i) => i.slug === 'legal');
      await User.create({
        name: 'Demo Customer',
        email: 'demo@zynapse.com',
        password: 'Demo@123',
        role: 'CUSTOMER',
        status: 'active',
        planTier: 'PRO',
        runsTotal: 500,
        runsUsed: 42,
        industryId: legalIndustry._id,
      });
      console.log('✅ Created demo customer: demo@zynapse.com / Demo@123');
    }

    console.log('\n🎉 Seed complete!');
    console.log('──────────────────────────────────');
    console.log('Admin:    admin@admin.com / Admin@123');
    console.log('Customer: demo@zynapse.com  / Demo@123');
    console.log('──────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
