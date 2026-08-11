import { PiPlantFill } from 'react-icons/pi';
import styles from './Header.module.css';

export default function Header() {
  const logoPath = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href={import.meta.env.BASE_URL} className={styles.logo} aria-label="아띠아 다육 홈으로">
          <img src={logoPath} alt="아띠아 다육 로고" className={styles.logoImg} />
          <span className={styles.logoText}>
            <span className={styles.logoMain}>아띠아 다육</span>
            <span className={styles.logoSub}>ATTIA SUCCULENT</span>
          </span>
        </a>

        <p className={styles.tagline}>
          <PiPlantFill className={styles.taglineIcon} aria-hidden="true" />
          정성껏 키운 다육이를 소개합니다
        </p>
      </div>
    </header>
  );
}
