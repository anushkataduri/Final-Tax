package com.taxedge.itr.filing.repository;

import com.taxedge.itr.filing.entity.ItrFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItrFilingRepository extends JpaRepository<ItrFiling, String> {
}
