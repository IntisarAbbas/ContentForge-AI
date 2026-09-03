import WelcomeBanner from "../../components/common/WelcomeBanner";
import StatsCard from "../../components/common/StatsCard";
import DashboardCard from "../../components/common/DashboardCard";
import { dashboardCards } from "../../data/dashboardCards";

function Home() {
  return (
    <>
      {/* Hero Banner */}
      <section className="md:pt-6">
        <WelcomeBanner />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2 xl:grid-cols-3">
    <StatsCard
     title="AI Tools"
     value="20+"
     color="#7C3AED"
   />

   <StatsCard
     title="AI Assistant"
     value="24/7"
     color="#06B6D4"
   />

   <StatsCard
     title="Templates"
     value="500+"
     color="#F97316"
   />
 </section>

      {/* Dashboard Cards */}
      <section className="pt-8 md:pt-14">
        <h2 className="pb-4 text-2xl font-bold md:text-3xl">
          Explore AI Tools
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <DashboardCard
             key={card.id}
             title={card.title}
             description={card.description}
             Icon={card.icon}
             path={card.path}
          />
          ))}
        </div>
      </section>

      <div className="h-10 md:h-20"></div>
      </>
  );
}

export default Home;