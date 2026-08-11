import { useState, useMemo, useEffect } from 'react';
import { PiCactus, PiLeafFill, PiPlantFill, PiSpinnerGapFill } from 'react-icons/pi';
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
      <section className={styles.hero} aria-label="소개">
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.heroEyebrow}>
            <PiCactus className={styles.heroIcon} aria-hidden="true" />
            Attia Succulent
          </p>
          <h1 className={styles.heroTitle}>
            작고 소중한<br />
            <span className={styles.heroAccent}>다육이</span> 분양합니다
          </h1>
          <p className={styles.heroDesc}>
            정성껏 키운 다육이들을 소개해요.<br />
            마음에 드는 아이가 있으면 카카오로 문의해 주세요
            <PiLeafFill className={styles.heroDescIcon} aria-hidden="true" />
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{dataList.length}</span>
              <span className={styles.statLabel}>종 보유</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{dataList.filter((s) => s.inStock).length}</span>
              <span className={styles.statLabel}>분양 가능</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>직거래</span>
              <span className={styles.statLabel}>택배 가능</span>
            </div>
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
