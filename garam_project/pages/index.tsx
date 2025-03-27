import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>🏆 리펑 에디션 경매 시스템</h1>
      <ul style={{ marginTop: 20 }}>
        <li><Link href="/admin">🎯 운영자 페이지</Link></li>
        <li><Link href="/team/1">🧢 팀 1 입찰</Link></li>
        <li><Link href="/team/2">🎩 팀 2 입찰</Link></li>
        <li><Link href="/display">📺 전광판 보기</Link></li>
      </ul>
    </div>
  );
}