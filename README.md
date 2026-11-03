# Bấm giờ tập luyện (Workout Timer)

Ứng dụng quản lý và bấm giờ tập luyện cho phòng gym với kho 10.000 bài tập ảo hóa, đồng hồ chạy theo từng giây tự động chuyển bài, quản lý bài tập đã lưu và giáo án tập luyện tùy chỉnh.

## 🛠 Công nghệ sử dụng
- **React 19** + **TypeScript** + **Vite**
- **React Router v6**: Điều hướng SPA, code-splitting route bằng `React.lazy` và `Suspense`.
- **react-window**: Danh sách ảo hóa (`FixedSizeList`) tối ưu hiển thị 10.000 bài tập mượt mà.
- **Zustand**: Quản lý state đồng hồ buổi tập với selector chống re-render thừa; state bài tập đã lưu kết hợp middleware `persist` lưu vào `localStorage`.
- **Context API + useReducer**: Quản lý giáo án tập luyện với kiến trúc tách 2 Context (`RoutineStateContext` và `RoutineDispatchContext`) cùng middleware `withLogger`.
- **ThemeContext**: Hỗ trợ chuyển đổi giao diện sáng/tối (Light/Dark mode).
- **Vitest + React Testing Library**: Bộ kiểm thử toàn diện với hơn 40 test cases đạt độ bao phủ Lines > 87%.

## 🚀 Khởi chạy dự án

### Cài đặt dependencies
```bash
npm install
```

### Chạy môi trường phát triển (Dev)
```bash
npm run dev
```

### Build dự án (Production)
```bash
npm run build
```

### Chạy kiểm thử (Unit test)
```bash
npm test
```

### Chạy kiểm tra độ bao phủ (Coverage)
```bash
npm run coverage
```

## 📊 Báo cáo kiểm thử & Độ bao phủ (Coverage)
- Độ bao phủ toàn bộ các thư mục `src/features` và `src/utils` đạt **> 87% Lines** (vượt ngưỡng yêu cầu 70%).
- Bảng coverage chi tiết được lưu tại `coverage.png`.

## 📁 Cấu trúc thư mục
```
src/
├── App.tsx, main.tsx, types.ts, setupTests.ts
├── data/exercises.ts (+ exercises.test.ts)
├── utils/format.ts (+ format.test.ts)
├── hooks/useDebounce.ts (+ useDebounce.test.ts)
├── contexts/ThemeContext.tsx
└── features/
    ├── library/
    │   ├── LibraryPage.tsx (+ LibraryPage.test.tsx)
    │   └── ExerciseRow.tsx (+ ExerciseRow.test.tsx)
    ├── session/
    │   ├── useSessionStore.ts (+ useSessionStore.test.ts)
    │   ├── SessionBar.tsx (+ SessionBar.test.tsx)
    │   └── CountdownBar.tsx
    ├── saved/
    │   ├── useSavedStore.ts (+ useSavedStore.test.ts)
    │   └── SavedPage.tsx (+ SavedPage.test.tsx)
    └── routines/
        ├── routineReducer.ts (+ routineReducer.test.ts)
        ├── withLogger.ts
        ├── RoutineContext.tsx
        ├── RoutinesPage.tsx (+ RoutinesPage.test.tsx)
        └── RoutineDetailPage.tsx (+ RoutineDetailPage.test.tsx)
```
