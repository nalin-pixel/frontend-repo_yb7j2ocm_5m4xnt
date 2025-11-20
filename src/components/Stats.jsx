import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Stats(){
  const [stats, setStats] = useState({ most_selling: null, least_selling: null });
  const load = async ()=>{
    const res = await fetch(`${API}/api/stats/top`);
    setStats(await res.json());
  }
  useEffect(()=>{load();},[]);

  const Tile = ({title, data}) => (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 text-blue-100">
      <div className="text-blue-300/70 text-sm mb-1">{title}</div>
      {data ? (
        <div>
          <div className="text-white font-semibold">{data.name}</div>
          <div className="text-sm text-blue-300/80">Qty sold: {data.quantity}</div>
          <div className="text-sm text-blue-300/60">Price: ${Number(data.price).toFixed(2)}</div>
        </div>
      ) : <div className="text-blue-300/60 text-sm">No data yet</div>}
    </div>
  );

  return (
    <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <h2 className="text-white font-semibold mb-3">Top Items</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Tile title="Most selling" data={stats.most_selling} />
        <Tile title="Least selling" data={stats.least_selling} />
      </div>
    </section>
  )
}
