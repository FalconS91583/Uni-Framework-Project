import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import {
    FaLightbulb, FaCar, FaCity, FaRobot, FaStar,
    FaChevronDown, FaTimes, FaSearch, FaShoppingCart,
    FaHome, FaUser, FaBox, FaHeart, FaRegHeart
} from "react-icons/fa";

const CombinationsPage = () => {
    const [uniqueSets, setUniqueSets] = useState([]);
    const [userSets, setUserSets] = useState([]);
    const [combinations, setCombinations] = useState([]);
    const [expandedCombination, setExpandedCombination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const generateCreativeCombinations = useCallback((allSets, userSets) => {
        if (!Array.isArray(allSets) || !Array.isArray(userSets)) {
            console.error("Invalid data received:", { allSets, userSets });
            setCombinations([{
                id: 0,
                title: "Błąd danych",
                description: "Wystąpił problem z wczytaniem danych. Spróbuj ponownie.",
                requiredSets: []
            }]);
            return;
        }

        const validAllSets = allSets.filter(set => set?.name && set?.image);
        const validUserSets = userSets.filter(set => set?.name && set?.image);
        const userSetNames = validUserSets.map(set => set.name);

        if (userSetNames.length < 2) {
            setCombinations([{
                id: 0,
                title: "Dodaj więcej zestawów",
                description: "Potrzebujesz co najmniej 2 różnych zestawów, aby tworzyć kombinacje",
                requiredSets: []
            }]);
            return;
        }

        const generatedCombinations = [
            {
                id: 1,
                title: "Mega-Budowla Techniczna",
                description: "Połącz techniczne elementy z różnych zestawów, aby stworzyć imponującą konstrukcję",
                requiredSets: validAllSets.filter(set =>
                    ["LEGO Technic Ferrari Daytona SP3", "LEGO Technic Lamborghini Sián FKP 37"].includes(set.name)
                ),
                instructions: [
                    "1. Użyj podstawy konstrukcyjnej z Ferrari",
                    "2. Dodaj zaawansowane mechanizmy z Lamborghini",
                    "3. Połącz systemy łączeń technicznych",
                    "4. Dodaj ruchome elementy dla interaktywności",
                    "5. Wykorzystaj specjalne części obu zestawów"
                ],
                difficulty: 3,
                icon: <FaRobot />,
                theme: "technic",
                estimatedTime: "4-6 godzin",
                piecesRequired: 5000
            },
            {
                id: 2,
                title: "Kombinacja Pojazdów",
                description: "Stwórz hybrydowy pojazd z elementów różnych zestawów",
                requiredSets: validAllSets.filter(set =>
                    ["LEGO Technic Ferrari Daytona SP3", "LEGO Creator Expert Taj Mahal"].includes(set.name)
                ),
                instructions: [
                    "1. Weź podwozie z Ferrari",
                    "2. Użyj dekoracyjnych elementów z Taj Mahal",
                    "3. Połącz systemy konstrukcyjne",
                    "4. Dodaj niestandardowe elementy aerodynamiczne",
                    "5. Wykorzystaj detale wykończeniowe"
                ],
                difficulty: 2,
                icon: <FaCar />,
                theme: "vehicle",
                estimatedTime: "3-5 godzin",
                piecesRequired: 4500
            },
            {
                id: 3,
                title: "Scena Narracyjna",
                description: "Zbuduj scenkę z historii używając elementów z różnych zestawów",
                requiredSets: validAllSets.filter(set =>
                    ["LEGO Star Wars Millennium Falcon", "LEGO Harry Potter Hogwarts Castle"].includes(set.name)
                ),
                instructions: [
                    "1. Stwórz tło z płaskich elementów z Millennium Falcon",
                    "2. Użyj magicznych elementów z Hogwartu",
                    "3. Dodaj ruchome elementy scenograficzne",
                    "4. Wykorzystaj specjalne efekty z obu zestawów",
                    "5. Zaaranżuj oświetlenie i dodatkowe detale"
                ],
                difficulty: 1,
                icon: <FaCity />,
                theme: "scene",
                estimatedTime: "2-4 godzin",
                piecesRequired: 3000
            },
            {
                id: 4,
                title: "Kreatywny Instrument",
                description: "Połącz elementy muzyczne i konstrukcyjne",
                requiredSets: validAllSets.filter(set =>
                    ["LEGO Ideas Fender Stratocaster", "LEGO Technic Lamborghini Sián FKP 37"].includes(set.name)
                ),
                instructions: [
                    "1. Wykorzystaj podstawę dźwiękową z Fendera",
                    "2. Dodaj elementy aerodynamiczne z Lamborghini",
                    "3. Skonstruuj niestandardowy korpus instrumentu",
                    "4. Dodaj mechanizmy regulacji dźwięku",
                    "5. Wykonaj finalne strojenie"
                ],
                difficulty: 2,
                icon: <FaLightbulb />,
                theme: "music",
                estimatedTime: "3-5 godzin",
                piecesRequired: 2500
            }
        ].filter(combo => combo.requiredSets.length >= 2);

        const filteredCombinations = generatedCombinations.map(combo => {
            const missingSets = combo.requiredSets.filter(
                set => !userSetNames.includes(set.name)
            );

            return {
                ...combo,
                isAvailable: missingSets.length === 0,
                missingSets,
                isFavorite: favorites.includes(combo.id)
            };
        });

        setCombinations(filteredCombinations);
    }, [favorites]);

    const fetchOrders = useCallback(async () => {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);

            const [ordersResponse, setsResponse] = await Promise.all([
                axios.get("http://localhost:8080/api/orders", {
                    headers: { "x-auth-token": authToken }
                }),
                axios.get("http://localhost:8080/api/sets")
            ]);

            const userItems = ordersResponse.data.flatMap(order =>
                order.items.map(item => ({
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    pieces: item.pieces,
                    theme: item.theme
                }))
            );

            const allSets = setsResponse.data.map(set => ({
                name: set.name,
                image: set.image,
                price: set.price,
                pieces: set.pieces,
                theme: set.theme
            }));

            setUserSets(userItems);
            setUniqueSets(allSets);
            generateCreativeCombinations(allSets, userItems);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Nie udało się załadować danych. Spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    }, [navigate, generateCreativeCombinations]);

    const toggleInstructions = (id) => {
        setExpandedCombination(expandedCombination === id ? null : id);
    };

    const toggleFavorite = (id) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(favId => favId !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const renderDifficultyStars = (difficulty) => {
        return Array.from({ length: 3 }, (_, i) => (
            <FaStar
                key={i}
                className={i < difficulty ? styles.filledStar : styles.emptyStar}
            />
        ));
    };

    const filteredCombinations = combinations.filter(combo =>
        combo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combo.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className={styles.container}>
            {/* Pasek nawigacyjny */}
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <h1 className={styles.logo} onClick={() => navigate("/")}>FalconBrick</h1>
                    <div className={styles.searchBar}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Wyszukaj kombinacje..."
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
                    <div className={styles.cart} onClick={() => navigate("/cart")}>
                        <FaShoppingCart size={20} />
                    </div>
                </div>
            </nav>

            {/* Hero section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2>Kreatywne Kombinacje LEGO</h2>
                    <p>Odkryj nowe sposoby łączenia swoich zestawów</p>
                </div>
            </div>

            <main className={styles.mainContent}>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Filtruj:</label>
                        <select>
                            <option>Wszystkie</option>
                            <option>Dostępne</option>
                            <option>Ulubione</option>
                            <option>Techniczne</option>
                            <option>Pojazdy</option>
                            <option>Sceny</option>
                        </select>
                    </div>
                    <div className={styles.stats}>
                        <p>Posiadasz: <strong>{userSets.length}</strong> zestawów</p>
                        <p>Dostępne: <strong>{combinations.filter(c => c.isAvailable).length}</strong> kombinacji</p>
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                {isLoading ? (
                    <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <p>Ładowanie kombinacji...</p>
                    </div>
                ) : (
                    <div className={styles.combinationsGrid}>
                        {filteredCombinations.map((combo) => (
                            <div
                                key={combo.id}
                                className={`${styles.comboCard} ${styles[combo.theme] || ''} ${!combo.isAvailable && combo.id !== 0 ? styles.unavailableCombo : ''
                                    }`}
                            >
                                <div className={styles.comboHeader}>
                                    <div className={styles.comboIcon}>{combo.icon}</div>
                                    <h3 className={styles.comboTitle}>{combo.title}</h3>
                                    <button
                                        className={styles.favoriteButton}
                                        onClick={() => toggleFavorite(combo.id)}
                                    >
                                        {favorites.includes(combo.id) ? (
                                            <FaHeart className={styles.favoriteIcon} />
                                        ) : (
                                            <FaRegHeart className={styles.favoriteIcon} />
                                        )}
                                    </button>
                                </div>

                                {!combo.isAvailable && combo.id !== 0 && (
                                    <div className={styles.missingSetsBadge}>
                                        <FaTimes className={styles.missingIcon} />
                                        <span>Brakujące zestawy: {combo.missingSets.length}</span>
                                    </div>
                                )}

                                <p className={styles.comboDescription}>{combo.description}</p>

                                <div className={styles.comboMeta}>
                                    <div className={styles.metaItem}>
                                        <span>Poziom trudności:</span>
                                        <div className={styles.stars}>
                                            {renderDifficultyStars(combo.difficulty)}
                                        </div>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Szacowany czas:</span>
                                        <strong>{combo.estimatedTime}</strong>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Elementy:</span>
                                        <strong>{combo.piecesRequired.toLocaleString()}</strong>
                                    </div>
                                </div>

                                <div className={styles.requiredSets}>
                                    <h4>Wymagane zestawy:</h4>
                                    <div className={styles.setsList}>
                                        {combo.requiredSets?.map((set, i) => {
                                            const isOwned = userSets.some(userSet => userSet.name === set.name);
                                            return (
                                                <div key={i} className={`${styles.setItem} ${isOwned ? '' : styles.missingSet
                                                    }`}>
                                                    <div className={styles.setDetails}>
                                                        <span className={styles.setName}>
                                                            {set.name}
                                                            {!isOwned && <FaTimes className={styles.missingSetIcon} />}
                                                        </span>
                                                        <span className={styles.setPieces}>
                                                            {(set.pieces || 0).toLocaleString()} elementów
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {combo.id !== 0 && (
                                    <>
                                        {combo.isAvailable ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleInstructions(combo.id);
                                                }}
                                                className={styles.toggleButton}
                                            >
                                                {expandedCombination === combo.id ? (
                                                    "Ukryj instrukcję"
                                                ) : (
                                                    <>
                                                        Pokaż instrukcję <FaChevronDown className={styles.chevron} />
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button className={styles.disabledButton} disabled>
                                                Wymagane dodatkowe zestawy
                                            </button>
                                        )}
                                    </>
                                )}

                                {expandedCombination === combo.id && (
                                    <div className={styles.instructionsModal}>
                                        <div className={styles.instructionsContent}>
                                            <h4>Instrukcja krok po kroku:</h4>
                                            <ol className={styles.stepsList}>
                                                {combo.instructions?.map((step, i) => (
                                                    <li key={i} className={styles.step}>
                                                        <span className={styles.stepNumber}>{i + 1}.</span>
                                                        <span className={styles.stepText}>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                            <div className={styles.difficultyFull}>
                                                <span>Poziom trudności: </span>
                                                <div className={styles.stars}>
                                                    {renderDifficultyStars(combo.difficulty)}
                                                    <span className={styles.difficultyLabel}>
                                                        {["Łatwy", "Średni", "Trudny"][combo.difficulty - 1]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3>FalconBrick</h3>
                        <p>Kreatywne kombinacje LEGO</p>
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

export default CombinationsPage;    