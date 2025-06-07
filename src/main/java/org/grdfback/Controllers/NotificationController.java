package org.grdfback.Controllers;

import org.grdfback.DTOs.NotificationRequest;
import org.grdfback.Entities.Client;
import org.grdfback.Entities.Notification;
import org.grdfback.Entities.Task;
import org.grdfback.Entities.Tech;
import org.grdfback.Repositories.ClientRepository;
import org.grdfback.Repositories.NotificationRepository;
import org.grdfback.Repositories.TaskRepository;
import org.grdfback.Repositories.TechRepository;
import org.grdfback.Services.NotificationService;
import org.grdfback.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private TaskService taskService;
@Autowired
private TaskRepository taskRepository;
    @Autowired
    private TechRepository techRepository;
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/tech/{techId}")
    public List<Client> getClientsForTech(@PathVariable Long techId) {
        return notificationService.getClientsForTech(techId);
    }
    @PostMapping("/create-with-task")
    public ResponseEntity<?> createNotificationWithTask(@RequestBody NotificationRequest dto) {
        Notification notification = new Notification();
        Client client = clientRepository.findById(dto.getClientId()).orElse(null);
        if (client == null) return ResponseEntity.badRequest().body("Client introuvable");

        notification.setClient(client);
        notification.setTaskNeeded(dto.isTaskNeeded());

        // 🔍 Trouver un technicien libre
        Tech technician = techRepository.findFirstByIsBusyFalse().orElse(null);
        if (technician == null) return ResponseEntity.status(500).body("Aucun technicien disponible");

        notification.setTechnician(technician);
        notificationRepository.save(notification);

        // ✅ Créer la tâche
        Task task = new Task();
        task.setClient(client);
        task.setTech(technician);
        task.setStatus("EN_ATTENTE");
        task.setTaskDate(LocalDate.now());
        task.setDescription(dto.getDescription());

        taskRepository.save(task);

        return ResponseEntity.ok("Notification + tâche créées !");
    }

}
