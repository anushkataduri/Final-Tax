package com.taxedge.itr.filing.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.taxedge.itr.filing.dto.ItrFilingPostDto;
import com.taxedge.itr.filing.entity.ItrFiling;

@Mapper(componentModel = "spring")
public interface ItrFilingMapper {

	@Mapping(target = "itrId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	@Mapping(target = "documents", ignore = true)
	ItrFiling toEntity(ItrFilingPostDto dto);

	@Mapping(target = "itrId", ignore = true)
	@Mapping(target = "customer", ignore = true)
	@Mapping(target = "documents", ignore = true)
	void updateEntity(ItrFilingPostDto dto, @MappingTarget ItrFiling itrFiling);
}