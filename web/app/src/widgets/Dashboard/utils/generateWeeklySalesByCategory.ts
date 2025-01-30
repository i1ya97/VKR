import { Theme } from "@mui/material";

const colors = ['#483D8B', '#bebd7f', '#FF7E00'];


const categories = ['Электроника', 'Спортивные товары', 'Бытовая техника']

export const generateWeeklySalesByCategory = (theme: Theme, values: number[]) => {

    return {
        subTitle: 'Всего:',
        title: `${values.reduce((acc, item) => acc + item, 0)}`,
        disableUnitTitle: true,
        donutItems: values.map((item, index) => ({
            name: categories[index],
            value: item,
            color: colors[index], 
        })),
        textColor: theme.palette.text.primary,
    };
}