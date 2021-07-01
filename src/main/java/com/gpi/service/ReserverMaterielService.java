package com.gpi.service;

import com.gpi.domain.ReserverMateriel;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ReserverMateriel}.
 */
public interface ReserverMaterielService {
    /**
     * Save a reserverMateriel.
     *
     * @param reserverMateriel the entity to save.
     * @return the persisted entity.
     */
    ReserverMateriel save(ReserverMateriel reserverMateriel);

    /**
     * Partially updates a reserverMateriel.
     *
     * @param reserverMateriel the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReserverMateriel> partialUpdate(ReserverMateriel reserverMateriel);

    /**
     * Get all the reserverMateriels.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReserverMateriel> findAll(Pageable pageable);

    /**
     * Get the "id" reserverMateriel.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReserverMateriel> findOne(Long id);

    /**
     * Delete the "id" reserverMateriel.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
