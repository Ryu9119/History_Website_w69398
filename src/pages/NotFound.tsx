import Header from '../components/Header';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-gray-600">This page does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
