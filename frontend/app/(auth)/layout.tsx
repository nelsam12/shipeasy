import { Navbar } from "@/components/layouts/Navbar";
import { GuestGuard } from "@/components/guards/GuestGuard";

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
