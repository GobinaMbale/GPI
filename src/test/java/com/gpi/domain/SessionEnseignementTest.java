package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SessionEnseignementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SessionEnseignement.class);
        SessionEnseignement sessionEnseignement1 = new SessionEnseignement();
        sessionEnseignement1.setId(1L);
        SessionEnseignement sessionEnseignement2 = new SessionEnseignement();
        sessionEnseignement2.setId(sessionEnseignement1.getId());
        assertThat(sessionEnseignement1).isEqualTo(sessionEnseignement2);
        sessionEnseignement2.setId(2L);
        assertThat(sessionEnseignement1).isNotEqualTo(sessionEnseignement2);
        sessionEnseignement1.setId(null);
        assertThat(sessionEnseignement1).isNotEqualTo(sessionEnseignement2);
    }
}
