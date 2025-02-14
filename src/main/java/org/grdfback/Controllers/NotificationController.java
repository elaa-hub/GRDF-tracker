package org.grdfback.Controllers;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Notification;
import org.grdfback.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/tech/{techId}")
    public List<Client> getClientsForTech(@PathVariable Long techId) {
        return notificationService.getClientsForTech(techId);
    }
}
