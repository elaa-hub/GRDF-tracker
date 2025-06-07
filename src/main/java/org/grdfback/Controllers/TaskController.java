    package org.grdfback.Controllers;

    import org.grdfback.Entities.Task;
    import org.grdfback.Repositories.TaskRepository;
    import org.grdfback.Services.TaskService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
        @RestController
    @CrossOrigin(origins = "http://localhost:4200")  // Allowing CORS only from the Angular frontend
    @RequestMapping("/api/tasks")
    public class TaskController {
            @Autowired
            private TaskService taskService;

            // 🔹 Toutes les tâches
            @GetMapping
            public List<Task> getAllTasks() {
                return taskService.getAllTasks();
            }

            // 🔹 Tâche par ID
            @GetMapping("/{taskId}")
            public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
                return taskService.getTaskById(taskId)
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
            }

            // 🔹 Créer une nouvelle tâche
            @PostMapping("/")
            public Task createTask(@RequestBody Task task) {
                return taskService.createTask(task);
            }

            // 🔹 Toutes les tâches notées pour un technicien
            @GetMapping("/tech/{techID}/rated")
            public ResponseEntity<List<Task>> getRatedTasksByTech(@PathVariable Long techID) {
                return ResponseEntity.ok(taskService.getRatedTasksByTechId(techID));
            }

            // 🔹 Compter les tâches d’un technicien
            @GetMapping("/tech/{techId}/count")
            public long getTaskCountByTech(@PathVariable Long techId) {
                return taskService.countTasksByTechId(techId);
            }

            // 🔹 Tâches d’un technicien
            @GetMapping("/tech/{techId}")
            public ResponseEntity<List<Task>> getTasksByTechId(@PathVariable Long techId) {
                return ResponseEntity.ok(taskService.getTasksByTechId(techId));
            }
        }