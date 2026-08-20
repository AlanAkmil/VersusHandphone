import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import { mockSuggestions } from "@/data/mock-duel";

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      <Header />
      <SearchHero suggestions={mockSuggestions} />
    </main>
  );
}
