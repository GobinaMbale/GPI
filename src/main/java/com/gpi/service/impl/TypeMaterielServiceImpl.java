package com.gpi.service.impl;

import com.gpi.domain.TypeMateriel;
import com.gpi.repository.TypeMaterielRepository;
import com.gpi.service.TypeMaterielService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TypeMateriel}.
 */
@Service
@Transactional
public class TypeMaterielServiceImpl implements TypeMaterielService {

    private final Logger log = LoggerFactory.getLogger(TypeMaterielServiceImpl.class);

    private final TypeMaterielRepository typeMaterielRepository;

    public TypeMaterielServiceImpl(TypeMaterielRepository typeMaterielRepository) {
        this.typeMaterielRepository = typeMaterielRepository;
    }

    @Override
    public TypeMateriel save(TypeMateriel typeMateriel) {
        log.debug("Request to save TypeMateriel : {}", typeMateriel);
        return typeMaterielRepository.save(typeMateriel);
    }

    @Override
    public Optional<TypeMateriel> partialUpdate(TypeMateriel typeMateriel) {
        log.debug("Request to partially update TypeMateriel : {}", typeMateriel);

        return typeMaterielRepository
            .findById(typeMateriel.getId())
            .map(
                existingTypeMateriel -> {
                    if (typeMateriel.getLibelle() != null) {
                        existingTypeMateriel.setLibelle(typeMateriel.getLibelle());
                    }

                    return existingTypeMateriel;
                }
            )
            .map(typeMaterielRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TypeMateriel> findAll(Pageable pageable) {
        log.debug("Request to get all TypeMateriels");
        return typeMaterielRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TypeMateriel> findOne(Long id) {
        log.debug("Request to get TypeMateriel : {}", id);
        return typeMaterielRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TypeMateriel : {}", id);
        typeMaterielRepository.deleteById(id);
    }
}
