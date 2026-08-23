import React from "react";
import { CHART_INK } from "@/utils/chartTheme";

// Shared recharts tooltip: value leads (bold), series name follows, keyed by
// a short stroke of the series color rather than a filled box.
export default function ChartTooltip({
    active,
    label,
    payload,
    formatter,
    labelFormatter,
}) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div
            className="rounded-md border px-3 py-2 shadow-sm text-sm"
            style={{
                background: CHART_INK.surface,
                borderColor: CHART_INK.grid,
                color: CHART_INK.primary,
            }}
        >
            <div
                className="text-xs mb-1"
                style={{ color: CHART_INK.secondary }}
            >
                {labelFormatter ? labelFormatter(label) : label}
            </div>
            <div className="flex flex-col gap-1">
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 10,
                                height: 2,
                                background: entry.color,
                            }}
                        />
                        <span style={{ color: CHART_INK.secondary }}>
                            {entry.name}
                        </span>
                        <span className="font-semibold ml-auto">
                            {formatter
                                ? formatter(entry.value, entry.name)
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
