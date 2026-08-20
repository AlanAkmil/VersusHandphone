import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import QuickCompareForm from "@/components/QuickCompareForm";
import { mockSuggestions } from "@/data/mock-duel";

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      <Header />
      <SearchHero suggestions={mockSuggestions} />
      <div className="px-6 pb-20">
        <QuickCompareForm />
      </div>
    </main>
  );
}
