package com.taxedge.loan.workingcapitalloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalDocumentDto;
import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalDocument;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface WorkingCapitalDocumentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workingCapitalApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    WorkingCapitalDocument toEntity(WorkingCapitalDocumentDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workingCapitalApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateFromDto(WorkingCapitalDocumentDto dto,
                       @MappingTarget WorkingCapitalDocument entity);

    WorkingCapitalDocumentDto toDto(WorkingCapitalDocument entity);
}
