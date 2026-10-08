package com.taxedge.loan.vehicleloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.vehicleloan.dto.VehicleLoanApplicationDto;
import com.taxedge.loan.vehicleloan.entity.VehicleLoanApplication;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface VehicleLoanApplicationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    VehicleLoanApplication toEntity(VehicleLoanApplicationDto dto);

    VehicleLoanApplicationDto toDto(VehicleLoanApplication entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(VehicleLoanApplicationDto dto, @MappingTarget VehicleLoanApplication entity);
}
