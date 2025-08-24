export type OrgRole =
  | "president"
  | "vice-president"
  | "secretary"
  | "treasurer"
  | "member";

export type DeptRole = "lead" | "co-lead" | "member" ;

export interface IUser {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  branch: string;
  orgRole: OrgRole;
  department: {
    name: string;
    role: DeptRole;
    isInRole: boolean;
  };
  isAdmin: boolean;
  profilePicture?: string;
  password: string; // hashed password
}
