import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import ChartTooltip from "@/Components/Charts/ChartTooltip";
import EmptyChartState from "@/Components/Charts/EmptyChartState";
import { CHART_SERIES, CHART_INK, formatShortDate, formatFullDate } from "@/utils/chartTheme";

export default function GuestBookTrendChart({ data = [] }) {
    const hasData = data.some((d) => d.count > 0);

    if (!hasData) {
        return <EmptyChartState />;
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid
                    vertical={false}
                    stroke={CHART_INK.grid}
                    strokeDasharray="0"
                />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    stroke={CHART_INK.axis}
                    tick={{ fill: CHART_INK.muted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: CHART_INK.axis }}
                    minTickGap={20}
                />
                <YAxis
                    allowDecimals={false}
                    stroke={CHART_INK.axis}
                    tick={{ fill: CHART_INK.muted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                />
                <Tooltip
                    content={
                        <ChartTooltip
                            labelFormatter={formatFullDate}
                            formatter={(value) => `${value} tamu`}
                        />
                    }
                />
                <Line
                    type="monotone"
                    dataKey="count"
                    name="Tamu"
                    stroke={CHART_SERIES.aqua}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface, fill: CHART_SERIES.aqua }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
