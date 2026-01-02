import AppLayout from "@/components/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-gold-500 sm:text-6xl">
            ✨ نظام حوكمة جهاز الاستثمار العماني جاهز
          </h1>
        </div>
      </main>
    </AppLayout>
  );
}
