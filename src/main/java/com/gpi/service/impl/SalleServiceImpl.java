package com.gpi.service.impl;

import com.gpi.domain.Salle;
import com.gpi.repository.SalleRepository;
import com.gpi.service.SalleService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Salle}.
 */
@Service
@Transactional
public class SalleServiceImpl implements SalleService {

    private final Logger log = LoggerFactory.getLogger(SalleServiceImpl.class);

    private final SalleRepository salleRepository;

    public SalleServiceImpl(SalleRepository salleRepository) {
        this.salleRepository = salleRepository;
    }

    @Override
    public Salle save(Salle salle) {
        log.debug("Request to save Salle : {}", salle);
        return salleRepository.save(salle);
    }

    @Override
    public Optional<Salle> partialUpdate(Salle salle) {
        log.debug("Request to partially update Salle : {}", salle);

        return salleRepository
            .findById(salle.getId())
            .map(
                existingSalle -> {
                    if (salle.getCode() != null) {
                        existingSalle.setCode(salle.getCode());
                    }
                    if (salle.getNom() != null) {
                        existingSalle.setNom(salle.getNom());
                    }
                    if (salle.getCampus() != null) {
                        existingSalle.setCampus(salle.getCampus());
                    }
                    if (salle.getCapacite() != null) {
                        existingSalle.setCapacite(salle.getCapacite());
                    }
                    if (salle.getBatiment() != null) {
                        existingSalle.setBatiment(salle.getBatiment());
                    }

                    return existingSalle;
                }
            )
            .map(salleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Salle> findAll(Pageable pageable) {
        log.debug("Request to get all Salles");
        return salleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Salle> findOne(Long id) {
        log.debug("Request to get Salle : {}", id);
        return salleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Salle : {}", id);
        salleRepository.deleteById(id);
    }
}
