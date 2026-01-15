export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contact_person?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RFP {
  id: string;
  title: string;
  description: string;
  budget?: number;
  delivery_deadline?: Date;
  payment_terms?: string;
  warranty_period?: string;
  requirements: RFPRequirements;
  status: 'draft' | 'sent' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface RFPRequirements {
  items: Array<{
    name: string;
    quantity: number;
    specifications: string;
  }>;
  [key: string]: any;
}

export interface RFPVendor {
  id: string;
  rfp_id: string;
  vendor_id: string;
  sent_at?: Date;
  email_sent: boolean;
  created_at: Date;
}

export interface Proposal {
  id: string;
  rfp_id: string;
  vendor_id: string;
  email_subject?: string;
  email_body?: string;
  total_price?: number;
  delivery_time?: string;
  payment_terms?: string;
  warranty?: string;
  parsed_data?: ParsedProposalData;
  raw_email_data?: any;
  ai_score?: number;
  ai_summary?: string;
  received_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ParsedProposalData {
  items?: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  strengths?: string[];
  weaknesses?: string[];
  [key: string]: any;
}

export interface CreateRFPRequest {
  naturalLanguageInput: string;
}

export interface CreateRFPResponse {
  rfp: RFP;
  structured_data: any;
}

export interface SendRFPRequest {
  rfpId: string;
  vendorIds: string[];
}

export interface ProposalComparison {
  proposals: Array<Proposal & { vendor: Vendor }>;
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
