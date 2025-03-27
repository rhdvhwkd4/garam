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
    const auctionRef = ref(db, "auction");

    onValue(peopleRef, (snapshot) => setPeople(snapshot.val()));
    onValue(auctionRef, (snapshot) => setAuction(snapshot.val()));
  }, []);

  if (!people || !auction) return <p className="text-white text-center">불러오는 중...</p>;

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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">🎯 운영자 페이지</h1>
      <div className="bg-gray-900 p-6 rounded-3xl shadow-xl max-w-5xl mx-auto">
        <h2 className="text-xl mb-4">📌 현재 선수: <span className="text-yellow-400 font-bold">{currentPlayerName}</span></h2>
        <p className="mb-6">점수: <span className="text-green-400">{currentPlayer?.score}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {auction.teams.map((team: any) => (
            <div key={team.name} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold text-white">{team.name}</h3>
              <p className="text-sm text-gray-300">남은 포인트: <span className="text-green-400">{team.points}</span></p>
              <p className="text-sm">입찰가: <span className="text-yellow-400">{auction.bids?.[team.name] || 0}</span></p>
              <button
                onClick={() => handleAuction(team.name)}
                className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-bold w-full"
              >
                ✅ 낙찰
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handlePass}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-white font-semibold shadow-md"
          >
            ❌ 유찰
          </button>
          <button
            onClick={callNextPlayer}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-white font-semibold shadow-md"
          >
            ➡️ 다음 선수</button>
        </div>
      </div>
    </div>
  );
}
