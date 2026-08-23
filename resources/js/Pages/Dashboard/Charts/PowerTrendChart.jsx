import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import ChartTooltip from "@/Components/Charts/ChartTooltip";
import EmptyChartState from "@/Components/Charts/EmptyChartState";
import { CHART_SERIES, CHART_INK, formatShortDate, formatFullDate } from "@/utils/chartTheme";

export default function PowerTrendChart({ data = [] }) {
    const hasData = data.some((d) => d.avg_power !== null);

    if (!hasData) {
        return <EmptyChartState />;
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_SERIES.blue} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={CHART_SERIES.blue} stopOpacity={0.1} />
                    </linearGradient>
                </defs>
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
                    stroke={CHART_INK.axis}
                    tick={{ fill: CHART_INK.muted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    unit="W"
                />
                <Tooltip
                    content={
                        <ChartTooltip
                            labelFormatter={formatFullDate}
                            formatter={(value) => `${value} W`}
                        />
                    }
                />
                <Area
                    type="monotone"
                    dataKey="avg_power"
                    name="Rata-rata Daya"
                    stroke={CHART_SERIES.blue}
                    strokeWidth={2}
                    fill="url(#powerFill)"
                    connectNulls={false}
                    dot={{ r: 3, strokeWidth: 2, stroke: CHART_INK.surface, fill: CHART_SERIES.blue }}
                    activeDot={{ r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
