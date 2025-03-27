// pages/team/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "../../lib/firebase";

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  const db = getDatabase(app);

  const [auction, setAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);

  useEffect(() => {
    const auctionRef = ref(db, "auction");
    onValue(auctionRef, (snapshot) => {
      setAuction(snapshot.val());
    });
  }, []);

  if (!auction || !id) return <p className="text-white text-center">불러오는 중...</p>;

  const team = auction.teams.find((t: any) => t.name === `팀${id}`);
  const currentPlayer = auction.current_player;

  const adjustBid = (amount: number) => {
    const newBid = bidAmount + amount;
    if (newBid <= team.points) {
      setBidAmount(newBid);
    }
  };
const confirmBid = () => {
  update(ref(db, "auction/bids"), {
    [team.name]: bidAmount
  });
  setBidAmount(0);
};
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl mb-4">🏁 팀 {id} 입찰</h1>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-xl mb-2">현재 선수: <strong>{currentPlayer}</strong></h2>
        <p className="mb-4">보유 포인트: <strong>{team.points}p</strong></p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[1, 5, 10, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => adjustBid(amount)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md"
            >
              +{amount}p
            </button>
          ))}
        </div>

        <div className="mb-4 text-lg">
          현재 입찰가: <span className="text-yellow-400 font-bold">{bidAmount}p</span>
        </div>

        <button
          onClick={confirmBid}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl font-semibold text-white"
        >
          💰 입찰하기
        </button>
      </div>
    </div>
  );
}
