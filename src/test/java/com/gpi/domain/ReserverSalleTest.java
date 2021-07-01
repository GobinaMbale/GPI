package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReserverSalleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReserverSalle.class);
        ReserverSalle reserverSalle1 = new ReserverSalle();
        reserverSalle1.setId(1L);
        ReserverSalle reserverSalle2 = new ReserverSalle();
        reserverSalle2.setId(reserverSalle1.getId());
        assertThat(reserverSalle1).isEqualTo(reserverSalle2);
        reserverSalle2.setId(2L);
        assertThat(reserverSalle1).isNotEqualTo(reserverSalle2);
        reserverSalle1.setId(null);
        assertThat(reserverSalle1).isNotEqualTo(reserverSalle2);
    }
}
