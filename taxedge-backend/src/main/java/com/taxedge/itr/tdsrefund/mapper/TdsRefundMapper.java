package com.taxedge.itr.tdsrefund.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.taxedge.itr.tdsrefund.dto.TdsRefundDto;
import com.taxedge.itr.tdsrefund.entity.TdsRefund;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface TdsRefundMapper {
	
	@Mapping(target = "id", ignore = true)
    @Mapping(target = "custId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    TdsRefund toEntity(TdsRefundDto dto);

	TdsRefundDto toDto(TdsRefund entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "custId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(TdsRefundDto dto, @MappingTarget TdsRefund entity);

}
