import currencyPage from '../pages/CurrencyPage.json' with { type: "json" };
import currencyCard from '../pages/CurrencyCard.json' with { type: "json" };

export const getPages = async (ctx) => {
    ctx.body = [currencyPage, currencyCard];
};