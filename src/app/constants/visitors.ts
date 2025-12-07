export const VISIT_PURPOSES = [
  'Meeting',
  'Interview',
  'Delivery',
  'Maintenance',
  'Consultation',
  'Training',
  'Other',
] as const;

export type VisitPurpose = (typeof VISIT_PURPOSES)[number];
