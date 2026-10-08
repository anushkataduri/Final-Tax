package com.taxedge.loan.homeloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.homeloan.dto.HomeLoanApplicationDto;
import com.taxedge.loan.homeloan.entity.HomeLoanApplication;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface HomeLoanApplicationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    HomeLoanApplication toEntity(HomeLoanApplicationDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateFromDto(HomeLoanApplicationDto dto, @MappingTarget HomeLoanApplication entity);

    HomeLoanApplicationDto toDto(HomeLoanApplication entity);
}
