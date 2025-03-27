// pages/admin.tsx
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../lib/firebase";

export default function AdminPage() {
  const db = getDatabase(app);
  const [people, setPeople] = useState<any>(null);
  const [auction, setAuction] = useState<any>(null);

  useEffect(() => {
    const peopleRef = ref(db, "people");
    onValue(peopleRef, (snapshot) => {
      setPeople(snapshot.val());
    });
    const auctionRef = ref(db, "auction");
    onValue(auctionRef, (snapshot) => {
      setAuction(snapshot.val());
    });
  }, []);

  if (!people || !auction) return <p>불러오는 중...</p>;

  const currentPlayerName = auction.current_player;
  const currentPlayer = people.players.find((p: any) => p.name === currentPlayerName);

  const callNextPlayer = () => {
    const remaining = auction.players.filter((p: string) => p !== currentPlayerName);
    const next = remaining[0] || "";
    update(ref(db, "auction"), {
      current_player: next,
      bids: {},
    });
  };

  const handleAuction = (teamName: string) => {
    const bidAmount = auction.bids[teamName];
    const newTeams = auction.teams.map((team: any) => {
      if (team.name === teamName) {
        return {
          ...team,
          members: [...team.members, currentPlayerName],
          points: team.points - bidAmount,
        };
      }
      return team;
    });
    update(ref(db, "auction"), {
      teams: newTeams,
      history: [...auction.history, { player: currentPlayerName, team: teamName, price: bidAmount }],
    });
    callNextPlayer();
  };

  const handlePass = () => {
    const remaining = auction.players.filter((p: string) => p !== currentPlayerName);
    const nextList = [...remaining, currentPlayerName];
    update(ref(db, "auction"), {
      players: nextList,
    });
    callNextPlayer();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🎯 운영자 페이지</h2>
      <h3>📌 현재 선수: {currentPlayerName}</h3>
      <p>점수: {currentPlayer?.score}</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {auction.teams.map((team: any) => (
          <div key={team.name} style={{ border: "1px solid #ccc", padding: 16 }}>
            <h4>{team.name}</h4>
            <p>남은 포인트: {team.points}</p>
            <p>입찰가: {auction.bids?.[team.name] || 0}</p>
            <button onClick={() => handleAuction(team.name)}>낙찰</button>
          </div>
        ))}
      </div>
      <button onClick={handlePass} style={{ marginTop: 20 }}>❌ 유찰</button>
      <button onClick={callNextPlayer} style={{ marginTop: 20, marginLeft: 10 }}>➡️ 다음 선수</button>
    </div>
  );
}