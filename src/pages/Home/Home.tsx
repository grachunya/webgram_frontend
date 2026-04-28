import { Building2 } from "lucide-react";
import styles from "./Home.module.scss";
import { CARD_SECTIONS } from "./lib/cardData";

const Home = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <section className={styles.hero}>
          <Building2 className={styles.heroIcon} size={48} />
          <h1 className={styles.heroTitle}>Колл-центр</h1>
          <p className={styles.heroSubtitle}>
            Единая система управления IP-телефонией. Совершайте звонки,
            распределяйте вызовы между операторами, отслеживайте очереди и
            ведите телефонную книгу — всё в одном месте.
          </p>
        </section>

        <nav className={styles.sections}>
          {CARD_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <a
                key={section.id}
                href="#"
                className={styles.sectionCard}
                onClick={(e) => e.preventDefault()}
              >
                <Icon className={styles.sectionIcon} size={36} />
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <p className={styles.sectionDesc}>{section.description}</p>
              </a>
            );
          })}
        </nav>
      </div>

      <footer className={styles.footer}>
        <span>Webgram</span>
        <span className={styles.footerCopy}>&copy; {currentYear}</span>
      </footer>
    </div>
  );
};

export default Home;
