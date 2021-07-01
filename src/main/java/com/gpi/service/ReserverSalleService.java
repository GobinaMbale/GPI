package com.gpi.service;

import com.gpi.domain.ReserverSalle;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ReserverSalle}.
 */
public interface ReserverSalleService {
    /**
     * Save a reserverSalle.
     *
     * @param reserverSalle the entity to save.
     * @return the persisted entity.
     */
    ReserverSalle save(ReserverSalle reserverSalle);

    /**
     * Partially updates a reserverSalle.
     *
     * @param reserverSalle the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReserverSalle> partialUpdate(ReserverSalle reserverSalle);

    /**
     * Get all the reserverSalles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReserverSalle> findAll(Pageable pageable);

    /**
     * Get the "id" reserverSalle.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReserverSalle> findOne(Long id);

    /**
     * Delete the "id" reserverSalle.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
