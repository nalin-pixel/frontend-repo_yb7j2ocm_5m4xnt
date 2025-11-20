import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "" });
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => {
    const res = await fetch(`${API}/api/items?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => { load(); }, [q]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: parseFloat(form.price || 0),
      stock: parseInt(form.stock || 0),
      category: form.category || undefined,
      is_active: true,
    };
    if (editing) {
      await fetch(`${API}/api/items/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch(`${API}/api/items`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setForm({ name: "", price: "", stock: "", category: "" });
    setEditing(null);
    load();
  };

  const edit = (it) => {
    setEditing(it._id);
    setForm({ name: it.name, price: it.price, stock: it.stock ?? 0, category: it.category ?? "" });
  };

  const del = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${API}/api/items/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Inventory</h2>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search items..." className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
      </div>

      <form onSubmit={submit} className="grid sm:grid-cols-5 gap-3 mb-4">
        <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
        <input required value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} type="number" step="0.01" placeholder="Price" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
        <input value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} type="number" placeholder="Stock" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
        <input value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} placeholder="Category" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100 text-sm" />
        <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm shadow">{editing?"Update":"Add"}</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-blue-100">
          <thead>
            <tr className="text-left bg-slate-900/40">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id} className="border-t border-slate-700/60">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.category || "-"}</td>
                <td className="p-2">${Number(it.price).toFixed(2)}</td>
                <td className="p-2">{it.stock ?? 0}</td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={()=>edit(it)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white">Edit</button>
                  <button onClick={()=>del(it._id)} className="px-2 py-1 bg-rose-600 hover:bg-rose-500 rounded text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
