package com.gpi.repository;

import com.gpi.domain.TypeMateriel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeMateriel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeMaterielRepository extends JpaRepository<TypeMateriel, Long> {}
