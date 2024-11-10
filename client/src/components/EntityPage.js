import { List } from "./List/List";
import { Card } from "./Card/Card";

export const ActionSection = ({ entityCode }) => {
    return (
        <></>
    );
}

export const MainSection = ({ entityCode }) => {
    return (
        <>
            <div className='w3-col m12'>
                <List selectedEntityCode={entityCode} />
            </div>
            <Card selectedEntityCode={entityCode} />
        </>
    );
}