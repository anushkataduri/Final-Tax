package com.taxedge.itr.reviseditr.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.taxedge.itr.reviseditr.dto.RevisedItrDto;
import com.taxedge.itr.reviseditr.entity.RevisedItr;

@Mapper(componentModel = "spring")
public interface RevisedItrMapper {

	@Mapping(target = "revisedItrId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	RevisedItr toEntity(RevisedItrDto dto);

	@Mapping(target = "revisedItrId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	void updateEntity(RevisedItrDto dto, @MappingTarget RevisedItr revisedItr);
}