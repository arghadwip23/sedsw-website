import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import DashboardClient from "./DashboardClient";

// Define JWT payload type
interface JWTPayload {
  registrationNumber?: string;
  orgRole?: string;
  department?: string;
  isAdmin?: boolean;
  [key: string]: unknown; // allow extra claims without error
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // name of your cookie

  let isAdmin = false;
  let userRole = "";
  let userDepartment = "";
  let registrationNumber = "";

  if (token) {
    try {
      const decoded = decodeJwt<JWTPayload>(token);
      isAdmin = decoded.isAdmin === true;
      userRole = decoded.orgRole as string || "";
      userDepartment = decoded.department as string || "";
      registrationNumber = decoded.registrationNumber as string || "";
    } catch {
      // silently ignore invalid token
    }
  }

  return (
    <DashboardClient 
      isAdmin={isAdmin} 
      userRole={userRole} 
      userDepartment={userDepartment}
      registrationNumber={registrationNumber}
    />
  );
}
