package com.taxedge.gst.filing.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import org.mapstruct.NullValuePropertyMappingStrategy;

import com.taxedge.gst.filing.dto.GstFilingDto;
import com.taxedge.gst.filing.entity.GstFiling;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GstFilingMapper {

    @Mapping(target = "gstfilingId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    GstFiling toEntity(GstFilingDto dto);

    @Mapping(target = "customerId", source = "customer.custId")
    GstFilingDto toDto(GstFiling entity);

    @Mapping(target = "gstfilingId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(GstFilingDto dto, @MappingTarget GstFiling entity);
}