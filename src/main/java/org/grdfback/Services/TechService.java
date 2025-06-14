package org.grdfback.Services;

import jakarta.transaction.Transactional;
import org.grdfback.Entities.Client;
import org.grdfback.Entities.Notification;
import org.grdfback.Entities.Task;
import org.grdfback.Entities.Tech;
import org.grdfback.Repositories.ClientRepository;
import org.grdfback.Repositories.NotificationRepository;
import org.grdfback.Repositories.TaskRepository;
import org.grdfback.Repositories.TechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TechService {
    @Autowired
    private TechRepository techRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional

    public Task addTaskForClient(Long techId, Long clientId, Task task) {
        Optional<Tech> techOpt = techRepository.findById(techId);
        Optional<Client> clientOpt = clientRepository.findById(clientId);

        if (techOpt.isPresent() && clientOpt.isPresent()) {
            Tech tech = techOpt.get();
            Client client = clientOpt.get();

            System.out.println("Task before saving: " + task);  // Or use a logger here

            if (task.getDescription() == null || task.getDescription().isEmpty()) {
                throw new IllegalArgumentException("Description is required.");
            }

            task.setTech(tech);
            task.setClient(client);
            task.setTaskDate(LocalDate.now());

            return taskRepository.save(task);
        }

        throw new IllegalArgumentException("User not found.");
    }


    public List<Task> getTasksForClient(Long clientId) {
        return taskRepository.findByClient_ClientId(clientId);  }


    @Transactional
    public Task addTaskForNotification(Long techId, Long notificationId, Task task) {
        // Retrieve the technician and notification
        Optional<Tech> techOpt = techRepository.findById(techId);
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (techOpt.isPresent() && notificationOpt.isPresent()) {
            Tech tech = techOpt.get();
            Notification notification = notificationOpt.get();
            Client client = notification.getClient();

            System.out.println("Task before saving: " + task);

            if (task.getDescription() == null || task.getDescription().isEmpty()) {
                throw new IllegalArgumentException("Description obligatoire.");
            }

            task.setTech(tech);
            task.setClient(client);
            task.setTaskDate(LocalDate.now());

            // Save the task
            return taskRepository.save(task);
        }

        throw new IllegalArgumentException("Technician or Notification not found.");
    }
}
