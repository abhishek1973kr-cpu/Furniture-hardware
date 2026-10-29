/**
 * Orders Service Layer for VibeFab Luxury Admin
 * 
 * Provides real-time Firestore synchronization using `onSnapshot` on the "orders" collection.
 * Incoming orders reflect instantly without page refresh.
 * Status updates ("Pending" | "Dispatched" | "Delivered") persist directly to Firestore.
 */

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { INITIAL_ORDERS } from "@/data/mockHardwareData";

const COLLECTION_NAME = "orders";
export const ORDERS_STORAGE_KEY = "vibefab_luxury_orders_realtime_v1";

// Local listeners array for offline / local-storage reactive updates
const localListeners = new Set();

function notifyLocalListeners(orders) {
  localListeners.forEach((listener) => {
    try {
      listener(orders);
    } catch (err) {
      console.error("Error notifying order listener:", err);
    }
  });
}

function getStoredLocalOrders() {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Local order storage read error:", e);
  }
  return INITIAL_ORDERS;
}

function saveStoredLocalOrders(orders) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Local order storage save error:", e);
  }
}

/**
 * Real-time listener for incoming customer orders using Firestore onSnapshot
 * @param {Function} onOrdersUpdated - Callback receiving updated orders array
 * @returns {Function} unsubscribe function
 */
export function subscribeToOrders(onOrdersUpdated) {
  // If real Firebase Firestore is configured
  if (isFirebaseConfigured && db) {
    try {
      const ordersCol = collection(db, COLLECTION_NAME);
      const q = query(ordersCol, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const liveOrders = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              // Format date nicely if Firestore Timestamp
              let formattedDate = data.date;
              if (data.createdAt && typeof data.createdAt.toDate === "function") {
                formattedDate = data.createdAt.toDate().toISOString().split("T")[0];
              }
              return {
                id: docSnap.id,
                ...data,
                date: formattedDate || data.date || new Date().toISOString().split("T")[0],
              };
            });
            saveStoredLocalOrders(liveOrders);
            onOrdersUpdated(liveOrders);
          } else {
            // First time collection is empty, seed or notify
            const currentLocal = getStoredLocalOrders();
            onOrdersUpdated(currentLocal);
          }
        },
        (error) => {
          console.warn("Firestore orders onSnapshot subscription error, using local fallback:", error);
          const localOrders = getStoredLocalOrders();
          onOrdersUpdated(localOrders);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Failed to attach onSnapshot to orders, using local subscriber:", err);
    }
  }

  // Fallback: Local reactive subscription
  localListeners.add(onOrdersUpdated);
  const initial = getStoredLocalOrders();
  onOrdersUpdated(initial);

  return () => {
    localListeners.delete(onOrdersUpdated);
  };
}

/**
 * Update the status of an order in Firestore ("Pending" | "Dispatched" | "Delivered")
 */
export async function updateOrderStatus(orderId, newStatus) {
  // Always update locally for instant optimistic UI feedback
  const currentOrders = getStoredLocalOrders();
  const updatedOrders = currentOrders.map((ord) =>
    ord.id === orderId ? { ...ord, status: newStatus, lastUpdated: new Date().toISOString() } : ord
  );
  saveStoredLocalOrders(updatedOrders);
  notifyLocalListeners(updatedOrders);

  // Sync to Firestore if online
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.warn(`Firestore updateDoc failed for order ${orderId}:`, err);
    }
  }

  return true;
}

/**
 * Create a new customer order (useful for simulating incoming orders in real-time)
 */
export async function createCustomerOrder(orderData) {
  const newId = `ORD-VBF-${Date.now().toString().slice(-4)}`;
  const payload = {
    id: newId,
    ...orderData,
    date: orderData.date || new Date().toISOString().split("T")[0],
    status: orderData.status || "Pending",
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...payload,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.warn("Firestore addDoc error for order:", err);
    }
  }

  // Local storage update
  const current = getStoredLocalOrders();
  const next = [payload, ...current];
  saveStoredLocalOrders(next);
  notifyLocalListeners(next);

  return payload;
}
