package com.gpi.repository;

import com.gpi.domain.ReserverMateriel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ReserverMateriel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReserverMaterielRepository extends JpaRepository<ReserverMateriel, Long> {}
