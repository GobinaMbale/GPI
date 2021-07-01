package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.SessionEnseignement;
import com.gpi.repository.SessionEnseignementRepository;
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
 * Integration tests for the {@link SessionEnseignementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SessionEnseignementResourceIT {

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/session-enseignements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SessionEnseignementRepository sessionEnseignementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSessionEnseignementMockMvc;

    private SessionEnseignement sessionEnseignement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SessionEnseignement createEntity(EntityManager em) {
        SessionEnseignement sessionEnseignement = new SessionEnseignement().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return sessionEnseignement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SessionEnseignement createUpdatedEntity(EntityManager em) {
        SessionEnseignement sessionEnseignement = new SessionEnseignement().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return sessionEnseignement;
    }

    @BeforeEach
    public void initTest() {
        sessionEnseignement = createEntity(em);
    }

    @Test
    @Transactional
    void createSessionEnseignement() throws Exception {
        int databaseSizeBeforeCreate = sessionEnseignementRepository.findAll().size();
        // Create the SessionEnseignement
        restSessionEnseignementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isCreated());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeCreate + 1);
        SessionEnseignement testSessionEnseignement = sessionEnseignementList.get(sessionEnseignementList.size() - 1);
        assertThat(testSessionEnseignement.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testSessionEnseignement.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createSessionEnseignementWithExistingId() throws Exception {
        // Create the SessionEnseignement with an existing ID
        sessionEnseignement.setId(1L);

        int databaseSizeBeforeCreate = sessionEnseignementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSessionEnseignementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = sessionEnseignementRepository.findAll().size();
        // set the field null
        sessionEnseignement.setDateDebut(null);

        // Create the SessionEnseignement, which fails.

        restSessionEnseignementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateFinIsRequired() throws Exception {
        int databaseSizeBeforeTest = sessionEnseignementRepository.findAll().size();
        // set the field null
        sessionEnseignement.setDateFin(null);

        // Create the SessionEnseignement, which fails.

        restSessionEnseignementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSessionEnseignements() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        // Get all the sessionEnseignementList
        restSessionEnseignementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sessionEnseignement.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getSessionEnseignement() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        // Get the sessionEnseignement
        restSessionEnseignementMockMvc
            .perform(get(ENTITY_API_URL_ID, sessionEnseignement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sessionEnseignement.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSessionEnseignement() throws Exception {
        // Get the sessionEnseignement
        restSessionEnseignementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSessionEnseignement() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();

        // Update the sessionEnseignement
        SessionEnseignement updatedSessionEnseignement = sessionEnseignementRepository.findById(sessionEnseignement.getId()).get();
        // Disconnect from session so that the updates on updatedSessionEnseignement are not directly saved in db
        em.detach(updatedSessionEnseignement);
        updatedSessionEnseignement.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restSessionEnseignementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSessionEnseignement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSessionEnseignement))
            )
            .andExpect(status().isOk());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
        SessionEnseignement testSessionEnseignement = sessionEnseignementList.get(sessionEnseignementList.size() - 1);
        assertThat(testSessionEnseignement.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testSessionEnseignement.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sessionEnseignement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSessionEnseignementWithPatch() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();

        // Update the sessionEnseignement using partial update
        SessionEnseignement partialUpdatedSessionEnseignement = new SessionEnseignement();
        partialUpdatedSessionEnseignement.setId(sessionEnseignement.getId());

        partialUpdatedSessionEnseignement.dateFin(UPDATED_DATE_FIN);

        restSessionEnseignementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSessionEnseignement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSessionEnseignement))
            )
            .andExpect(status().isOk());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
        SessionEnseignement testSessionEnseignement = sessionEnseignementList.get(sessionEnseignementList.size() - 1);
        assertThat(testSessionEnseignement.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testSessionEnseignement.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateSessionEnseignementWithPatch() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();

        // Update the sessionEnseignement using partial update
        SessionEnseignement partialUpdatedSessionEnseignement = new SessionEnseignement();
        partialUpdatedSessionEnseignement.setId(sessionEnseignement.getId());

        partialUpdatedSessionEnseignement.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restSessionEnseignementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSessionEnseignement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSessionEnseignement))
            )
            .andExpect(status().isOk());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
        SessionEnseignement testSessionEnseignement = sessionEnseignementList.get(sessionEnseignementList.size() - 1);
        assertThat(testSessionEnseignement.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testSessionEnseignement.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sessionEnseignement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSessionEnseignement() throws Exception {
        int databaseSizeBeforeUpdate = sessionEnseignementRepository.findAll().size();
        sessionEnseignement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionEnseignementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionEnseignement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SessionEnseignement in the database
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSessionEnseignement() throws Exception {
        // Initialize the database
        sessionEnseignementRepository.saveAndFlush(sessionEnseignement);

        int databaseSizeBeforeDelete = sessionEnseignementRepository.findAll().size();

        // Delete the sessionEnseignement
        restSessionEnseignementMockMvc
            .perform(delete(ENTITY_API_URL_ID, sessionEnseignement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SessionEnseignement> sessionEnseignementList = sessionEnseignementRepository.findAll();
        assertThat(sessionEnseignementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
