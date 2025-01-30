import { Theme } from "@mui/material";
import { BarInfo } from "@shared/charts";
import { HistogramData } from "@shared/charts/models/HistogramData";

// const colors = ['#EE204D', '#bebd7f', '#7F4870', '#FF7E00', '#403A3A', '#CC6666', '#483D8B'];

// const value = [10, 32, 35, 26, 17, 40, 36];

export const generateWeeklySales = (theme: Theme, data: HistogramData[], barsInfo: BarInfo) => {
	// let currentdate = dayjs.utc().add(-6, 'day');
	// const data: {
	// 	groupKey: string;
	// 	[key: string]: number | string;
	// } = { groupKey: '' };
	// const barsInfo: BarInfo = {};
	// for (let i = 0; i < 7; i++) {
	// 	const key = currentdate.format('DD.MM.YYYY');
	// 	data[key] = value[i];
	// 	barsInfo[key] = {
	// 		alias: key,
	// 		color: colors[i],
	// 	}
	// 	currentdate = currentdate.add(1, 'day');
	// }
	return {
		data: data,
		barsInfo,
		axisBottomOptions: {
			hideTicks: true,
		},
		style: {
			textColor: theme.palette.text.primary,
			backgroundLegend: '',
		},
		hideGridRows: true,
	};
}