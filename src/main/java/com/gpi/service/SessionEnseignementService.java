package com.gpi.service;

import com.gpi.domain.SessionEnseignement;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SessionEnseignement}.
 */
public interface SessionEnseignementService {
    /**
     * Save a sessionEnseignement.
     *
     * @param sessionEnseignement the entity to save.
     * @return the persisted entity.
     */
    SessionEnseignement save(SessionEnseignement sessionEnseignement);

    /**
     * Partially updates a sessionEnseignement.
     *
     * @param sessionEnseignement the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SessionEnseignement> partialUpdate(SessionEnseignement sessionEnseignement);

    /**
     * Get all the sessionEnseignements.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SessionEnseignement> findAll(Pageable pageable);

    /**
     * Get the "id" sessionEnseignement.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SessionEnseignement> findOne(Long id);

    /**
     * Delete the "id" sessionEnseignement.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
