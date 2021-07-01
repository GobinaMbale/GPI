package com.gpi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gpi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserMgrTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserMgr.class);
        UserMgr userMgr1 = new UserMgr();
        userMgr1.setId(1L);
        UserMgr userMgr2 = new UserMgr();
        userMgr2.setId(userMgr1.getId());
        assertThat(userMgr1).isEqualTo(userMgr2);
        userMgr2.setId(2L);
        assertThat(userMgr1).isNotEqualTo(userMgr2);
        userMgr1.setId(null);
        assertThat(userMgr1).isNotEqualTo(userMgr2);
    }
}
