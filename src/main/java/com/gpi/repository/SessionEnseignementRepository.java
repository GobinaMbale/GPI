package com.gpi.repository;

import com.gpi.domain.SessionEnseignement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SessionEnseignement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SessionEnseignementRepository extends JpaRepository<SessionEnseignement, Long> {}
