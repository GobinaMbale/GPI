package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.Enseigner;
import com.gpi.repository.EnseignerRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link EnseignerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EnseignerResourceIT {

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/enseigners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EnseignerRepository enseignerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEnseignerMockMvc;

    private Enseigner enseigner;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Enseigner createEntity(EntityManager em) {
        Enseigner enseigner = new Enseigner().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return enseigner;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Enseigner createUpdatedEntity(EntityManager em) {
        Enseigner enseigner = new Enseigner().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return enseigner;
    }

    @BeforeEach
    public void initTest() {
        enseigner = createEntity(em);
    }

    @Test
    @Transactional
    void createEnseigner() throws Exception {
        int databaseSizeBeforeCreate = enseignerRepository.findAll().size();
        // Create the Enseigner
        restEnseignerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(enseigner)))
            .andExpect(status().isCreated());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeCreate + 1);
        Enseigner testEnseigner = enseignerList.get(enseignerList.size() - 1);
        assertThat(testEnseigner.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testEnseigner.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createEnseignerWithExistingId() throws Exception {
        // Create the Enseigner with an existing ID
        enseigner.setId(1L);

        int databaseSizeBeforeCreate = enseignerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEnseignerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(enseigner)))
            .andExpect(status().isBadRequest());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = enseignerRepository.findAll().size();
        // set the field null
        enseigner.setDateDebut(null);

        // Create the Enseigner, which fails.

        restEnseignerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(enseigner)))
            .andExpect(status().isBadRequest());

        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateFinIsRequired() throws Exception {
        int databaseSizeBeforeTest = enseignerRepository.findAll().size();
        // set the field null
        enseigner.setDateFin(null);

        // Create the Enseigner, which fails.

        restEnseignerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(enseigner)))
            .andExpect(status().isBadRequest());

        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEnseigners() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        // Get all the enseignerList
        restEnseignerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(enseigner.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getEnseigner() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        // Get the enseigner
        restEnseignerMockMvc
            .perform(get(ENTITY_API_URL_ID, enseigner.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(enseigner.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEnseigner() throws Exception {
        // Get the enseigner
        restEnseignerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEnseigner() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();

        // Update the enseigner
        Enseigner updatedEnseigner = enseignerRepository.findById(enseigner.getId()).get();
        // Disconnect from session so that the updates on updatedEnseigner are not directly saved in db
        em.detach(updatedEnseigner);
        updatedEnseigner.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restEnseignerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEnseigner.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEnseigner))
            )
            .andExpect(status().isOk());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
        Enseigner testEnseigner = enseignerList.get(enseignerList.size() - 1);
        assertThat(testEnseigner.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testEnseigner.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, enseigner.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(enseigner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(enseigner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(enseigner)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEnseignerWithPatch() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();

        // Update the enseigner using partial update
        Enseigner partialUpdatedEnseigner = new Enseigner();
        partialUpdatedEnseigner.setId(enseigner.getId());

        partialUpdatedEnseigner.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restEnseignerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnseigner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEnseigner))
            )
            .andExpect(status().isOk());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
        Enseigner testEnseigner = enseignerList.get(enseignerList.size() - 1);
        assertThat(testEnseigner.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testEnseigner.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateEnseignerWithPatch() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();

        // Update the enseigner using partial update
        Enseigner partialUpdatedEnseigner = new Enseigner();
        partialUpdatedEnseigner.setId(enseigner.getId());

        partialUpdatedEnseigner.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restEnseignerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnseigner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEnseigner))
            )
            .andExpect(status().isOk());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
        Enseigner testEnseigner = enseignerList.get(enseignerList.size() - 1);
        assertThat(testEnseigner.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testEnseigner.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, enseigner.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(enseigner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(enseigner))
            )
            .andExpect(status().isBadRequest());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEnseigner() throws Exception {
        int databaseSizeBeforeUpdate = enseignerRepository.findAll().size();
        enseigner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnseignerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(enseigner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Enseigner in the database
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEnseigner() throws Exception {
        // Initialize the database
        enseignerRepository.saveAndFlush(enseigner);

        int databaseSizeBeforeDelete = enseignerRepository.findAll().size();

        // Delete the enseigner
        restEnseignerMockMvc
            .perform(delete(ENTITY_API_URL_ID, enseigner.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Enseigner> enseignerList = enseignerRepository.findAll();
        assertThat(enseignerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
