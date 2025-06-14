package org.grdfback.Services;


import org.grdfback.Entities.Client;
import org.grdfback.Entities.Notification;
import org.grdfback.Entities.Tech;
import org.grdfback.Repositories.ClientRepository;
import org.grdfback.Repositories.NotificationRepository;
import org.grdfback.Repositories.TaskRepository;
import org.grdfback.Repositories.TechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private TechRepository techRepository;
    @Autowired
    private ClientRepository clientRepository;
@Autowired
private TaskRepository taskRepository;
    public List<Client> getClientsForTech(Long techId) {
        Tech tech = techRepository.findById(techId).orElseThrow(() -> new IllegalArgumentException("Technician not found"));

        List<Notification> notifications = notificationRepository.findByTaskNeededTrueAndTechnician(tech);

        return notifications.stream()
                .map(notification -> notification.getClient()) // Get the client from the notification
                .distinct() // Ensure no duplicate clients are returned
                .collect(Collectors.toList());
    }

}
