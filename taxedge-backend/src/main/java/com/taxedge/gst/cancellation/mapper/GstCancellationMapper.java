package com.taxedge.gst.cancellation.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.taxedge.gst.cancellation.dto.GstCancellationDto;
import com.taxedge.gst.cancellation.entity.GstCancellation;

@Mapper(componentModel = "spring")
public interface GstCancellationMapper {

    @Mapping(target = "customerId", source = "customer.custId")
    GstCancellationDto toDto(GstCancellation gstCancellation);
}