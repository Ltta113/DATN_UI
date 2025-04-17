import CategoryContent from './components/CategoryContent';
import HomeContent from './components/HomeContent';

const Home = () => {
    return (
        <main className="container mx-auto w-[80%] min-h-screen">
            <div className="flex flex-col items-center">
                <CategoryContent />
            </div>
            <div className="flex flex-col items-center">
                <HomeContent />
            </div>
        </main>
    )
};

export default Home;