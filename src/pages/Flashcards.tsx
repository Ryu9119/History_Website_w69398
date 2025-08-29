import Header from '../components/Header';

const Flashcards = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Flashcards (Skeleton)</h1>
        <p className="text-gray-600">This is a skeleton page for the flashcards section.</p>
      </div>
    </div>
  );
};

export default Flashcards;
