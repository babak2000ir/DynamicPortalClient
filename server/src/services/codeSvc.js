import currencyList from '../pages/currencyList.json' with { type: "json" };
import currencyCard from '../pages/currencyCard.json' with { type: "json" };

export const getPages = async (ctx) => {
    ctx.body = [currencyList, currencyCard];
};