import { createCanvas } from 'canvas';
import * as echarts from 'echarts';
import { formulas } from '../../../Events/BotEvents/messageEvents/messageCreate/levelling.js';

const commonOptions = {
 backgroundColor: 'transparent',
 grid: {
  left: '8%',
  right: '8%',
  bottom: '18%',
  top: '5%',
  containLabel: true,
 },
 title: {
  left: 'center',
  textStyle: {
   color: '#f7f1ee',
   fontWeight: 'bold',
   fontSize: 16,
   fontFamily: 'sans-serif',
  },
  top: 10,
 },
} satisfies echarts.EChartsCoreOption;

const xAxisOpts = {
 type: 'category' as const,
 nameLocation: 'middle' as const,
 nameTextStyle: {
  fontStyle: 'italic',
  fontWeight: 'bold',
  color: '#f7f1ee',
  padding: [10, 0, 0, 0],
 },
 nameGap: 35,
 axisLine: { lineStyle: { color: '#666', width: 1 } },
 axisTick: { alignWithLabel: true, lineStyle: { color: '#555' } },
 axisLabel: { color: '#f7f1ee', fontSize: 12, rotate: 0, margin: 12 },
};

const yAxisOpts = {
 type: 'value' as const,
 name: 'Hours',
 nameLocation: 'middle' as const,
 nameGap: 45,
 nameTextStyle: {
  fontStyle: 'italic',
  fontWeight: 'bold',
  color: '#f7f1ee',
  fontSize: 13,
 },
 axisLine: {
  show: true,
  lineStyle: { color: '#666' },
 },
 splitLine: {
  lineStyle: {
   color: 'rgba(120, 120, 120, 0.2)',
   type: [2, 4] as [number, number],
  },
 },
 axisLabel: { color: '#f7f1ee', formatter: '{value}', fontSize: 11 },
};

const colors = {
 primary: [
  '#f4651c',
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#9b59b6',
  '#f1c40f',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#1a5276',
 ],
 gradients: (color: string) => ({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
   { offset: 0, color: color },
   { offset: 1, color: echarts.color.modifyAlpha(color, 0.7) },
  ],
 }),
};

const chartOpts = {
 renderer: 'canvas',
 width: 800,
 height: 500,
} satisfies echarts.EChartsInitOpts;

const xpFormulasChart = (curveModifier: number) => {
 const nodeCanvas = createCanvas(chartOpts.width, chartOpts.height);
 const chart = echarts.init(nodeCanvas, null, chartOpts);

 const maxLevel = 200;
 const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i);

 const formulaData = Object.entries(formulas).map(([name, formula], index) => {
  const data = levels.map((level) => {
   if (level === 0) return 0;
   return formula(level, curveModifier);
  });

  return {
   name: name.charAt(0).toUpperCase() + name.slice(1),
   type: 'line',
   smooth: true,
   symbol: 'none',
   lineStyle: {
    width: 2.5,
    color: colors.primary[index % colors.primary.length],
   },
   emphasis: {
    lineStyle: {
     width: 4,
     shadowBlur: 10,
     shadowColor: 'rgba(0,0,0,0.3)',
    },
   },
   data: data,
  };
 });

 chart.setOption({
  ...commonOptions,
  backgroundColor: '#2b2d31',
  title: {
   ...commonOptions.title,
   subtextStyle: {
    color: 'rgba(247, 241, 238, 0.65)',
    fontSize: 12,
    fontWeight: 'normal',
   },
  },
  legend: {
   data: formulaData.map((s) => ({
    name: s.name,
    textStyle: {
     color: s.lineStyle.color,
    },
   })),
   textStyle: { fontSize: 11 },
   top: 'bottom',
   icon: 'line',
   itemWidth: 20,
   itemHeight: 12,
   itemGap: 15,
   padding: 10,
  },
  tooltip: {
   trigger: 'axis',
   backgroundColor: 'rgba(0, 0, 0, 0.8)',
   borderColor: '#666',
   borderWidth: 1,
   textStyle: { color: '#f7f1ee' },
   formatter: (params: any) => {
    let html = `<div style="font-weight: bold; margin-bottom: 4px;">Level ${params[0].axisValue}</div>`;
    params.forEach((param: any) => {
     html += `<div style="display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%;"></span>
      <span>${param.seriesName}: ${param.value.toLocaleString()} XP</span>
     </div>`;
    });
    return html;
   },
  },
  xAxis: {
   ...xAxisOpts,
   data: levels,
   name: 'Level',
   axisLabel: {
    ...xAxisOpts.axisLabel,
    interval: (index: number) => index % 10 === 0,
    formatter: (value: string) => value,
   },
  },
  yAxis: {
   ...yAxisOpts,
   name: 'XP Required',
   max: 10000000,
   axisLabel: {
    ...yAxisOpts.axisLabel,
    formatter: (value: number) => {
     if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
     if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
     return value.toString();
    },
   },
   scale: false,
  },
  series: formulaData,
 });

 return { chart, canvas: nodeCanvas };
};

export default (curveModifier: number) => {
 const { chart, canvas } = xpFormulasChart(curveModifier);

 const buffer = canvas.toBuffer('image/png');

 chart.dispose();

 return {
  attachment: buffer,
  name: 'xp-formulas-chart.png',
 };
};
