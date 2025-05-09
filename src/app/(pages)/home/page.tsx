import AuthorContent from "./components/AuthorContent";
import HomeContent from "./components/HomeContent";

const Home = () => {
  return (
    <main className="container mx-auto w-[80%] min-h-screen">
      <div className="flex flex-col items-center">
        <HomeContent />
      </div>
      <div className="flex flex-col items-center">
        <AuthorContent />
      </div>
    </main>
  );
};

export default Home;
