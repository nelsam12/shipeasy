import { Navbar } from "@/src/shared/components/layouts/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      {children}
    </div>
  );
}
