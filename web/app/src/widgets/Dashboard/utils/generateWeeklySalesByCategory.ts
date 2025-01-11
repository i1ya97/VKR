import { Theme } from "@mui/material";
import { BarInfo } from "@shared/charts";
import dayjs from "dayjs";

const colors = ['#EE204D', '#bebd7f', '#7F4870', '#FF7E00', '#403A3A', '#CC6666', '#483D8B'];

const value = [20, 73, 47, 25, 31];

const categories = ['Мебель', 'Электроника', 'Канцелярия', 'Товары для животных','Одежда и обувь']

export const generateWeeklySalesByCategory = (theme: Theme) => {
    let currentdate = dayjs.utc().add(-6, 'day');
    const data: Record<string, string | number> = { groupKey: '' };
    const barsInfo: BarInfo = {};
    for (let i = 0; i < 7; i++) {
        const key = currentdate.format('DD.MM.YYYY');
        data[key] = value[i];
        barsInfo[key] = {
            alias: key,
            color: colors[i],
        }
        currentdate = currentdate.add(1, 'day');
    }
    return {
        subTitle: 'Всего:',
        title: `${value.reduce((acc, item) => acc + item, 0)}`,
        disableUnitTitle: true,
        donutItems: value.map((item, index) => ({
            name: categories[index],
            value: item,
            color: colors[index], 
        })),
        textColor: theme.palette.text.primary,
    };
}