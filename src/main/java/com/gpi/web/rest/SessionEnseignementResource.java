package com.gpi.web.rest;

import com.gpi.domain.SessionEnseignement;
import com.gpi.repository.SessionEnseignementRepository;
import com.gpi.service.SessionEnseignementService;
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
 * REST controller for managing {@link com.gpi.domain.SessionEnseignement}.
 */
@RestController
@RequestMapping("/api")
public class SessionEnseignementResource {

    private final Logger log = LoggerFactory.getLogger(SessionEnseignementResource.class);

    private static final String ENTITY_NAME = "sessionEnseignement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SessionEnseignementService sessionEnseignementService;

    private final SessionEnseignementRepository sessionEnseignementRepository;

    public SessionEnseignementResource(
        SessionEnseignementService sessionEnseignementService,
        SessionEnseignementRepository sessionEnseignementRepository
    ) {
        this.sessionEnseignementService = sessionEnseignementService;
        this.sessionEnseignementRepository = sessionEnseignementRepository;
    }

    /**
     * {@code POST  /session-enseignements} : Create a new sessionEnseignement.
     *
     * @param sessionEnseignement the sessionEnseignement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sessionEnseignement, or with status {@code 400 (Bad Request)} if the sessionEnseignement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/session-enseignements")
    public ResponseEntity<SessionEnseignement> createSessionEnseignement(@Valid @RequestBody SessionEnseignement sessionEnseignement)
        throws URISyntaxException {
        log.debug("REST request to save SessionEnseignement : {}", sessionEnseignement);
        if (sessionEnseignement.getId() != null) {
            throw new BadRequestAlertException("A new sessionEnseignement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SessionEnseignement result = sessionEnseignementService.save(sessionEnseignement);
        return ResponseEntity
            .created(new URI("/api/session-enseignements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /session-enseignements/:id} : Updates an existing sessionEnseignement.
     *
     * @param id the id of the sessionEnseignement to save.
     * @param sessionEnseignement the sessionEnseignement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sessionEnseignement,
     * or with status {@code 400 (Bad Request)} if the sessionEnseignement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sessionEnseignement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/session-enseignements/{id}")
    public ResponseEntity<SessionEnseignement> updateSessionEnseignement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SessionEnseignement sessionEnseignement
    ) throws URISyntaxException {
        log.debug("REST request to update SessionEnseignement : {}, {}", id, sessionEnseignement);
        if (sessionEnseignement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sessionEnseignement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionEnseignementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SessionEnseignement result = sessionEnseignementService.save(sessionEnseignement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sessionEnseignement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /session-enseignements/:id} : Partial updates given fields of an existing sessionEnseignement, field will ignore if it is null
     *
     * @param id the id of the sessionEnseignement to save.
     * @param sessionEnseignement the sessionEnseignement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sessionEnseignement,
     * or with status {@code 400 (Bad Request)} if the sessionEnseignement is not valid,
     * or with status {@code 404 (Not Found)} if the sessionEnseignement is not found,
     * or with status {@code 500 (Internal Server Error)} if the sessionEnseignement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/session-enseignements/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SessionEnseignement> partialUpdateSessionEnseignement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SessionEnseignement sessionEnseignement
    ) throws URISyntaxException {
        log.debug("REST request to partial update SessionEnseignement partially : {}, {}", id, sessionEnseignement);
        if (sessionEnseignement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sessionEnseignement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionEnseignementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SessionEnseignement> result = sessionEnseignementService.partialUpdate(sessionEnseignement);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sessionEnseignement.getId().toString())
        );
    }

    /**
     * {@code GET  /session-enseignements} : get all the sessionEnseignements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sessionEnseignements in body.
     */
    @GetMapping("/session-enseignements")
    public ResponseEntity<List<SessionEnseignement>> getAllSessionEnseignements(Pageable pageable) {
        log.debug("REST request to get a page of SessionEnseignements");
        Page<SessionEnseignement> page = sessionEnseignementService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /session-enseignements/:id} : get the "id" sessionEnseignement.
     *
     * @param id the id of the sessionEnseignement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sessionEnseignement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/session-enseignements/{id}")
    public ResponseEntity<SessionEnseignement> getSessionEnseignement(@PathVariable Long id) {
        log.debug("REST request to get SessionEnseignement : {}", id);
        Optional<SessionEnseignement> sessionEnseignement = sessionEnseignementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sessionEnseignement);
    }

    /**
     * {@code DELETE  /session-enseignements/:id} : delete the "id" sessionEnseignement.
     *
     * @param id the id of the sessionEnseignement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/session-enseignements/{id}")
    public ResponseEntity<Void> deleteSessionEnseignement(@PathVariable Long id) {
        log.debug("REST request to delete SessionEnseignement : {}", id);
        sessionEnseignementService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
