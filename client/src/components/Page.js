import { create } from 'zustand';
import { useGlobalStore, listPageStore, cardPageStore } from "../stores";
import { List } from "./List/List";
import { Card } from "./Card/Card";

export const Page = () => {
    const { selectedPage, pages } = useGlobalStore();
    const pageType = pages.filter(page => page.id === selectedPage).type;

    switch (pageType) {
        case 'list':
            const useListPageStore = create(listPageStore);
            window.useListPageStore = useListPageStore;
            return (
                <div className='w3-col m12'>
                    <List useListPageStore = {useListPageStore} />
                </div>
            );
        case 'card':
            const useCardPageStore = create(cardPageStore);
            window.useCardPageStore = useCardPageStore;
            return (<Card useCardPageStore={useCardPageStore} />);
        default:
            return (
                <div className='w3-col m12'>
                    <h1>Page not found, or broken.</h1>
                </div>
            );
    }

}


