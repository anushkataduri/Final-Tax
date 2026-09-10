package com.taxedge.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FcmNotificationService {

    public void sendRegistrationSuccessNotification(String targetDeviceToken, String userName) {
        if (targetDeviceToken == null || targetDeviceToken.trim().isEmpty()) {
            System.out.println("No FCM token found for user. Skipping notification.");
            return;
        }

        // If running in Expo Go or dev mode, Expo tokens cannot be sent directly to Firebase FCM API
        if (targetDeviceToken.startsWith("ExponentPushToken") || targetDeviceToken.contains("dev-")) {
            System.out.println("Expo push token stored for user: " + targetDeviceToken + " (Direct FCM dispatch is used on production Android APKs).");
            return;
        }

        try {
            // Build the notification payload
            Notification notification = Notification.builder()
                    .setTitle("Welcome to TaxEdge! 🎉")
                    .setBody("Hello " + userName + ", your GST account registration was successful.")
                    .build();

            // Build the FCM message targeting the specific device token
            Message message = Message.builder()
                    .setToken(targetDeviceToken)
                    .setNotification(notification)
                    .putData("type", "REGISTRATION_SUCCESS")
                    .build();

            // Send via Firebase Messaging directly from Backend
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("FCM Push Notification sent successfully. Message ID: " + response);
        } catch (Exception e) {
            System.err.println("Error sending FCM notification: " + e.getMessage());
        }
    }
}
