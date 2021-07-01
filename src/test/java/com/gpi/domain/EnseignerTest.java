package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnseignerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enseigner.class);
        Enseigner enseigner1 = new Enseigner();
        enseigner1.setId(1L);
        Enseigner enseigner2 = new Enseigner();
        enseigner2.setId(enseigner1.getId());
        assertThat(enseigner1).isEqualTo(enseigner2);
        enseigner2.setId(2L);
        assertThat(enseigner1).isNotEqualTo(enseigner2);
        enseigner1.setId(null);
        assertThat(enseigner1).isNotEqualTo(enseigner2);
    }
}
