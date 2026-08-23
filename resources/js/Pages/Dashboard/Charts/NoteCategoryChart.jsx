import React, { useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    LabelList,
} from "recharts";
import ChartTooltip from "@/Components/Charts/ChartTooltip";
import EmptyChartState from "@/Components/Charts/EmptyChartState";
import { CHART_SERIES, CHART_INK, formatDurationMinutes } from "@/utils/chartTheme";
import { noteCategoryLabel } from "@/Pages/Logbooks/Constant";

const CATEGORY_COLORS = [CHART_SERIES.blue, CHART_SERIES.orange, CHART_SERIES.aqua];

const METRICS = {
    count: {
        label: "Jumlah Keterangan",
        dataKey: "count",
        formatValue: (value) => `${value} keterangan`,
        formatLabel: (value) => `${value}`,
    },
    duration: {
        label: "Total Durasi",
        dataKey: "duration_minutes",
        formatValue: (value) => formatDurationMinutes(value),
        formatLabel: (value) => formatDurationMinutes(value),
    },
};

export default function NoteCategoryChart({ data = [] }) {
    const [metric, setMetric] = useState("count");
    const hasData = data.some((d) => d.count > 0);

    const active = METRICS[metric];

    const chartData = data.map((d) => ({
        ...d,
        label: noteCategoryLabel(d.category),
    }));

    return (
        <div>
            <div className="join mb-2">
                {Object.entries(METRICS).map(([key, config]) => (
                    <button
                        key={key}
                        className={`btn btn-xs join-item ${
                            metric === key ? "btn-primary" : "btn-outline"
                        }`}
                        onClick={() => setMetric(key)}
                    >
                        {config.label}
                    </button>
                ))}
            </div>

            {!hasData ? (
                <EmptyChartState />
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 8, right: 48, left: 8, bottom: 0 }}
                    >
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="label"
                            stroke={CHART_INK.axis}
                            tick={{ fill: CHART_INK.secondary, fontSize: 13 }}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <Tooltip
                            cursor={{ fill: CHART_INK.grid, opacity: 0.4 }}
                            content={<ChartTooltip formatter={active.formatValue} />}
                        />
                        <Bar
                            dataKey={active.dataKey}
                            name={active.label}
                            barSize={22}
                            radius={[0, 4, 4, 0]}
                            isAnimationActive={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={entry.category}
                                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                />
                            ))}
                            <LabelList
                                dataKey={active.dataKey}
                                position="right"
                                formatter={active.formatLabel}
                                style={{ fill: CHART_INK.primary, fontSize: 12, fontWeight: 600 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
