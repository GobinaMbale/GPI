package com.gpi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gpi.IntegrationTest;
import com.gpi.domain.UserMgr;
import com.gpi.domain.enumeration.TypeEnseignant;
import com.gpi.repository.UserMgrRepository;
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
 * Integration tests for the {@link UserMgrResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserMgrResourceIT {

    private static final TypeEnseignant DEFAULT_TYPE = TypeEnseignant.PERMANENT;
    private static final TypeEnseignant UPDATED_TYPE = TypeEnseignant.VACATAIRE;

    private static final Integer DEFAULT_QUOTA_HORAIRE = 1;
    private static final Integer UPDATED_QUOTA_HORAIRE = 2;

    private static final String ENTITY_API_URL = "/api/user-mgrs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserMgrRepository userMgrRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserMgrMockMvc;

    private UserMgr userMgr;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMgr createEntity(EntityManager em) {
        UserMgr userMgr = new UserMgr().type(DEFAULT_TYPE).quotaHoraire(DEFAULT_QUOTA_HORAIRE);
        return userMgr;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMgr createUpdatedEntity(EntityManager em) {
        UserMgr userMgr = new UserMgr().type(UPDATED_TYPE).quotaHoraire(UPDATED_QUOTA_HORAIRE);
        return userMgr;
    }

    @BeforeEach
    public void initTest() {
        userMgr = createEntity(em);
    }

    @Test
    @Transactional
    void createUserMgr() throws Exception {
        int databaseSizeBeforeCreate = userMgrRepository.findAll().size();
        // Create the UserMgr
        restUserMgrMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMgr)))
            .andExpect(status().isCreated());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeCreate + 1);
        UserMgr testUserMgr = userMgrList.get(userMgrList.size() - 1);
        assertThat(testUserMgr.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testUserMgr.getQuotaHoraire()).isEqualTo(DEFAULT_QUOTA_HORAIRE);
    }

    @Test
    @Transactional
    void createUserMgrWithExistingId() throws Exception {
        // Create the UserMgr with an existing ID
        userMgr.setId(1L);

        int databaseSizeBeforeCreate = userMgrRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMgrMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMgr)))
            .andExpect(status().isBadRequest());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserMgrs() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        // Get all the userMgrList
        restUserMgrMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userMgr.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].quotaHoraire").value(hasItem(DEFAULT_QUOTA_HORAIRE)));
    }

    @Test
    @Transactional
    void getUserMgr() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        // Get the userMgr
        restUserMgrMockMvc
            .perform(get(ENTITY_API_URL_ID, userMgr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userMgr.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.quotaHoraire").value(DEFAULT_QUOTA_HORAIRE));
    }

    @Test
    @Transactional
    void getNonExistingUserMgr() throws Exception {
        // Get the userMgr
        restUserMgrMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserMgr() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();

        // Update the userMgr
        UserMgr updatedUserMgr = userMgrRepository.findById(userMgr.getId()).get();
        // Disconnect from session so that the updates on updatedUserMgr are not directly saved in db
        em.detach(updatedUserMgr);
        updatedUserMgr.type(UPDATED_TYPE).quotaHoraire(UPDATED_QUOTA_HORAIRE);

        restUserMgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserMgr.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserMgr))
            )
            .andExpect(status().isOk());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
        UserMgr testUserMgr = userMgrList.get(userMgrList.size() - 1);
        assertThat(testUserMgr.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUserMgr.getQuotaHoraire()).isEqualTo(UPDATED_QUOTA_HORAIRE);
    }

    @Test
    @Transactional
    void putNonExistingUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userMgr.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMgr)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserMgrWithPatch() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();

        // Update the userMgr using partial update
        UserMgr partialUpdatedUserMgr = new UserMgr();
        partialUpdatedUserMgr.setId(userMgr.getId());

        partialUpdatedUserMgr.quotaHoraire(UPDATED_QUOTA_HORAIRE);

        restUserMgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMgr))
            )
            .andExpect(status().isOk());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
        UserMgr testUserMgr = userMgrList.get(userMgrList.size() - 1);
        assertThat(testUserMgr.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testUserMgr.getQuotaHoraire()).isEqualTo(UPDATED_QUOTA_HORAIRE);
    }

    @Test
    @Transactional
    void fullUpdateUserMgrWithPatch() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();

        // Update the userMgr using partial update
        UserMgr partialUpdatedUserMgr = new UserMgr();
        partialUpdatedUserMgr.setId(userMgr.getId());

        partialUpdatedUserMgr.type(UPDATED_TYPE).quotaHoraire(UPDATED_QUOTA_HORAIRE);

        restUserMgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMgr))
            )
            .andExpect(status().isOk());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
        UserMgr testUserMgr = userMgrList.get(userMgrList.size() - 1);
        assertThat(testUserMgr.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUserMgr.getQuotaHoraire()).isEqualTo(UPDATED_QUOTA_HORAIRE);
    }

    @Test
    @Transactional
    void patchNonExistingUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userMgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserMgr() throws Exception {
        int databaseSizeBeforeUpdate = userMgrRepository.findAll().size();
        userMgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMgrMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userMgr)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMgr in the database
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserMgr() throws Exception {
        // Initialize the database
        userMgrRepository.saveAndFlush(userMgr);

        int databaseSizeBeforeDelete = userMgrRepository.findAll().size();

        // Delete the userMgr
        restUserMgrMockMvc
            .perform(delete(ENTITY_API_URL_ID, userMgr.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserMgr> userMgrList = userMgrRepository.findAll();
        assertThat(userMgrList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
