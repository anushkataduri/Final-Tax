package com.taxedge.loan.personalloan.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.loan.personalloan.dto.PersonalLoanDocumentDto;
import com.taxedge.loan.personalloan.entity.PersonalLoanDocument;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface PersonalLoanDocumentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loanApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    PersonalLoanDocument toEntity(PersonalLoanDocumentDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loanApplication", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateFromDto(PersonalLoanDocumentDto dto, @MappingTarget PersonalLoanDocument entity);

    @Mapping(target = "loanApplicationId", source = "loanApplication.id")
    PersonalLoanDocumentDto toDto(PersonalLoanDocument entity);
}
