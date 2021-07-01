package com.gpi.service.impl;

import com.gpi.domain.Classe;
import com.gpi.repository.ClasseRepository;
import com.gpi.service.ClasseService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Classe}.
 */
@Service
@Transactional
public class ClasseServiceImpl implements ClasseService {

    private final Logger log = LoggerFactory.getLogger(ClasseServiceImpl.class);

    private final ClasseRepository classeRepository;

    public ClasseServiceImpl(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    @Override
    public Classe save(Classe classe) {
        log.debug("Request to save Classe : {}", classe);
        return classeRepository.save(classe);
    }

    @Override
    public Optional<Classe> partialUpdate(Classe classe) {
        log.debug("Request to partially update Classe : {}", classe);

        return classeRepository
            .findById(classe.getId())
            .map(
                existingClasse -> {
                    if (classe.getCode() != null) {
                        existingClasse.setCode(classe.getCode());
                    }
                    if (classe.getNiveau() != null) {
                        existingClasse.setNiveau(classe.getNiveau());
                    }
                    if (classe.getSpecialite() != null) {
                        existingClasse.setSpecialite(classe.getSpecialite());
                    }
                    if (classe.getLibelle() != null) {
                        existingClasse.setLibelle(classe.getLibelle());
                    }

                    return existingClasse;
                }
            )
            .map(classeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Classe> findAll(Pageable pageable) {
        log.debug("Request to get all Classes");
        return classeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Classe> findOne(Long id) {
        log.debug("Request to get Classe : {}", id);
        return classeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Classe : {}", id);
        classeRepository.deleteById(id);
    }
}
