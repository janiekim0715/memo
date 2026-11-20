import { AllMemosList, AllMemosNav } from "@/components/AllMemos";

export default function AllMemosPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34">
      <AllMemosNav />
      <AllMemosList />
    </main>
  );
}
