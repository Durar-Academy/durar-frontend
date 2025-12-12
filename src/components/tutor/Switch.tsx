import React from "react";

import { useState } from "react";

export default function ToggleSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#D2D4E0]" : "bg-blue-500"
      }`}
    >
      <span
        className={`inline-block h-[17px] w-[17px] transform rounded-full bg-white transition ${
          enabled ? "translate-x-0.5" : "translate-x-6"
        }`}
      />
    </button>
  );
}

