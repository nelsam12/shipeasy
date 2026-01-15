import { Navbar } from "@/src/shared/components/layouts/Navbar";
import { GuestGuard } from "@/src/shared/components/guards";

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
