package com.gpi.service;

import com.gpi.domain.Grade;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Grade}.
 */
public interface GradeService {
    /**
     * Save a grade.
     *
     * @param grade the entity to save.
     * @return the persisted entity.
     */
    Grade save(Grade grade);

    /**
     * Partially updates a grade.
     *
     * @param grade the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Grade> partialUpdate(Grade grade);

    /**
     * Get all the grades.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Grade> findAll(Pageable pageable);

    /**
     * Get the "id" grade.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Grade> findOne(Long id);

    /**
     * Delete the "id" grade.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
