package com.gpi.service;

import com.gpi.domain.Departement;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Departement}.
 */
public interface DepartementService {
    /**
     * Save a departement.
     *
     * @param departement the entity to save.
     * @return the persisted entity.
     */
    Departement save(Departement departement);

    /**
     * Partially updates a departement.
     *
     * @param departement the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Departement> partialUpdate(Departement departement);

    /**
     * Get all the departements.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Departement> findAll(Pageable pageable);

    /**
     * Get the "id" departement.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Departement> findOne(Long id);

    /**
     * Delete the "id" departement.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
