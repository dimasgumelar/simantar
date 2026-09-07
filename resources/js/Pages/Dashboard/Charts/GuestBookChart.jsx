import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LabelList,
} from "recharts";
import ChartTooltip from "@/Components/Charts/ChartTooltip";
import EmptyChartState from "@/Components/Charts/EmptyChartState";
import { CHART_SERIES, CHART_INK } from "@/utils/chartTheme";

export default function GuestBookChart({ data = [] }) {
    const hasData = data.some((d) => d.count > 0);

    if (!hasData) {
        return <EmptyChartState />;
    }

    const height = Math.max(160, data.length * 44);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 8, right: 32, left: 8, bottom: 0 }}
            >
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis
                    type="category"
                    dataKey="transmission"
                    stroke={CHART_INK.axis}
                    tick={{ fill: CHART_INK.secondary, fontSize: 13 }}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                />
                <Tooltip
                    cursor={{ fill: CHART_INK.grid, opacity: 0.4 }}
                    content={<ChartTooltip formatter={(value) => `${value} tamu`} />}
                />
                <Bar
                    dataKey="count"
                    name="Tamu"
                    fill={CHART_SERIES.aqua}
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={false}
                >
                    <LabelList
                        dataKey="count"
                        position="right"
                        style={{ fill: CHART_INK.primary, fontSize: 12, fontWeight: 600 }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
