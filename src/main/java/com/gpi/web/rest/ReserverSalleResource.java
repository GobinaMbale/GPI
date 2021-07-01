package com.gpi.web.rest;

import com.gpi.domain.ReserverSalle;
import com.gpi.repository.ReserverSalleRepository;
import com.gpi.service.ReserverSalleService;
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
 * REST controller for managing {@link com.gpi.domain.ReserverSalle}.
 */
@RestController
@RequestMapping("/api")
public class ReserverSalleResource {

    private final Logger log = LoggerFactory.getLogger(ReserverSalleResource.class);

    private static final String ENTITY_NAME = "reserverSalle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReserverSalleService reserverSalleService;

    private final ReserverSalleRepository reserverSalleRepository;

    public ReserverSalleResource(ReserverSalleService reserverSalleService, ReserverSalleRepository reserverSalleRepository) {
        this.reserverSalleService = reserverSalleService;
        this.reserverSalleRepository = reserverSalleRepository;
    }

    /**
     * {@code POST  /reserver-salles} : Create a new reserverSalle.
     *
     * @param reserverSalle the reserverSalle to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reserverSalle, or with status {@code 400 (Bad Request)} if the reserverSalle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reserver-salles")
    public ResponseEntity<ReserverSalle> createReserverSalle(@Valid @RequestBody ReserverSalle reserverSalle) throws URISyntaxException {
        log.debug("REST request to save ReserverSalle : {}", reserverSalle);
        if (reserverSalle.getId() != null) {
            throw new BadRequestAlertException("A new reserverSalle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReserverSalle result = reserverSalleService.save(reserverSalle);
        return ResponseEntity
            .created(new URI("/api/reserver-salles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reserver-salles/:id} : Updates an existing reserverSalle.
     *
     * @param id the id of the reserverSalle to save.
     * @param reserverSalle the reserverSalle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reserverSalle,
     * or with status {@code 400 (Bad Request)} if the reserverSalle is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reserverSalle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reserver-salles/{id}")
    public ResponseEntity<ReserverSalle> updateReserverSalle(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ReserverSalle reserverSalle
    ) throws URISyntaxException {
        log.debug("REST request to update ReserverSalle : {}, {}", id, reserverSalle);
        if (reserverSalle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reserverSalle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reserverSalleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ReserverSalle result = reserverSalleService.save(reserverSalle);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reserverSalle.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reserver-salles/:id} : Partial updates given fields of an existing reserverSalle, field will ignore if it is null
     *
     * @param id the id of the reserverSalle to save.
     * @param reserverSalle the reserverSalle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reserverSalle,
     * or with status {@code 400 (Bad Request)} if the reserverSalle is not valid,
     * or with status {@code 404 (Not Found)} if the reserverSalle is not found,
     * or with status {@code 500 (Internal Server Error)} if the reserverSalle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reserver-salles/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ReserverSalle> partialUpdateReserverSalle(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ReserverSalle reserverSalle
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReserverSalle partially : {}, {}", id, reserverSalle);
        if (reserverSalle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reserverSalle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reserverSalleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReserverSalle> result = reserverSalleService.partialUpdate(reserverSalle);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reserverSalle.getId().toString())
        );
    }

    /**
     * {@code GET  /reserver-salles} : get all the reserverSalles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reserverSalles in body.
     */
    @GetMapping("/reserver-salles")
    public ResponseEntity<List<ReserverSalle>> getAllReserverSalles(Pageable pageable) {
        log.debug("REST request to get a page of ReserverSalles");
        Page<ReserverSalle> page = reserverSalleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reserver-salles/:id} : get the "id" reserverSalle.
     *
     * @param id the id of the reserverSalle to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reserverSalle, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reserver-salles/{id}")
    public ResponseEntity<ReserverSalle> getReserverSalle(@PathVariable Long id) {
        log.debug("REST request to get ReserverSalle : {}", id);
        Optional<ReserverSalle> reserverSalle = reserverSalleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reserverSalle);
    }

    /**
     * {@code DELETE  /reserver-salles/:id} : delete the "id" reserverSalle.
     *
     * @param id the id of the reserverSalle to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reserver-salles/{id}")
    public ResponseEntity<Void> deleteReserverSalle(@PathVariable Long id) {
        log.debug("REST request to delete ReserverSalle : {}", id);
        reserverSalleService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
