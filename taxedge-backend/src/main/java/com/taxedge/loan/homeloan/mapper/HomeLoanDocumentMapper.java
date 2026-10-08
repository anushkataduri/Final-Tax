package com.taxedge.loan.homeloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.homeloan.dto.HomeLoanDocumentDto;
import com.taxedge.loan.homeloan.entity.HomeLoanDocument;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface HomeLoanDocumentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "homeLoanApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    HomeLoanDocument toEntity(HomeLoanDocumentDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "homeLoanApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateFromDto(HomeLoanDocumentDto dto, @MappingTarget HomeLoanDocument entity);

    HomeLoanDocumentDto toDto(HomeLoanDocument entity);
}
