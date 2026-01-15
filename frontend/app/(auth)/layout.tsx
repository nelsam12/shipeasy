import { Navbar } from "@/components/navbar";
import { GuestGuard } from "../guards/guest-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GuestGuard>
        <Navbar />
        <div className="p-4 h-full">{children}</div>
      </GuestGuard>
    </>
  );
}
