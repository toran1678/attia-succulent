import type { Succulent, SucculentTag, SucculentTrait } from '../types';

/* ============================================
   아띠아 다육 — Mock 데이터
   ============================================ */

export const KAKAO_CHANNEL_URL = 'http://pf.kakao.com/_YeRiX';
export const KAKAO_OPEN_CHAT_URL = 'http://pf.kakao.com/_YeRiX/chat';
export const YOUTUBE_URL = 'https://www.youtube.com/@Attiasucculents';

export const succulents: Succulent[] = [
  {
    id: 1,
    name: '핑크 루비 금',
    scientificName: 'Echeveria subsessilis variegata',
    price: 35000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1000&auto=format&fit=crop',
    ],
    tags: ['금 다육', '특수 및 희귀다육'],
    traits: ['환엽(둥근잎)'],
    description: '분홍빛 무늬금(금)이 화려하게 감도는 잎이 매력적인 희귀종입니다. 각도에 따라 오묘한 파스텔 톤을 자랑합니다.',
    inStock: true,
  },
  {
    id: 2,
    name: '옥선 철화',
    scientificName: 'Haworthia truncata f. cristata',
    price: 48000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1459664018906-085c36f472af?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1459664018906-085c36f472af?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=1000&auto=format&fit=crop',
    ],
    tags: ['하월시아', '특수 및 희귀다육'],
    traits: ['철화', '원종'],
    description: '잎 끝이 납작하게 연결되어 부채꼴 철화 형태로 자라나는 독특한 원종 하월시아입니다.',
    inStock: true,
  },
  {
    id: 3,
    name: '원종 흑법사',
    scientificName: 'Aeonium arboreum wild',
    price: 18000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&auto=format&fit=crop',
    ],
    tags: ['특수 및 희귀다육'],
    traits: ['원종', '야생'],
    description: '야생 원종 특유의 건강하고 짙은 보랏빛 잎이 로제트 형태로 곧게 모여있는 다육이입니다.',
    inStock: true,
  },
  {
    id: 4,
    name: '원종 아가보이데스 창',
    scientificName: 'Echeveria agavoides wild',
    price: 22000,
    thumbnailUrl: '', // 이미지 준비 중 (Placeholder 테스트)
    tags: ['창 다육'],
    traits: ['원종', '야생'],
    description: '날카롭고 붉은 손톱 끝이 매력적인 원종 창 다육이입니다.',
    inStock: false,
  },
  {
    id: 5,
    name: '라우이 hyb',
    scientificName: 'Echeveria laui hybrid',
    price: 32000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1000&auto=format&fit=crop',
    ],
    tags: ['특수 및 희귀다육'],
    traits: ['hyb(교배종)', '환엽(둥근잎)'],
    description: '하얀 분이 가득 덮인 둥근 환엽 잎이 아름다운 교배종 다육이입니다.',
    inStock: true,
  },
  {
    id: 6,
    name: '환엽 성미인',
    scientificName: 'Pachyphytum oviferum',
    price: 9000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&auto=format&fit=crop',
    tags: ['특수 및 희귀다육'],
    traits: ['환엽(둥근잎)'],
    description: '통통하고 동글동글한 달걀 모양의 잎이 귀여운 다육이입니다.',
    inStock: true,
  },
  {
    id: 7,
    name: '천대전송 SP',
    scientificName: 'Haworthia coarctata SP',
    price: 18000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=600&auto=format&fit=crop',
    tags: ['하월시아'],
    traits: ['SP(알수없는종)'],
    description: '해외 수입 미등록 원종으로 오묘한 가로 줄무늬가 매력적인 하월시아 SP입니다.',
    inStock: true,
  },
  {
    id: 8,
    name: '에보니 창 금',
    scientificName: 'Echeveria agavoides Ebony Variegata',
    price: 55000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=1000&auto=format&fit=crop',
    ],
    tags: ['창 다육', '금 다육', '특수 및 희귀다육'],
    traits: ['야생'],
    description: '짙은 붉은 창에 화려한 황금 빛 무늬 금이 깔린 명품 창 다육입니다.',
    inStock: true,
  },
  {
    id: 9,
    name: '원종 샬롯 hyb',
    scientificName: 'Echeveria Charlotte hybrid',
    price: 25000,
    thumbnailUrl: '', // 이미지 준비 중 (Placeholder 테스트)
    tags: ['창 다육'],
    traits: ['hyb(교배종)', '환엽(둥근잎)'],
    description: '단단하고 붉게 물드는 환엽 잎을 가진 최고급 교배종 다육이입니다.',
    inStock: true,
  },
  {
    id: 10,
    name: '문스톤 철화',
    scientificName: 'Pachyphytum oviferum f. cristata',
    price: 29000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1000&auto=format&fit=crop',
    ],
    tags: ['특수 및 희귀다육'],
    traits: ['철화'],
    description: '포도송이처럼 철화로 이어진 앙증맞은 핑크빛 문스톤입니다.',
    inStock: true,
  },
  {
    id: 11,
    name: '레드 에보니 SP',
    scientificName: 'Echeveria agavoides "Red Ebony" SP',
    price: 42000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=600&auto=format&fit=crop',
    tags: ['창 다육', '특수 및 희귀다육'],
    traits: ['SP(알수없는종)', '야생'],
    description: '초콜릿빛 적자색이 전체를 덮는 강렬한 포스의 야생 창 다육입니다.',
    inStock: false,
  },
  {
    id: 12,
    name: '비모란 금',
    scientificName: 'Gymnocalycium mihanovichii f. variegata',
    price: 15000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=600&auto=format&fit=crop',
    tags: ['금 다육', '특수 및 희귀다육'],
    description: '형광 붉은빛과 알록달록한 금 무늬가 돋보이는 접목 선인장입니다.',
    inStock: true,
  },
];

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
