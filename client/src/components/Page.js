import { useGlobalStore } from "../stores";
import { List } from "./List/List";
import { Card } from "./Card/Card";

export const Page = () => {
    const { selectedPage, pages } = useGlobalStore();
    const pageType = pages.find(page => page.id === selectedPage).type;

    switch (pageType) {
        case 'list':
            return (
                <div className='w3-col m12'>
                    <List />
                </div>
            );
        case 'card':
            return (
                <div className='w3-col m12'>
                    <Card />
                </div>
            );
        default:
            return (
                <div className='w3-col m12'>
                    <h1>Page not found, or broken.</h1>
                </div>
            );
    }

}


