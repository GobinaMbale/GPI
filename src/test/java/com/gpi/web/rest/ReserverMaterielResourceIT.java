package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.ReserverMateriel;
import com.gpi.repository.ReserverMaterielRepository;
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
 * Integration tests for the {@link ReserverMaterielResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReserverMaterielResourceIT {

    private static final Instant DEFAULT_DATE_RESERVATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_RESERVATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_RETOUR = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_RETOUR = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/reserver-materiels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReserverMaterielRepository reserverMaterielRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReserverMaterielMockMvc;

    private ReserverMateriel reserverMateriel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReserverMateriel createEntity(EntityManager em) {
        ReserverMateriel reserverMateriel = new ReserverMateriel()
            .dateReservation(DEFAULT_DATE_RESERVATION)
            .dateRetour(DEFAULT_DATE_RETOUR);
        return reserverMateriel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReserverMateriel createUpdatedEntity(EntityManager em) {
        ReserverMateriel reserverMateriel = new ReserverMateriel()
            .dateReservation(UPDATED_DATE_RESERVATION)
            .dateRetour(UPDATED_DATE_RETOUR);
        return reserverMateriel;
    }

    @BeforeEach
    public void initTest() {
        reserverMateriel = createEntity(em);
    }

    @Test
    @Transactional
    void createReserverMateriel() throws Exception {
        int databaseSizeBeforeCreate = reserverMaterielRepository.findAll().size();
        // Create the ReserverMateriel
        restReserverMaterielMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isCreated());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeCreate + 1);
        ReserverMateriel testReserverMateriel = reserverMaterielList.get(reserverMaterielList.size() - 1);
        assertThat(testReserverMateriel.getDateReservation()).isEqualTo(DEFAULT_DATE_RESERVATION);
        assertThat(testReserverMateriel.getDateRetour()).isEqualTo(DEFAULT_DATE_RETOUR);
    }

    @Test
    @Transactional
    void createReserverMaterielWithExistingId() throws Exception {
        // Create the ReserverMateriel with an existing ID
        reserverMateriel.setId(1L);

        int databaseSizeBeforeCreate = reserverMaterielRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReserverMaterielMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReserverMateriels() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        // Get all the reserverMaterielList
        restReserverMaterielMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reserverMateriel.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateReservation").value(hasItem(DEFAULT_DATE_RESERVATION.toString())))
            .andExpect(jsonPath("$.[*].dateRetour").value(hasItem(DEFAULT_DATE_RETOUR.toString())));
    }

    @Test
    @Transactional
    void getReserverMateriel() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        // Get the reserverMateriel
        restReserverMaterielMockMvc
            .perform(get(ENTITY_API_URL_ID, reserverMateriel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reserverMateriel.getId().intValue()))
            .andExpect(jsonPath("$.dateReservation").value(DEFAULT_DATE_RESERVATION.toString()))
            .andExpect(jsonPath("$.dateRetour").value(DEFAULT_DATE_RETOUR.toString()));
    }

    @Test
    @Transactional
    void getNonExistingReserverMateriel() throws Exception {
        // Get the reserverMateriel
        restReserverMaterielMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewReserverMateriel() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();

        // Update the reserverMateriel
        ReserverMateriel updatedReserverMateriel = reserverMaterielRepository.findById(reserverMateriel.getId()).get();
        // Disconnect from session so that the updates on updatedReserverMateriel are not directly saved in db
        em.detach(updatedReserverMateriel);
        updatedReserverMateriel.dateReservation(UPDATED_DATE_RESERVATION).dateRetour(UPDATED_DATE_RETOUR);

        restReserverMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReserverMateriel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReserverMateriel))
            )
            .andExpect(status().isOk());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
        ReserverMateriel testReserverMateriel = reserverMaterielList.get(reserverMaterielList.size() - 1);
        assertThat(testReserverMateriel.getDateReservation()).isEqualTo(UPDATED_DATE_RESERVATION);
        assertThat(testReserverMateriel.getDateRetour()).isEqualTo(UPDATED_DATE_RETOUR);
    }

    @Test
    @Transactional
    void putNonExistingReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reserverMateriel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReserverMaterielWithPatch() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();

        // Update the reserverMateriel using partial update
        ReserverMateriel partialUpdatedReserverMateriel = new ReserverMateriel();
        partialUpdatedReserverMateriel.setId(reserverMateriel.getId());

        partialUpdatedReserverMateriel.dateRetour(UPDATED_DATE_RETOUR);

        restReserverMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReserverMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReserverMateriel))
            )
            .andExpect(status().isOk());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
        ReserverMateriel testReserverMateriel = reserverMaterielList.get(reserverMaterielList.size() - 1);
        assertThat(testReserverMateriel.getDateReservation()).isEqualTo(DEFAULT_DATE_RESERVATION);
        assertThat(testReserverMateriel.getDateRetour()).isEqualTo(UPDATED_DATE_RETOUR);
    }

    @Test
    @Transactional
    void fullUpdateReserverMaterielWithPatch() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();

        // Update the reserverMateriel using partial update
        ReserverMateriel partialUpdatedReserverMateriel = new ReserverMateriel();
        partialUpdatedReserverMateriel.setId(reserverMateriel.getId());

        partialUpdatedReserverMateriel.dateReservation(UPDATED_DATE_RESERVATION).dateRetour(UPDATED_DATE_RETOUR);

        restReserverMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReserverMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReserverMateriel))
            )
            .andExpect(status().isOk());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
        ReserverMateriel testReserverMateriel = reserverMaterielList.get(reserverMaterielList.size() - 1);
        assertThat(testReserverMateriel.getDateReservation()).isEqualTo(UPDATED_DATE_RESERVATION);
        assertThat(testReserverMateriel.getDateRetour()).isEqualTo(UPDATED_DATE_RETOUR);
    }

    @Test
    @Transactional
    void patchNonExistingReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reserverMateriel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReserverMateriel() throws Exception {
        int databaseSizeBeforeUpdate = reserverMaterielRepository.findAll().size();
        reserverMateriel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverMaterielMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reserverMateriel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReserverMateriel in the database
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReserverMateriel() throws Exception {
        // Initialize the database
        reserverMaterielRepository.saveAndFlush(reserverMateriel);

        int databaseSizeBeforeDelete = reserverMaterielRepository.findAll().size();

        // Delete the reserverMateriel
        restReserverMaterielMockMvc
            .perform(delete(ENTITY_API_URL_ID, reserverMateriel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ReserverMateriel> reserverMaterielList = reserverMaterielRepository.findAll();
        assertThat(reserverMaterielList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
