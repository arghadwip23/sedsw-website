
export type OrgRole =
  | "chairperson"
  | "vice chairperson"
  | "general secretary"
  | "treasurer"
  | "lead"
  | "deputy lead"
  | "member";

export interface IUser {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  // branch is only for non-core roles
  branch?: string;
  orgRole: OrgRole;
  department: string; // just a string now
  isCoreCommittee: boolean;
  verifiedByPresident: boolean;
  isAdmin: boolean;
  profilePicture?: string;
  password: string; // hashed password
}
