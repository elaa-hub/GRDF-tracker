package org.grdfback.Controllers;

import org.grdfback.Entities.Task;
import org.grdfback.Services.TechService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend
@RestController
@RequestMapping("/api/techs")
public class TechController {
    @Autowired
    private TechService techService;

    @PostMapping(   "/{techId}/tasks/{clientId}")
    public ResponseEntity<?> addTask(@PathVariable Long techId, @PathVariable Long clientId, @RequestBody Task task) {
        try {
            Task createdTask = techService.addTaskForClient(techId, clientId, task);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Impossible d'ajouter la tâche : " + e.getMessage());
        }
    }

}

