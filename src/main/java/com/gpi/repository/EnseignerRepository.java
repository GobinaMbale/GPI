package com.gpi.repository;

import com.gpi.domain.Enseigner;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Enseigner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EnseignerRepository extends JpaRepository<Enseigner, Long> {}
