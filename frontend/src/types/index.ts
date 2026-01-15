export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contact_person?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface RFPRequirements {
  items: Array<{
    name: string;
    quantity: number;
    specifications: string;
  }>;
  [key: string]: any;
}

export interface RFP {
  id: string;
  title: string;
  description: string;
  budget?: number;
  delivery_deadline?: string;
  payment_terms?: string;
  warranty_period?: string;
  requirements: RFPRequirements;
  status: 'draft' | 'sent' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  rfp_id: string;
  vendor_id: string;
  vendor_name?: string;
  vendor_email?: string;
  email_subject?: string;
  email_body?: string;
  total_price?: number;
  delivery_time?: string;
  payment_terms?: string;
  warranty?: string;
  parsed_data?: {
    items?: Array<{
      name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
    strengths?: string[];
    weaknesses?: string[];
    [key: string]: any;
  };
  raw_email_data?: any;
  ai_score?: number;
  ai_summary?: string;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalComparison {
  proposals: Proposal[];
  comparison: {
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
  };
}

export interface CreateRFPRequest {
  naturalLanguageInput: string;
}

export interface CreateRFPResponse {
  rfp: RFP;
  structured_data: any;
}
