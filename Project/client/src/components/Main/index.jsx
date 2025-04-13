import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [featuredSets, setFeaturedSets] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setFeaturedSets([
            {
              id: 1,
              name: "Millennium Falcon",
              imageUrl: "https://zklockow.pl/img/lego-star-wars-75192-sokol-millennium-1.jpg",
              theme: "Star Wars",
              rating: 4.9
            },
            {
              id: 2,
              name: "Eiffel Tower",
              imageUrl: "https://a.allegroimg.com/original/11f3c4/afab743c4c999239f01c9d11fe01/LEGO-ICONS-10307-Eiffel-Tower",
              theme: "Architecture",
              rating: 4.8
            }
          ]);

          setNewReleases([
            {
              id: 5,
              name: "Venice Skyline",
              imageUrl: "https://www.lego.com/cdn/cs/set/assets/blt3500f6e8f1c72de9/21026_alt1.jpg",
              theme: "Architecture",
              releaseDate: "Nowość!"
            },
            {
              id: 6,
              name: "Space Shuttle",
              imageUrl: "https://a.allegroimg.com/original/114b49/afea3b3547ddbbe1538587bf5a34/LEGO-Creator-Expert-NASA-Space-Shuttle-Wahadlowiec-Discovery-10283",
              theme: "NASA",
              releaseDate: "Nowość!"
            }
          ]);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const goToOrders = () => {
    navigate("/orders");
  };

  if (isLoading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_spinner}></div>
        <p>Ładowanie Twoich danych...</p>
      </div>
    );
  }

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>FalconBrick</h1>
        <div className={styles.nav_links}>
          <a href="#featured">Wyróżnione</a>
          <a href="#new">Nowości</a>
          <button className={styles.orders_btn} onClick={goToOrders}>
            Moje Zamówienia
          </button>
          <button className={styles.white_btn} onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.hero_content}>
            <h2>Odkryj magiczny świat LEGO®</h2>
            <p>Zobacz najnowsze zestawy i kolekcje</p>
          </div>
        </section>

        <section id="featured" className={styles.section}>
          <div className={styles.section_header}>
            <h3>Wyróżnione zestawy</h3>
            <p>Najpopularniejsze wśród naszych klientów</p>
          </div>
          <div className={styles.sets_grid}>
            {featuredSets.map((set) => (
              <div key={set.id} className={styles.set_card}>
                <div className={styles.set_image_container}>
                  <img src={set.imageUrl} alt={set.name} className={styles.set_image} />
                  <div className={styles.set_rating}>
                    <span>★</span> {set.rating}
                  </div>
                </div>
                <div className={styles.set_info}>
                  <h4>{set.name}</h4>
                  <p className={styles.set_theme}>{set.theme}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="new" className={styles.section}>
          <div className={styles.section_header}>
            <h3>Nowości</h3>
            <p>Świeżo dodane do naszej kolekcji</p>
          </div>
          <div className={styles.sets_grid}>
            {newReleases.map((set) => (
              <div key={set.id} className={styles.set_card}>
                <div className={styles.set_image_container}>
                  <img src={set.imageUrl} alt={set.name} className={styles.set_image} />
                  <div className={styles.new_badge}>{set.releaseDate}</div>
                </div>
                <div className={styles.set_info}>
                  <h4>{set.name}</h4>
                  <p className={styles.set_theme}>{set.theme}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cta_section}>
          <div className={styles.cta_content}>
            <h3>Gotów na nową przygodę?</h3>
            <p>Odwiedź nasz sklep i znajdź swój wymarzony zestaw</p>
            <button
              className={styles.primary_btn}
              onClick={() => window.location.href = "/home"}
            >
              Przejdź do sklepu
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footer_content}>
          <div className={styles.footer_about}>
            <h4 className={styles.footer_logo}>FalconBrick</h4>
            <p>Twoje miejsce dla pasjonatów LEGO® od 2010 roku</p>
            <div className={styles.social_icons}>
              <a href="#facebook">FB</a>
              <a href="#instagram">IG</a>
              <a href="#twitter">TW</a>
            </div>
          </div>
          <div className={styles.footer_links}>
            <div>
              <h4>Informacje</h4>
              <ul>
                <li><a href="#about">O nas</a></li>
                <li><a href="#contact">Kontakt</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4>Pomoc</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#shipping">Dostawa</a></li>
                <li><a href="#returns">Zwroty</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} FalconBrick. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;