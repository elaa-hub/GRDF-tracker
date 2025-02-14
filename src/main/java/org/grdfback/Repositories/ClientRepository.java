package org.grdfback.Repositories;

import org.grdfback.Entities.Client;
import org.grdfback.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {
    List<Client> findByHouseAddress(String houseAddress);

}
