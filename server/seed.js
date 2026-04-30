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
