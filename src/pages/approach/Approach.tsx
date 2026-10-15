import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import CountUp from "../../components/CountUp";
import Icon from "../../components/Icon";
import type { IconName } from "../../components/Icon";
import PageHero from "../../components/PageHero";
import Reveal from "../../components/Reveal";
import Scrollytelling from "../../components/Scrollytelling";
import SectionHeading from "../../components/SectionHeading";
import { approachSteps } from "../../data/siteContent";
import "./Approach.css";

const pipeline: { label: string; icon: IconName }[] = [
  { label: "Climate-positive projects", icon: "sun" },
  { label: "Emission reductions", icon: "wind" },
  { label: "Carbon credits", icon: "coins" },
  { label: "Returns & development funding", icon: "chart" },
];

const expertise: { title: string; text: string; icon: IconName }[] = [
  { title: "Climate solutions", text: "Mitigation and adaptation strategies built for real-world impact.", icon: "globe" },
  { title: "Climate finance", text: "Carbon credit management that turns climate action into returns.", icon: "coins" },
  { title: "Community based programmes", text: "Programmes designed with and for rural communities.", icon: "users" },
  { title: "Market research", text: "Insight into the Indian and North-east market and its unique challenges.", icon: "search" },
];

const sdgs = [
  { num: 3, label: "Good Health & Well-being", color: "#4c9f38" },
  { num: 5, label: "Gender Equality", color: "#ff3a21" },
  { num: 7, label: "Affordable & Clean Energy", color: "#fcc30b" },
  { num: 8, label: "Decent Work & Economic Growth", color: "#a21942" },
  { num: 13, label: "Climate Action", color: "#3f7e44" },
  { num: 15, label: "Life on Land", color: "#56c02b" },
];

const Approach = () => {
  return (
    <>
      <PageHero
        crumb="Our Approach"
        eyebrow="Our Approach"
        title={
          <>
            Climate consciousness is the new <span className="text-gradient">business currency.</span>
          </>
        }
        lead="We deal in Carbon Credit Management, which offers companies and businesses a wonderful opportunity to earn great returns."
        aside={
          <a href="#journey" className="btn btn--green">
            See how we work <Icon name="arrowRight" size={18} />
          </a>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Carbon trading"
            title={
              <>
                A global opportunity, <span className="text-gradient">growing fast.</span>
              </>
            }
          />
          <div className="bento bento--3 approach-market">
            <Reveal className="bento__cell bento__cell--green bento__cell--wide approach-market__main">
              <span className="bento__big">
                $<CountUp value={300} suffix="B" />
              </span>
              <h3>Global carbon credit trading market, per year</h3>
              <p>
                This market is promising to become a significant source of funding for development projects across the world.
              </p>
            </Reveal>
            <Reveal delay={100} className="bento__cell bento__cell--gold">
              <span className="bento__big">
                <CountUp value={2} suffix="×" />
              </span>
              <h3>Set to double</h3>
              <p>The carbon credit market is set to become twice as large.</p>
            </Reveal>
            <Reveal delay={160} className="bento__cell bento__cell--white bento__cell--wide">
              <span className="bento__icon">
                <Icon name="target" />
              </span>
              <h3>Your strengths, your options</h3>
              <p>
                Understanding this global opportunity and exploring the socio-economic context, Bibsikha helps organisations
                identify their strengths and what they can deliver through a range of options and solutions in the field of
                Carbon Trading.
              </p>
            </Reveal>
            <Reveal delay={220} className="bento__cell bento__cell--cream">
              <span className="bento__icon">
                <Icon name="coins" />
              </span>
              <h3>Earn great returns</h3>
              <p>Carbon Credit Management for companies and businesses.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--cream" id="journey" style={{ "--story-bg": "var(--cream)" } as CSSProperties}>
        <div className="container">
          <SectionHeading
            eyebrow="How we work"
            align="center"
            title={
              <>
                Five steps to <span className="text-gradient">manifold growth.</span>
              </>
            }
          />
          <Scrollytelling steps={approachSteps} />
        </div>
      </section>

      <section className="section section--dark approach-tech">
        <div className="container">
          <SectionHeading
            eyebrow="How carbon trading works"
            title={
              <>
                From climate action to <span className="text-gold">returns.</span>
              </>
            }
            lead="Projects that cut emissions generate carbon credits, which can be traded — creating value for businesses and funding for development."
          />

          <Reveal className="pipeline">
            {pipeline.map((node, index) => (
              <div key={node.label} className="pipeline__node" style={{ animationDelay: `${index * 0.6}s` }}>
                <span className="pipeline__icon">
                  <Icon name={node.icon} size={28} />
                </span>
                <span>{node.label}</span>
              </div>
            ))}
            <span className="pipeline__line" aria-hidden="true">
              <span className="pipeline__pulse" />
            </span>
          </Reveal>

          <div className="grid-4 approach-tech__cards">
            {expertise.map((item, index) => (
              <Reveal key={item.title} delay={index * 90} className="approach-tech__card">
                <Icon name={item.icon} size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container approach-sdg">
          <div>
            <SectionHeading
              eyebrow="Environment & SDGs"
              title={
                <>
                  Aligned with the <span className="text-gradient">UN SDGs.</span>
                </>
              }
              lead="From cleaner kitchens for women to green energy and skilled rural employment, our programmes contribute to the Sustainable Development Goals."
            />
            <Reveal delay={200}>
              <Link to="/contact" className="btn btn--gold">
                Plan a project with us <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>
          </div>
          <div className="approach-sdg__grid">
            {sdgs.map((goal, index) => (
              <Reveal key={goal.num} delay={index * 70} variant="zoom" className="approach-sdg__tile">
                <span className="approach-sdg__num" style={{ background: goal.color }}>
                  {goal.num}
                </span>
                <span>{goal.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Approach;
