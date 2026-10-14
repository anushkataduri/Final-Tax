package com.taxedge.notification.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FcmNotificationServiceImpl implements FcmNotificationService {

    @Override
    public void sendRegistrationSuccessNotification(String targetDeviceToken, String userName) {
        if (targetDeviceToken == null || targetDeviceToken.trim().isEmpty()) {
            System.out.println("No push token found for user. Skipping notification.");
            return;
        }

        String title = "Registration Successful";
        String body = "Registration successful";

        if (isExpoPushToken(targetDeviceToken)) {
            sendExpoPushNotification(targetDeviceToken, title, body, "REGISTRATION_SUCCESS");
            return;
        }

        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setToken(targetDeviceToken)
                    .setNotification(notification)
                    .putData("type", "REGISTRATION_SUCCESS")
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("FCM Push Notification sent successfully. Message ID: " + response);
        } catch (Exception e) {
            System.err.println("Error sending FCM notification: " + e.getMessage());
        }
    }

    @Override
    public void sendSuccessNotification(String targetDeviceToken, String userName) {
        sendRegistrationSuccessNotification(targetDeviceToken, userName);
    }

    private boolean isExpoPushToken(String token) {
        return token.startsWith("ExponentPushToken") || token.startsWith("ExpoPushToken") || token.contains("dev-");
    }

    private void sendExpoPushNotification(String expoPushToken, String title, String body, String type) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String jsonPayload = String.format(
                "{\"to\":\"%s\",\"title\":\"%s\",\"body\":\"%s\",\"sound\":\"default\",\"priority\":\"high\",\"data\":{\"type\":\"%s\"}}",
                expoPushToken, title, body, type
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://exp.host/--/api/v2/push/send"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Backend Expo Push Notification response: " + response.body());
        } catch (Exception ex) {
            System.err.println("Error dispatching Expo Push Notification from backend: " + ex.getMessage());
        }
    }
}
