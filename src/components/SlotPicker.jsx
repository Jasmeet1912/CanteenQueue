"use client";

import { SLOTS } from "@/lib/status";

export default function SlotPicker() {
  return (
    <fieldset className="space-y-1">
      <legend className="font-medium">Pickup time</legend>
      <div className="flex flex-wrap gap-2">
        {SLOTS.map((s, i) => (
          <label key={s} className="cursor-pointer rounded border bg-white px-3 py-1 has-checked:bg-black has-checked:text-white">
            <input type="radio" name="slot" value={s} defaultChecked={i === 0} className="sr-only" />
            {s}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
