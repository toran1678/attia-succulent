import { useState, useMemo, useEffect } from 'react';
import { PiLeafFill, PiSpinnerGapFill, PiPlantFill } from 'react-icons/pi';
import type { Succulent, SucculentTag, SucculentTrait } from '../../types';
import FilterChips from '../../components/FilterChips/FilterChips';
import GalleryCard from '../../components/GalleryCard/GalleryCard';
import Modal from '../../components/Modal/Modal';
import styles from './GalleryPage.module.css';

/** 구글 시트 Apps Script 웹앱 URL */
const GOOGLE_SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbyFy0OcukIfespOEJcrmm6fn6loZIOqW1H3rIg0645K1KcAfqAo5B-SbDP7W1L4jQul/exec';

/** 품절 여부 체크박스 판별 함수 (체크됨/TRUE/품절 = inStock: false -> 품절 뱃지 표시) */
const parseInStock = (val: any): boolean => {
  // 체크박스 체크됨(true/1) 이면 품절 -> inStock: false
  if (val === true || val === 1) return false;
  // 체크박스 해제됨(false/0) 이면 판매 중 -> inStock: true
  if (val === false || val === 0) return true;

  if (typeof val === 'string') {
    const s = val.trim().toUpperCase();
    if (s === 'TRUE' || s === 'Y' || s === '1' || s === '품절' || s === 'O' || s === '체크') {
      return false; // 품절 표시
    }
    if (s === 'FALSE' || s === 'N' || s === '0' || s === '판매중' || s === 'X') {
      return true; // 정상 판매 중
    }
  }
  return true; // 기본값: 판매 중
};

export default function GalleryPage() {
  const [dataList, setDataList] = useState<Succulent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTag, setActiveTag] = useState<SucculentTag>('전체');
  const [activeTrait, setActiveTrait] = useState<SucculentTrait | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSucculent, setSelectedSucculent] = useState<Succulent | null>(null);

  /* ── 오직 구글 시트 데이터만 가져와서 렌더링 ── */
  useEffect(() => {
    // 구글 시트 캐시 데이터 확인 (0초 렌더링용)
    const cached = localStorage.getItem('att_gsheet_succulents_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDataList(parsed);
          setIsLoading(false);
        }
      } catch (e) {
        // 무시
      }
    }

    let isSubscribed = true;

    // 구글 시트 최신 데이터 실시간 불러오기
    fetch(GOOGLE_SHEET_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isSubscribed) return;

        if (Array.isArray(data)) {
          // 이름이 있는 유효 데이터만 추출
          const formatted: Succulent[] = data
            .filter((item: any) => Boolean(item.name && String(item.name).trim()))
            .map((item: any, idx: number) => ({
              id: Number(item.id) || idx + 1,
              name: String(item.name || ''),
              scientificName: String(item.scientificName || ''),
              price: Number(item.price) || 0,
              thumbnailUrl: item.thumbnailUrl ? String(item.thumbnailUrl) : undefined,
              detailUrl: item.detailUrl ? String(item.detailUrl) : undefined,
              images: Array.isArray(item.images)
                ? item.images
                : (item.images ? String(item.images).split(',').map(s => s.trim()) : undefined),
              tags: Array.isArray(item.tags)
                ? item.tags
                : (item.tags ? String(item.tags).split(',').map(s => s.trim() as SucculentTag) : []),
              traits: Array.isArray(item.traits)
                ? item.traits
                : (item.traits ? String(item.traits).split(',').map(s => s.trim() as SucculentTrait) : undefined),
              description: String(item.description || ''),
              inStock: parseInStock(item.inStock),
            }));

          setDataList(formatted);
          localStorage.setItem('att_gsheet_succulents_v2', JSON.stringify(formatted));
        }
      })
      .catch((err) => {
        console.error('구글 시트 연동 로딩 실패:', err);
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = dataList;

    // 카테고리 태그 필터
    if (activeTag !== '전체') {
      result = result.filter((s) => s.tags.includes(activeTag));
    }

    // 형질/특징 드롭다운 필터
    if (activeTrait !== null) {
      result = result.filter((s) => s.traits?.includes(activeTrait));
    }

    // 텍스트 검색 필터 (이름, 학명, 태그, 형질)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.traits?.some((tr) => tr.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [dataList, activeTag, activeTrait, searchQuery]);

  return (
    <>
      {/* ── 히어로 섹션 ── */}
      <section
        className={styles.hero}
        aria-label="소개"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}background.png)` }}
      >
        <div className={`container ${styles.heroInner}`}>
          {/* 텍스트 영역 */}
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>
              작은 초록이 주는
              <svg className={styles.heroEyebrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </p>
            <h1 className={styles.heroTitle}>
              일상의 작은 <span className={styles.heroAccent}>행복</span>
            </h1>
            <div className={styles.heroDivider} aria-hidden="true" />
            <p className={styles.heroDesc}>
              정성스럽게 키운 다육식물을<br />
              당신의 공간에 전해드려요.
            </p>
            <a href="#gallery" className={styles.heroCta}>
              다육이 보러가기
              <span className={styles.heroCtaArrow}>→</span>
            </a>
          </div>
        </div>

        {/* 하단 특징 뱃지 3개 */}
        <div className={`container ${styles.heroFeatures}`}>
          <div className={styles.featureCard}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16.17 7.83 2 22"/>
              <path d="M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12"/>
              <path d="m7.83 7.83 8.34 8.34"/>
            </svg>
            <strong className={styles.featureTitle}>건강한 다육이</strong>
            <span className={styles.featureSub}>꼼꼼한 선별과 관리</span>
          </div>
          <div className={styles.featureCard}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
              <path d="M12 22V12"/>
              <polyline points="3.29 7 12 12 20.71 7"/>
              <path d="m7.5 4.27 9 5.15"/>
            </svg>
            <strong className={styles.featureTitle}>안심 포장 배송</strong>
            <span className={styles.featureSub}>안전하고 빠르게</span>
          </div>
          <div className={styles.featureCard}>
            <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
            <strong className={styles.featureTitle}>따뜻한 식물 이야기</strong>
            <span className={styles.featureSub}>식물과 함께하는 삶</span>
          </div>
        </div>


      </section>

      {/* ── 필터 칩 (상단 태그 + 하단 검색/형질 드롭다운) ── */}
      <FilterChips
        dataList={dataList}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        activeTrait={activeTrait}
        onTraitChange={setActiveTrait}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── 갤러리 ── */}
      <main className={`container ${styles.gallerySection}`} id="gallery" aria-label="다육이 갤러리">
        {isLoading && dataList.length === 0 ? (
          <div className={styles.empty}>
            <PiSpinnerGapFill className={`${styles.emptyIcon} ${styles.spin}`} aria-hidden="true" />
            <p>다육이 목록을 불러오고 있어요...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <PiPlantFill className={styles.emptyIcon} aria-hidden="true" />
            <p>해당하는 조건의 다육이가 없어요.</p>
          </div>
        ) : (
          <div className={styles.masonry} role="list" aria-label="다육이 목록">
            {filtered.map((succulent) => (
              <div key={succulent.id} role="listitem">
                <GalleryCard succulent={succulent} onClick={setSelectedSucculent} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── 모달 ── */}
      <Modal succulent={selectedSucculent} onClose={() => setSelectedSucculent(null)} />
    </>
  );
}
