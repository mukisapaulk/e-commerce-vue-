// src/stores/notificationStore.ts
import { defineStore } from "pinia";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
}

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    // Get all visible notifications
    visibleNotifications(state): Notification[] {
      return state.notifications.filter((notification) => notification.isVisible);
    },
  },
  actions: {
    // Add a new notification
    addNotification(message: string, type: "success" | "error" | "info" | "warning" = "info") {
      const notification: Notification = {
        id: `${new Date().getTime()}`, // Unique ID based on the timestamp
        message,
        type,
        isVisible: true,
      };
      this.notifications.push(notification);

      // Optionally hide notification after a timeout
      setTimeout(() => {
        this.hideNotification(notification.id);
      }, 5000); // Hide after 5 seconds
    },

    // Hide a specific notification by ID
    hideNotification(id: string) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.isVisible = false;
      }
    },

    // Clear all notifications
    clearNotifications() {
      this.notifications = [];
    },
  },
});
