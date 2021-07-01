package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.TypeMateriel;
import com.gpi.repository.TypeMaterielRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TypeMaterielResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeMaterielResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-materiels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeMaterielRepository typeMaterielRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeMaterielMockMvc;

    private TypeMateriel typeMateriel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeMateriel createEntity(EntityManager em) {
        TypeMateriel typeMateriel = new TypeMateriel().libelle(DEFAULT_LIBELLE);
        return typeMateriel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeMateriel createUpdatedEntity(EntityManager em) {
        TypeMateriel typeMateriel = new TypeMateriel().libelle(UPDATED_LIBELLE);
        return typeMateriel;
    }

    @BeforeEach
    public void initTest() {
        typeMateriel = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeMateriel() throws Exception {
        int databaseSizeBeforeCreate = typeMaterielRepository.findAll().size();
        // Create the TypeMateriel
        restTypeMaterielMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMateriel)))
            .andExpect(status().isCreated());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeCreate + 1);
        TypeMateriel testTypeMateriel = typeMaterielList.get(typeMaterielList.size() - 1);
        assertThat(testTypeMateriel.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createTypeMaterielWithExistingId() throws Exception {
        // Create the TypeMateriel with an existing ID
        typeMateriel.setId(1L);

        int databaseSizeBeforeCreate = typeMaterielRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeMaterielMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMateriel)))
            .andExpect(status().isBadRequest());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLibelleIsRequired() throws Exception {
        int databaseSizeBeforeTest = typeMaterielRepository.findAll().size();
        // set the field null
        typeMateriel.setLibelle(null);

        // Create the TypeMateriel, which fails.

        restTypeMaterielMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMateriel)))
            .andExpect(status().isBadRequest());

        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTypeMateriels() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        // Get all the typeMaterielList
        restTypeMaterielMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeMateriel.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getTypeMateriel() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        // Get the typeMateriel
        restTypeMaterielMockMvc
            .perform(get(ENTITY_API_URL_ID, typeMateriel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeMateriel.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingTypeMateriel() throws Exception {
        // Get the typeMateriel
        restTypeMaterielMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTypeMateriel() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();

        // Update the typeMateriel
        TypeMateriel updatedTypeMateriel = typeMaterielRepository.findById(typeMateriel.getId()).get();
        // Disconnect from session so that the updates on updatedTypeMateriel are not directly saved in db
        em.detach(updatedTypeMateriel);
        updatedTypeMateriel.libelle(UPDATED_LIBELLE);

        restTypeMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeMateriel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeMateriel))
            )
            .andExpect(status().isOk());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
        TypeMateriel testTypeMateriel = typeMaterielList.get(typeMaterielList.size() - 1);
        assertThat(testTypeMateriel.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeMateriel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeMateriel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeMaterielWithPatch() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();

        // Update the typeMateriel using partial update
        TypeMateriel partialUpdatedTypeMateriel = new TypeMateriel();
        partialUpdatedTypeMateriel.setId(typeMateriel.getId());

        restTypeMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeMateriel))
            )
            .andExpect(status().isOk());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
        TypeMateriel testTypeMateriel = typeMaterielList.get(typeMaterielList.size() - 1);
        assertThat(testTypeMateriel.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateTypeMaterielWithPatch() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();

        // Update the typeMateriel using partial update
        TypeMateriel partialUpdatedTypeMateriel = new TypeMateriel();
        partialUpdatedTypeMateriel.setId(typeMateriel.getId());

        partialUpdatedTypeMateriel.libelle(UPDATED_LIBELLE);

        restTypeMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeMateriel))
            )
            .andExpect(status().isOk());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
        TypeMateriel testTypeMateriel = typeMaterielList.get(typeMaterielList.size() - 1);
        assertThat(testTypeMateriel.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeMateriel() throws Exception {
        int databaseSizeBeforeUpdate = typeMaterielRepository.findAll().size();
        typeMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeMateriel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeMateriel in the database
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeMateriel() throws Exception {
        // Initialize the database
        typeMaterielRepository.saveAndFlush(typeMateriel);

        int databaseSizeBeforeDelete = typeMaterielRepository.findAll().size();

        // Delete the typeMateriel
        restTypeMaterielMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeMateriel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeMateriel> typeMaterielList = typeMaterielRepository.findAll();
        assertThat(typeMaterielList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
