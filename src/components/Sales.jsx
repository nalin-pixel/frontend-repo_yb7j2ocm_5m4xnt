import React, { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Sales(){
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState(0);
  const [cashier, setCashier] = useState("");
  const [note, setNote] = useState("");
  const [recent, setRecent] = useState([]);

  const load = async () => {
    const res = await fetch(`${API}/api/items?active=true`);
    setItems(await res.json());
    const rs = await fetch(`${API}/api/sales?limit=10`);
    setRecent(await rs.json());
  }
  useEffect(()=>{load();},[]);

  const addToCart = (it) => {
    setCart(prev => {
      const idx = prev.findIndex(x=>x._id===it._id);
      if(idx>=0){
        const copy=[...prev];
        copy[idx].qty += 1; return copy;
      }
      return [...prev,{...it, qty:1}];
    })
  }

  const totals = useMemo(()=>{
    const subtotal = cart.reduce((s,it)=> s + Number(it.price)*it.qty, 0);
    const tax = 0;
    const total = subtotal + tax;
    const change = Math.max(0, Number(paid)-total);
    return {subtotal, tax, total, change};
  },[cart,paid]);

  const checkout = async ()=>{
    if(cart.length===0) return;
    const payload = {
      items: cart.map(it=>({ item_id: it._id, quantity: it.qty })),
      cashier: cashier || undefined,
      note: note || undefined,
      paid: Number(paid),
    };
    const res = await fetch(`${API}/api/sales`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    if(!res.ok){
      const e = await res.json().catch(()=>({detail:'Error'}));
      alert(e.detail || 'Checkout failed');
      return;
    }
    const sale = await res.json();
    setCart([]); setPaid(0); setNote("");
    load();
    // open simple receipt
    const win = window.open("", "receipt");
    if(win){
      win.document.write(`<pre>${JSON.stringify(sale,null,2)}</pre>`);
      win.document.close();
    }
  }

  return (
    <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <h2 className="text-white font-semibold mb-3">Sales</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-auto pr-1">
            {items.map(it=> (
              <button key={it._id} onClick={()=>addToCart(it)} className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 hover:border-blue-500 text-left">
                <div className="text-blue-100 font-medium truncate">{it.name}</div>
                <div className="text-blue-300/70 text-sm">${Number(it.price).toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 max-h-80 overflow-auto">
            {cart.length===0 && <div className="text-blue-300/60 text-sm">No items in cart</div>}
            {cart.map(it=> (
              <div key={it._id} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <div>
                  <div className="text-blue-100">{it.name}</div>
                  <div className="text-blue-300/70 text-xs">${Number(it.price).toFixed(2)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setCart(prev=> prev.map(x=> x._id===it._id?{...x,qty:Math.max(1,x.qty-1)}:x))} className="px-2 py-1 rounded bg-slate-700 text-white">-</button>
                  <div className="w-8 text-center text-white">{it.qty}</div>
                  <button onClick={()=>setCart(prev=> prev.map(x=> x._id===it._id?{...x,qty:x.qty+1}:x))} className="px-2 py-1 rounded bg-slate-700 text-white">+</button>
                  <div className="w-20 text-right text-white">${(Number(it.price)*it.qty).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input value={cashier} onChange={e=>setCashier(e.target.value)} placeholder="Cashier" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
            <input value={paid} onChange={e=>setPaid(e.target.value)} type="number" step="0.01" placeholder="Paid" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm col-span-2" />
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-blue-100 col-span-2">
              <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-white"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
              <div className="flex justify-between text-emerald-400"><span>Change</span><span>${totals.change.toFixed(2)}</span></div>
            </div>
            <button onClick={checkout} className="col-span-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow">Checkout</button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-white font-medium mb-2">Recent Receipts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-blue-100">
            <thead>
              <tr className="text-left bg-slate-900/40">
                <th className="p-2">Receipt</th>
                <th className="p-2">Cashier</th>
                <th className="p-2">Total</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r=> (
                <tr key={r._id} className="border-t border-slate-700/60">
                  <td className="p-2">{r.receipt_no}</td>
                  <td className="p-2">{r.cashier || '-'}</td>
                  <td className="p-2">${Number(r.total).toFixed(2)}</td>
                  <td className="p-2">${Number(r.paid).toFixed(2)}</td>
                  <td className="p-2">${Number(r.change).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
