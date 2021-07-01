package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.ReserverSalle;
import com.gpi.repository.ReserverSalleRepository;
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
 * Integration tests for the {@link ReserverSalleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReserverSalleResourceIT {

    private static final Instant DEFAULT_DATE_RESERVATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_RESERVATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_MOTIF = "AAAAAAAAAA";
    private static final String UPDATED_MOTIF = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reserver-salles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReserverSalleRepository reserverSalleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReserverSalleMockMvc;

    private ReserverSalle reserverSalle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReserverSalle createEntity(EntityManager em) {
        ReserverSalle reserverSalle = new ReserverSalle().dateReservation(DEFAULT_DATE_RESERVATION).motif(DEFAULT_MOTIF);
        return reserverSalle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReserverSalle createUpdatedEntity(EntityManager em) {
        ReserverSalle reserverSalle = new ReserverSalle().dateReservation(UPDATED_DATE_RESERVATION).motif(UPDATED_MOTIF);
        return reserverSalle;
    }

    @BeforeEach
    public void initTest() {
        reserverSalle = createEntity(em);
    }

    @Test
    @Transactional
    void createReserverSalle() throws Exception {
        int databaseSizeBeforeCreate = reserverSalleRepository.findAll().size();
        // Create the ReserverSalle
        restReserverSalleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverSalle)))
            .andExpect(status().isCreated());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeCreate + 1);
        ReserverSalle testReserverSalle = reserverSalleList.get(reserverSalleList.size() - 1);
        assertThat(testReserverSalle.getDateReservation()).isEqualTo(DEFAULT_DATE_RESERVATION);
        assertThat(testReserverSalle.getMotif()).isEqualTo(DEFAULT_MOTIF);
    }

    @Test
    @Transactional
    void createReserverSalleWithExistingId() throws Exception {
        // Create the ReserverSalle with an existing ID
        reserverSalle.setId(1L);

        int databaseSizeBeforeCreate = reserverSalleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReserverSalleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverSalle)))
            .andExpect(status().isBadRequest());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateReservationIsRequired() throws Exception {
        int databaseSizeBeforeTest = reserverSalleRepository.findAll().size();
        // set the field null
        reserverSalle.setDateReservation(null);

        // Create the ReserverSalle, which fails.

        restReserverSalleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverSalle)))
            .andExpect(status().isBadRequest());

        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMotifIsRequired() throws Exception {
        int databaseSizeBeforeTest = reserverSalleRepository.findAll().size();
        // set the field null
        reserverSalle.setMotif(null);

        // Create the ReserverSalle, which fails.

        restReserverSalleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverSalle)))
            .andExpect(status().isBadRequest());

        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReserverSalles() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        // Get all the reserverSalleList
        restReserverSalleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reserverSalle.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateReservation").value(hasItem(DEFAULT_DATE_RESERVATION.toString())))
            .andExpect(jsonPath("$.[*].motif").value(hasItem(DEFAULT_MOTIF)));
    }

    @Test
    @Transactional
    void getReserverSalle() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        // Get the reserverSalle
        restReserverSalleMockMvc
            .perform(get(ENTITY_API_URL_ID, reserverSalle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reserverSalle.getId().intValue()))
            .andExpect(jsonPath("$.dateReservation").value(DEFAULT_DATE_RESERVATION.toString()))
            .andExpect(jsonPath("$.motif").value(DEFAULT_MOTIF));
    }

    @Test
    @Transactional
    void getNonExistingReserverSalle() throws Exception {
        // Get the reserverSalle
        restReserverSalleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewReserverSalle() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();

        // Update the reserverSalle
        ReserverSalle updatedReserverSalle = reserverSalleRepository.findById(reserverSalle.getId()).get();
        // Disconnect from session so that the updates on updatedReserverSalle are not directly saved in db
        em.detach(updatedReserverSalle);
        updatedReserverSalle.dateReservation(UPDATED_DATE_RESERVATION).motif(UPDATED_MOTIF);

        restReserverSalleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReserverSalle.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReserverSalle))
            )
            .andExpect(status().isOk());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
        ReserverSalle testReserverSalle = reserverSalleList.get(reserverSalleList.size() - 1);
        assertThat(testReserverSalle.getDateReservation()).isEqualTo(UPDATED_DATE_RESERVATION);
        assertThat(testReserverSalle.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void putNonExistingReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reserverSalle.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reserverSalle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reserverSalle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reserverSalle)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReserverSalleWithPatch() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();

        // Update the reserverSalle using partial update
        ReserverSalle partialUpdatedReserverSalle = new ReserverSalle();
        partialUpdatedReserverSalle.setId(reserverSalle.getId());

        partialUpdatedReserverSalle.dateReservation(UPDATED_DATE_RESERVATION).motif(UPDATED_MOTIF);

        restReserverSalleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReserverSalle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReserverSalle))
            )
            .andExpect(status().isOk());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
        ReserverSalle testReserverSalle = reserverSalleList.get(reserverSalleList.size() - 1);
        assertThat(testReserverSalle.getDateReservation()).isEqualTo(UPDATED_DATE_RESERVATION);
        assertThat(testReserverSalle.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void fullUpdateReserverSalleWithPatch() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();

        // Update the reserverSalle using partial update
        ReserverSalle partialUpdatedReserverSalle = new ReserverSalle();
        partialUpdatedReserverSalle.setId(reserverSalle.getId());

        partialUpdatedReserverSalle.dateReservation(UPDATED_DATE_RESERVATION).motif(UPDATED_MOTIF);

        restReserverSalleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReserverSalle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReserverSalle))
            )
            .andExpect(status().isOk());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
        ReserverSalle testReserverSalle = reserverSalleList.get(reserverSalleList.size() - 1);
        assertThat(testReserverSalle.getDateReservation()).isEqualTo(UPDATED_DATE_RESERVATION);
        assertThat(testReserverSalle.getMotif()).isEqualTo(UPDATED_MOTIF);
    }

    @Test
    @Transactional
    void patchNonExistingReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reserverSalle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reserverSalle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reserverSalle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReserverSalle() throws Exception {
        int databaseSizeBeforeUpdate = reserverSalleRepository.findAll().size();
        reserverSalle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReserverSalleMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(reserverSalle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReserverSalle in the database
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReserverSalle() throws Exception {
        // Initialize the database
        reserverSalleRepository.saveAndFlush(reserverSalle);

        int databaseSizeBeforeDelete = reserverSalleRepository.findAll().size();

        // Delete the reserverSalle
        restReserverSalleMockMvc
            .perform(delete(ENTITY_API_URL_ID, reserverSalle.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ReserverSalle> reserverSalleList = reserverSalleRepository.findAll();
        assertThat(reserverSalleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
