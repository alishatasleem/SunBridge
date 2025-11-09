import React from "react";
import { Gift, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCoupons({ store = [], onSave, onDelete }) {
  const [draft, setDraft] = React.useState({
    id: undefined,
    name: "",
    cost: 50,
    icon: "🎟️",
    desc: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!draft.name) {
      alert("Please enter a reward name");
      return;
    }
    onSave && onSave(draft);
    setDraft({ id: undefined, name: "", cost: 50, icon: "🎟️", desc: "" });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center">
          {draft.id ? <Edit className="mr-2" /> : <Plus className="mr-2" />}
          {draft.id ? "Edit" : "Add"} Reward
        </h3>

        <div className="grid sm:grid-cols-4 gap-4 mb-4">
          <input
            className="border-2 border-gray-300 focus:border-amber-500 rounded px-4 py-3"
            placeholder="Reward Name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
          <input
            className="border-2 border-gray-300 focus:border-amber-500 rounded px-4 py-3"
            placeholder="Cost (points)"
            type="number"
            value={draft.cost}
            onChange={(e) =>
              setDraft((d) => ({ ...d, cost: Number(e.target.value || 0) }))
            }
          />
          <input
            className="border-2 border-gray-300 focus:border-amber-500 rounded px-4 py-3"
            placeholder="Icon (emoji)"
            value={draft.icon}
            onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
          />
          <input
            className="border-2 border-gray-300 focus:border-amber-500 rounded px-4 py-3"
            placeholder="Description"
            value={draft.desc}
            onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all"
          >
            Save Reward
          </button>
          {draft.id && (
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition-all"
              onClick={() =>
                setDraft({ id: undefined, name: "", cost: 50, icon: "🎟️", desc: "" })
              }
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center">
          <Gift className="mr-2 text-pink-600" />
          All Rewards ({store.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {store.map((c) => (
            <div
              key={c.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-pink-400 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="font-bold text-lg">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.desc}</div>
                  <div className="text-lg font-bold text-pink-600 mt-2">
                    {c.cost} points
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setDraft(c)}
                  className="flex-1 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-blue-800 font-semibold transition-all"
                >
                  <Edit size={16} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${c.name}"?`)) {
                      onDelete && onDelete(c.id);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-semibold transition-all"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {store.length === 0 && (
            <div className="text-gray-500 col-span-full text-center py-8">
              No rewards added yet. Create your first reward above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}