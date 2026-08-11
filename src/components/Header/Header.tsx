import { PiPlantFill } from 'react-icons/pi';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.logo} aria-label="아띠아 다육 홈으로">
          <PiPlantFill className={styles.logoIcon} aria-hidden="true" />
          <span className={styles.logoText}>
            <span className={styles.logoMain}>아띠아</span>
            <span className={styles.logoSub}>다육</span>
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
