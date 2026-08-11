import { RiKakaoTalkFill, RiYoutubeFill } from 'react-icons/ri';
import { KAKAO_CHANNEL_URL, YOUTUBE_URL } from '../../data/succulents';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const logoPath = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src={logoPath} alt="아띠아 다육 로고" className={styles.brandImg} />
          <div className={styles.brandText}>
            <span className={styles.brandName}>아띠아 다육</span>
            <span className={styles.brandSub}>ATTIA SUCCULENT</span>
          </div>
        </div>

        <p className={styles.desc}>
          정성과 사랑으로 키운 다육이를 여러분께 분양합니다.
        </p>

        <div className={styles.socialRow}>
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.kakaoBtn}
            aria-label="카카오 채널 방문하기"
          >
            <RiKakaoTalkFill aria-hidden="true" />
            카카오 채널
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.youtubeBtn}
            aria-label="유튜브 채널 방문하기"
          >
            <RiYoutubeFill aria-hidden="true" />
            유튜브
          </a>
        </div>

        <p className={styles.copy}>
          © {year} 아띠아 다육. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
