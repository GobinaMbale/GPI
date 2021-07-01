package com.gpi.web.rest;

import com.gpi.domain.Enseigner;
import com.gpi.repository.EnseignerRepository;
import com.gpi.service.EnseignerService;
import com.gpi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gpi.domain.Enseigner}.
 */
@RestController
@RequestMapping("/api")
public class EnseignerResource {

    private final Logger log = LoggerFactory.getLogger(EnseignerResource.class);

    private static final String ENTITY_NAME = "enseigner";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnseignerService enseignerService;

    private final EnseignerRepository enseignerRepository;

    public EnseignerResource(EnseignerService enseignerService, EnseignerRepository enseignerRepository) {
        this.enseignerService = enseignerService;
        this.enseignerRepository = enseignerRepository;
    }

    /**
     * {@code POST  /enseigners} : Create a new enseigner.
     *
     * @param enseigner the enseigner to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new enseigner, or with status {@code 400 (Bad Request)} if the enseigner has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/enseigners")
    public ResponseEntity<Enseigner> createEnseigner(@Valid @RequestBody Enseigner enseigner) throws URISyntaxException {
        log.debug("REST request to save Enseigner : {}", enseigner);
        if (enseigner.getId() != null) {
            throw new BadRequestAlertException("A new enseigner cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Enseigner result = enseignerService.save(enseigner);
        return ResponseEntity
            .created(new URI("/api/enseigners/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /enseigners/:id} : Updates an existing enseigner.
     *
     * @param id the id of the enseigner to save.
     * @param enseigner the enseigner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enseigner,
     * or with status {@code 400 (Bad Request)} if the enseigner is not valid,
     * or with status {@code 500 (Internal Server Error)} if the enseigner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/enseigners/{id}")
    public ResponseEntity<Enseigner> updateEnseigner(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Enseigner enseigner
    ) throws URISyntaxException {
        log.debug("REST request to update Enseigner : {}, {}", id, enseigner);
        if (enseigner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enseigner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enseignerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Enseigner result = enseignerService.save(enseigner);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enseigner.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /enseigners/:id} : Partial updates given fields of an existing enseigner, field will ignore if it is null
     *
     * @param id the id of the enseigner to save.
     * @param enseigner the enseigner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enseigner,
     * or with status {@code 400 (Bad Request)} if the enseigner is not valid,
     * or with status {@code 404 (Not Found)} if the enseigner is not found,
     * or with status {@code 500 (Internal Server Error)} if the enseigner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/enseigners/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Enseigner> partialUpdateEnseigner(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Enseigner enseigner
    ) throws URISyntaxException {
        log.debug("REST request to partial update Enseigner partially : {}, {}", id, enseigner);
        if (enseigner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enseigner.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enseignerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Enseigner> result = enseignerService.partialUpdate(enseigner);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enseigner.getId().toString())
        );
    }

    /**
     * {@code GET  /enseigners} : get all the enseigners.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of enseigners in body.
     */
    @GetMapping("/enseigners")
    public ResponseEntity<List<Enseigner>> getAllEnseigners(Pageable pageable) {
        log.debug("REST request to get a page of Enseigners");
        Page<Enseigner> page = enseignerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /enseigners/:id} : get the "id" enseigner.
     *
     * @param id the id of the enseigner to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the enseigner, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/enseigners/{id}")
    public ResponseEntity<Enseigner> getEnseigner(@PathVariable Long id) {
        log.debug("REST request to get Enseigner : {}", id);
        Optional<Enseigner> enseigner = enseignerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(enseigner);
    }

    /**
     * {@code DELETE  /enseigners/:id} : delete the "id" enseigner.
     *
     * @param id the id of the enseigner to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/enseigners/{id}")
    public ResponseEntity<Void> deleteEnseigner(@PathVariable Long id) {
        log.debug("REST request to delete Enseigner : {}", id);
        enseignerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
