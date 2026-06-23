import './css/Home.css';
import leagueInfoImage from './assets/league-info.jpg';
import seasonInfoImage from './assets/season-info.jpg';


export const Header = () => {
    return (
        <header className="header">
            <div className="ticker-wrapper">
                <div className="ticker-track">
                    <span className="league-heading">🏏 Golra Station Super League 2026</span>
                    <span>⭐ Registration Open Now</span>
                    <span>📅 Starts 31 July 2026</span>
                </div>
            </div>
        </header>
    );
}


function RegistrationButton(){
    return (
        <div className="registration-section">
            <h1 className="league-title">Welcome to Golra Station Super League 2026!</h1>
            <button className="registration-button"
            onClick={
                () => {
                    // Handle registration button click
                    window.location.href = '/register';
                }
            }>Register Now</button>
        </div>
    );
}

function Body(){
    return (
        <div className="body">
            <img src={leagueInfoImage} alt="Cricket Match" className="league-info-image"/>
            <img src={seasonInfoImage} alt="Season Info" className="season-info-image"/>
        </div>
    );
}

export const HomeComponent = () => {

    return (
        <div>
            <Header/>
            <RegistrationButton/>
            <Body/>
        </div>
    );

}