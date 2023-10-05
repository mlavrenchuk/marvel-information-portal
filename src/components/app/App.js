import { useState } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundry from "../errorBoundry/ErrorBoundry";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

import decoration from "../../resources/img/vision.png";



const App = () => {

    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id)
    }
    return (
        <div className="app">
            <AppHeader />
            <main>
                <AppBanner />
                <ComicsList/>
                {/* <ErrorBoundry>
                    <RandomChar />
                </ErrorBoundry>
                <div className="char__content">
                    <ErrorBoundry>
                        <CharList onCharSelected={onCharSelected} />
                    </ErrorBoundry>
                    <ErrorBoundry>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundry>
                </div>
                <img
                    className="bg-decoration"
                    src={decoration}
                    alt="vision"
                /> */}
            </main>
        </div>
    );
}

export default App;
