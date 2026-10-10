export const metadata = { title: 'SHOWDAY 여행일정', description: '시니어를 위한 여행 일정·경비 추천' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ko"><body>{children}</body></html>);
}
