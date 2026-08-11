/* ============================================
   아띠아 다육 — 공통 TypeScript 타입
   ============================================ */

/** 카테고리 태그 */
export type SucculentTag =
  | '전체'
  | '창 다육'
  | '금 다육'
  | '특수 및 희귀다육'
  | '하월시아';

/** 형질/특징 타입 */
export type SucculentTrait =
  | '철화'
  | '원종'
  | '야생'
  | '환엽(둥근잎)'
  | 'SP(알수없는종)'
  | 'hyb(교배종)';

/** 다육이 관리 정보 */
export interface CareInfo {
  watering: string;
  sunlight: string;
  temperature: string;
  difficulty: '쉬움' | '보통' | '어려움';
}

/** 다육이 데이터 */
export interface Succulent {
  id: number;
  /** 한국어 이름 */
  name: string;
  /** 학명 또는 영문명 */
  scientificName: string;
  price: number;
  /** 썸네일용 이미지 URL (없을 경우 placeholder 표시) */
  thumbnailUrl?: string;
  /** 상세 모달용 고해상도 이미지 URL (없으면 thumbnailUrl 사용) */
  detailUrl?: string;
  /** 다중 상세 이미지 URL 목록 (여러 장일 때 슬라이드 가능) */
  images?: string[];
  /** 카테고리 태그 목록 */
  tags: SucculentTag[];
  /** 형질/특징 목록 */
  traits?: SucculentTrait[];
  /** 한 줄 설명 */
  description: string;
  /** 관리 정보 */
  careInfo?: CareInfo;
  /** 재고 여부 */
  inStock: boolean;
}

/** 필터 칩에 사용할 카테고리 옵션 */
export interface FilterOption {
  label: SucculentTag;
  count: number;
}
