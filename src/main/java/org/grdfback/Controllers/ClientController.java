package org.grdfback.Controllers;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Task;
import org.grdfback.Services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend
@RestController
@RequestMapping("/api/clients")


public class ClientController {
    @Autowired
    private ClientService clientService;
    @GetMapping("/{clientId}/tasks")
    public ResponseEntity<List<Task>> getTasksForClient(@PathVariable Long clientId) {
        List<Task> tasks = clientService.getTasksForClient(clientId);

        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retourne 204 No Content si le client n'a pas de tâches
        }

        return ResponseEntity.ok(tasks); // Retourne 200 OK avec la liste des tâches
    }

}
    /*
    @PostMapping("/{clientId}/tasks/{taskId}/rate")
    public ResponseEntity<Task> rateTechnician(@PathVariable Long taskId, @RequestBody int rating) {
        Task ratedTask = clientService.rateTechnician(taskId, rating);
        if (ratedTask != null) {
            return ResponseEntity.ok(ratedTask);
        }
        return ResponseEntity.notFound().build();
    }
*/




