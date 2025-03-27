import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../lib/firebase";

export default function DisplayPage() {
  const db = getDatabase(app);
  const [people, setPeople] = useState<any>(null);
  const [auction, setAuction] = useState<any>(null);

  useEffect(() => {
    onValue(ref(db, "people"), (snap) => setPeople(snap.val()));
    onValue(ref(db, "auction"), (snap) => setAuction(snap.val()));
  }, []);

  if (!people || !auction) return <p>불러오는 중...</p>;

  const currentPlayer = people.players.find((p: any) => p.name === auction.current_player);

  return (
    <div style={{ padding: 40 }}>
      <h2>📺 전광판</h2>
      <h3>현재 선수: {currentPlayer?.name}</h3>
      <p>{currentPlayer?.intro}</p>
      <img src={`/${currentPlayer?.image}`} alt="선수 이미지" width={200} />
      <div style={{ marginTop: 20 }}>
        <h4>입찰 현황</h4>
        {Object.entries(auction.bids || {}).map(([team, bid]: any) => (
          <p key={team}>{team}: {bid}점</p>
        ))}
      </div>
    </div>
  );
}