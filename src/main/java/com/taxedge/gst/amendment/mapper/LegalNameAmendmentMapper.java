package com.taxedge.gst.amendment.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.taxedge.gst.amendment.dto.LegalNameAmendmentViewDto;
import com.taxedge.gst.amendment.entity.LegalNameAmendmentEntity;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LegalNameAmendmentMapper {

    @Mapping(target = "customerId", source = "customer.custId")
    @Mapping(target = "businessGstId", source = "gstNumber")
    LegalNameAmendmentViewDto toDto(LegalNameAmendmentEntity entity);

    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "gstNumber", expression = "java(dto.getGstNumber() != null && !dto.getGstNumber().isEmpty() ? dto.getGstNumber() : dto.getBusinessGstId())")
    LegalNameAmendmentEntity toEntity(LegalNameAmendmentViewDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "gstNumber", ignore = true)
    void updateEntity(LegalNameAmendmentViewDto dto, @MappingTarget LegalNameAmendmentEntity entity);
}
