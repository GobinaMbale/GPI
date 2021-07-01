package com.gpi.service.impl;

import com.gpi.domain.SessionEnseignement;
import com.gpi.repository.SessionEnseignementRepository;
import com.gpi.service.SessionEnseignementService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SessionEnseignement}.
 */
@Service
@Transactional
public class SessionEnseignementServiceImpl implements SessionEnseignementService {

    private final Logger log = LoggerFactory.getLogger(SessionEnseignementServiceImpl.class);

    private final SessionEnseignementRepository sessionEnseignementRepository;

    public SessionEnseignementServiceImpl(SessionEnseignementRepository sessionEnseignementRepository) {
        this.sessionEnseignementRepository = sessionEnseignementRepository;
    }

    @Override
    public SessionEnseignement save(SessionEnseignement sessionEnseignement) {
        log.debug("Request to save SessionEnseignement : {}", sessionEnseignement);
        return sessionEnseignementRepository.save(sessionEnseignement);
    }

    @Override
    public Optional<SessionEnseignement> partialUpdate(SessionEnseignement sessionEnseignement) {
        log.debug("Request to partially update SessionEnseignement : {}", sessionEnseignement);

        return sessionEnseignementRepository
            .findById(sessionEnseignement.getId())
            .map(
                existingSessionEnseignement -> {
                    if (sessionEnseignement.getDateDebut() != null) {
                        existingSessionEnseignement.setDateDebut(sessionEnseignement.getDateDebut());
                    }
                    if (sessionEnseignement.getDateFin() != null) {
                        existingSessionEnseignement.setDateFin(sessionEnseignement.getDateFin());
                    }

                    return existingSessionEnseignement;
                }
            )
            .map(sessionEnseignementRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SessionEnseignement> findAll(Pageable pageable) {
        log.debug("Request to get all SessionEnseignements");
        return sessionEnseignementRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SessionEnseignement> findOne(Long id) {
        log.debug("Request to get SessionEnseignement : {}", id);
        return sessionEnseignementRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SessionEnseignement : {}", id);
        sessionEnseignementRepository.deleteById(id);
    }
}
