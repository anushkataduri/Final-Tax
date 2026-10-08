package com.taxedge.companyregistration.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class CompanyRegistrationFileStorage {
    private final Path root;

    public CompanyRegistrationFileStorage(
            @Value("${app.storage.company-registration-dir:./uploads/company-registration}") String directory) {
        root = Path.of(directory).toAbsolutePath().normalize();
    }

    public String store(Long registrationId, MultipartFile file) throws IOException {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String safeExtension = extension == null || !extension.matches("[A-Za-z0-9]{1,10}")
                ? "" : "." + extension.toLowerCase(Locale.ROOT);
        String key = registrationId + "/" + UUID.randomUUID() + safeExtension;
        Path destination = resolve(key);
        Files.createDirectories(destination.getParent());
        try {
            file.transferTo(destination);
            if (!Files.isRegularFile(destination) || Files.size(destination) == 0 ||
                    Files.size(destination) != file.getSize()) {
                throw new IOException("Uploaded file was not stored successfully");
            }
            return key;
        } catch (IOException | RuntimeException exception) {
            Files.deleteIfExists(destination);
            throw exception;
        }
    }

    public boolean exists(String key) {
        if (key == null || !key.matches("[0-9]+/[0-9a-fA-F-]{36}(?:\\.[A-Za-z0-9]{1,10})?")) {
            return false;
        }
        Path path = resolve(key);
        try {
            return Files.isRegularFile(path) && Files.size(path) > 0;
        } catch (IOException exception) {
            return false;
        }
    }

    public Resource load(String key) throws IOException {
        if (key == null || !key.matches("[0-9]+/[0-9a-fA-F-]{36}(?:\\.[A-Za-z0-9]{1,10})?")) {
            throw new IOException("Stored document path is invalid");
        }
        Path path = resolve(key);
        if (!Files.isRegularFile(path)) {
            throw new IOException("Stored document file does not exist");
        }
        return new FileSystemResource(path);
    }

    public void delete(String key) throws IOException {
        Files.deleteIfExists(resolve(key));
    }

    private Path resolve(String key) {
        Path resolved = root.resolve(key).normalize();
        if (!resolved.startsWith(root)) {
            throw new IllegalArgumentException("Invalid stored document path");
        }
        return resolved;
    }
}
