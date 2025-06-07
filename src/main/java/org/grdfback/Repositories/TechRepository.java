package org.grdfback.Repositories;

import org.grdfback.Entities.Task;
import org.grdfback.Entities.Tech;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechRepository  extends JpaRepository<Tech, Long> {
    Optional<Tech> findTopByIsBusyFalse(); // ✅ NOTE: "Top" ou "First" fonctionne
    Optional<Tech> findFirstByIsBusyFalse();


}
