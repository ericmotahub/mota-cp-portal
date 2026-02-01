
export type Persona = 'PARTNER' | 'FILMMAKER' | 'CREW';

export type InternalStatus = 
  | 'SCOUTING' 
  | 'BIDDING_IN_PROG' 
  | 'BID_SENT' 
  | 'BID_FOR_REVIEW' 
  | 'DISCUSSING' 
  | 'AWARDED' 
  | 'IN_PROD' 
  | 'DELIVERED' 
  | 'LOST';

export type BidStatus = 
  | 'BIDDING' 
  | 'AWARDED' 
  | 'CONTRACT_BID' 
  | 'ON_HOLD' 
  | 'DRAFT';

export type ShotType = 'C' | 'B' | 'A' | 'AA' | 'ROTO' | 'DMP' | 'FX';

export interface ShotBidLineItem {
  id: string;
  shotName: string;
  shotType: ShotType;
  description: string;
  scope: string;
  location: string;
  status: 'Active' | 'Omit' | 'WIP';
  departments: {
    layout: number;
    matchmove: number;
    fx: number;
    anim: number;
    lighting: number;
    comp: number;
    paintPrep: number;
    roto: number;
    other: number;
  };
  complexityMultiplier: number;
  totalDays: number;
  cost: number;
  aiConfidence?: number; // 0-100
}

export interface AssetBidLineItem {
  id: string;
  assetName: string;
  type: string;
  location: string;
  status: 'Active' | 'Omit';
  tasks: {
    model: number;
    groom: number;
    texture: number;
    rig: number;
    lookdev: number;
    fx: number;
  };
  totalDays: number;
  cost: number;
}

export interface DeptRate {
  dept: string;
  rate: number;
  headcountAvailable: number;
  departmentHead: string;
}

export interface ApprovalStep {
  role: string;
  user: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date?: string;
  comment?: string;
}

export interface ProjectBid {
  id: string;
  title: string;
  scope: string;
  status: BidStatus;
  amount: number;
  rebate: number;
  territory: string;
  shots: number;
  assets: number;
  margin: number;
  lastUpdated: string;
  deptRates: DeptRate[];
  shotItems?: ShotBidLineItem[];
  assetItems?: AssetBidLineItem[];
  adjustments: {
    productionFee: number;
    contingency: number;
    insurance: number;
  };
  approvals: ApprovalStep[];
  scheduleWeeks: number;
  productionStart: string;
  deliveryDate: string;
  internalVFXProducer: string;
  internalVFXSupervisor: string;
  aiBreakdownStatus?: 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED';
  carbonFootprintEst?: number; // Kg CO2e
}

export interface BidItem {
  id: string;
  description: string;
  tags: string[];
  days: number;
  isAI: boolean;
  bidTotal: number;
  estRebate: number;
  status: 'draft' | 'review' | 'approved';
}

export interface Project {
  id: string;
  title: string;
  studio: string;
  status: 'PREP' | 'PROD' | 'POST' | 'DEV';
  executive: string;
  territory: string;
  budget: string;
  shots?: number;
  type?: 'Feature' | 'Series';
}

export interface Talent {
  id: string;
  name: string;
  title: string;
  experience: string;
  yearsActive: number;
  location: string;
  rate: string;
  skills: string[];
  deepTags?: string[];
  availability: string;
  memberStatus: 'ELITE' | 'VERIFIED' | 'STANDARD';
  vettedBy?: string;
  bio?: string;
  motaIndex: {
    composite: number;
    creative: number;
    technical: number;
    pipeline: number;
  };
  links?: {
    imdb?: string;
    linkedin?: string;
    portfolio?: string;
    showreel?: string;
  };
}

export interface Message {
  id: string;
  sender: 'STUDIO' | 'ARTIST';
  text: string;
  timestamp: string;
  type: 'TEXT' | 'OFFER';
  offerData?: {
    show: string;
    role: string;
    rate: string;
    dates: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  };
}

export interface Engagement {
  talentId: string;
  messages: Message[];
  status: 'CHATTING' | 'OFFER_SENT' | 'CONTRACTED';
  lastActivity: string;
}
