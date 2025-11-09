import React from "react";

export default function AdminCoupons({ store, addOrEdit, removeOne }) {
  const empty = { id: undefined, name: "", cost: 50, icon: "🎟️", desc: "" };
  const [draft, setDraft] = React.useState(empty);

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim()) return alert("Name is required");
    const payload = {
      ...draft,
      name: draft.name.trim(),
      desc: draft.desc.trim(),
      cost: Number.isFinite(draft.cost) ? Number(draft.cost) : 0
    };
    addOrEdit?.(payload);
    setDraft(empty);
  }

  return (
    <div className="space-y-6">
      {/* Editor */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
        <h3 className="font-bold">Add / Edit Reward</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={draft.name}
              onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="e.g., Transit Pass"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={draft.cost}
              onChange={(e) => setDraft(d => ({ ...d, cost: e.target.valueAsNumber ?? 0 }))}
              placeholder="points"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={draft.icon}
              onChange={(e) => setDraft(d => ({ ...d, icon: e.target.value }))}
              placeholder="🎟️"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={draft.desc}
              onChange={(e) => setDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder="Short blurb"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white">
            {draft.id ? "Update" : "Save"}
          </button>
          {draft.id && (
            <button
              type="button"
              className="px-4 py-2 rounded bg-slate-200"
              onClick={() => setDraft(empty)}
            >
              New
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-3">All Rewards</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {store?.map((c) => (
            <div key={c.id} className="border rounded p-3 flex items-start justify-between">
              <div className="pr-3">
                <div className="text-2xl">{c.icon}</div>
                <div className="font-bold">{c.name}</div>
                <div className="text-xs text-slate-600">{c.desc}</div>
                <div className="text-sm font-semibold text-pink-600">{c.cost} pts</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-slate-200" onClick={() => setDraft(c)}>
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded bg-rose-500 text-white"
                  onClick={() => removeOne?.(c.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!store?.length && (
            <div className="text-sm text-slate-500">No rewards yet. Add one above.</div>
          )}
        </div>
      </div>
    </div>
  );
}
