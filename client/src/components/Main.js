import React, { Suspense } from 'react';
import { useGlobalStore } from '../stores';
import Alert from './Alert/Alert';
import { Dashboard } from './Dashboard';
import { Page } from './Page';

const Main = () => {
    const { pagesLoaded, selectedPage } = useGlobalStore()

    //const loadedPage = useGlobalStore(state => state.loadedPage);
    //const loadedPageParams = useGlobalStore(state => state.loadedPageParams);
    //const ActionSection = React.lazy(() => import(`./${loadedPage}`).then((module) => ({ default: module.ActionSection })));
    //const MainSection = React.lazy(() => import(`./${loadedPage}`).then((module) => ({ default: module.MainSection })));

    return (
        <div className="w3-white">
            <Suspense>
                <Alert />
            </Suspense>
            <Suspense fallback={<Spinner />}>
                <div className="w3-row pt-2 pb-4 pl-4 pr-4 lg:sticky top-12 z-10">
                    {/* <ActionSection {...loadedPageParams} /> */}
                </div>
            </Suspense>
            <Suspense fallback={<Spinner />}>
                <div className="w3-row">
                    {/* <MainSection  {...loadedPageParams} /> */}
                    {selectedPage ?
                        <Page /> : <Dashboard />
                    }
                </div>
            </Suspense>
        </div>
    );
}

const Spinner = () => {
    return (
        <div id="spinner w3-spin" />
    )
}

export default Main;