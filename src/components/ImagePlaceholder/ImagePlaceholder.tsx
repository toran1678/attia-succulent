import { PiPlantFill } from 'react-icons/pi';
import styles from './ImagePlaceholder.module.css';

interface ImagePlaceholderProps {
  aspectRatio?: string;
  className?: string;
}

export default function ImagePlaceholder({ aspectRatio, className }: ImagePlaceholderProps) {
  return (
    <div
      className={`${styles.placeholder} ${className ?? ''}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      aria-label="이미지 준비 중"
    >
      <div className={styles.content}>
        <PiPlantFill className={styles.icon} aria-hidden="true" />
        <span className={styles.text}>이미지 준비 중</span>
      </div>
    </div>
  );
}
