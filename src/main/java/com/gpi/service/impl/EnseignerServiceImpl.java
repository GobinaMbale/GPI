package com.gpi.service.impl;

import com.gpi.domain.Enseigner;
import com.gpi.repository.EnseignerRepository;
import com.gpi.service.EnseignerService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Enseigner}.
 */
@Service
@Transactional
public class EnseignerServiceImpl implements EnseignerService {

    private final Logger log = LoggerFactory.getLogger(EnseignerServiceImpl.class);

    private final EnseignerRepository enseignerRepository;

    public EnseignerServiceImpl(EnseignerRepository enseignerRepository) {
        this.enseignerRepository = enseignerRepository;
    }

    @Override
    public Enseigner save(Enseigner enseigner) {
        log.debug("Request to save Enseigner : {}", enseigner);
        return enseignerRepository.save(enseigner);
    }

    @Override
    public Optional<Enseigner> partialUpdate(Enseigner enseigner) {
        log.debug("Request to partially update Enseigner : {}", enseigner);

        return enseignerRepository
            .findById(enseigner.getId())
            .map(
                existingEnseigner -> {
                    if (enseigner.getDateDebut() != null) {
                        existingEnseigner.setDateDebut(enseigner.getDateDebut());
                    }
                    if (enseigner.getDateFin() != null) {
                        existingEnseigner.setDateFin(enseigner.getDateFin());
                    }

                    return existingEnseigner;
                }
            )
            .map(enseignerRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Enseigner> findAll(Pageable pageable) {
        log.debug("Request to get all Enseigners");
        return enseignerRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Enseigner> findOne(Long id) {
        log.debug("Request to get Enseigner : {}", id);
        return enseignerRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Enseigner : {}", id);
        enseignerRepository.deleteById(id);
    }
}
