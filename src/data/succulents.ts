import type { Succulent, SucculentTag, SucculentTrait } from '../types';

/* ============================================
   아띠아 다육 — 데이터 및 상수
   ============================================ */

export const KAKAO_CHANNEL_URL = 'http://pf.kakao.com/_YeRiX';
export const KAKAO_OPEN_CHAT_URL = 'http://pf.kakao.com/_YeRiX/chat';
export const YOUTUBE_URL = 'https://www.youtube.com/@Attiasucculents';

/** 더미 데이터 제거 (오직 구글 시트 데이터만 가져와 렌더링) */
export const succulents: Succulent[] = [];

/** 카테고리 태그 옵션 */
export const FILTER_TAGS: SucculentTag[] = [
  '전체',
  '창 다육',
  '금 다육',
  '특수 및 희귀다육',
  '하월시아',
];

/** 형질/특징 필터 옵션 */
export const FILTER_TRAITS: SucculentTrait[] = [
  '철화',
  '원종',
  '야생',
  '환엽(둥근잎)',
  'SP(알수없는종)',
  'hyb(교배종)',
];
