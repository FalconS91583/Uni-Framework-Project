import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { FaShoppingCart, FaHome, FaUser, FaBox, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [sets, setSets] = useState([]);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchSets = async () => {
    try {
      const data = [
        {
          id: 1,
          name: "LEGO Technic Ferrari Daytona SP3",
          image: "https://image.ceneostatic.pl/data/products/134438627/i-lego-technic-42143-ferrari-daytona-sp3.jpg",
          price: 1999.99,
          priceDisplay: "1999.99 PLN",
          description: "Ekskluzywny model Ferrari Daytona SP3 z serii Technic.",
          pieces: 3778,
          age: "18+",
          theme: "Technic"
        },
        {
          id: 2,
          name: "LEGO Star Wars Millennium Falcon",
          image: "https://cdn.al.to/i/setup/images/prod/big/product-new-big,,2021/8/pr_2021_8_16_15_15_52_619_00.jpg",
          price: 3499.99,
          priceDisplay: "3499.99 PLN",
          description: "Ogromny model kultowego statku Millennium Falcon.",
          pieces: 7541,
          age: "16+",
          theme: "Star Wars"
        },
        {
          id: 3,
          name: "LEGO Ideas Fender Stratocaster",
          image: "https://image.ceneostatic.pl/data/products/115388562/i-lego-ideas-21329-fender-stratocaster.jpg",
          price: 799.99,
          priceDisplay: "799.99 PLN",
          description: "Kultowa gitara Fender Stratocaster w wersji LEGO.",
          pieces: 1074,
          age: "18+",
          theme: "Music"
        },
        {
          id: 4,
          name: "LEGO Creator Expert Taj Mahal",
          image: "https://a.allegroimg.com/original/111f64/4df553fb4173afeec9a24e82ef2b/Lego-10256-Creator-Expert-Taj-Mahal",
          price: 1299.99,
          priceDisplay: "1299.99 PLN",
          description: "Imponujący model słynnego Taj Mahal.",
          pieces: 5923,
          age: "16+",
          theme: "Architecture"
        },
        {
          id: 5,
          name: "LEGO Harry Potter Hogwarts Castle",
          image: "https://ecsmedia.pl/cdn-cgi/image/width=270,height=270,/c/lego-harry-potter-klocki-zamek-hogwart-71043-b-iext165650428.jpg",
          price: 1599.99,
          priceDisplay: "1599.99 PLN",
          description: "Ogromny model zamku Hogwart z serii Harry Potter.",
          pieces: 6020,
          age: "16+",
          theme: "Harry Potter"
        },
        {
          id: 6,
          name: "LEGO Technic Lamborghini Sián FKP 37",
          image: "https://moders.pl/wp-content/uploads/2022/11/lambo.jpg",
          price: 1799.99,
          priceDisplay: "1799.99 PLN",
          description: "Supersamochód Lamborghini Sián w wersji LEGO Technic.",
          pieces: 3696,
          age: "18+",
          theme: "Technic"
        }
      ];
      setSets(data);
    } catch (error) {
      setError("Wystąpił problem z pobieraniem danych.");
    }
  };

  const addToCart = (set) => {
    setCartCount(cartCount + 1);
    setCartItems([...cartItems, set]);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price;
    }, 0).toFixed(2) + " PLN";
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Twój koszyk jest pusty!");
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        pieces: item.pieces,
        theme: item.theme
      })),
      totalPrice: cartItems.reduce((sum, item) => sum + item.price, 0)
    };

    const authToken = localStorage.getItem("token");

    if (!authToken) {
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      alert("Zaloguj się aby złożyć zamówienie");
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/orders", orderData, {
        headers: {
          "x-auth-token": authToken,
        },
      });

      setCartItems([]);
      setCartCount(0);
      alert("Zamówienie złożone pomyślnie!");
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);
      alert("Błąd podczas składania zamówienia. Spróbuj ponownie.");
    }
  };

  const filteredSets = sets.filter(set =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.theme?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSets();
  }, []);

  return (
    <div className={styles.container}>
      {/* Pasek nawigacyjny */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h1 className={styles.logo}>FalconBrick</h1>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Wyszukaj zestawy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navButton} onClick={() => navigate("/")}>
            <FaHome /> Strona główna
          </button>
          <button className={styles.navButton} onClick={() => navigate("/profile")}>
            <FaUser /> Profil
          </button>
          <button className={styles.navButton} onClick={() => navigate("/orders")}>
            <FaBox /> Zamówienia
          </button>
          <div className={styles.cart} onClick={toggleCart}>
            <FaShoppingCart size={20} />
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Odkryj świat LEGO</h2>
          <p>Najlepsze zestawy dla kolekcjonerów i pasjonatów</p>
          <button className={styles.heroButton} onClick={() => window.scrollTo({ top: document.querySelector(`.${styles.grid}`).offsetTop, behavior: 'smooth' })}>
            Przeglądaj produkty
          </button>
        </div>
      </div>

      <main className={styles.mainContent}>
        {error && <div className={styles.error}>{error}</div>}

        <h2 className={styles.sectionTitle}>Nasze najlepsze zestawy</h2>

        <div className={styles.grid}>
          {filteredSets.map((set) => (
            <div key={set.id} className={styles.card}>
              <div className={styles.cardBadge}>{set.theme || "LEGO"}</div>
              <img src={set.image} alt={set.name} className={styles.image} />
              <h2 className={styles.title}>{set.name}</h2>
              <p className={styles.description}>{set.description}</p>
              <div className={styles.detailsContainer}>
                <p className={styles.details}>
                  <strong>Cena:</strong> {set.priceDisplay || `${set.price} PLN`}
                </p>
                <p className={styles.details}>
                  <strong>Elementy:</strong> {set.pieces}
                </p>
                <p className={styles.details}>
                  <strong>Wiek:</strong> {set.age}
                </p>
              </div>
              <button className={styles.button} onClick={() => addToCart(set)}>Dodaj do koszyka</button>
            </div>
          ))}
        </div>
      </main>

      {showCart && (
        <div className={styles.cartModal}>
          <div className={styles.cartHeader}>
            <h2>Twój koszyk</h2>
            <button className={styles.closeButton} onClick={toggleCart}>×</button>
          </div>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Twój koszyk jest pusty</p>
              <button className={styles.continueShopping} onClick={toggleCart}>
                Kontynuuj zakupy
              </button>
            </div>
          ) : (
            <>
              <ul className={styles.cartList}>
                {cartItems.map((item) => (
                  <li key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                    <div className={styles.cartItemDetails}>
                      <h3>{item.name}</h3>
                      <p>{item.priceDisplay}</p>
                    </div>
                    <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>X</button>
                  </li>
                ))}
              </ul>
              <div className={styles.cartFooter}>
                <p className={styles.total}>Łączna cena: <span>{calculateTotal()}</span></p>
                <button className={styles.orderButton} onClick={handleOrder}>Złóż zamówienie</button>
              </div>
            </>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>FalconBrick</h3>
            <p>Najlepsze zestawy LEGO dla każdego</p>
          </div>
          <div className={styles.footerSection}>
            <h3>Kontakt</h3>
            <p>email: kontakt@falconbrick.pl</p>
            <p>telefon: +48 123 456 789</p>
          </div>
          <div className={styles.footerSection}>
            <h3>Informacje</h3>
            <p>Regulamin</p>
            <p>Polityka prywatności</p>
            <p>Zwroty i reklamacje</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 FalconBrick. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;