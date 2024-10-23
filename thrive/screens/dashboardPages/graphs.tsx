import React from 'react';
import { View, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText, Path, Circle } from 'react-native-svg';

export const CombinedCharts = () => {
    const data = [
        { day: "Mon", orders: 10, revenue: 100 },
        { day: "Tue", orders: 20, revenue: 200 },
        { day: "Wed", orders: 10, revenue: 150 },
        { day: "Thu", orders: 16, revenue: 180 },
        { day: "Fri", orders: 20, revenue: 220 },
        { day: "Sat", orders: 40, revenue: 400 },
        { day: "Sun", orders: 20, revenue: 250 },
    ];

    // Constants for chart dimensions and styling
    const CHART_WIDTH = Dimensions.get('window').width - 80;
    const CHART_HEIGHT = 350;
    const MARGIN_X = 70; // Increased left margin for y-axis labels
    const MARGIN_Y = 50;
    const TITLE_MARGIN = 30;
    const BAR_WIDTH = 30;
    const BAR_COLOR = '#8A7DDC';
    const LINE_COLOR = '#FF6B6B';
    const AXIS_LABEL_COLOR = '#666';
    const AXIS_LINE_COLOR = '#E0E0E0';
    const TITLE_COLOR = '#333';

    // Calculate actual chart area
    const chartArea = {
        width: CHART_WIDTH - (MARGIN_X * 2),
        height: CHART_HEIGHT - (MARGIN_Y * 2) - TITLE_MARGIN
    };

    const barSpacing = chartArea.width / data.length;

    // Helper function to generate nice axis intervals
    const generateNiceIntervals = (maxValue: any) => {
        const niceMax = Math.ceil(maxValue / 10) * 10;
        return [0, niceMax/4, niceMax/2, (niceMax * 3)/4, niceMax];
    };

    // Calculate scales with nice intervals
    const maxOrders = Math.max(...data.map(d => d.orders));
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const orderIntervals = generateNiceIntervals(maxOrders);
    const revenueIntervals = generateNiceIntervals(maxRevenue);
    const yScaleOrders = chartArea.height / orderIntervals[orderIntervals.length - 1];
    const yScaleRevenue = chartArea.height / revenueIntervals[revenueIntervals.length - 1];

    const renderChart = (title: any, renderFunction: any, yAxisLabel:any, intervals: any, scale: any) => (
        <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                {/* Title */}
                <SvgText
                    x={CHART_WIDTH / 2}
                    y={TITLE_MARGIN}
                    fontSize={20}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={TITLE_COLOR}>
                    {title}
                </SvgText>

                {/* Grid lines and Y-axis labels */}
                <G>
                    {intervals.map((value:any, index:any) => {
                        const y = CHART_HEIGHT - MARGIN_Y - (value * scale);
                        return (
                            <G key={`grid-${index}`}>
                                <Line
                                    x1={MARGIN_X}
                                    y1={y}
                                    x2={CHART_WIDTH - MARGIN_X}
                                    y2={y}
                                    stroke={AXIS_LINE_COLOR}
                                    strokeWidth={1}
                                    strokeDasharray="5,5"
                                />
                                <SvgText
                                    x={MARGIN_X - 10}
                                    y={y + 4}
                                    fontSize={12}
                                    textAnchor="end"
                                    fill={AXIS_LABEL_COLOR}>
                                    {yAxisLabel === 'Revenue ($)' ? `$${value}` : value}
                                </SvgText>
                            </G>
                        );
                    })}
                </G>

                {/* X-axis */}
                <G>
                    <Line
                        x1={MARGIN_X}
                        y1={CHART_HEIGHT - MARGIN_Y}
                        x2={CHART_WIDTH - MARGIN_X}
                        y2={CHART_HEIGHT - MARGIN_Y}
                        stroke={AXIS_LINE_COLOR}
                        strokeWidth={2}
                    />
                    {data.map((item, index) => {
                        const x = MARGIN_X + (index * barSpacing) + (barSpacing / 2);
                        return (
                            <G key={`x-label-${index}`}>
                                <SvgText
                                    x={x}
                                    y={CHART_HEIGHT - MARGIN_Y + 20}
                                    fontSize={12}
                                    textAnchor="middle"
                                    fill={AXIS_LABEL_COLOR}>
                                    {item.day}
                                </SvgText>
                            </G>
                        );
                    })}
                </G>

                {/* Y-axis */}
                <Line
                    x1={MARGIN_X}
                    y1={MARGIN_Y + TITLE_MARGIN}
                    x2={MARGIN_X}
                    y2={CHART_HEIGHT - MARGIN_Y}
                    stroke={AXIS_LINE_COLOR}
                    strokeWidth={2}
                />

                {/* Chart content */}
                {renderFunction()}
            </Svg>
        </View>
    );

    const renderBars = () => (
        <G>
            {data.map((item, index) => {
                const x = MARGIN_X + (index * barSpacing) + (barSpacing - BAR_WIDTH) / 2;
                const barHeight = item.orders * yScaleOrders;
                return (
                    <G key={`bar-${index}`}>
                        <Rect
                            x={x}
                            y={CHART_HEIGHT - MARGIN_Y - barHeight}
                            width={BAR_WIDTH}
                            height={barHeight}
                            fill={BAR_COLOR}
                            rx={5}
                            ry={5}
                        />
                        <SvgText
                            x={x + BAR_WIDTH / 2}
                            y={CHART_HEIGHT - MARGIN_Y - barHeight - 5}
                            fontSize={12}
                            textAnchor="middle"
                            fill="#666">
                            {item.orders}
                        </SvgText>
                    </G>
                );
            })}
        </G>
    );

    const renderLine = () => {
        let pathD = `M ${MARGIN_X + (barSpacing / 2)} ${CHART_HEIGHT - MARGIN_Y - (data[0].revenue * yScaleRevenue)}`;

        data.forEach((item, index) => {
            const x = MARGIN_X + (index * barSpacing) + (barSpacing / 2);
            const y = CHART_HEIGHT - MARGIN_Y - (item.revenue * yScaleRevenue);
            pathD += ` L ${x} ${y}`;
        });

        return (
            <G>
                <Path
                    d={pathD}
                    stroke={LINE_COLOR}
                    strokeWidth={3}
                    fill="none"
                />
                {data.map((item, index) => {
                    const x = MARGIN_X + (index * barSpacing) + (barSpacing / 2);
                    const y = CHART_HEIGHT - MARGIN_Y - (item.revenue * yScaleRevenue);
                    return (
                        <G key={`point-${index}`}>
                            <Circle
                                cx={x}
                                cy={y}
                                r={6}
                                fill="#FFF"
                                stroke={LINE_COLOR}
                                strokeWidth={2}
                            />
                            <SvgText
                                x={x}
                                y={y - 15}
                                fontSize={12}
                                textAnchor="middle"
                                fill="#666">
                                ${item.revenue}
                            </SvgText>
                        </G>
                    );
                })}
            </G>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Analytics Dashboard</Text>
                {renderChart('Weekly Order Distribution', renderBars, 'Orders', orderIntervals, yScaleOrders)}
                {renderChart('Weekly Revenue Distribution', renderLine, 'Revenue ($)', revenueIntervals, yScaleRevenue)}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
});

export default CombinedCharts;