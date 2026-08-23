import React from "react";

export default function EmptyChartState({ message = "Tidak ada data pada rentang ini." }) {
    return (
        <div className="flex items-center justify-center h-full py-16 text-sm opacity-60">
            {message}
        </div>
    );
}
