package org.grdfback.Services;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Task;
import org.grdfback.Repositories.ClientRepository;
import org.grdfback.Repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ClientService {
    @Autowired
    private TaskRepository taskRepository;
@Autowired
  private ClientRepository clientRepository;
    public List<Task> getTasksForClient(Long clientId) {
        return taskRepository.findByClient_ClientId(clientId);
    }


}