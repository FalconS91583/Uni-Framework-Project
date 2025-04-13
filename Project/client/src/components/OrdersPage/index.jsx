import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import {
    FaHome, FaUser, FaBox, FaShoppingCart, FaSearch,
    FaCheckCircle, FaTimesCircle, FaTruck, FaMoneyBillWave,
    FaCalendarAlt, FaReceipt
} from "react-icons/fa";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:8080/api/orders", {
                headers: {
                    "x-auth-token": authToken,
                },
            });

            if (response.data && Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                console.error("Invalid orders data:", response.data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Nie udało się załadować zamówień. Spróbuj ponownie.");
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const cancelOrder = async (orderId) => {
        const authToken = localStorage.getItem("token");

        try {
            await axios.delete(`http://127.0.0.1:8080/api/orders/${orderId}`, {
                headers: {
                    "x-auth-token": authToken,
                },
            });
            fetchOrders();
        } catch (error) {
            console.error("Error canceling order:", error);
            setError("Nie udało się anulować zamówienia. Spróbuj ponownie.");
        }
    };

    const payOrder = async (orderId) => {
        const authToken = localStorage.getItem("token");
        const confirmPayment = window.confirm("Czy chcesz zapłacić za zamówienie?");

        if (!confirmPayment) return;

        try {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, paid: true } : order
                )
            );

            await axios.post(
                `http://127.0.0.1:8080/api/orders/${orderId}/pay`,
                {},
                {
                    headers: {
                        "x-auth-token": authToken,
                    },
                }
            );
        } catch (error) {
            console.error("Error paying for order:", error);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, paid: false } : order
                )
            );
            setError("Nie udało się zrealizować płatności. Spróbuj ponownie.");
        }
    };

    const trackPackage = (orderId) => {
        const statuses = [
            "Paczka jest w stanie pakowania",
            "Paczka wyruszyła w podróż",
            "Paczka zostanie dostarczona w najbliższym dniu roboczym",
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        alert(`Status zamówienia #${orderId.slice(-6).toUpperCase()}:\n${randomStatus}`);
    };

    const filteredOrders = orders
        .filter(order => {
            const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesFilter =
                filter === "all" ||
                (filter === "paid" && order.paid) ||
                (filter === "unpaid" && !order.paid);

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    const updateOrderStatus = async (orderId, newStatus) => {
        const authToken = localStorage.getItem("token");
        try {
            const response = await axios.put(
                `http://127.0.0.1:8080/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        "x-auth-token": authToken,
                    },
                }
            );

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
            setError("Nie udało się zaktualizować statusu zamówienia. Spróbuj ponownie.");
        }
    };

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
                            placeholder="Wyszukaj zamówienia..."
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
                    <button className={styles.navButton} onClick={() => navigate("/combinations")}>
                        <FaBox /> Kombinacje
                    </button>
                    <div className={styles.cart} onClick={() => navigate("/cart")}>
                        <FaShoppingCart size={20} />
                    </div>
                </div>
            </nav>

            {/* Główna zawartość */}
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        <FaReceipt className={styles.titleIcon} /> Twoje zamówienia
                    </h1>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label>Filtruj:</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">Wszystkie</option>
                                <option value="paid">Opłacone</option>
                                <option value="unpaid">Nieopłacone</option>
                            </select>
                        </div>
                        <div className={styles.stats}>
                            <p>Liczba zamówień: <strong>{orders.length}</strong></p>
                            <p>Wartość zamówień: <strong>
                                {orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)} PLN
                            </strong></p>
                        </div>
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                {isLoading ? (
                    <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <p>Ładowanie zamówień...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className={styles.noOrders}>
                        <p>Nie znaleziono zamówień</p>
                        <button
                            className={styles.shopButton}
                            onClick={() => navigate("/")}
                        >
                            Przejdź do sklepu
                        </button>
                    </div>
                ) : (
                    <div className={styles.ordersGrid}>
                        {filteredOrders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3 className={styles.orderId}>
                                        Zamówienie #{order._id.slice(-6).toUpperCase()}
                                    </h3>
                                    <div className={order.paid ? styles.statusPaid : styles.statusUnpaid}>
                                        {order.paid ? (
                                            <>
                                                <FaCheckCircle /> Opłacone
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle /> Oczekujące na płatność
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.orderMeta}>
                                    <div className={styles.metaItem}>
                                        <FaCalendarAlt className={styles.metaIcon} />
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <FaMoneyBillWave className={styles.metaIcon} />
                                        <span>{order.totalPrice.toFixed(2)} PLN</span>
                                    </div>
                                </div>

                                <ul className={styles.itemsList}>
                                    {order.items.map((item, index) => (
                                        <li key={`${item.name}-${index}`} className={styles.item}>
                                            <img
                                                src={item.image || item.imageUrl}
                                                alt={item.name}
                                                className={styles.itemImage}
                                            />
                                            <div className={styles.itemDetails}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemPieces}>{item.pieces} elementów</span>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                {item.price.toFixed(2)} PLN
                                                <span className={styles.itemQuantity}>x{item.quantity}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <select
                                    className={styles.orderStatusSelect}
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                >
                                    <option value="pending">Brak akcji</option>
                                    <option value="processing">Poproś o zmianę dnia dostrczenia</option>
                                    <option value="shipped">Poproś o kontakt z magazynem</option>
                                    <option value="delivered">Poproś o kontakt do kuriera</option>
                                </select>


                                <div className={styles.orderTotal}>
                                    Suma: <span>{order.totalPrice.toFixed(2)} PLN</span>
                                </div>

                                <div className={styles.actions}>
                                    {order.paid ? (
                                        <button
                                            className={styles.trackBtn}
                                            onClick={() => trackPackage(order._id)}
                                        >
                                            <FaTruck /> Śledź paczkę
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className={styles.cancelBtn}
                                                onClick={() => cancelOrder(order._id)}
                                            >
                                                Anuluj
                                            </button>
                                            <button
                                                className={styles.payBtn}
                                                onClick={() => payOrder(order._id)}
                                            >
                                                Opłać
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3>FalconBrick</h3>
                        <p>Twoje zamówienia LEGO</p>
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

export default OrdersPage;