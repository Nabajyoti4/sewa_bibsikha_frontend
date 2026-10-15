import CountUp from "../../components/CountUp";
import Icon from "../../components/Icon";
import PageHero from "../../components/PageHero";
import Reveal from "../../components/Reveal";
import SectionHeading from "../../components/SectionHeading";
import TiltCard from "../../components/TiltCard";
import { brand, dimensions, regions, strengths, teamExpertise } from "../../data/siteContent";
import "./About.css";

const About = () => {
  return (
    <>
      <PageHero
        crumb="About Bibsikha"
        eyebrow="About Us"
        title={
          <>
            Rooted in Assam. <span className="text-gradient">Working for the climate.</span>
          </>
        }
        lead="Bibsikha is a climate change mitigation and advisory group with expertise in natural resource conservation, climate change mitigation, and adaptation."
      />

      <section className="section">
        <div className="container about-story">
          <Reveal variant="left" className="about-story__visual">
            <TiltCard className="about-story__card about-story__card--main" max={6}>
              <Icon name="pin" size={64} strokeWidth={1.1} />
              <span className="about-story__card-title">Jorhat, Assam</span>
              <span className="about-story__card-text">Our headquarters, in the heart of North-east India.</span>
            </TiltCard>
            <div className="about-story__card about-story__card--stat">
              <strong>
                <CountUp value={3} suffix=" Lakh+" />
              </strong>
              <span>Rural households impacted</span>
            </div>
            <div className="about-story__card about-story__card--gold">
              <Icon name="award" size={30} />
              <span>A decade of field knowledge and expertise</span>
            </div>
          </Reveal>

          <div className="about-story__content">
            <Reveal>
              <span className="eyebrow">Who we are</span>
            </Reveal>
            <Reveal as="h2" delay={80} className="display-lg">
              Climate solutions with a <span className="text-gradient">three-dimensional</span> approach.
            </Reveal>
            <Reveal as="p" delay={140} className="lead">
              Bibsikha has multi-disciplinary expertise in climate solutions, community based programmes, climate finance and
              market research.
            </Reveal>
            <Reveal as="p" delay={200}>
              Our founding members’ proven ability to design and implement projects across the globe enables us to offer an
              integrated and effective platform with a three-dimensional approach for Energy, Environment and Ecosystem
              conservation projects.
            </Reveal>

            <div className="about-mv">
              <Reveal delay={240} className="about-mv__item">
                <span className="about-mv__icon">
                  <Icon name="briefcase" />
                </span>
                <div>
                  <h3>{brand.legalName}</h3>
                  <p>
                    Primarily an Environment &amp; Sustainability Consulting Company, delivering tailor-made solutions for private
                    and public sector clients.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={300} className="about-mv__item">
                <span className="about-mv__icon about-mv__icon--gold">
                  <Icon name="users" />
                </span>
                <div>
                  <h3>First of its kind from the North-east</h3>
                  <p>Skilled manpower is our main strength — the reason we have advanced to the top in a short period.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Our strengths"
            align="center"
            title={
              <>
                Energy, Environment, Ecosystem — <span className="text-gradient">delivered.</span>
              </>
            }
          />
          <div className="bento bento--3 about-values">
            {dimensions.map((item, index) => (
              <Reveal key={item.title} delay={index * 90} className={`bento__cell ${index === 0 ? "bento__cell--green" : "bento__cell--white"}`}>
                <span className="bento__icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="about-values__index">0{index + 1}</span>
              </Reveal>
            ))}
            {strengths.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className={`bento__cell ${index === 0 ? "bento__cell--gold bento__cell--wide" : "bento__cell--cream"}`}
              >
                <span className="bento__icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-regions">
          <div>
            <SectionHeading
              eyebrow="Where we work"
              title={
                <>
                  A deep ground hold in <span className="text-gradient">rural India.</span>
                </>
              }
              lead="Our teams work across rural regions of India and have impacted the lives of more than 300,000 rural households to date."
            />
          </div>
          <div className="about-regions__list">
            {regions.map((region, index) => (
              <Reveal key={region} delay={index * 90} variant="right" className="about-regions__item">
                <span className="about-regions__pin">
                  <Icon name="pin" size={22} />
                </span>
                <strong>{region}</strong>
                <span className="about-regions__num">0{index + 1}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHeading
            eyebrow="Our team"
            title={
              <>
                Skilled, dedicated and <span className="text-gradient">hands-on.</span>
              </>
            }
            lead="We are backed by a team of skilled and dedicated personnel with hands-on experience across these fields."
          />
          <div className="about-team">
            <Reveal>
              <TiltCard className="team-card team-card--lead">
                <span className="team-card__avatar">BB</span>
                <h3>{brand.ceo}</h3>
                <span>CEO, Bibsikha</span>
              </TiltCard>
            </Reveal>
            <div className="about-team__expertise">
              {teamExpertise.map((item, index) => (
                <Reveal key={item.title} delay={index * 80} className="about-team__skill">
                  <span>
                    <Icon name={item.icon} size={22} />
                  </span>
                  {item.title}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
