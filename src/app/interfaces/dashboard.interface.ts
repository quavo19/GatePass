export interface DepartmentData {
  readonly department: string;
  readonly count: number;
  readonly percentage: number;
}

export interface StaffData {
  readonly name: string;
  readonly department: string;
  readonly visitCount: number;
  readonly percentage: number;
}

export interface VisitorData {
  readonly fullName: string;
  readonly phone: string;
  readonly visitCount: number;
  readonly percentage: number;
}
