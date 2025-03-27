// pages/display.tsx
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../lib/firebase";

export default function DisplayPage() {
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
  const player = people.players.find((p: any) => p.name === currentPlayerName);
  const playerImage = "/" + player.image;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl text-blue-400 font-bold mb-4 animate-pulse">⚡ 전광판</h1>

      <div className="bg-gray-900 rounded-3xl shadow-xl p-6 max-w-4xl w-full flex flex-col items-center">
        <img src={playerImage} alt={player.name} className="w-60 h-60 object-cover rounded-2xl shadow-2xl mb-4" />
        <h2 className="text-2xl text-yellow-300 font-bold mb-2">{player.name}</h2>
        <p className="italic text-gray-300 mb-4">"{player.intro}"</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          {auction.teams.map((team: any) => (
            <div
              key={team.name}
              className="bg-gray-800 p-4 rounded-xl shadow-md text-center border border-gray-600"
            >
              <h3 className="text-xl font-semibold text-white">{team.name}</h3>
              <p className="text-green-400 font-bold">💰 {auction.bids?.[team.name] || 0}p</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
