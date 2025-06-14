package org.grdfback.Repositories;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findByTech_TechID(Long techID);

    List<Task> findByClient_ClientId(Long clientId);
}
