package com.taxedge.itr.taxnotice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.taxedge.itr.taxnotice.dto.TaxNoticeAssistanceDto;
import com.taxedge.itr.taxnotice.entity.TaxNoticeAssistance;

@Mapper(componentModel = "spring")
public interface TaxNoticeAssistanceMapper {

	@Mapping(target = "noticeId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	TaxNoticeAssistance toEntity(TaxNoticeAssistanceDto dto);

	@Mapping(target = "noticeId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	void updateEntity(TaxNoticeAssistanceDto dto, @MappingTarget TaxNoticeAssistance taxNotice);

	@Mapping(target = "customerId", source = "customer.custId")
	TaxNoticeAssistanceDto toDto(TaxNoticeAssistance taxNotice);
}