package org.grdfback.Services;

import org.grdfback.Entities.Task;
import org.grdfback.Repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get task by ID
    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    // Create a new task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getTasksByTechId(Long techID) {
        return taskRepository.findByTech_TechID(techID);
    }
    }
