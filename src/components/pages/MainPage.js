import {useState} from "react";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import SearchingForm from "../searchingForm/SearchingForm";
import ErrorBoundry from "../errorBoundry/ErrorBoundry";

import decoration from "../../resources/img/vision.png";

const MainPage = () => {
    const [selectedChar, setChar] = useState(null);
    
    const onCharSelected = (id) => {
        setChar(id);
    };
    
    return (
        <>
            <ErrorBoundry>
                <RandomChar />
            </ErrorBoundry>
            <div className="char__content">
                <ErrorBoundry>
                    <CharList onCharSelected={onCharSelected} />
                </ErrorBoundry>
                <div>
                    <ErrorBoundry>
                        <CharInfo charId={selectedChar} />
                    </ErrorBoundry>
                    <ErrorBoundry>
                        <SearchingForm/>
                    </ErrorBoundry>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision" />
        </>
    );
}

export default MainPage