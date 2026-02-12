import "./Achievements.css";

const logos = [
  "/logos/optum.svg",
  "/logos/coro.svg",
  "/logos/spyhealth.svg",
  "/logos/episource.svg",
  "/logos/nttdata.png",
  "/logos/clarus.svg",
  "/logos/dynamed.svg",
  "/logos/obss.svg",
  "/logos/cotiviti.svg",
  "/logos/ais.svg",
  "/logos/calpion.svg",

 
];

const AchievementsClients = () => {
  return (
    <section className="ac-section">
      <div className="ac-container">

        {/* TOP: ACHIEVEMENTS */}
        <div className="achievements-area">
          <h2 className="achievements-title">Our Achievements</h2>

          <div className="achievement-cards">
            <div className="card">
              <div className="icon"><img src="/images/Group.png" alt="" /></div>
              <h3>20+</h3>
              <p>Batches</p>
            </div>

            <div className="card">
              <div className="icon"><img src="/images/Traine.png" alt="" /> </div>
              <h3>1,675+</h3>
              <p>Trainees Trained</p>
            </div>

            <div className="card">
              <div className="icon"><img src="/images/percentage.png" alt="" /> </div>
              <p className="big">
                High Placement <br /> Success Rate
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM: CLIENTS */}
      <div className="clients-area">
        <h2 className="clients-title">
         Medical Coding Companies</h2>

        <div className="clients-box">
          <div className="logo-track">
            {[...logos, ...logos].map((logo, i) => (
              <img key={i} src={logo} alt="client logo" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsClients;
