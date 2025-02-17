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
        private TaskRepository taskRepository;
          @Autowired
          private TaskService taskService;

        // Get all tasks
        @GetMapping
        public List<Task> getAllTasks() {
            List<Task> tasks = taskService.getAllTasks();
            if (tasks.isEmpty()) {
                System.out.println("No tasks found in the database.");
            }
            return tasks;
        }

        // Get task by ID
        @GetMapping("/{taskId}")
        public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
            return taskService.getTaskById(taskId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }

        // Create a new task
        @PostMapping("/")
        public Task createTask(@RequestBody Task task) {
            return taskService.createTask(task);
        }
        @GetMapping("/tech/{techID}")
        public List<Task> getTasksByTech(@PathVariable Long techID) {
            return taskService.getTasksByTechId(techID);
        }
    }