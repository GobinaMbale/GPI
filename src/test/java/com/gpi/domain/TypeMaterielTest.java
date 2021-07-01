package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeMaterielTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeMateriel.class);
        TypeMateriel typeMateriel1 = new TypeMateriel();
        typeMateriel1.setId(1L);
        TypeMateriel typeMateriel2 = new TypeMateriel();
        typeMateriel2.setId(typeMateriel1.getId());
        assertThat(typeMateriel1).isEqualTo(typeMateriel2);
        typeMateriel2.setId(2L);
        assertThat(typeMateriel1).isNotEqualTo(typeMateriel2);
        typeMateriel1.setId(null);
        assertThat(typeMateriel1).isNotEqualTo(typeMateriel2);
    }
}
