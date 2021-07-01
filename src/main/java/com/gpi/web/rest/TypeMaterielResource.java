package com.gpi.web.rest;

import com.gpi.domain.TypeMateriel;
import com.gpi.repository.TypeMaterielRepository;
import com.gpi.service.TypeMaterielService;
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
 * REST controller for managing {@link com.gpi.domain.TypeMateriel}.
 */
@RestController
@RequestMapping("/api")
public class TypeMaterielResource {

    private final Logger log = LoggerFactory.getLogger(TypeMaterielResource.class);

    private static final String ENTITY_NAME = "typeMateriel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeMaterielService typeMaterielService;

    private final TypeMaterielRepository typeMaterielRepository;

    public TypeMaterielResource(TypeMaterielService typeMaterielService, TypeMaterielRepository typeMaterielRepository) {
        this.typeMaterielService = typeMaterielService;
        this.typeMaterielRepository = typeMaterielRepository;
    }

    /**
     * {@code POST  /type-materiels} : Create a new typeMateriel.
     *
     * @param typeMateriel the typeMateriel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeMateriel, or with status {@code 400 (Bad Request)} if the typeMateriel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-materiels")
    public ResponseEntity<TypeMateriel> createTypeMateriel(@Valid @RequestBody TypeMateriel typeMateriel) throws URISyntaxException {
        log.debug("REST request to save TypeMateriel : {}", typeMateriel);
        if (typeMateriel.getId() != null) {
            throw new BadRequestAlertException("A new typeMateriel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeMateriel result = typeMaterielService.save(typeMateriel);
        return ResponseEntity
            .created(new URI("/api/type-materiels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-materiels/:id} : Updates an existing typeMateriel.
     *
     * @param id the id of the typeMateriel to save.
     * @param typeMateriel the typeMateriel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeMateriel,
     * or with status {@code 400 (Bad Request)} if the typeMateriel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeMateriel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-materiels/{id}")
    public ResponseEntity<TypeMateriel> updateTypeMateriel(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TypeMateriel typeMateriel
    ) throws URISyntaxException {
        log.debug("REST request to update TypeMateriel : {}, {}", id, typeMateriel);
        if (typeMateriel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeMateriel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeMaterielRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeMateriel result = typeMaterielService.save(typeMateriel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeMateriel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-materiels/:id} : Partial updates given fields of an existing typeMateriel, field will ignore if it is null
     *
     * @param id the id of the typeMateriel to save.
     * @param typeMateriel the typeMateriel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeMateriel,
     * or with status {@code 400 (Bad Request)} if the typeMateriel is not valid,
     * or with status {@code 404 (Not Found)} if the typeMateriel is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeMateriel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-materiels/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<TypeMateriel> partialUpdateTypeMateriel(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TypeMateriel typeMateriel
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeMateriel partially : {}, {}", id, typeMateriel);
        if (typeMateriel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeMateriel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeMaterielRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeMateriel> result = typeMaterielService.partialUpdate(typeMateriel);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeMateriel.getId().toString())
        );
    }

    /**
     * {@code GET  /type-materiels} : get all the typeMateriels.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeMateriels in body.
     */
    @GetMapping("/type-materiels")
    public ResponseEntity<List<TypeMateriel>> getAllTypeMateriels(Pageable pageable) {
        log.debug("REST request to get a page of TypeMateriels");
        Page<TypeMateriel> page = typeMaterielService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /type-materiels/:id} : get the "id" typeMateriel.
     *
     * @param id the id of the typeMateriel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeMateriel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-materiels/{id}")
    public ResponseEntity<TypeMateriel> getTypeMateriel(@PathVariable Long id) {
        log.debug("REST request to get TypeMateriel : {}", id);
        Optional<TypeMateriel> typeMateriel = typeMaterielService.findOne(id);
        return ResponseUtil.wrapOrNotFound(typeMateriel);
    }

    /**
     * {@code DELETE  /type-materiels/:id} : delete the "id" typeMateriel.
     *
     * @param id the id of the typeMateriel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-materiels/{id}")
    public ResponseEntity<Void> deleteTypeMateriel(@PathVariable Long id) {
        log.debug("REST request to delete TypeMateriel : {}", id);
        typeMaterielService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
