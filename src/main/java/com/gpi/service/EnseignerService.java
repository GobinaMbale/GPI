package com.gpi.service;

import com.gpi.domain.Enseigner;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Enseigner}.
 */
public interface EnseignerService {
    /**
     * Save a enseigner.
     *
     * @param enseigner the entity to save.
     * @return the persisted entity.
     */
    Enseigner save(Enseigner enseigner);

    /**
     * Partially updates a enseigner.
     *
     * @param enseigner the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Enseigner> partialUpdate(Enseigner enseigner);

    /**
     * Get all the enseigners.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Enseigner> findAll(Pageable pageable);

    /**
     * Get the "id" enseigner.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Enseigner> findOne(Long id);

    /**
     * Delete the "id" enseigner.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
