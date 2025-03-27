import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../../lib/firebase";

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  const db = getDatabase(app);

  const [auction, setAuction] = useState<any>(null);
  const [bid, setBid] = useState(0);

  useEffect(() => {
    onValue(ref(db, "auction"), (snap) => setAuction(snap.val()));
  }, []);

  const teamName = `팀${id}`;

  const submitBid = () => {
    update(ref(db, "auction/bids"), {
      [teamName]: bid,
    });
  };

  if (!auction) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>🧢 {teamName} 입찰 페이지</h2>
      <h3>현재 선수: {auction.current_player}</h3>
      <p>현재 입찰가: {auction.bids?.[teamName] || 0}점</p>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        style={{ marginRight: 10 }}
      />
      <button onClick={submitBid}>💰 입찰하기</button>
    </div>
  );
}