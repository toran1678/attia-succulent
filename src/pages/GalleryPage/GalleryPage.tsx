import { useState, useMemo } from 'react';
import { PiCactus, PiLeafFill, PiPlantFill } from 'react-icons/pi';
import type { Succulent, SucculentTag, SucculentTrait } from '../../types';
import { succulents } from '../../data/succulents';
import FilterChips from '../../components/FilterChips/FilterChips';
import GalleryCard from '../../components/GalleryCard/GalleryCard';
import Modal from '../../components/Modal/Modal';
import styles from './GalleryPage.module.css';

export default function GalleryPage() {
  const [activeTag, setActiveTag] = useState<SucculentTag>('전체');
  const [activeTrait, setActiveTrait] = useState<SucculentTrait | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSucculent, setSelectedSucculent] = useState<Succulent | null>(null);

  const filtered = useMemo(() => {
    let result = succulents;

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
  }, [activeTag, activeTrait, searchQuery]);

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
              <span className={styles.statNum}>{succulents.length}</span>
              <span className={styles.statLabel}>종 보유</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{succulents.filter((s) => s.inStock).length}</span>
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
        activeTag={activeTag}
        onTagChange={setActiveTag}
        activeTrait={activeTrait}
        onTraitChange={setActiveTrait}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── 갤러리 ── */}
      <main className={`container ${styles.gallerySection}`} id="gallery" aria-label="다육이 갤러리">
        {filtered.length === 0 ? (
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
