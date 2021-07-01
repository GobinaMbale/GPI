package com.gpi.service;

import com.gpi.domain.TypeMateriel;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link TypeMateriel}.
 */
public interface TypeMaterielService {
    /**
     * Save a typeMateriel.
     *
     * @param typeMateriel the entity to save.
     * @return the persisted entity.
     */
    TypeMateriel save(TypeMateriel typeMateriel);

    /**
     * Partially updates a typeMateriel.
     *
     * @param typeMateriel the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TypeMateriel> partialUpdate(TypeMateriel typeMateriel);

    /**
     * Get all the typeMateriels.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TypeMateriel> findAll(Pageable pageable);

    /**
     * Get the "id" typeMateriel.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TypeMateriel> findOne(Long id);

    /**
     * Delete the "id" typeMateriel.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
