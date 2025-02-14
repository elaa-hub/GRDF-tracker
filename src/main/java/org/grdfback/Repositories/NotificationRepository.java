package org.grdfback.Repositories;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Notification;
import org.grdfback.Entities.Tech;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTaskNeededTrueAndTechnician(Tech tech);
    List<Notification> findByTechnician(Tech tech);

}
