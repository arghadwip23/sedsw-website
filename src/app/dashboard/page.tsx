import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import DashboardClient from "./DashboardClient";

// Define JWT payload type
interface JWTPayload {
  isAdmin?: boolean;
  [key: string]: unknown; // allow extra claims without error
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // name of your cookie

  let isAdmin = false;

  if (token) {
    try {
      const decoded = decodeJwt<JWTPayload>(token);
      isAdmin = decoded.isAdmin === true;
    } catch {
      // silently ignore invalid token
    }
  }

  return <DashboardClient isAdmin={isAdmin} />;
}
