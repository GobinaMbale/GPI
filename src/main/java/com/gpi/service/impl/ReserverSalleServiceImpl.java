package com.gpi.service.impl;

import com.gpi.domain.ReserverSalle;
import com.gpi.repository.ReserverSalleRepository;
import com.gpi.service.ReserverSalleService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ReserverSalle}.
 */
@Service
@Transactional
public class ReserverSalleServiceImpl implements ReserverSalleService {

    private final Logger log = LoggerFactory.getLogger(ReserverSalleServiceImpl.class);

    private final ReserverSalleRepository reserverSalleRepository;

    public ReserverSalleServiceImpl(ReserverSalleRepository reserverSalleRepository) {
        this.reserverSalleRepository = reserverSalleRepository;
    }

    @Override
    public ReserverSalle save(ReserverSalle reserverSalle) {
        log.debug("Request to save ReserverSalle : {}", reserverSalle);
        return reserverSalleRepository.save(reserverSalle);
    }

    @Override
    public Optional<ReserverSalle> partialUpdate(ReserverSalle reserverSalle) {
        log.debug("Request to partially update ReserverSalle : {}", reserverSalle);

        return reserverSalleRepository
            .findById(reserverSalle.getId())
            .map(
                existingReserverSalle -> {
                    if (reserverSalle.getDateReservation() != null) {
                        existingReserverSalle.setDateReservation(reserverSalle.getDateReservation());
                    }
                    if (reserverSalle.getMotif() != null) {
                        existingReserverSalle.setMotif(reserverSalle.getMotif());
                    }

                    return existingReserverSalle;
                }
            )
            .map(reserverSalleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReserverSalle> findAll(Pageable pageable) {
        log.debug("Request to get all ReserverSalles");
        return reserverSalleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReserverSalle> findOne(Long id) {
        log.debug("Request to get ReserverSalle : {}", id);
        return reserverSalleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ReserverSalle : {}", id);
        reserverSalleRepository.deleteById(id);
    }
}
