package com.gpi.service;

import com.gpi.domain.Matiere;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Matiere}.
 */
public interface MatiereService {
    /**
     * Save a matiere.
     *
     * @param matiere the entity to save.
     * @return the persisted entity.
     */
    Matiere save(Matiere matiere);

    /**
     * Partially updates a matiere.
     *
     * @param matiere the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Matiere> partialUpdate(Matiere matiere);

    /**
     * Get all the matieres.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Matiere> findAll(Pageable pageable);

    /**
     * Get the "id" matiere.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Matiere> findOne(Long id);

    /**
     * Delete the "id" matiere.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
