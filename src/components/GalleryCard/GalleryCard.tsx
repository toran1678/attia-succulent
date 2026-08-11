import { useState } from 'react';
import type { Succulent } from '../../types';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import styles from './GalleryCard.module.css';

interface GalleryCardProps {
  succulent: Succulent;
  onClick: (succulent: Succulent) => void;
}

export default function GalleryCard({ succulent, onClick }: GalleryCardProps) {
  const { name, scientificName, price, thumbnailUrl, tags, traits, inStock } = succulent;
  const [imgError, setImgError] = useState(false);

  const hasImg = Boolean(thumbnailUrl) && !imgError;

  return (
    <article
      className={styles.card}
      onClick={() => onClick(succulent)}
      role="button"
      tabIndex={0}
      aria-label={`${name} 상세보기`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(succulent)}
    >
      {/* ── 이미지 영역 ── */}
      <div className={styles.imgWrapper}>
        {hasImg ? (
          <img
            src={thumbnailUrl}
            alt={`${name} (${scientificName})`}
            className={styles.img}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlaceholder aspectRatio="4/3" />
        )}

        {/* 품절 뱃지 */}
        {!inStock && (
          <div className={styles.soldOut} aria-label="품절">
            품절
          </div>
        )}

        <div className={styles.overlay} aria-hidden="true">
          <span className={styles.overlayText}>자세히 보기</span>
        </div>
      </div>

      {/* ── 정보 영역 ── */}
      <div className={styles.info}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{name}</h3>
        </div>
        <p className={styles.sciName}>{scientificName}</p>

        {/* 카테고리 태그 */}
        <div className={styles.tags} aria-label="카테고리 태그">
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* 형질/특징 뱃지 (카테고리 태그 바로 아래 위치) */}
        {traits && traits.length > 0 && (
          <div className={styles.traits} aria-label="형질 특징">
            {traits.map((trait) => (
              <span key={trait} className={styles.trait}>
                {trait}
              </span>
            ))}
          </div>
        )}

        {/* 가격 */}
        <p className={styles.price}>
          {inStock
            ? `${price.toLocaleString('ko-KR')}원`
            : <span className={styles.soldOutText}>품절</span>
          }
        </p>
      </div>
    </article>
  );
}
