import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { PiMagnifyingGlass, PiX, PiLeaf, PiPlant, PiCaretDownBold } from 'react-icons/pi';
import type { Succulent, SucculentTag, SucculentTrait } from '../../types';
import { FILTER_TAGS, FILTER_TRAITS } from '../../data/succulents';
import styles from './FilterChips.module.css';

interface FilterChipsProps {
  dataList: Succulent[];
  activeTag: SucculentTag;
  onTagChange: (tag: SucculentTag) => void;
  activeTrait: SucculentTrait | null;
  onTraitChange: (trait: SucculentTrait | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

interface Suggestion {
  type: 'name' | 'scientific';
  text: string;
  subText?: string;
}

export default function FilterChips({
  dataList,
  activeTag,
  onTagChange,
  activeTrait,
  onTraitChange,
  searchQuery,
  onSearchChange,
}: FilterChipsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const traitMenuRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [isTraitOpen, setIsTraitOpen] = useState(false);

  /* ── 실시간 구글 시트 데이터 기반 카테고리 태그 개수 동적 계산 ── */
  const getTagCount = (tag: SucculentTag): number => {
    if (tag === '전체') return dataList.length;
    return dataList.filter((s) => s.tags.includes(tag)).length;
  };

  /* ── 실시간 구글 시트 데이터 기반 형질/특징 개수 동적 계산 ── */
  const getTraitCount = (trait: SucculentTrait): number => {
    return dataList.filter((s) => s.traits?.includes(trait)).length;
  };

  /* ── 자동완성 후보 생성 (실시간 데이터의 다육이 이름 및 학명 포함) ── */
  const suggestions = useMemo<Suggestion[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: Suggestion[] = [];
    const addedTexts = new Set<string>();

    const add = (item: Suggestion) => {
      const key = `${item.type}:${item.text}`;
      if (!addedTexts.has(key)) {
        addedTexts.add(key);
        results.push(item);
      }
    };

    for (const s of dataList) {
      if (s.name.toLowerCase().includes(q)) {
        add({ type: 'name', text: s.name, subText: s.scientificName });
      }
      if (s.scientificName && s.scientificName.toLowerCase().includes(q)) {
        add({ type: 'scientific', text: s.scientificName, subText: s.name });
      }
    }

    return results.slice(0, 8);
  }, [searchQuery, dataList]);

  const showDropdown = isFocused && suggestions.length > 0;

  /* ── 외부 클릭 시 드롭다운 닫기 ── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
        setHighlightIdx(-1);
      }
      if (!traitMenuRef.current?.contains(e.target as Node)) {
        setIsTraitOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── 키보드 내비게이션 ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && highlightIdx >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[highlightIdx]);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
        setHighlightIdx(-1);
      }
    },
    [showDropdown, suggestions, highlightIdx],
  );

  const selectSuggestion = (s: Suggestion) => {
    onSearchChange(s.text);
    setIsFocused(false);
    setHighlightIdx(-1);
    inputRef.current?.blur();
  };

  /* ── 하이라이트 ── */
  const highlight = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.mark}>{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const typeIcon = (type: Suggestion['type']) => {
    if (type === 'name') return <PiPlant className={styles.suggIcon} aria-hidden="true" />;
    return <PiLeaf className={styles.suggIcon} aria-hidden="true" />;
  };

  const typeLabel = (type: Suggestion['type']) => {
    if (type === 'name') return '이름';
    return '학명';
  };

  return (
    <section className={styles.wrapper} aria-label="카테고리 필터 및 검색">
      <div className={styles.inner}>
        {/* ── 1. 카테고리 태그 칩 (상단 배치) ── */}
        <div className={styles.track}>
          {FILTER_TAGS.map((tag) => {
            const count = getTagCount(tag as SucculentTag);
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                onClick={() => onTagChange(tag as SucculentTag)}
                aria-pressed={isActive}
              >
                {tag}
                <span className={styles.count}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── 2. 컨트롤 영역 (검색창 + 형질 드롭다운: 하단 배치) ── */}
        <div className={styles.controlsRow}>
          {/* ── 검색창 ── */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <PiMagnifyingGlass className={styles.searchIcon} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="다육이 이름, 학명으로 검색..."
                value={searchQuery}
                onChange={(e) => { onSearchChange(e.target.value); setHighlightIdx(-1); }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                aria-label="다육이 검색"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => { onSearchChange(''); setIsFocused(false); inputRef.current?.focus(); }}
                  aria-label="검색어 지우기"
                >
                  <PiX aria-hidden="true" />
                </button>
              )}
            </div>

            {/* ── 자동완성 드롭다운 ── */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className={styles.dropdown}
                role="listbox"
                aria-label="검색 자동완성"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.type}-${s.text}`}
                    type="button"
                    role="option"
                    aria-selected={i === highlightIdx}
                    className={`${styles.suggItem} ${i === highlightIdx ? styles.suggItemActive : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(s)}
                  >
                    {typeIcon(s.type)}
                    <span className={styles.suggTextGroup}>
                      <span className={styles.suggMain}>
                        {highlight(s.text, searchQuery)}
                      </span>
                      {s.subText && (
                        <span className={styles.suggSub}>{s.subText}</span>
                      )}
                    </span>
                    <span className={styles.suggType}>{typeLabel(s.type)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── 형질 / 특징 커스텀 드롭다운 ── */}
          <div className={styles.traitSelectWrap} ref={traitMenuRef}>
            <button
              type="button"
              className={`${styles.traitSelectBtn} ${activeTrait !== null ? styles.traitSelectBtnActive : ''}`}
              onClick={() => setIsTraitOpen(!isTraitOpen)}
              aria-haspopup="listbox"
              aria-expanded={isTraitOpen}
              aria-label="형질 특징 선택"
            >
              <span className={styles.traitLabel}>
                {activeTrait ? `특징: ${activeTrait}` : '형질·특징 전체'}
              </span>
              <PiCaretDownBold
                className={`${styles.caretIcon} ${isTraitOpen ? styles.caretRotate : ''}`}
                aria-hidden="true"
              />
            </button>

            {isTraitOpen && (
              <div className={styles.traitMenu} role="listbox" aria-label="형질 목록">
                <button
                  type="button"
                  className={`${styles.traitMenuItem} ${activeTrait === null ? styles.traitMenuItemActive : ''}`}
                  onClick={() => { onTraitChange(null); setIsTraitOpen(false); }}
                >
                  <span>형질·특징 전체</span>
                  <span className={styles.traitMenuCount}>{dataList.length}</span>
                </button>
                {FILTER_TRAITS.map((trait) => {
                  const count = getTraitCount(trait as SucculentTrait);
                  const isSelected = activeTrait === trait;
                  return (
                    <button
                      key={trait}
                      type="button"
                      className={`${styles.traitMenuItem} ${isSelected ? styles.traitMenuItemActive : ''}`}
                      onClick={() => { onTraitChange(isSelected ? null : (trait as SucculentTrait)); setIsTraitOpen(false); }}
                    >
                      <span>{trait}</span>
                      <span className={styles.traitMenuCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
