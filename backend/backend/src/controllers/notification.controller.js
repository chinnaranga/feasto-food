import Notification from "../models/Notification.js";
import { emitNotification } from "../sockets/socketManager.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.uid })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.uid },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        res.json(notification);
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.uid, read: false }, { read: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        res.status(500).json({ error: "Failed to update notifications" });
    }
};

// Utility to create and emit notification
export const createNotification = async (userId, data) => {
    try {
        const notification = new Notification({
            userId,
            ...data
        });
        await notification.save();
        emitNotification(userId, notification);
        return notification;
    } catch (error) {
        console.error("Create Notification Error:", error);
    }
};
