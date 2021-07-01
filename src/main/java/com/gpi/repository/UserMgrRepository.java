package com.gpi.repository;

import com.gpi.domain.UserMgr;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserMgr entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserMgrRepository extends JpaRepository<UserMgr, Long> {}
