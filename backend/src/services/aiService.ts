import OpenAI from 'openai';
import { RFPRequirements, ParsedProposalData, Proposal, Vendor } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  /**
   * Parse natural language RFP input into structured data
   */
  async parseRFPFromNaturalLanguage(input: string): Promise<{
    title: string;
    description: string;
    budget?: number;
    delivery_deadline?: string;
    payment_terms?: string;
    warranty_period?: string;
    requirements: RFPRequirements;
  }> {
    const prompt = `You are an AI assistant that helps parse procurement requests into structured RFP data.

Given the following natural language procurement request, extract and structure the information into a JSON format.

Procurement Request:
"${input}"

Extract the following information:
1. title: A concise title for the RFP
2. description: A comprehensive description of what is being procured
3. budget: Total budget amount (numeric value only, no currency symbols)
4. delivery_deadline: Deadline in ISO date format (YYYY-MM-DD) if mentioned, calculate from "within X days" relative to today
5. payment_terms: Payment terms (e.g., "Net 30", "Net 60")
6. warranty_period: Warranty period (e.g., "1 year", "2 years")
7. requirements: An object with an "items" array, where each item has:
   - name: Item name
   - quantity: Quantity needed
   - specifications: Detailed specifications

Today's date is: ${new Date().toISOString().split('T')[0]}

Return ONLY valid JSON without markdown code blocks or explanations. Format:
{
  "title": "...",
  "description": "...",
  "budget": number or null,
  "delivery_deadline": "YYYY-MM-DD" or null,
  "payment_terms": "..." or null,
  "warranty_period": "..." or null,
  "requirements": {
    "items": [
      {
        "name": "...",
        "quantity": number,
        "specifications": "..."
      }
    ]
  }
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts structured data from natural language. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error('Error parsing RFP with AI:', error);
      throw new Error('Failed to parse RFP with AI');
    }
  }

  /**
   * Parse vendor proposal email into structured data
   */
  async parseProposalEmail(
    emailSubject: string,
    emailBody: string,
    rfpData: any
  ): Promise<{
    total_price?: number;
    delivery_time?: string;
    payment_terms?: string;
    warranty?: string;
    parsed_data: ParsedProposalData;
    ai_summary: string;
  }> {
    const prompt = `You are an AI assistant that extracts structured proposal data from vendor emails.

RFP Requirements:
${JSON.stringify(rfpData, null, 2)}

Vendor Email:
Subject: ${emailSubject}
Body:
${emailBody}

Extract the following information from the vendor's proposal:
1. total_price: Total price quoted (numeric value only)
2. delivery_time: Delivery timeframe
3. payment_terms: Payment terms offered
4. warranty: Warranty period offered
5. parsed_data: An object containing:
   - items: Array of items with name, quantity, unit_price, total_price
   - strengths: Array of proposal strengths
   - weaknesses: Array of potential concerns
6. ai_summary: A brief 2-3 sentence summary of the proposal

Return ONLY valid JSON without markdown code blocks. Format:
{
  "total_price": number or null,
  "delivery_time": "..." or null,
  "payment_terms": "..." or null,
  "warranty": "..." or null,
  "parsed_data": {
    "items": [
      {
        "name": "...",
        "quantity": number,
        "unit_price": number,
        "total_price": number
      }
    ],
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."]
  },
  "ai_summary": "..."
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts structured data from proposal emails. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing proposal with AI:', error);
      throw new Error('Failed to parse proposal with AI');
    }
  }

  /**
   * Compare proposals and generate recommendations
   */
  async compareProposals(
    proposals: Array<Proposal & { vendor: Vendor }>,
    rfpData: any
  ): Promise<{
    best_price: string | null;
    best_delivery: string | null;
    best_overall: string | null;
    summary: string;
    details: Array<{
      vendor_id: string;
      vendor_name: string;
      score: number;
      pros: string[];
      cons: string[];
    }>;
  }> {
    const proposalsData = proposals.map((p) => ({
      vendor_id: p.vendor_id,
      vendor_name: p.vendor.name,
      total_price: p.total_price,
      delivery_time: p.delivery_time,
      payment_terms: p.payment_terms,
      warranty: p.warranty,
      ai_summary: p.ai_summary,
      parsed_data: p.parsed_data,
    }));

    const prompt = `You are an AI procurement analyst. Compare these vendor proposals and provide recommendations.

RFP Requirements:
${JSON.stringify(rfpData, null, 2)}

Vendor Proposals:
${JSON.stringify(proposalsData, null, 2)}

Analyze and provide:
1. best_price: vendor_id of vendor with best price
2. best_delivery: vendor_id of vendor with best delivery time
3. best_overall: vendor_id of recommended vendor overall
4. summary: A comprehensive 3-4 sentence summary of the comparison
5. details: Array of analysis for each vendor with:
   - vendor_id
   - vendor_name
   - score: Overall score out of 100
   - pros: Array of 2-4 advantages
   - cons: Array of 1-3 disadvantages

Consider price, delivery time, warranty, payment terms, and value for money.

Return ONLY valid JSON without markdown code blocks.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a procurement analyst AI that provides objective proposal comparisons. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error comparing proposals with AI:', error);
      throw new Error('Failed to compare proposals with AI');
    }
  }

  /**
   * Score a single proposal
   */
  async scoreProposal(proposalData: any, rfpData: any): Promise<number> {
    const prompt = `Score this vendor proposal from 0-100 based on how well it meets the RFP requirements.

RFP Requirements:
${JSON.stringify(rfpData, null, 2)}

Proposal:
${JSON.stringify(proposalData, null, 2)}

Consider: price competitiveness, delivery time, warranty, payment terms, completeness.
Return only a number between 0 and 100.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const content = response.choices[0].message.content?.trim();
      const score = parseFloat(content || '0');
      return Math.min(100, Math.max(0, score));
    } catch (error) {
      console.error('Error scoring proposal:', error);
      return 0;
    }
  }
}

export const aiService = new AIService();
