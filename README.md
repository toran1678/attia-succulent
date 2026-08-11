# 🌵 Attia Succulent (아띠아 다육)

> **정성과 사랑으로 키운 특별한 다육이 분양 및 감상 웹 애플리케이션**  
> 🌐 **라이브 웹사이트**: [https://toran1678.github.io/attia-succulent/](https://toran1678.github.io/attia-succulent/)

---

## ✨ 주요 기능 (Key Features)

### 🌿 1. 모던 다육이 갤러리 (Masonry Gallery)
- **반응형 Masonry 그리드**: 다양한 이미지 비율에 대응하는 동적 컬럼 그리드 배치 (Break-inside 방지)
- **상태 및 특징 뱃지**: 
  - 품절 상품 직관적 Overlay 표시
  - 카테고리 태그 및 **모던 미니멀 베이지 칩 톤의 형질 특징 뱃지** (`철화`, `원종`, `야생`, `환엽(둥근잎)`, `SP`, `hyb`)
- **Image Fallback Placeholder**: 이미지가 없거나 로딩 실패 시 아띠아 감성의 Custom SVG Placeholder 자동 렌더링

### 🔍 2. 스마트 필터링 & 키보드 검색 (Smart Search & Filter)
- **카테고리 태그 칩**: `전체`, `창 다육`, `금 다육`, `특수 및 희귀다육`, `하월시아` (모바일 반응형 멀티 라인 줄바꿈 지원)
- **형질·특징 드롭다운**: 카테고리와 조합 가능한 교차 정밀 필터링 기능
- **실시간 실크 드롭다운 자동완성**:
  - 한국어 이름 및 학명 대상 일치 키워드 하이라이팅 (`<mark>`)
  - 키보드 내비게이션 완벽 지원 (`↑`, `↓`, `Enter`, `Esc`)
  - 줄바꿈 방지 및 말줄임표 처리로 깔끔한 힌트 드롭다운 UI 제공

### 🖼️ 3. 다중 이미지 슬라이더 & 원본 크게 보기 (Lightbox Slider)
- **1:1 실시간 스와이프/드래그 뷰어**: 
  - 모바일 터치 스와이프 및 PC 마우스 드래그 동작 시 **실시간 트랙 위치 변환(`transform: translateX`)** 과 부드러운 Easing 애니메이션 적용
- **도트 인디케이터 & 이전/다음 화살표**: 다중 등록된 다육이 사진 전환 기능
- **풀스크린 뷰어 (Lightbox)**: 고해상도 사진 확대 원본 보기 기능 지원 및 `Esc` 키 제어

### 💬 4. 소셜 채널 연동 & 감성 푸터 (Social Integration)
- **카카오톡 1:1 오픈채팅 연동**: 상품 선택 시 해당 다육이 이름이 담긴 카카오톡 분양 문의 링크 연결
- **소프트 파스텔 소셜 버튼**: 눈이 편안한 감성 파스텔 톤의 **카카오 채널** 및 **유튜브** 연동 버튼

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 |
| --- | --- |
| **Frontend** | React (v18+), TypeScript, Vite |
| **Styling** | Vanilla CSS Modules (CSS Custom Properties & Design Tokens) |
| **Icons** | React Icons (`react-icons/pi`, `react-icons/io5`, `react-icons/ri`) |
| **Deployment** | GitHub Pages (GitHub Actions CI/CD) |

---

## 📁 프로젝트 구조 (Project Structure)

```text
atia/
├── public/                # 정적 리소스 (파비콘, 로고 등)
├── src/
│   ├── components/        # UI 컴포넌트
│   │   ├── FilterChips/   # 태그 칩 & 검색창 & 형질 드롭다운
│   │   ├── Footer/        # 소셜 연동 푸터
│   │   ├── GalleryCard/   # 갤러리 카드 컴포넌트
│   │   ├── Header/        # 헤더 & 네비게이션
│   │   ├── ImagePlaceholder/ # 이미지 로딩 실패/부재 대응 Placeholder
│   │   └── Modal/         # 다중 이미지 슬라이더 & 라이트박스 뷰어 모달
│   ├── data/
│   │   └── succulents.ts  # 다육이 컬렉션 Mock 데이터 및 소셜 링크
│   ├── pages/
│   │   └── GalleryPage/   # 메인 갤러리 페이지
│   ├── types/
│   │   └── index.ts       # Succulent, Tag, Trait 공통 TypeScript 타입
│   ├── index.css          # 글로벌 CSS 변수 (컬러 톤, 폰트, 여백 시스템)
│   ├── main.tsx           # React 엔트리 포인트
│   └── App.tsx            # 메인 앱 라우터
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📊 구글 시트(Google Sheets) 연동 가이드 (한글 컬럼 지원)

> 별도의 서버 구축 없이 **구글 시트(Google Sheets)를 관리자 CMS 및 데이터베이스로 활용**하여, 엑셀 수정하듯 다육이 데이터를 실시간 업데이트하는 방법입니다.

### 1단계: 구글 시트 및 체크박스/드롭다운 설정
구글 시트에 **1행 컬럼명**을 다음과 같이 작성합니다:

| 번호 | 이름 | 품종명 | 가격 | 썸네일 주소 | 이미지 주소 | 태그 | 특성 | 설명 | 품절 여부 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 핑크 루비 금 | Echeveria subsessilis | 35000 | https://... | https://...,https://... | 금 다육,특수 및 희귀다육 | 환엽(둥근잎) | 예쁜 다육이입니다 | ☑️ (체크됨) |

#### 💡 **품절 여부 (TRUE/FALSE) 체크박스 설정 방법**:
1. `품절 여부` 열 (J열 2행 이하 전체)을 선택합니다.
2. 상단 메뉴 **`삽입` (Insert) ➔ `확인란` (Checkbox)** 클릭!
3. 이제 클릭 한 번으로 체크 박스를 조작할 수 있습니다:
   - **체크됨 (☑️)** ➔ `TRUE` (판매 중)
   - **체크 해제 (☐)** ➔ `FALSE` (품절 표시)

#### 💡 **태그/특성 드롭다운 설정 방법**:
1. 드롭다운을 만들 열(예: **태그** 열 또는 **특성** 열) 전체 선택
2. 상단 메뉴 **`데이터` ➔ `데이터 유효성 검사`** ➔ **`규칙 추가`** 클릭
3. **기준**: `드롭다운` 선택 후 선택지 등록:
   - **태그 드롭다운**: `창 다육`, `금 다육`, `특수 및 희귀다육`, `하월시아`
   - **특성 드롭다운**: `철화`, `원종`, `야생`, `환엽(둥근잎)`, `SP(알수없는종)`, `hyb(교배종)`

---

### 2단계: Apps Script에 한글 컬럼 매핑 스크립트 작성
1. 구글 시트 상단 메뉴 **`확장 프로그램` ➔ `Apps Script`** 클릭
2. 아래의 **한글-영문 자동 매핑 스크립트**를 붙여넣고 저장:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0]; // 1행 한글 컬럼명
  const rows = data.slice(1);
  
  // 한글 헤더 -> 앱 영문 속성 자동 변환 테이블
  const headerMap = {
    '번호': 'id',
    '이름': 'name',
    '품종명': 'scientificName',
    '가격': 'price',
    '썸네일 주소': 'thumbnailUrl',
    '이미지 주소': 'images',
    '태그': 'tags',
    '특성': 'traits',
    '설명': 'description',
    '품절 여부': 'inStock'
  };
  
  const result = rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      const key = headerMap[header.toString().trim()] || header;
      let val = row[index];
      
      // 숫자 타입 변환
      if (key === 'id' || key === 'price') {
        val = Number(val) || 0;
      }
      // 품절 여부 변환 (체크박스 boolean 및 텍스트 자동 판별)
      if (key === 'inStock') {
        if (typeof val === 'boolean') {
          val = val; // 체크박스는 boolean(true/false)으로 바로 들어옴
        } else {
          const sVal = val.toString().trim().toUpperCase();
          val = (sVal !== '품절' && sVal !== 'FALSE' && sVal !== 'N');
        }
      }
      // 콤마(,) 구분 문자열을 배열로 변환
      if (['tags', 'traits', 'images'].includes(key) && typeof val === 'string') {
        val = val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      obj[key] = val;
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 우측 상단 **`배포` ➔ `새 배포`** 클릭 ➔ 유형: **`웹 앱`**, 액세스 권한: **`모든 사용자 (Anyone)`** 선택 후 **`배포`**!
4. 생성된 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec`) 복사!

---

### 3단계: React 서비스 연동
`src/pages/GalleryPage/GalleryPage.tsx`에서 `useEffect`로 구글 시트 데이터를 불러와 바인딩합니다:

```typescript
import { useState, useEffect } from 'react';
import type { Succulent } from '../../types';
import { succulents as initialSucculents } from '../../data/succulents';

const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/복사한_URL/exec';

export default function GalleryPage() {
  const [dataList, setDataList] = useState<Succulent[]>(initialSucculents);

  useEffect(() => {
    fetch(GOOGLE_SHEET_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDataList(data);
        }
      })
      .catch((err) => console.error('구글 시트 연동 실패:', err));
  }, []);

  // ...
}
```

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. 레포지토리 클론 (Clone Repository)
```bash
git clone https://github.com/toran1678/attia-succulent.git
cd attia-succulent
```

### 2. 의존성 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 개발 서버 실행 (Run Development Server)
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 으로 접속합니다.

### 4. 프로덕션 빌드 (Build Project)
```bash
npm run build
```

---

## 📜 라이선스 (License)

© 2026 **Attia Succulent (아띠아 다육)**. All rights reserved.
