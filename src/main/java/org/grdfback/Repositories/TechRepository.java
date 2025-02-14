package org.grdfback.Repositories;

import org.grdfback.Entities.Task;
import org.grdfback.Entities.Tech;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechRepository  extends JpaRepository<Tech, Long> {


}
