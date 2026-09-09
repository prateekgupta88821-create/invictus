export type Role = 'OFFICER' | 'MANUFACTURER' | 'CONSUMER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: Role;
  badge_number?: string;
  department?: string;
}

export interface ExtractedField {
  id?: string;
  field_name: string;
  detected_value: string | null;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h] %
  source_text?: string;
  status: 'PASS' | 'FAIL' | 'VERIFY' | 'NOT_APPLICABLE';
  inspector_override?: boolean;
  override_value?: string;
  override_note?: string;
}

export interface Violation {
  id?: string;
  rule_code: string;
  field_name: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  status: 'DETECTED' | 'CONFIRMED' | 'REJECTED' | 'RESOLVED';
  detected_value: string | null;
  expected_condition?: string;
  failure_message: string;
  remediation?: string;
  evidence_region?: string;
  inspector_remarks?: string;
}

export interface Inspection {
  id: string;
  case_id: string;
  product_name: string;
  manufacturer: string;
  scan_image_url: string;
  image_quality: 'GOOD' | 'NEEDS_IMPROVEMENT';
  image_quality_score: number;
  compliance_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Draft' | 'Under Review' | 'Confirmed' | 'Resolved' | 'Closed';
  inspector_notes?: string;
  notice_draft?: string;
  district: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  verification_id?: string;
  created_at?: string;
  fields?: ExtractedField[];
  violations?: Violation[];
}

export interface Business {
  id: string;
  name: string;
  trade_name?: string;
  registration_number?: string;
  address: string;
  district: string;
  state: string;
  pin_code: string;
  risk_score: number;
  risk_tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  repeat_violations_count: number;
  total_inspections: number;
  products_count?: number;
}

export interface AuditLogItem {
  sequence_num: number;
  timestamp: string;
  user_id: string;
  action: string;
  case_id?: string;
  entity_type: string;
  previous_value?: string;
  new_value?: string;
  record_hash: string;
  previous_hash: string;
}

export interface RuleItem {
  id: string;
  rule_code: string;
  name: string;
  description: string;
  field: string;
  category: string;
  severity: string;
  condition: string;
  weight: number;
  confidence_threshold: number;
  active: boolean;
  version: string;
}
