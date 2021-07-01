package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReserverMaterielTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReserverMateriel.class);
        ReserverMateriel reserverMateriel1 = new ReserverMateriel();
        reserverMateriel1.setId(1L);
        ReserverMateriel reserverMateriel2 = new ReserverMateriel();
        reserverMateriel2.setId(reserverMateriel1.getId());
        assertThat(reserverMateriel1).isEqualTo(reserverMateriel2);
        reserverMateriel2.setId(2L);
        assertThat(reserverMateriel1).isNotEqualTo(reserverMateriel2);
        reserverMateriel1.setId(null);
        assertThat(reserverMateriel1).isNotEqualTo(reserverMateriel2);
    }
}
