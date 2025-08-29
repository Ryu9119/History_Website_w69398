import Header from '../components/Header';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin (Skeleton)</h1>
        <p className="text-gray-600">This is a skeleton page for the admin section.</p>
      </div>
    </div>
  );
};

export default Admin;
