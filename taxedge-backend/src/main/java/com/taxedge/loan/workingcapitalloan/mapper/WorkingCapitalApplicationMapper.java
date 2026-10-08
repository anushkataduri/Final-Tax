package com.taxedge.loan.workingcapitalloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalApplicationDto;
import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalApplication;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface WorkingCapitalApplicationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    WorkingCapitalApplication toEntity(WorkingCapitalApplicationDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateFromDto(WorkingCapitalApplicationDto dto,
                       @MappingTarget WorkingCapitalApplication entity);

    WorkingCapitalApplicationDto toDto(WorkingCapitalApplication entity);
}
