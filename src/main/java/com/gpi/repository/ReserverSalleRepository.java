package com.gpi.repository;

import com.gpi.domain.ReserverSalle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ReserverSalle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReserverSalleRepository extends JpaRepository<ReserverSalle, Long> {}
