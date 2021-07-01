package com.gpi.service.impl;

import com.gpi.domain.Materiel;
import com.gpi.repository.MaterielRepository;
import com.gpi.service.MaterielService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Materiel}.
 */
@Service
@Transactional
public class MaterielServiceImpl implements MaterielService {

    private final Logger log = LoggerFactory.getLogger(MaterielServiceImpl.class);

    private final MaterielRepository materielRepository;

    public MaterielServiceImpl(MaterielRepository materielRepository) {
        this.materielRepository = materielRepository;
    }

    @Override
    public Materiel save(Materiel materiel) {
        log.debug("Request to save Materiel : {}", materiel);
        return materielRepository.save(materiel);
    }

    @Override
    public Optional<Materiel> partialUpdate(Materiel materiel) {
        log.debug("Request to partially update Materiel : {}", materiel);

        return materielRepository
            .findById(materiel.getId())
            .map(
                existingMateriel -> {
                    if (materiel.getNom() != null) {
                        existingMateriel.setNom(materiel.getNom());
                    }
                    if (materiel.getDateCreation() != null) {
                        existingMateriel.setDateCreation(materiel.getDateCreation());
                    }
                    if (materiel.getEtat() != null) {
                        existingMateriel.setEtat(materiel.getEtat());
                    }

                    return existingMateriel;
                }
            )
            .map(materielRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Materiel> findAll(Pageable pageable) {
        log.debug("Request to get all Materiels");
        return materielRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Materiel> findOne(Long id) {
        log.debug("Request to get Materiel : {}", id);
        return materielRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Materiel : {}", id);
        materielRepository.deleteById(id);
    }
}
