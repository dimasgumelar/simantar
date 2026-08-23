import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList,
} from "recharts";
import ChartTooltip from "@/Components/Charts/ChartTooltip";
import EmptyChartState from "@/Components/Charts/EmptyChartState";
import { STATUS_COLORS, CHART_INK } from "@/utils/chartTheme";

export default function SignatureStatusChart({ data = [] }) {
    const hasData = data.some((d) => d.signed > 0 || d.unsigned > 0);

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
                    content={<ChartTooltip formatter={(value) => `${value} logbook`} />}
                />
                <Legend
                    iconType="square"
                    wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary }}
                />
                <Bar
                    dataKey="signed"
                    name="Sudah TTD"
                    stackId="ttd"
                    fill={STATUS_COLORS.good}
                    barSize={20}
                    radius={[4, 0, 0, 4]}
                />
                <Bar
                    dataKey="unsigned"
                    name="Belum TTD"
                    stackId="ttd"
                    fill={STATUS_COLORS.warning}
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                >
                    <LabelList
                        dataKey={(entry) => entry.signed + entry.unsigned}
                        position="right"
                        style={{ fill: CHART_INK.primary, fontSize: 12, fontWeight: 600 }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
