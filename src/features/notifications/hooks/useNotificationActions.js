/**
 * src/features/notifications/hooks/useNotificationActions.js
 *
 * Custom hook wrapping RTK Query mutation triggers for notifications.
 * Provides clean action handlers for read, archive, and delete operations.
 */

import { useCallback } from "react";
import {
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useArchiveNotificationMutation,
  useArchiveAllMutation,
  useDeleteNotificationMutation,
  useDeleteAllMutation,
  useCreateTestNotificationMutation,
} from "../api/notificationApi";

export function useNotificationActions() {
  const [markAsReadMutation, { isLoading: isMarkingRead }] = useMarkAsReadMutation();
  const [markAllAsReadMutation, { isLoading: isMarkingAllRead }] = useMarkAllAsReadMutation();
  const [archiveMutation, { isLoading: isArchiving }] = useArchiveNotificationMutation();
  const [archiveAllMutation, { isLoading: isArchivingAll }] = useArchiveAllMutation();
  const [deleteMutation, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [deleteAllMutation, { isLoading: isDeletingAll }] = useDeleteAllMutation();
  const [createTestMutation, { isLoading: isCreatingTest }] = useCreateTestNotificationMutation();

  const markAsRead = useCallback(
    async (id) => {
      try {
        await markAsReadMutation(id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, [markAllAsReadMutation]);

  const archiveNotification = useCallback(
    async (id) => {
      try {
        await archiveMutation(id).unwrap();
      } catch (err) {
        console.error("Failed to archive notification:", err);
      }
    },
    [archiveMutation]
  );

  const archiveAll = useCallback(async () => {
    try {
      await archiveAllMutation().unwrap();
    } catch (err) {
      console.error("Failed to archive all:", err);
    }
  }, [archiveAllMutation]);

  const deleteNotification = useCallback(
    async (id) => {
      try {
        await deleteMutation(id).unwrap();
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    },
    [deleteMutation]
  );

  const deleteAll = useCallback(async () => {
    try {
      await deleteAllMutation().unwrap();
    } catch (err) {
      console.error("Failed to delete all:", err);
    }
  }, [deleteAllMutation]);

  const createTestNotification = useCallback(
    async (type = "SYSTEM") => {
      try {
        await createTestMutation({ type }).unwrap();
      } catch (err) {
        console.error("Failed to create test notification:", err);
      }
    },
    [createTestMutation]
  );

  return {
    markAsRead,
    markAllAsRead,
    archiveNotification,
    archiveAll,
    deleteNotification,
    deleteAll,
    createTestNotification,
    isLoading:
      isMarkingRead ||
      isMarkingAllRead ||
      isArchiving ||
      isArchivingAll ||
      isDeleting ||
      isDeletingAll ||
      isCreatingTest,
  };
}
