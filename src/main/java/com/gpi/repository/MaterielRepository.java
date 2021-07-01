package com.gpi.repository;

import com.gpi.domain.Materiel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Materiel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaterielRepository extends JpaRepository<Materiel, Long> {}
