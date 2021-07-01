package com.gpi.web.rest;

import com.gpi.domain.ReserverMateriel;
import com.gpi.repository.ReserverMaterielRepository;
import com.gpi.service.ReserverMaterielService;
import com.gpi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link com.gpi.domain.ReserverMateriel}.
 */
@RestController
@RequestMapping("/api")
public class ReserverMaterielResource {

    private final Logger log = LoggerFactory.getLogger(ReserverMaterielResource.class);

    private static final String ENTITY_NAME = "reserverMateriel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReserverMaterielService reserverMaterielService;

    private final ReserverMaterielRepository reserverMaterielRepository;

    public ReserverMaterielResource(
        ReserverMaterielService reserverMaterielService,
        ReserverMaterielRepository reserverMaterielRepository
    ) {
        this.reserverMaterielService = reserverMaterielService;
        this.reserverMaterielRepository = reserverMaterielRepository;
    }

    /**
     * {@code POST  /reserver-materiels} : Create a new reserverMateriel.
     *
     * @param reserverMateriel the reserverMateriel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reserverMateriel, or with status {@code 400 (Bad Request)} if the reserverMateriel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reserver-materiels")
    public ResponseEntity<ReserverMateriel> createReserverMateriel(@RequestBody ReserverMateriel reserverMateriel)
        throws URISyntaxException {
        log.debug("REST request to save ReserverMateriel : {}", reserverMateriel);
        if (reserverMateriel.getId() != null) {
            throw new BadRequestAlertException("A new reserverMateriel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReserverMateriel result = reserverMaterielService.save(reserverMateriel);
        return ResponseEntity
            .created(new URI("/api/reserver-materiels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reserver-materiels/:id} : Updates an existing reserverMateriel.
     *
     * @param id the id of the reserverMateriel to save.
     * @param reserverMateriel the reserverMateriel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reserverMateriel,
     * or with status {@code 400 (Bad Request)} if the reserverMateriel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reserverMateriel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reserver-materiels/{id}")
    public ResponseEntity<ReserverMateriel> updateReserverMateriel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReserverMateriel reserverMateriel
    ) throws URISyntaxException {
        log.debug("REST request to update ReserverMateriel : {}, {}", id, reserverMateriel);
        if (reserverMateriel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reserverMateriel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reserverMaterielRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ReserverMateriel result = reserverMaterielService.save(reserverMateriel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reserverMateriel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reserver-materiels/:id} : Partial updates given fields of an existing reserverMateriel, field will ignore if it is null
     *
     * @param id the id of the reserverMateriel to save.
     * @param reserverMateriel the reserverMateriel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reserverMateriel,
     * or with status {@code 400 (Bad Request)} if the reserverMateriel is not valid,
     * or with status {@code 404 (Not Found)} if the reserverMateriel is not found,
     * or with status {@code 500 (Internal Server Error)} if the reserverMateriel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reserver-materiels/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ReserverMateriel> partialUpdateReserverMateriel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReserverMateriel reserverMateriel
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReserverMateriel partially : {}, {}", id, reserverMateriel);
        if (reserverMateriel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reserverMateriel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reserverMaterielRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReserverMateriel> result = reserverMaterielService.partialUpdate(reserverMateriel);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reserverMateriel.getId().toString())
        );
    }

    /**
     * {@code GET  /reserver-materiels} : get all the reserverMateriels.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reserverMateriels in body.
     */
    @GetMapping("/reserver-materiels")
    public ResponseEntity<List<ReserverMateriel>> getAllReserverMateriels(Pageable pageable) {
        log.debug("REST request to get a page of ReserverMateriels");
        Page<ReserverMateriel> page = reserverMaterielService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reserver-materiels/:id} : get the "id" reserverMateriel.
     *
     * @param id the id of the reserverMateriel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reserverMateriel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reserver-materiels/{id}")
    public ResponseEntity<ReserverMateriel> getReserverMateriel(@PathVariable Long id) {
        log.debug("REST request to get ReserverMateriel : {}", id);
        Optional<ReserverMateriel> reserverMateriel = reserverMaterielService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reserverMateriel);
    }

    /**
     * {@code DELETE  /reserver-materiels/:id} : delete the "id" reserverMateriel.
     *
     * @param id the id of the reserverMateriel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reserver-materiels/{id}")
    public ResponseEntity<Void> deleteReserverMateriel(@PathVariable Long id) {
        log.debug("REST request to delete ReserverMateriel : {}", id);
        reserverMaterielService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
