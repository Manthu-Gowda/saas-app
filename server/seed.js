import mongoose from 'mongoose';
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
];

const buildTools = (industries) => {
  const bySlug = (s) => industries.find((i) => i.slug === s)._id;

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
  ];
};

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...');

    // Clear existing data
    await Industry.deleteMany();
    await Tool.deleteMany();
    await User.deleteMany({ role: 'CUSTOMER', email: 'demo@zynapse.com' });
    await User.deleteMany({ role: 'ADMIN', email: 'admin@zynapse.com' });

    console.log('✅ Cleared old data');

    // Create industries
    const industries = await Industry.insertMany(INDUSTRIES);
    console.log(`✅ Created ${industries.length} industries`);

    // Create tools
    const toolData = buildTools(industries);
    const tools = await Tool.insertMany(toolData);
    console.log(`✅ Created ${tools.length} tools`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@zynapse.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@zynapse.com',
        password: 'Admin@123',
        role: 'ADMIN',
        status: 'active',
        planTier: 'BUSINESS',
        runsTotal: 99999,
      });
      console.log('✅ Created admin user: admin@zynapse.com / Admin@123');
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
    console.log('Admin:    admin@zynapse.com / Admin@123');
    console.log('Customer: demo@zynapse.com  / Demo@123');
    console.log('──────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
