package com.gpi.web.rest;

import com.gpi.domain.UserMgr;
import com.gpi.repository.UserMgrRepository;
import com.gpi.service.UserMgrService;
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
 * REST controller for managing {@link com.gpi.domain.UserMgr}.
 */
@RestController
@RequestMapping("/api")
public class UserMgrResource {

    private final Logger log = LoggerFactory.getLogger(UserMgrResource.class);

    private static final String ENTITY_NAME = "userMgr";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserMgrService userMgrService;

    private final UserMgrRepository userMgrRepository;

    public UserMgrResource(UserMgrService userMgrService, UserMgrRepository userMgrRepository) {
        this.userMgrService = userMgrService;
        this.userMgrRepository = userMgrRepository;
    }

    /**
     * {@code POST  /user-mgrs} : Create a new userMgr.
     *
     * @param userMgr the userMgr to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userMgr, or with status {@code 400 (Bad Request)} if the userMgr has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-mgrs")
    public ResponseEntity<UserMgr> createUserMgr(@RequestBody UserMgr userMgr) throws URISyntaxException {
        log.debug("REST request to save UserMgr : {}", userMgr);
        if (userMgr.getId() != null) {
            throw new BadRequestAlertException("A new userMgr cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserMgr result = userMgrService.save(userMgr);
        return ResponseEntity
            .created(new URI("/api/user-mgrs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-mgrs/:id} : Updates an existing userMgr.
     *
     * @param id the id of the userMgr to save.
     * @param userMgr the userMgr to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userMgr,
     * or with status {@code 400 (Bad Request)} if the userMgr is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userMgr couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-mgrs/{id}")
    public ResponseEntity<UserMgr> updateUserMgr(@PathVariable(value = "id", required = false) final Long id, @RequestBody UserMgr userMgr)
        throws URISyntaxException {
        log.debug("REST request to update UserMgr : {}, {}", id, userMgr);
        if (userMgr.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userMgr.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userMgrRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserMgr result = userMgrService.save(userMgr);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userMgr.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-mgrs/:id} : Partial updates given fields of an existing userMgr, field will ignore if it is null
     *
     * @param id the id of the userMgr to save.
     * @param userMgr the userMgr to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userMgr,
     * or with status {@code 400 (Bad Request)} if the userMgr is not valid,
     * or with status {@code 404 (Not Found)} if the userMgr is not found,
     * or with status {@code 500 (Internal Server Error)} if the userMgr couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-mgrs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UserMgr> partialUpdateUserMgr(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserMgr userMgr
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserMgr partially : {}, {}", id, userMgr);
        if (userMgr.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userMgr.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userMgrRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserMgr> result = userMgrService.partialUpdate(userMgr);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userMgr.getId().toString())
        );
    }

    /**
     * {@code GET  /user-mgrs} : get all the userMgrs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userMgrs in body.
     */
    @GetMapping("/user-mgrs")
    public ResponseEntity<List<UserMgr>> getAllUserMgrs(Pageable pageable) {
        log.debug("REST request to get a page of UserMgrs");
        Page<UserMgr> page = userMgrService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-mgrs/:id} : get the "id" userMgr.
     *
     * @param id the id of the userMgr to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userMgr, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-mgrs/{id}")
    public ResponseEntity<UserMgr> getUserMgr(@PathVariable Long id) {
        log.debug("REST request to get UserMgr : {}", id);
        Optional<UserMgr> userMgr = userMgrService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userMgr);
    }

    /**
     * {@code DELETE  /user-mgrs/:id} : delete the "id" userMgr.
     *
     * @param id the id of the userMgr to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-mgrs/{id}")
    public ResponseEntity<Void> deleteUserMgr(@PathVariable Long id) {
        log.debug("REST request to delete UserMgr : {}", id);
        userMgrService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
