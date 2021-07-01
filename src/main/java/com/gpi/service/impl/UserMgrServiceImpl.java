package com.gpi.service.impl;

import com.gpi.domain.UserMgr;
import com.gpi.repository.UserMgrRepository;
import com.gpi.service.UserMgrService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserMgr}.
 */
@Service
@Transactional
public class UserMgrServiceImpl implements UserMgrService {

    private final Logger log = LoggerFactory.getLogger(UserMgrServiceImpl.class);

    private final UserMgrRepository userMgrRepository;

    public UserMgrServiceImpl(UserMgrRepository userMgrRepository) {
        this.userMgrRepository = userMgrRepository;
    }

    @Override
    public UserMgr save(UserMgr userMgr) {
        log.debug("Request to save UserMgr : {}", userMgr);
        return userMgrRepository.save(userMgr);
    }

    @Override
    public Optional<UserMgr> partialUpdate(UserMgr userMgr) {
        log.debug("Request to partially update UserMgr : {}", userMgr);

        return userMgrRepository
            .findById(userMgr.getId())
            .map(
                existingUserMgr -> {
                    if (userMgr.getType() != null) {
                        existingUserMgr.setType(userMgr.getType());
                    }
                    if (userMgr.getQuotaHoraire() != null) {
                        existingUserMgr.setQuotaHoraire(userMgr.getQuotaHoraire());
                    }

                    return existingUserMgr;
                }
            )
            .map(userMgrRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserMgr> findAll(Pageable pageable) {
        log.debug("Request to get all UserMgrs");
        return userMgrRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserMgr> findOne(Long id) {
        log.debug("Request to get UserMgr : {}", id);
        return userMgrRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserMgr : {}", id);
        userMgrRepository.deleteById(id);
    }
}
