import "./css/Home.css";
import leagueInfoImage from "./assets/league-info.jpg";
import seasonInfoImage from "./assets/season-info.jpg";

export const Header = () => {
  return (
    <header className="header">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          <span className="league-heading">
            🏏 Golra Station Super League 2026
          </span>
          <span>⭐ Registration Open Now</span>
          <span>📅 Starts 31 July 2026</span>
        </div>
      </div>
    </header>
  );
};

function RegistrationButton() {
  return (
    <div className="registration-section">
      <h1 className="league-title">
        Welcome to Golra Station Super League 2026!
      </h1>
      <button
        className="registration-button"
        onClick={() => {
          // Handle registration button click
          window.location.href = "/register";
        }}
      >
        Register Now
      </button>
    </div>
  );
}

function RulesSection() {
  return (
    <section className="rules-section">
      <div className="rules-header">
        <h2>رولز اینڈ ریگولیشن</h2>
      </div>
      <ol className="rules-list">
        <li>
          ٹیم کیپٹن کے علاوہ اگر کوئی پلیئر امپائر سے شور اٹھ کرے گا تو امپائر
          کے پاس پوری اپلانٹی دینے کا اختیار ہوگا۔
        </li>
        <li>
          انتظامیہ کی جانب سے دیئے گئے ٹائم پر اگر میچ شروع نہیں ہوتا تو مزید 15
          منٹ دیے جائیں گے۔ اس سے بھی لیٹ ہو جائے تو دوسری ٹیم کو پوائنٹ دیے
          جائیں گے۔
        </li>
        <li>
          موسم کی خرابی یا حکومتی معاملات کی وجہ سے ٹورنمنٹ کی تاریخوں میں
          تبدیلی کی جا سکتی ہے۔
        </li>
        <li>
          ڈرافٹنگ کے علاوہ اگر باہر سے کوئی پلیئر ٹیم میں کھیلے تو دوسری ٹیم کو
          پوائنٹ دیے جائیں گے۔
        </li>
        <li>
          شرکت انتظامیہ (منیجمنٹ) کی جانب سے ہوں گی، اور تمام پلیئرز نے کالے رنگ
          کا ٹراؤزر لازمی پہننا ہوگا۔ کالے رنگ کے علاوہ کوئی ٹراؤزر قابل قبول
          نہیں ہوگا۔
        </li>
        <li>
          فرنچائزز کی انٹری فیس جمع کرنے کی آخری تاریخ 03-07-2026 ہے۔ جو ٹیم لیٹ
          ہوگی اس کے متبادل دوسری فرنچائز ایڈ کر دی جائے گی۔
        </li>
      </ol>
    </section>
  );
}

function Body() {
  return (
    <div className="body">
      <img
        src={leagueInfoImage}
        alt="Cricket Match"
        className="league-info-image"
      />
      <img
        src={seasonInfoImage}
        alt="Season Info"
        className="season-info-image"
      />
    </div>
  );
}

export const HomeComponent = () => {
  return (
    <div>
      <Header />
      <RegistrationButton />
      <RulesSection />
      <Body />
    </div>
  );
};
