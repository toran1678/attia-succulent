import { useEffect, useCallback, useState, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { PiCaretLeftBold, PiCaretRightBold, PiMagnifyingGlassPlusFill } from 'react-icons/pi';
import type { Succulent } from '../../types';
import { KAKAO_OPEN_CHAT_URL } from '../../data/succulents';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import styles from './Modal.module.css';

interface ModalProps {
  succulent: Succulent | null;
  onClose: () => void;
}

export default function Modal({ succulent, onClose }: ModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // 실시간 드래그/스와이프 상태
  const [dragOffset, setDragOffset] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  const isMovedRef = useRef(false);

  // 모달 데이터 변경 시 인덱스 초기화
  useEffect(() => {
    setActiveImgIdx(0);
    setImgError(false);
    setIsZoomOpen(false);
    setDragOffset(0);
  }, [succulent]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) {
          setIsZoomOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        setActiveImgIdx((prev) => (prev === 0 ? imageListLength - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImgIdx((prev) => (prev === imageListLength - 1 ? 0 : prev + 1));
      }
    },
    [isZoomOpen, onClose],
  );

  useEffect(() => {
    if (!succulent) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [succulent, handleKeyDown]);

  if (!succulent) return null;

  const { name, scientificName, price, detailUrl, thumbnailUrl, images, tags, traits, description, inStock } = succulent;

  // 이미지 리스트 구성 (images 배열이 우선, 없으면 detailUrl 또는 thumbnailUrl)
  const imageList = (images && images.length > 0)
    ? images
    : [detailUrl || thumbnailUrl || ''].filter(Boolean);

  const imageListLength = imageList.length;
  const currentImgSrc = imageList[activeImgIdx] || '';
  const hasImg = Boolean(currentImgSrc) && !imgError;
  const isMultiImg = imageList.length > 1;

  const kakaoUrl = `${KAKAO_OPEN_CHAT_URL}?text=${encodeURIComponent(`[${name}] 분양 문의드립니다.`)}`;

  const handlePrevImg = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imageListLength - 1 : prev - 1));
  };

  const handleNextImg = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImgIdx((prev) => (prev === imageListLength - 1 ? 0 : prev + 1));
  };

  /* ── 드래그 / 터치 시작 ── */
  const onStart = (clientX: number) => {
    startXRef.current = clientX;
    currentXRef.current = clientX;
    setIsInteracting(true);
    isMovedRef.current = false;
  };

  /* ── 드래그 / 터치 진행 중 ── */
  const onMove = (clientX: number) => {
    if (startXRef.current === null) return;
    const diff = clientX - startXRef.current;
    if (Math.abs(diff) > 5) {
      isMovedRef.current = true;
    }
    setDragOffset(diff);
    currentXRef.current = clientX;
  };

  /* ── 드래그 / 터치 종료 ── */
  const onEnd = () => {
    if (startXRef.current === null) return;
    const diff = dragOffset;
    const minDistance = 40;

    setIsInteracting(false);

    if (diff < -minDistance && isMultiImg) {
      setActiveImgIdx((prev) => (prev === imageListLength - 1 ? 0 : prev + 1));
    } else if (diff > minDistance && isMultiImg) {
      setActiveImgIdx((prev) => (prev === 0 ? imageListLength - 1 : prev - 1));
    } else if (!isMovedRef.current) {
      setIsZoomOpen(true);
    }

    setDragOffset(0);
    startXRef.current = null;
    currentXRef.current = null;
  };

  return (
    <>
      {/* ── 기본 상세 모달 ── */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${name} 상세 정보`}
      >
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
          {/* 닫기 버튼 */}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="모달 닫기">
            <IoClose aria-hidden="true" />
          </button>

          {/* ── 이미지 슬라이더 영역 ── */}
          <div className={styles.imgWrapper}>
            {hasImg ? (
              <div
                className={styles.sliderViewport}
                onTouchStart={(e) => onStart(e.touches[0].clientX)}
                onTouchMove={(e) => onMove(e.touches[0].clientX)}
                onTouchEnd={onEnd}
                onMouseDown={(e) => onStart(e.clientX)}
                onMouseMove={(e) => startXRef.current !== null && onMove(e.clientX)}
                onMouseUp={onEnd}
                onMouseLeave={() => startXRef.current !== null && onEnd()}
              >
                {/* 실시간으로 움직이는 이미지 트랙 */}
                <div
                  className={styles.sliderTrack}
                  style={{
                    transform: `translateX(calc(-${activeImgIdx * 100}% + ${dragOffset}px))`,
                    transition: isInteracting ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                  {imageList.map((src, idx) => (
                    <div key={idx} className={styles.slideItem}>
                      <img
                        src={src}
                        alt={`${name} 사진 (${idx + 1}/${imageList.length})`}
                        className={styles.img}
                        loading="eager"
                        draggable={false}
                        onError={() => setImgError(true)}
                      />
                    </div>
                  ))}
                </div>

                {/* 사진 확대 버튼 힌트 */}
                <button
                  type="button"
                  className={styles.zoomTriggerBtn}
                  onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
                  aria-label="사진 원본 크게 보기"
                  title="사진 원본 크게 보기"
                >
                  <PiMagnifyingGlassPlusFill aria-hidden="true" />
                  <span>확대하기</span>
                </button>
              </div>
            ) : (
              <ImagePlaceholder aspectRatio="16/10" />
            )}

            {/* 품절 뱃지 */}
            {!inStock && <div className={styles.soldOut}>품절</div>}

            {/* 다중 이미지 슬라이드 이전/다음 버튼 */}
            {isMultiImg && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={handlePrevImg}
                  aria-label="이전 이미지"
                >
                  <PiCaretLeftBold aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={handleNextImg}
                  aria-label="다음 이미지"
                >
                  <PiCaretRightBold aria-hidden="true" />
                </button>

                {/* 이미지 인디케이터 (도트) */}
                <div className={styles.dotsIndicator}>
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.dot} ${idx === activeImgIdx ? styles.dotActive : ''}`}
                      onClick={(e) => { e.stopPropagation(); setActiveImgIdx(idx); }}
                      aria-label={`${idx + 1}번째 이미지로 이동`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── 상세 본문 ── */}
          <div className={styles.body}>
            <div className={styles.nameRow}>
              <div>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.sciName}>{scientificName}</p>
              </div>
              <p className={styles.price}>
                {inStock ? `${price.toLocaleString('ko-KR')}원` : <span className={styles.soldOutText}>품절</span>}
              </p>
            </div>

            {/* 카테고리 태그 */}
            <div className={styles.badgeGroup}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            {/* 형질/특징 뱃지 (카테고리 태그 바로 아래 위치) */}
            {traits && traits.length > 0 && (
              <div className={styles.traitsGroup}>
                {traits.map((trait) => (
                  <span key={trait} className={styles.trait}>{trait}</span>
                ))}
              </div>
            )}

            <p className={styles.desc}>{description}</p>

            <a
              href={kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.kakaoBtn} ${!inStock ? styles.kakaoBtnDisabled : ''}`}
              aria-label={`카카오톡으로 ${name} 문의하기`}
              onClick={!inStock ? (e) => e.preventDefault() : undefined}
            >
              <RiKakaoTalkFill aria-hidden="true" />
              {inStock ? '카카오톡으로 문의하기' : '현재 품절된 상품입니다'}
            </a>
          </div>
        </div>
      </div>

      {/* ── 이미지 풀스크린 확대 뷰어 (Lightbox) ── */}
      {isZoomOpen && hasImg && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-label={`${name} 원본 사진 확대 뷰어`}
        >
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setIsZoomOpen(false)}
              aria-label="확대 뷰어 닫기"
            >
              <IoClose aria-hidden="true" />
            </button>

            <div
              className={styles.lightboxSliderViewport}
              onTouchStart={(e) => onStart(e.touches[0].clientX)}
              onTouchMove={(e) => onMove(e.touches[0].clientX)}
              onTouchEnd={onEnd}
              onMouseDown={(e) => onStart(e.clientX)}
              onMouseMove={(e) => startXRef.current !== null && onMove(e.clientX)}
              onMouseUp={onEnd}
              onMouseLeave={() => startXRef.current !== null && onEnd()}
            >
              <div
                className={styles.sliderTrack}
                style={{
                  transform: `translateX(calc(-${activeImgIdx * 100}% + ${dragOffset}px))`,
                  transition: isInteracting ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {imageList.map((src, idx) => (
                  <div key={idx} className={styles.lightboxSlideItem}>
                    <img
                      src={src}
                      alt={`${name} 원본 확대 사진 (${idx + 1}/${imageList.length})`}
                      className={styles.lightboxImg}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 라이트박스 내 이전/다음 슬라이드 탐색 */}
            {isMultiImg && (
              <>
                <button
                  type="button"
                  className={`${styles.lightboxNavBtn} ${styles.lightboxPrevBtn}`}
                  onClick={handlePrevImg}
                  aria-label="이전 사진 보기"
                >
                  <PiCaretLeftBold aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxNavBtn} ${styles.lightboxNextBtn}`}
                  onClick={handleNextImg}
                  aria-label="다음 사진 보기"
                >
                  <PiCaretRightBold aria-hidden="true" />
                </button>
                <div className={styles.lightboxCounter}>
                  {activeImgIdx + 1} / {imageList.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
