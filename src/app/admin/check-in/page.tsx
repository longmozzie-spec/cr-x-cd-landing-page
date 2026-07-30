import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, AUTH_COOKIE } from "@/lib/auth";
import { CheckInScanner } from "./CheckInScanner";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  return <CheckInScanner />;
}
