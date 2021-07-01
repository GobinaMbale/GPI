package com.gpi.service.impl;

import com.gpi.domain.ReserverMateriel;
import com.gpi.repository.ReserverMaterielRepository;
import com.gpi.service.ReserverMaterielService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ReserverMateriel}.
 */
@Service
@Transactional
public class ReserverMaterielServiceImpl implements ReserverMaterielService {

    private final Logger log = LoggerFactory.getLogger(ReserverMaterielServiceImpl.class);

    private final ReserverMaterielRepository reserverMaterielRepository;

    public ReserverMaterielServiceImpl(ReserverMaterielRepository reserverMaterielRepository) {
        this.reserverMaterielRepository = reserverMaterielRepository;
    }

    @Override
    public ReserverMateriel save(ReserverMateriel reserverMateriel) {
        log.debug("Request to save ReserverMateriel : {}", reserverMateriel);
        return reserverMaterielRepository.save(reserverMateriel);
    }

    @Override
    public Optional<ReserverMateriel> partialUpdate(ReserverMateriel reserverMateriel) {
        log.debug("Request to partially update ReserverMateriel : {}", reserverMateriel);

        return reserverMaterielRepository
            .findById(reserverMateriel.getId())
            .map(
                existingReserverMateriel -> {
                    if (reserverMateriel.getDateReservation() != null) {
                        existingReserverMateriel.setDateReservation(reserverMateriel.getDateReservation());
                    }
                    if (reserverMateriel.getDateRetour() != null) {
                        existingReserverMateriel.setDateRetour(reserverMateriel.getDateRetour());
                    }

                    return existingReserverMateriel;
                }
            )
            .map(reserverMaterielRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReserverMateriel> findAll(Pageable pageable) {
        log.debug("Request to get all ReserverMateriels");
        return reserverMaterielRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReserverMateriel> findOne(Long id) {
        log.debug("Request to get ReserverMateriel : {}", id);
        return reserverMaterielRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ReserverMateriel : {}", id);
        reserverMaterielRepository.deleteById(id);
    }
}
